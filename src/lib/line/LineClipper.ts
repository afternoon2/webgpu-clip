import { Clipper } from '../Clipper';
import { Line, Polygon, Polyline } from '../types';
import { code } from './shader';

export type LineClipperConfig = {
  device: GPUDevice;
  polygon: Polygon;
  maxIntersectionsPerLine?: number;
};

const BIND_GROUP_LAYOUT_ENTRIES: GPUBindGroupLayoutEntry[] = [
  {
    binding: 0,
    visibility: GPUShaderStage.COMPUTE,
    buffer: { type: 'read-only-storage' },
  },
  {
    binding: 1,
    visibility: GPUShaderStage.COMPUTE,
    buffer: { type: 'read-only-storage' },
  },
  {
    binding: 2,
    visibility: GPUShaderStage.COMPUTE,
    buffer: { type: 'storage' },
  },
  {
    binding: 3,
    visibility: GPUShaderStage.COMPUTE,
    buffer: { type: 'storage' },
  },
];

export class LineClipper extends Clipper<Line> {
  maxIntersectionsPerLine: number;

  constructor({
    device,
    polygon,
    maxIntersectionsPerLine = 128,
  }: LineClipperConfig) {
    super(polygon, BIND_GROUP_LAYOUT_ENTRIES, code, device);
    this.maxIntersectionsPerLine = maxIntersectionsPerLine;
  }

  async clip(lines: Line[]): Promise<Line[]> {
    const lineData = new Float32Array(
      LineClipper.flattenPointList(lines.flat() as Polyline),
    );
    const lineBuffer = this.device.createBuffer({
      size: lineData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(lineBuffer.getMappedRange()).set(lineData);
    lineBuffer.unmap();

    const clippedLinesBuffer = this.device.createBuffer({
      size:
        lines.length *
        this.maxIntersectionsPerLine *
        4 *
        Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const readClippedLinesBuffer = this.device.createBuffer({
      size: clippedLinesBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const intersectionSize = 3 * Float32Array.BYTES_PER_ELEMENT; // Size of one Intersection
    const totalIntersections = lines.length * this.maxIntersectionsPerLine;

    const intersectionsBuffer = this.device.createBuffer({
      size: totalIntersections * intersectionSize,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });

    const clearBuffer = () => {
      const clearData = new Float32Array(totalIntersections * 2).fill(-1.0);
      this.device.queue.writeBuffer(intersectionsBuffer, 0, clearData);
    };

    clearBuffer();

    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: lineBuffer } },
        { binding: 1, resource: { buffer: this.edgesBuffer } },
        { binding: 2, resource: { buffer: intersectionsBuffer } },
        { binding: 3, resource: { buffer: clippedLinesBuffer } },
      ],
    });

    // Dispatch
    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.pipeline);
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
    this.device.queue.submit([commandEncoder.finish()]);

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
  }
}
