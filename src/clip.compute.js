import shader from "./lineClip.wgsl?raw";

export async function clipLinesWithCompute(lines, polygon) {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const edgeData = new Float32Array(convertPolygonToEdges(polygon));
  const lineData = new Float32Array(
    lines.flatMap((line) => [line[0].X, line[0].Y, line[1].X, line[1].Y])
  );

  // Buffers
  // Create buffers
  const edgeBuffer = device.createBuffer({
    size: edgeData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });
  new Float32Array(edgeBuffer.getMappedRange()).set(edgeData);
  edgeBuffer.unmap();

  const lineBuffer = device.createBuffer({
    size: lineData.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });
  new Float32Array(lineBuffer.getMappedRange()).set(lineData);
  lineBuffer.unmap();

  const clippedLinesBuffer = device.createBuffer({
    size: lines.length * 16 * 4 * Float32Array.BYTES_PER_ELEMENT, // Max 16 segments per line, 4 floats per segment
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const readClippedLinesBuffer = device.createBuffer({
    size: clippedLinesBuffer.size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  const intersectionSize = 3 * Float32Array.BYTES_PER_ELEMENT; // Size of one Intersection
  const maxIntersectionsPerLine = 16; // Adjust as needed
  const totalIntersections = lines.length * maxIntersectionsPerLine;

  const intersectionsBuffer = device.createBuffer({
    size: totalIntersections * intersectionSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const debugBuffer = device.createBuffer({
    size: totalIntersections * intersectionSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const readDebugBuffer = device.createBuffer({
    size: debugBuffer.size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  const clearBuffer = () => {
    const clearData = new Float32Array(totalIntersections * 2).fill(-1.0); // Fill with sentinel value
    device.queue.writeBuffer(intersectionsBuffer, 0, clearData);
  };

  clearBuffer();

  // Compute pipeline
  const shaderModule = device.createShaderModule({
    code: shader,
  });

  // Pipeline and bind group
  const pipeline = device.createComputePipeline({
    layout: "auto",
    compute: {
      module: shaderModule,
      entryPoint: "main",
    },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: lineBuffer } },
      { binding: 1, resource: { buffer: edgeBuffer } },
      { binding: 2, resource: { buffer: intersectionsBuffer } },
      { binding: 3, resource: { buffer: debugBuffer } },
      { binding: 4, resource: { buffer: clippedLinesBuffer } },
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
    clippedLinesBuffer.size
  );
  commandEncoder.copyBufferToBuffer(
    debugBuffer,
    0,
    readDebugBuffer,
    0,
    debugBuffer.size
  );
  device.queue.submit([commandEncoder.finish()]);

  // Read buffers
  await readClippedLinesBuffer.mapAsync(GPUMapMode.READ);
  const clippedLinesData = new Float32Array(
    readClippedLinesBuffer.getMappedRange()
  );
  const clippedLines = [];
  for (let i = 0; i < clippedLinesData.length; i += 4) {
    clippedLines.push([
      { X: clippedLinesData[i], Y: clippedLinesData[i + 1] },
      { X: clippedLinesData[i + 2], Y: clippedLinesData[i + 3] },
    ]);
  }
  readClippedLinesBuffer.unmap();

  await readDebugBuffer.mapAsync(GPUMapMode.READ);
  const debugData = new Float32Array(readDebugBuffer.getMappedRange());
  console.log("Debug Data:", debugData);
  readDebugBuffer.unmap();

  return clippedLines.filter(
    (line) => !line.every((pt) => pt.X === 0 && pt.Y === 0)
  );
}

function convertPolygonToEdges(polygon) {
  const edges = [];
  for (const ring of polygon) {
    for (let i = 0; i < ring.length; i++) {
      const start = ring[i];
      const end = ring[(i + 1) % ring.length]; // Wrap to form a closed loop
      edges.push(start.X, start.Y, end.X, end.Y);
    }
  }
  return edges;
}
