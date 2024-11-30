import {
  convertPolygonToEdges,
  createMappedStorageCopyDataBuffer,
  parseClippedPolyline,
} from '../utils';
import code from './shader.wgsl?raw';

export function setupMultilineClip(device) {
  const module = device.createShaderModule({
    code,
  });

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
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
    ],
  });

  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),

    compute: {
      module,
      entryPoint: 'main',
    },
  });

  return async function (polyline, polygon) {
    const vertices = polyline.flatMap(({ X, Y }) => [X, Y]);
    const verticesArray = new Float32Array(vertices);
    const verticesBuffer = device.createBuffer({
      size: verticesArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(verticesBuffer.getMappedRange()).set(verticesArray);
    verticesBuffer.unmap();
    console.log('Vertices:', vertices);

    const edgeData = new Float32Array(convertPolygonToEdges(polygon));
    const edgeBuffer = createMappedStorageCopyDataBuffer(edgeData, device);

    const maxPoints = vertices.length * edgeData.length * 4;
    const clippedPolylineBuffer = device.createBuffer({
      size: maxPoints * 4 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      label: 'clippedFragmentsBuffer',
    });

    const readClippedPolylineBuffer = device.createBuffer({
      size: clippedPolylineBuffer.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      label: 'readClippedPolylineBuffer',
    });

    const debugBuffer = device.createBuffer({
      size: (polyline.length - 1) * 2 * 4 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      label: 'debugBuffer',
    });

    const readDebugBuffer = device.createBuffer({
      size: debugBuffer.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      label: 'debugBuffer',
    });

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: verticesBuffer } },
        { binding: 1, resource: { buffer: edgeBuffer } },
        { binding: 2, resource: { buffer: clippedPolylineBuffer } },
        { binding: 3, resource: { buffer: debugBuffer } },
      ],
    });

    const totalSegments = vertices.length / 2 - 1; // Total segments
    const workgroupSize = 256; // Workgroup size in WGSL
    const workgroupCount = Math.ceil(totalSegments / workgroupSize);

    console.log('Vertices Buffer:', Array.from(verticesArray));
    console.log(`Workgroup Count: ${workgroupCount}`);
    console.log(`Total Segments: ${totalSegments}`);
    console.log(`Workgroup Size: ${workgroupSize}`);

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(workgroupCount);
    passEncoder.end();
    commandEncoder.copyBufferToBuffer(
      clippedPolylineBuffer,
      0,
      readClippedPolylineBuffer,
      0,
      clippedPolylineBuffer.size,
    );
    commandEncoder.copyBufferToBuffer(
      debugBuffer,
      0,
      readDebugBuffer,
      0,
      debugBuffer.size,
    );
    device.queue.submit([commandEncoder.finish()]);

    await readClippedPolylineBuffer.mapAsync(GPUMapMode.READ);
    const clippedPolylineData = new Float32Array(
      readClippedPolylineBuffer.getMappedRange(),
    );
    const clippedData = parseClippedPolyline(clippedPolylineData);

    readClippedPolylineBuffer.unmap();

    await readDebugBuffer.mapAsync(GPUMapMode.READ);
    const debugData = new Float32Array(await readDebugBuffer.getMappedRange());
    console.log('Debug Data:', JSON.stringify(Array.from(debugData), null, 2));
    readDebugBuffer.unmap();

    return clippedData;
  };
}
