import { Clipper } from '../Clipper';
import { Polygon, Polyline, PolylineCollection } from '../types';
import { getShader } from './getShader';

export type PolylineClipperConfig = {
  device: GPUDevice;
  polygon: Polygon;
  maxIntersectionsPerSegment: number;
  maxClippedPolylinesPerSegment: number;
  workgroupSize: number;
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
  private maxClippedPolylinesPerSegment: number;
  private workgroupSize: number;

  constructor({
    device,
    polygon,
    maxIntersectionsPerSegment,
    maxClippedPolylinesPerSegment,
    workgroupSize,
  }: PolylineClipperConfig) {
    super(
      polygon,
      BIND_GROUP_LAYOUT_ENTRIES,
      getShader(workgroupSize, maxIntersectionsPerSegment),
      device,
    );
    this.maxIntersectionsPerSegment = maxIntersectionsPerSegment;
    this.workgroupSize = workgroupSize;
    this.maxClippedPolylinesPerSegment = maxClippedPolylinesPerSegment;
  }

  async clip(polyline: Polyline): Promise<Polyline[]> {
    const verticesArray = new Float32Array(
      PolylineClipper.flattenPointList(polyline),
    );
    const verticesBuffer = this.device.createBuffer({
      size: verticesArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
      mappedAtCreation: true,
    });
    new Float32Array(verticesBuffer.getMappedRange()).set(verticesArray);
    verticesBuffer.unmap();

    const numSegments = polyline.length - 1;
    const cols = this.maxClippedPolylinesPerSegment * 4;

    const clippedPolylineBuffer = this.device.createBuffer({
      size: numSegments * cols * Float32Array.BYTES_PER_ELEMENT, // vec4f per slot
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const maxClippedPolylinePerSegmentBuffer = this.device.createBuffer({
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.device.queue.writeBuffer(
      maxClippedPolylinePerSegmentBuffer,
      0,
      new Uint32Array([this.maxClippedPolylinesPerSegment]),
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

    const parsedClippedData = PolylineClipper.parseClippedPolyline(
      clippedData,
      numSegments,
      cols * numSegments,
    );

    return parsedClippedData;
  }

  private static parseClippedPolyline(
    buffer: Float32Array,
    rows: number,
    cols: number,
  ): PolylineCollection {
    const polylines = [];

    for (let row = 0; row < rows; row++) {
      const rowOffset = row * cols;
      let currentPolyline = [];

      for (let col = 0; col < cols; col++) {
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
            // Add the point to the current polyline
            currentPolyline.push({ X, Y });
          }
        }
      }

      // Push the last polyline in the row (if any)
      if (currentPolyline.length > 0) {
        polylines.push(currentPolyline);
      }
    }

    return polylines as PolylineCollection;
  }
}
