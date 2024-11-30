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
      }, // vertices
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'read-only-storage' },
      }, // edges
      {
        binding: 2,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' },
      }, // clippedPolylineBuffer
      {
        binding: 3,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' },
      }, // debugBuffer
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

    const maxOutputPoints = polyline.length * edges.length * 2; // Conservative estimate
    const clippedPolylineBuffer = device.createBuffer({
      size: maxOutputPoints * 4 * Float32Array.BYTES_PER_ELEMENT, // vec4f for each point
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      label: 'clippedPolylineBuffer',
    });

    const readClippedPolylineBuffer = device.createBuffer({
      size: clippedPolylineBuffer.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      label: 'readClippedPolylineBuffer',
    });

    const debugBuffer = device.createBuffer({
      size: 1024 * Uint32Array.BYTES_PER_ELEMENT, // Size for debug logs
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      label: 'debugBuffer',
    });

    const readDebugBuffer = device.createBuffer({
      size: debugBuffer.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      label: 'readDebugBuffer',
    });

    const bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: verticesBuffer } },
        { binding: 1, resource: { buffer: edgesBuffer } },
        { binding: 2, resource: { buffer: clippedPolylineBuffer } },
        { binding: 3, resource: { buffer: debugBuffer } },
      ],
    });

    const numSegments = polyline.length - 1; // One segment per pair of vertices
    const workgroupSize = 64; // Same as @workgroup_size in the shader
    const numWorkgroups = Math.ceil(numSegments / workgroupSize);

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();

    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(numWorkgroups); // Dispatch workgroups
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
    const clippedData = new Float32Array(
      readClippedPolylineBuffer.getMappedRange(),
    );

    let polylines = [];
    let currentPolyline = [];

    for (let i = 0; i < clippedData.length; i += 4) {
      const x = clippedData[i];
      const y = clippedData[i + 1];
      const sentinel = clippedData[i + 2];

      if (sentinel === -1.0) {
        // Sentinel value: end of polyline
        if (currentPolyline.length > 0) {
          polylines.push(currentPolyline);
          currentPolyline = [];
        }
      } else {
        currentPolyline.push({ X: x, Y: y });
      }
    }

    // Add the final polyline if it exists
    if (currentPolyline.length > 0) {
      polylines.push(currentPolyline);
    }

    clippedPolylineBuffer.unmap();

    polylines = polylines.filter(
      (polyline) => !polyline.every((pt) => pt.X === 0 && pt.Y === 0),
    );

    console.log('Clipped Polylines:', polylines);

    // await readDebugBuffer.mapAsync(GPUMapMode.READ);
    // const debugData = new Float32Array(await readDebugBuffer.getMappedRange());
    // console.log('Debug Data:', JSON.stringify(Array.from(debugData), null, 2));
    // readDebugBuffer.unmap();

    return polylines;
  };
}
