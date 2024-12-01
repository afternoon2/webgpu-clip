import { Polygon, PolylineCollection } from './types';

export function convertPolygonToEdges(polygon: Polygon): number[] {
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

export function parseClippedPolyline(
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
