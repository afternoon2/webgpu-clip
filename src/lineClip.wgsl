struct Point {
  X: f32,
  Y: f32,
};

struct Intersection {
  point: Point,
  isValid: u32, // Use u32 instead of bool
};

struct Line {
  start: Point,
  end: Point,
};

struct Edge {
  start: Point,
  end: Point,
};

@group(0) @binding(0) var<storage, read> lines: array<Line>;
@group(0) @binding(1) var<storage, read> edges: array<Edge>;
@group(0) @binding(2) var<storage, read_write> intersectionsBuffer: array<Intersection>;
@group(0) @binding(3) var<storage, read_write> debugBuffer: array<Intersection>;
@group(0) @binding(4) var<storage, read_write> clippedLinesBuffer: array<Line>;

fn lineIntersection(p1: Point, p2: Point, p3: Point, p4: Point) -> Intersection {
  let s1 = vec2<f32>(p2.X - p1.X, p2.Y - p1.Y);
  let s2 = vec2<f32>(p4.X - p3.X, p4.Y - p3.Y);

  let denom = -s2.x * s1.y + s1.x * s2.y;

  if (abs(denom) < 1e-6) {
    return Intersection(Point(-1.0, -1.0), 0); // No intersection
  }

  let s = (-s1.y * (p1.X - p3.X) + s1.x * (p1.Y - p3.Y)) / denom;
  let t = (s2.x * (p1.Y - p3.Y) - s2.y * (p1.X - p3.X)) / denom;

  if (s >= 0.0 && s <= 1.0 && t >= 0.0 && t <= 1.0) {
    return Intersection(Point(p1.X + t * s1.x, p1.Y + t * s1.y), 1);
  }

  return Intersection(Point(-1.0, -1.0), 0); // No intersection
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let lineIndex = id.x;
  if (lineIndex >= arrayLength(&lines)) {
    return;
  }

  // Calculate buffer offsets dynamically
  let totalIntersections = arrayLength(&intersectionsBuffer); // Total intersections in the buffer
  let intersectionsPerLine = totalIntersections / arrayLength(&lines);
  let baseOffset = lineIndex * intersectionsPerLine;

  // Debug buffer offset
  let debugBaseOffset = lineIndex * intersectionsPerLine;

  // Clipped lines offset
  let clippedBaseOffset = lineIndex * intersectionsPerLine;

  var count = 0u;
  var clippedCount = 0u;

  // Process edges and find intersections
  for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
    let edge = edges[i];
    let result = lineIntersection(lines[lineIndex].start, lines[lineIndex].end, edge.start, edge.end);

    if (result.isValid == 1u) {
      if (count < intersectionsPerLine) {
        intersectionsBuffer[baseOffset + count] = result;
        debugBuffer[debugBaseOffset + count] = result; // Write to debug buffer
        count = count + 1u;
      }
    }
  }

  // Sort intersections directly in the buffer
  for (var i = 0u; i < count; i = i + 1u) {
    for (var j = i + 1u; j < count; j = j + 1u) {
      let d1 = distance(vec2<f32>(
        intersectionsBuffer[baseOffset + i].point.X, intersectionsBuffer[baseOffset + i].point.Y),
        vec2<f32>(lines[lineIndex].start.X, lines[lineIndex].start.Y)
      );
      let d2 = distance(vec2<f32>(
        intersectionsBuffer[baseOffset + j].point.X, intersectionsBuffer[baseOffset + j].point.Y),
        vec2<f32>(lines[lineIndex].start.X, lines[lineIndex].start.Y)
      );

      if (d2 < d1) {
        let temp = intersectionsBuffer[baseOffset + i];
        intersectionsBuffer[baseOffset + i] = intersectionsBuffer[baseOffset + j];
        intersectionsBuffer[baseOffset + j] = temp;
      }
    }
  }

  // Create clipped line segments from pairs of intersections
  for (var i = 0u; i + 1u < count; i = i + 2u) {
    if (clippedCount < intersectionsPerLine) {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = Line(
        intersectionsBuffer[baseOffset + i].point,
        intersectionsBuffer[baseOffset + i + 1u].point
      );
      clippedCount = clippedCount + 1u;
    }
  }

  // Optional: Mark unused slots in buffers with a sentinel value
  for (var i = count; i < intersectionsPerLine; i = i + 1u) {
    intersectionsBuffer[baseOffset + i] = Intersection(Point(-1.0, -1.0), 0);
    debugBuffer[debugBaseOffset + i] = Intersection(Point(-1.0, -1.0), 0);
  }
}
