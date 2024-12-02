import { Line, Polygon, Polyline } from './types';

export abstract class Clipper<T extends Polyline | Line[]> {
  protected edges: number[];
  protected maxIntersectionsPerSegment: number = 32;
  protected bindGroupLayout: GPUBindGroupLayout;
  protected pipeline: GPUComputePipeline;

  constructor(
    polygon: Polygon,
    layoutEntries: GPUBindGroupLayoutEntry[],
    shader: string,
    protected device: GPUDevice,
  ) {
    this.edges = Clipper.convertPolygonToEdges(polygon);
    this.bindGroupLayout = this.device.createBindGroupLayout({
      entries: layoutEntries,
    });
    this.pipeline = this.device.createComputePipeline({
      layout: this.device.createPipelineLayout({
        bindGroupLayouts: [this.bindGroupLayout],
      }),
      compute: {
        module: this.device.createShaderModule({
          code: shader,
        }),
        entryPoint: 'main',
      },
    });
  }

  abstract clip(target: T): Promise<T[]>;

  protected static convertPolygonToEdges(polygon: Polygon) {
    const edges = [];
    for (const ring of polygon) {
      for (let i = 0; i < ring.length; i++) {
        const start = ring[i];
        const end = ring[(i + 1) % ring.length];
        edges.push(start.X, start.Y, end.X, end.Y);
      }
    }
    return edges;
  }

  protected static flattenPointList(pointList: Line | Polyline): number[] {
    return pointList.flatMap((pt) => [pt.X, pt.Y]);
  }
}
