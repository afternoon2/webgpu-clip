import { Clipper } from '../Clipper';
import { Polygon, Polyline, PolylineCollection } from '../types';

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
      PolylineClipper.getShader(workgroupSize, maxIntersectionsPerSegment),
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

  private static getShader(
    workgroupSize: number,
    maxIntersectionsPerSegment: number,
  ): string {
    return /* wgsl */ `
    @group(0) @binding(0) var<storage, read> vertices: array<vec2f>;
    @group(0) @binding(1) var<storage, read> edges: array<vec4f>;
    @group(0) @binding(2) var<storage, read_write> clippedPolylineBuffer: array<vec4f>;
    @group(0) @binding(3) var<uniform> maxClippedPolylinesPerSegment: u32;

    var<private> col: u32;

    fn lineIntersection(p1: vec2f, p2: vec2f, p3: vec2f, p4: vec2f) -> vec3f {
      let s1 = vec2<f32>(p2.x - p1.x, p2.y - p1.y);
      let s2 = vec2<f32>(p4.x - p3.x, p4.y - p3.y);

      let denom = -s2.x * s1.y + s1.x * s2.y;

      if (abs(denom) < 1e-6) {
        return vec3f(-1.0, -1.0, 0.0); // No intersection
      }

      let s = (-s1.y * (p1.x - p3.x) + s1.x * (p1.y - p3.y)) / denom;
      let t = (s2.x * (p1.y - p3.y) - s2.y * (p1.x - p3.x)) / denom;

      if (s >= 0.0 && s <= 1.0 && t >= 0.0 && t <= 1.0) {
        return vec3f(p1.x + t * s1.x, p1.y + t * s1.y, 1.0);
      }

      return vec3f(-1.0, -1.0, 0.0); // No intersection
    }

    fn isPointInsidePolygon(point: vec2f) -> bool {
      var leftNodes = 0;
      for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
        let edge = edges[i];
        let start = edge.xy;
        let end = edge.zw;
        if ((start.y <= point.y && end.y > point.y) || (start.y > point.y && end.y <= point.y)) {
          let slope = (end.x - start.x) / (end.y - start.y);
          let intersectX = start.x + (point.y - start.y) * slope;
          if (point.x < intersectX) {
            leftNodes = leftNodes + 1;
          }
        }
      }
      return (leftNodes % 2) != 0;
    }

    fn addPoint(point: vec2f, rowOffset: u32) {
      clippedPolylineBuffer[rowOffset + col] = vec4f(point, 1.0, 0.0);
      col = col + 1u;
    }

    fn addSentinel(rowOffset: u32) {
      clippedPolylineBuffer[rowOffset + col] = vec4f(-1.0, -1.0, -1.0, 0.0);
      col = col + 1u;
    }

    @compute @workgroup_size(${workgroupSize})
    fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
      let threadIndex = globalId.x;

      if (threadIndex >= arrayLength(&vertices) - 1u) {
        return; // No segment to process
      }

      let p1 = vertices[threadIndex];
      let p2 = vertices[threadIndex + 1u];

      let p1Inside = isPointInsidePolygon(p1);
      let p2Inside = isPointInsidePolygon(p2);

      var intersections: array<vec2f, ${maxIntersectionsPerSegment}>;
      var intersectionCount = 0u;

      for (var j = 0u; j < arrayLength(&edges); j = j + 1u) {
        let edge = edges[j];
        let intersection = lineIntersection(p1, p2, edge.xy, edge.zw);

        if (intersection.z == 1.0) {
          intersections[intersectionCount] = intersection.xy;
          intersectionCount = intersectionCount + 1u;
        }
      }

      if (intersectionCount > 1u) {
        for (var k = 0u; k < intersectionCount - 1u; k = k + 1u) {
          for (var l = k + 1u; l < intersectionCount; l = l + 1u) {
            if (distance(p1, intersections[l]) < distance(p1, intersections[k])) {
              let temp = intersections[k];
              intersections[k] = intersections[l];
              intersections[l] = temp;
            }
          }
        }
      }

      let rowOffset = threadIndex * maxClippedPolylinesPerSegment;
      col = 0u;

      if (p1Inside && p2Inside) {
        addPoint(p1, rowOffset);

        if (intersectionCount == 0u) {
          addPoint(p2, rowOffset);
        } else if (intersectionCount > 1u) {
          addPoint(intersections[0u], rowOffset);
          addSentinel(rowOffset);

          for (var i = 1u; i < intersectionCount - 1u; i = i + 2u) {
            addPoint(intersections[i], rowOffset);
            addPoint(intersections[i + 1u], rowOffset);
            addSentinel(rowOffset);
          }

          addPoint(intersections[intersectionCount - 1u], rowOffset);
          addPoint(p2, rowOffset);
        }
      } else if (p1Inside && !p2Inside) {
        addPoint(p1, rowOffset);
        addPoint(intersections[0], rowOffset);
        addSentinel(rowOffset);

        if (intersectionCount > 1u) {
          for (var i = 1u; i < intersectionCount; i = i + 2u) {
            addPoint(intersections[i], rowOffset);
            addPoint(intersections[i + 1u], rowOffset);
            addSentinel(rowOffset);
          }
        }
      } else if (!p1Inside && p2Inside) {
        if (intersectionCount == 1u) {
          addPoint(intersections[0], rowOffset);
          addPoint(p2, rowOffset);
        } else {
          for (var i = 0u; i < intersectionCount - 1u; i = i + 2u) {
            addPoint(intersections[i], rowOffset);
            addPoint(intersections[i + 1u], rowOffset);
            addSentinel(rowOffset);
          }
          addPoint(intersections[intersectionCount - 1u], rowOffset);
          addPoint(p2, rowOffset);
          addSentinel(rowOffset);
        }
      } else {
        for (var i = 0u; i + 1u < intersectionCount; i = i + 2u) {
          addPoint(intersections[i], rowOffset);
          addPoint(intersections[i + 1u], rowOffset);
          addSentinel(rowOffset);
        }
      }
    }
    `;
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
