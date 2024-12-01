import { convertPolygonToEdges, parseClippedPolyline } from '../utils';
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
        buffer: { type: 'uniform' },
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
    const verticesArray = new Float32Array(
      polyline.flatMap(({ X, Y }) => [X, Y]),
    );
    const verticesBuffer = device.createBuffer({
      size: verticesArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(verticesBuffer.getMappedRange()).set(verticesArray);
    verticesBuffer.unmap();

    // Flatten edges into a Float32Array of vec4f (start.x, start.y, end.x, end.y)
    const edges = convertPolygonToEdges(polygon);
    const edgesArray = new Float32Array(edges);
    const edgesBuffer = device.createBuffer({
      size: edgesArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(edgesBuffer.getMappedRange()).set(edgesArray);
    edgesBuffer.unmap();

    const numSegments = polyline.length - 1;
    const maxVerticesPerClippedPolyline = 16;
    const maxClippedPolylinesPerSegment = 64;
    const cols = maxVerticesPerClippedPolyline * maxClippedPolylinesPerSegment;

    const clippedPolylineBuffer = device.createBuffer({
      size: numSegments * cols * 4 * Float32Array.BYTES_PER_ELEMENT, // vec4f per slot
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const maxClippedPolylinePerSegmentBuffer = device.createBuffer({
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(
      maxClippedPolylinePerSegmentBuffer,
      0,
      new Uint32Array([maxClippedPolylinesPerSegment]),
    );

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: verticesBuffer } },
        { binding: 1, resource: { buffer: edgesBuffer } },
        { binding: 2, resource: { buffer: clippedPolylineBuffer } },
        {
          binding: 3,
          resource: { buffer: maxClippedPolylinePerSegmentBuffer },
        },
      ],
    });

    const workgroupSize = 64; // Same as @workgroup_size in the shader
    const numWorkgroups = Math.ceil(numSegments / workgroupSize);

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(numWorkgroups); // Dispatch workgroups
    passEncoder.end();

    const readBuffer = device.createBuffer({
      size: clippedPolylineBuffer.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      label: 'readBuffer',
    });

    commandEncoder.copyBufferToBuffer(
      clippedPolylineBuffer,
      0,
      readBuffer,
      0,
      clippedPolylineBuffer.size,
    );
    device.queue.submit([commandEncoder.finish()]);

    await readBuffer.mapAsync(GPUMapMode.READ);
    const clippedData = new Float32Array(readBuffer.getMappedRange());
    const parsedClippedData = parseClippedPolyline(
      clippedData,
      numSegments,
      maxClippedPolylinesPerSegment,
    );

    return parsedClippedData;
  };
}
