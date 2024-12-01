export function convertPolygonToEdges(polygon) {
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

export function createMappedStorageCopyDataBuffer(data, device) {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    mappedAtCreation: true,
  });
  new Float32Array(buffer.getMappedRange()).set(data);
  buffer.unmap();

  return buffer;
}

export function parseClippedPolyline(buffer, rows, cols) {
  const SENTINEL = [-1.0, -1.0]; // Define the sentinel value
  const polylines = []; // Output list of clipped polylines

  for (let row = 0; row < rows; row++) {
    const rowOffset = row * cols; // Calculate the start index of the row
    let currentPolyline = []; // Temporary storage for the current polyline

    for (let col = 0; col < cols; col++) {
      const index = rowOffset + col;

      const x = buffer[index * 4 + 0]; // Read X coordinate
      const y = buffer[index * 4 + 1]; // Read Y coordinate
      const sentinelFlag = buffer[index * 4 + 2]; // Check sentinel flag

      if (![x, y, sentinelFlag, buffer[index * 4 + 3]].every((v) => v === 0)) {
        if (sentinelFlag === -1.0) {
          // Sentinel indicates the end of the current polyline
          if (currentPolyline.length > 0) {
            polylines.push(currentPolyline);
            currentPolyline = [];
          }
        } else {
          // Add the point to the current polyline
          currentPolyline.push({ X: x, Y: y });
        }
      }
    }

    // Push the last polyline in the row (if any)
    if (currentPolyline.length > 0) {
      polylines.push(currentPolyline);
    }
  }

  return polylines;
}
