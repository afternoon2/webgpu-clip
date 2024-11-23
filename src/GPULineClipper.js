import shader from "./lineClip.wgsl?raw";

export class GPULineClipper {
  #device = null;
  #adapter = null;
  #pipeline = null;
  #ready = null;

  constructor(maxIntersectionsPerLine = 128) {
    this.maxIntersectionsPerLine = maxIntersectionsPerLine;
    this.#ready = this.#initializeGPU();
  }

  async #initializeGPU() {
    if (!navigator.gpu) {
      throw new Error("WebGPU is not supported on this browser.");
    }

    this.#adapter = await navigator.gpu.requestAdapter();
    if (!this.#adapter) {
      throw new Error("Failed to get GPU adapter.");
    }

    this.#device = await this.#adapter.requestDevice();

    const shaderModule = this.#device.createShaderModule({ code: shader });

    this.#pipeline = this.#device.createComputePipeline({
      layout: "auto",
      compute: {
        module: shaderModule,
        entryPoint: "main",
      },
    });
  }

  static #convertPolygonToEdges(polygon) {
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

  async clipLines(lines, polygon) {
    await this.#ready; // Wait for GPU initialization to complete

    const edgeData = new Float32Array(
      GPULineClipper.#convertPolygonToEdges(polygon)
    );
    const lineData = new Float32Array(
      lines.flatMap((line) => [line[0].X, line[0].Y, line[1].X, line[1].Y])
    );

    // Buffers
    // Create buffers
    const edgeBuffer = this.#device.createBuffer({
      size: edgeData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(edgeBuffer.getMappedRange()).set(edgeData);
    edgeBuffer.unmap();

    const lineBuffer = this.#device.createBuffer({
      size: lineData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(lineBuffer.getMappedRange()).set(lineData);
    lineBuffer.unmap();

    const clippedLinesBuffer = this.#device.createBuffer({
      size:
        lines.length *
        this.maxIntersectionsPerLine *
        4 *
        Float32Array.BYTES_PER_ELEMENT, // Max 16 segments per line, 4 floats per segment
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const readClippedLinesBuffer = this.#device.createBuffer({
      size: clippedLinesBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const intersectionSize = 3 * Float32Array.BYTES_PER_ELEMENT; // Size of one Intersection
    const totalIntersections = lines.length * this.maxIntersectionsPerLine;

    const intersectionsBuffer = this.#device.createBuffer({
      size: totalIntersections * intersectionSize,
      usage:
        GPUBufferUsage.STORAGE |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });

    const debugBuffer = this.#device.createBuffer({
      size: totalIntersections * intersectionSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const readDebugBuffer = this.#device.createBuffer({
      size: debugBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const clearBuffer = () => {
      const clearData = new Float32Array(totalIntersections * 2).fill(-1.0); // Fill with sentinel value
      this.#device.queue.writeBuffer(intersectionsBuffer, 0, clearData);
    };

    clearBuffer();

    // Compute pipeline
    const shaderModule = this.#device.createShaderModule({
      code: shader,
    });

    // Pipeline and bind group
    const pipeline = this.#device.createComputePipeline({
      layout: "auto",
      compute: {
        module: shaderModule,
        entryPoint: "main",
      },
    });

    const bindGroup = this.#device.createBindGroup({
      layout: this.#pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: lineBuffer } },
        { binding: 1, resource: { buffer: edgeBuffer } },
        { binding: 2, resource: { buffer: intersectionsBuffer } },
        { binding: 3, resource: { buffer: debugBuffer } },
        { binding: 4, resource: { buffer: clippedLinesBuffer } },
      ],
    });

    // Dispatch
    const commandEncoder = this.#device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.#pipeline);
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
    this.#device.queue.submit([commandEncoder.finish()]);

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
}
