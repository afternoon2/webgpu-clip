import { Line, Polygon } from '../types';
import { convertPolygonToEdges, getGPUDevice } from '../utils';
import { code } from './shader';

export type SetupLineClipParams = {
  deviceInstance?: GPUDevice;
  maxIntersectionsPerLine: number;
};

export async function setupLineClip(
  { deviceInstance, maxIntersectionsPerLine }: SetupLineClipParams = {
    maxIntersectionsPerLine: 128,
  },
) {
  const device = deviceInstance || (await getGPUDevice());

  const module = device.createShaderModule({
    code,
  });

  const pipeline = device.createComputePipeline({
    layout: 'auto',
    compute: {
      module,
      entryPoint: 'main',
    },
  });

  return async function clipLines(
    lines: Line[],
    polygon: Polygon,
  ): Promise<Line[]> {
    const edgeData = new Float32Array(convertPolygonToEdges(polygon));
    const edgeBuffer = device.createBuffer({
      size: edgeData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(edgeBuffer.getMappedRange()).set(edgeData);
    edgeBuffer.unmap();

    const lineData = new Float32Array(
      lines.flatMap((line) => [line[0].X, line[0].Y, line[1].X, line[1].Y]),
    );
    const lineBuffer = device.createBuffer({
      size: lineData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(lineBuffer.getMappedRange()).set(lineData);
    lineBuffer.unmap();

    const clippedLinesBuffer = device.createBuffer({
      size:
        lines.length *
        maxIntersectionsPerLine *
        4 *
        Float32Array.BYTES_PER_ELEMENT, // maxIntersectionsPerLine segments per line, 4 floats per segment
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const readClippedLinesBuffer = device.createBuffer({
      size: clippedLinesBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const intersectionSize = 3 * Float32Array.BYTES_PER_ELEMENT; // Size of one Intersection
    const totalIntersections = lines.length * maxIntersectionsPerLine;

    const intersectionsBuffer = device.createBuffer({
      size: totalIntersections * intersectionSize,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });

    const clearBuffer = () => {
      const clearData = new Float32Array(totalIntersections * 2).fill(-1.0); // Fill with sentinel value
      device.queue.writeBuffer(intersectionsBuffer, 0, clearData);
    };

    clearBuffer();

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: lineBuffer } },
        { binding: 1, resource: { buffer: edgeBuffer } },
        { binding: 2, resource: { buffer: intersectionsBuffer } },
        { binding: 3, resource: { buffer: clippedLinesBuffer } },
      ],
    });

    // Dispatch
    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(lines.length);
    passEncoder.end();
    commandEncoder.copyBufferToBuffer(
      clippedLinesBuffer,
      0,
      readClippedLinesBuffer,
      0,
      clippedLinesBuffer.size,
    );
    device.queue.submit([commandEncoder.finish()]);

    // Read buffers
    await readClippedLinesBuffer.mapAsync(GPUMapMode.READ);
    const clippedLinesData = new Float32Array(
      readClippedLinesBuffer.getMappedRange(),
    );
    const clippedLines: Line[] = [];
    for (let i = 0; i < clippedLinesData.length; i += 4) {
      clippedLines.push([
        { X: clippedLinesData[i], Y: clippedLinesData[i + 1] },
        { X: clippedLinesData[i + 2], Y: clippedLinesData[i + 3] },
      ]);
    }
    readClippedLinesBuffer.unmap();

    return clippedLines.filter(
      (line) => !line.every((pt) => pt.X === 0 && pt.Y === 0),
    );
  };
}
