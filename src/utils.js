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

export function parseClippedPolyline(data) {
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
