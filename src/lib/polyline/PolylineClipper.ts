import { Clipper } from '../Clipper';
import { Polygon, Polyline, PolylineCollection } from '../types';
import { getShader } from './getShader';

export type PolylineClipperConfig = {
  device: GPUDevice;
  polygon: Polygon;
  maxIntersectionsPerSegment?: number;
  maxClippedVerticesPerSegment?: number;
  workgroupSize?: number;
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
    buffer: { type: 'uniform' },
  },
];

export class PolylineClipper extends Clipper<Polyline> {
  private maxClippedVerticesPerSegment: number;
  private workgroupSize: number;

  constructor({
    device,
    polygon,
    maxIntersectionsPerSegment,
    maxClippedVerticesPerSegment,
    workgroupSize,
  }: PolylineClipperConfig) {
    const ws = workgroupSize ?? 64;
    const mi = maxIntersectionsPerSegment ?? 32;
    const mc = maxClippedVerticesPerSegment ?? 64;
    super(polygon, BIND_GROUP_LAYOUT_ENTRIES, getShader(ws, mi), device);
    this.maxIntersectionsPerSegment = mi;
    this.workgroupSize = ws;
    this.maxClippedVerticesPerSegment = mc;
  }

  async clip(polylines: Polyline[]): Promise<Polyline[]> {
    performance.mark('rawClippingStart');
    console.log(`Polylines: ${polylines.length}`);

    const vertices = polylines.flatMap((polyline, polylineIndex) =>
      polyline.flatMap((pt, pointIndex) => [
        pt.X,
        pt.Y,
        polylineIndex,
        pointIndex,
      ]),
    );
    console.log(`Vertices: ${vertices.length / 4}`);
    const verticesArray = new Float32Array(vertices);
    const verticesBuffer = this.device.createBuffer({
      size: verticesArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(verticesBuffer.getMappedRange()).set(verticesArray);
    verticesBuffer.unmap();

    const numSegments = polylines.reduce((sum, polyline) => {
      sum += polyline.length - 1;
      return sum;
    }, 0);
    console.log(`Segments: ${numSegments}`);
    const cols = this.maxClippedVerticesPerSegment * 4;

    const clippedPolylineBuffer = this.device.createBuffer({
      size: numSegments * cols * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const maxClippedPolylinePerSegmentBuffer = this.device.createBuffer({
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.device.queue.writeBuffer(
      maxClippedPolylinePerSegmentBuffer,
      0,
      new Uint32Array([this.maxClippedVerticesPerSegment]),
    );

    const bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: verticesBuffer } },
        { binding: 1, resource: { buffer: this.edgesBuffer } },
        { binding: 2, resource: { buffer: clippedPolylineBuffer } },
        {
          binding: 3,
          resource: { buffer: maxClippedPolylinePerSegmentBuffer },
        },
      ],
    });

    const numWorkgroups = Math.ceil(numSegments / this.workgroupSize);

    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();

    passEncoder.setPipeline(this.pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(numWorkgroups); // Dispatch workgroups
    passEncoder.end();

    const readBuffer = this.device.createBuffer({
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
    this.device.queue.submit([commandEncoder.finish()]);

    await readBuffer.mapAsync(GPUMapMode.READ);
    const clippedData = new Float32Array(readBuffer.getMappedRange());
    performance.mark('rawClippingEnd');
    performance.measure('rawClipping', 'rawClippingStart', 'rawClippingEnd');
    console.log(
      `Raw clipping takes ${performance.getEntriesByName('rawClipping')[0].duration / 1000} sec`,
    );
    const parsedClippedData = this.parseClippedPolyline(
      clippedData,
      numSegments,
    );
    readBuffer.unmap();

    console.log(parsedClippedData);

    return parsedClippedData;
  }

  private parseClippedPolyline(
    buffer: Float32Array,
    rows: number,
  ): PolylineCollection {
    const polylines = [];

    for (let row = 0; row < rows; row += 1) {
      const rowOffset = row * this.maxClippedVerticesPerSegment;
      const segmentLength = buffer[rowOffset * 4 + 3];
      let currentPolyline = [];
      for (let col = 0; col < segmentLength; col += 1) {
        const index = rowOffset + col;

        const X = buffer[index * 4 + 0];
        const Y = buffer[index * 4 + 1];
        const S = buffer[index * 4 + 2];
        const P = buffer[index * 4 + 3];

        if (![X, Y, S, P].every((v) => v === 0)) {
          if (S === -1.0) {
            // Sentinel indicates the end of the current polyline
            if (currentPolyline.length > 0) {
              polylines.push(currentPolyline);
              currentPolyline = [];
            }
          } else {
            if (X !== undefined && Y !== undefined) {
              // Add the point to the current polyline
              currentPolyline.push({ X, Y });
            }
          }
        }
      }

      // Push the last polyline in the row (if any)
      if (currentPolyline.length > 0) {
        polylines.push(currentPolyline);
      }
    }

    return polylines.reduce((collection, polyline, index) => {
      if (index === 0) {
        collection.push(polyline as Polyline);
      } else {
        const currentClippedPolyline = collection[collection.length - 1];
        const prev = currentClippedPolyline[currentClippedPolyline.length - 1];
        const curr = polyline[0];

        if (PolylineClipper.arePointsEqual(prev, curr)) {
          currentClippedPolyline.push(...polyline.slice(1));
        } else {
          collection.push(polyline as Polyline);
        }
      }
      return collection;
    }, [] as PolylineCollection);
  }

  private static arePointsEqual(
    p1: { X: number; Y: number },
    p2: { X: number; Y: number },
  ): boolean {
    const EPSILON = 1e-6; // Tolerance for floating-point comparison
    return Math.abs(p1.X - p2.X) < EPSILON && Math.abs(p1.Y - p2.Y) < EPSILON;
  }
}
