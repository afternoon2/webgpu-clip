import shader from './lineClip.wgsl?raw';
import polylineShader from './polylineClip.wgsl?raw';

export class GPULineClipper {
  #device = null;
  #pipeline = null;
  #lineShaderModule = null;
  #polylineShaderModule = null;

  constructor(device, maxIntersectionsPerLine = 128) {
    this.#device = device;
    this.maxIntersectionsPerLine = maxIntersectionsPerLine;
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

  async clipPolyline(polyline, polygon) {
    const vertices = polyline.flatMap(({ X, Y }) => [X, Y]);
    const verticesArray = new Float32Array(vertices);
    const verticesBuffer = this.#device.createBuffer({
      size: verticesArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(verticesBuffer.getMappedRange()).set(verticesArray);
    verticesBuffer.unmap();

    const edgeData = new Float32Array(
      GPULineClipper.#convertPolygonToEdges(polygon),
    );
    const edgeBuffer = this.#createMappedStorageCopyDataBuffer(edgeData);

    const maxPoints = vertices.length * edgeData.length * 3;
    const clippedPolylineBuffer = this.#device.createBuffer({
      size: maxPoints * 4 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      label: 'clippedFragmentsBuffer',
    });

    const readClippedPolylineBuffer = this.#device.createBuffer({
      size: clippedPolylineBuffer.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      label: 'readClippedPolylineBuffer',
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
        { binding: 0, resource: { buffer: verticesBuffer } },
        { binding: 1, resource: { buffer: edgeBuffer } },
        { binding: 2, resource: { buffer: clippedPolylineBuffer } },
      ],
    });

    // Dispatch
    const commandEncoder = this.#device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(this.#pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(1);
    passEncoder.end();
    commandEncoder.copyBufferToBuffer(
      clippedPolylineBuffer,
      0,
      readClippedPolylineBuffer,
      0,
      clippedPolylineBuffer.size,
    );
    this.#device.queue.submit([commandEncoder.finish()]);

    await readClippedPolylineBuffer.mapAsync(GPUMapMode.READ);
    const clippedPolylineData = new Float32Array(
      readClippedPolylineBuffer.getMappedRange(),
    );
    const clippedData = parseClippedPolyline(clippedPolylineData);

    readClippedPolylineBuffer.unmap();

    return clippedData;
  }

  async clipLines(lines, polygon) {
    this.#pipeline = this.#device.createComputePipeline({
      layout: 'auto',
      compute: {
        module: this.#lineShaderModule,
        entryPoint: 'main',
      },
    });

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

function parseClippedPolyline(data) {
  const polylines = [];
  let currentPolyline = [];

  for (let i = 0; i < data.length; i += 4) {
    const x = data[i];
    const y = data[i + 1];
    const s = data[i + 2];
    const isSentinel = [x, y, s].every((v) => v === -1);

    if (isSentinel) {
      if (currentPolyline.length > 0) {
        polylines.push(currentPolyline);
        currentPolyline = [];
      }
    } else {
      currentPolyline.push({ X: x, Y: y });
    }
  }

  if (
    currentPolyline.length > 0 &&
    !currentPolyline.every((pt) => pt.X === 0 && pt.Y === 0)
  ) {
    polylines.push(currentPolyline);
  }

  return polylines;
}
