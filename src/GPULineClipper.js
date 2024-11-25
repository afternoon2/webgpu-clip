import shader from './lineClip.wgsl?raw';
import polylineShader from './polylineClip.wgsl?raw';

export class GPULineClipper {
  #device = null;
  #adapter = null;
  #pipeline = null;
  #ready = null;
  #lineShaderModule = null;
  #polylineShaderModule = null;

  constructor(maxIntersectionsPerLine = 128) {
    this.maxIntersectionsPerLine = maxIntersectionsPerLine;
    this.#ready = this.#initializeGPU();
  }

  async #initializeGPU() {
    if (!navigator.gpu) {
      throw new Error('WebGPU is not supported on this browser.');
    }

    this.#adapter = await navigator.gpu.requestAdapter();
    if (!this.#adapter) {
      throw new Error('Failed to get GPU adapter.');
    }

    this.#device = await this.#adapter.requestDevice();

    this.#lineShaderModule = this.#device.createShaderModule({
      code: shader,
    });
    this.#polylineShaderModule = this.#device.createShaderModule({
      code: polylineShader,
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

  #createMappedStorageCopyDataBuffer(data) {
    const buffer = this.#device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();

    return buffer;
  }

  async clipPolylines(polylines, polygon) {
    await this.#ready;

    const edgeData = new Float32Array(
      GPULineClipper.#convertPolygonToEdges(polygon),
    );
    const edgeBuffer = this.#createMappedStorageCopyDataBuffer(edgeData);

    const { vertices, metadata } = polylines.reduce(
      (obj, polyline, index) => {
        if (index === 0) {
          obj.metadata.push([index, polyline.length]); // Use `polyline.length` as exclusive
          obj.vertices.push(...polyline);
        } else {
          const prevMetadata = obj.metadata[index - 1];
          obj.metadata.push([
            prevMetadata[1],
            prevMetadata[1] + polyline.length, // Exclusive end
          ]);
        }
        obj.vertices.push(...polyline);
        return obj;
      },
      { vertices: [], metadata: [] },
    );

    console.log('Metadata:', metadata);
    console.log('Vertices:', vertices);

    const polylineVerticesBuffer = this.#createMappedStorageCopyDataBuffer(
      new Float32Array(vertices.flatMap((pt) => [pt.X, pt.Y])),
    );
    const metadataArray = new Uint32Array(metadata.flat());

    const polylineMetadataBuffer = this.#device.createBuffer({
      label: 'polylineMetadataBuffer',
      size: metadataArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    this.#device.queue.writeBuffer(polylineMetadataBuffer, 0, metadataArray);

    const maxVerticesPerPolyline = Math.max(...polylines.map((p) => p.length));
    const clippedVerticesBuffer = this.#device.createBuffer({
      size:
        maxVerticesPerPolyline *
        2 *
        Float32Array.BYTES_PER_ELEMENT *
        polylines.length,
      label: 'clippedVerticesBuffer',
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const readClippedVerticesBuffer = this.#device.createBuffer({
      size: clippedVerticesBuffer.size,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      label: 'readClippedVerticesBuffer',
    });

    const bindGroupLayout = this.#device.createBindGroupLayout({
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
          buffer: { type: 'read-only-storage' },
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: 'storage' },
        },
      ],
    });

    this.#pipeline = this.#device.createComputePipeline({
      layout: this.#device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      }),

      compute: {
        module: this.#polylineShaderModule,
        entryPoint: 'main',
      },
    });

    const bindGroup = this.#device.createBindGroup({
      layout: this.#pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: polylineVerticesBuffer } },
        { binding: 1, resource: { buffer: polylineMetadataBuffer } },
        { binding: 2, resource: { buffer: edgeBuffer } },
        { binding: 3, resource: { buffer: clippedVerticesBuffer } },
      ],
    });

    console.log(`Dispatching ${polylines.length} workgroups`);

    // Dispatch
    const commandEncoder = this.#device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.#pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(polylines.length);
    passEncoder.end();
    commandEncoder.copyBufferToBuffer(
      clippedVerticesBuffer,
      0,
      readClippedVerticesBuffer,
      0,
      clippedVerticesBuffer.size,
    );
    this.#device.queue.submit([commandEncoder.finish()]);

    // Read buffers
    await readClippedVerticesBuffer.mapAsync(GPUMapMode.READ);
    const clippedVerticesData = new Float32Array(
      readClippedVerticesBuffer.getMappedRange(),
    );
    console.table(clippedVerticesData);
    readClippedVerticesBuffer.unmap();
  }

  async clipLines(lines, polygon) {
    await this.#ready; // Wait for GPU initialization to complete

    this.#pipeline = this.#device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.#lineShaderModule,
        entryPoint: 'main',
      },
    });

    // Buffers
    // Create buffers
    const edgeData = new Float32Array(
      GPULineClipper.#convertPolygonToEdges(polygon),
    );
    const edgeBuffer = this.#createMappedStorageCopyDataBuffer(edgeData);

    const lineData = new Float32Array(
      lines.flatMap((line) => [line[0].X, line[0].Y, line[1].X, line[1].Y]),
    );
    const lineBuffer = this.#createMappedStorageCopyDataBuffer(lineData);

    const clippedLinesBuffer = this.#device.createBuffer({
      size:
        lines.length *
        this.maxIntersectionsPerLine *
        4 *
        Float32Array.BYTES_PER_ELEMENT, // maxIntersectionsPerLine segments per line, 4 floats per segment
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

    const clearBuffer = () => {
      const clearData = new Float32Array(totalIntersections * 2).fill(-1.0); // Fill with sentinel value
      this.#device.queue.writeBuffer(intersectionsBuffer, 0, clearData);
    };

    clearBuffer();

    const bindGroup = this.#device.createBindGroup({
      layout: this.#pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: lineBuffer } },
        { binding: 1, resource: { buffer: edgeBuffer } },
        { binding: 2, resource: { buffer: intersectionsBuffer } },
        { binding: 3, resource: { buffer: clippedLinesBuffer } },
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
      clippedLinesBuffer.size,
    );
    this.#device.queue.submit([commandEncoder.finish()]);

    // Read buffers
    await readClippedLinesBuffer.mapAsync(GPUMapMode.READ);
    const clippedLinesData = new Float32Array(
      readClippedLinesBuffer.getMappedRange(),
    );
    const clippedLines = [];
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
