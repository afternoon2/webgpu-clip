
struct Intersection {
  point: vec2f,
  isValid: u32, // Use u32 instead of bool
};

struct Line {
  start: vec2f,
  end: vec2f,
};

struct Edge {
  start: vec2f,
  end: vec2f,
};

@group(0) @binding(0) var<storage, read> lines: array<Line>;
@group(0) @binding(1) var<storage, read> edges: array<Edge>;
@group(0) @binding(2) var<storage, read_write> intersectionsBuffer: array<Intersection>;
@group(0) @binding(3) var<storage, read_write> clippedLinesBuffer: array<Line>;

fn lineIntersection(p1: vec2f, p2: vec2f, p3: vec2f, p4: vec2f) -> Intersection {
  let s1 = vec2<f32>(p2.x - p1.x, p2.y - p1.y);
  let s2 = vec2<f32>(p4.x - p3.x, p4.y - p3.y);

  let denom = -s2.x * s1.y + s1.x * s2.y;

  if (abs(denom) < 1e-6) {
    return Intersection(vec2f(-1.0, -1.0), 0); // No intersection
  }

  let s = (-s1.y * (p1.x - p3.x) + s1.x * (p1.y - p3.y)) / denom;
  let t = (s2.x * (p1.y - p3.y) - s2.y * (p1.x - p3.x)) / denom;

  if (s >= 0.0 && s <= 1.0 && t >= 0.0 && t <= 1.0) {
    return Intersection(vec2f(p1.x + t * s1.x, p1.y + t * s1.y), 1);
  }

  return Intersection(vec2f(-1.0, -1.0), 0); // No intersection
}
fn isPointInsidePolygon(testPoint: vec2<f32>) -> bool {
    var leftNodes = 0;
    var rightNodes = 0;

    for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
        let edge = edges[i];

        // Check if the edge crosses the Y threshold of the test point
        if ((edge.start.y <= testPoint.y && edge.end.y > testPoint.y) || 
            (edge.start.y > testPoint.y && edge.end.y <= testPoint.y)) {
            
            // Calculate the X-coordinate of the intersection
            let slope = (edge.end.x - edge.start.x) / (edge.end.y - edge.start.y);
            let intersectX = edge.start.x + (testPoint.y - edge.start.y) * slope;

            // Count nodes on the left or right side
            if (intersectX < testPoint.x) {
                leftNodes = leftNodes + 1;
            } else {
                rightNodes = rightNodes + 1;
            }
        }
    }

    // Determine if the point is inside the polygon
    return (leftNodes % 2 != 0) && (rightNodes % 2 != 0);
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
        count = count + 1u;
      }
    }
  }

  // Sort intersections directly in the buffer
  for (var i = 0u; i < count; i = i + 1u) {
    for (var j = i + 1u; j < count; j = j + 1u) {
      let d1 = distance(vec2<f32>(
        intersectionsBuffer[baseOffset + i].point.x, intersectionsBuffer[baseOffset + i].point.y),
        vec2<f32>(lines[lineIndex].start.x, lines[lineIndex].start.y)
      );
      let d2 = distance(vec2<f32>(
        intersectionsBuffer[baseOffset + j].point.x, intersectionsBuffer[baseOffset + j].point.y),
        vec2<f32>(lines[lineIndex].start.x, lines[lineIndex].start.y)
      );

      if (d2 < d1) {
        let temp = intersectionsBuffer[baseOffset + i];
        intersectionsBuffer[baseOffset + i] = intersectionsBuffer[baseOffset + j];
        intersectionsBuffer[baseOffset + j] = temp;
      }
    }
  }

  let p1 = lines[lineIndex].start;
  let p2 = lines[lineIndex].end;

  let p1Inside = isPointInsidePolygon(p1);
  let p2Inside = isPointInsidePolygon(p2);

  if (clippedCount == 1u) {
    if (!p1Inside) {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = Line(
        intersectionsBuffer[baseOffset].point,
        lines[lineIndex].end
      );
      clippedCount = clippedCount + 1u;
    } else if (!p2Inside) {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = Line(
        lines[lineIndex].start,
        intersectionsBuffer[baseOffset].point,
      );
      clippedCount = clippedCount + 1u;
    }
  } else {
    if (!p1Inside && !p2Inside) {
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
    } else if (p1Inside && !p2Inside) {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = Line(
        lines[lineIndex].start,
        intersectionsBuffer[baseOffset].point,
      );
      clippedCount = clippedCount + 1u;

      for (var i = 1u; i + 1u < count; i = i + 2u) {
        if (clippedCount < intersectionsPerLine) {
          clippedLinesBuffer[clippedBaseOffset + clippedCount] = Line(
            intersectionsBuffer[baseOffset + i].point,
            intersectionsBuffer[baseOffset + i + 1u].point
          );
          clippedCount = clippedCount + 1u;
        }
      }
    } else if (!p1Inside && p2Inside) {
      for (var i = 0u; i + 1u < count - 1u; i = i + 2u) {
        if (clippedCount < intersectionsPerLine) {
          clippedLinesBuffer[clippedBaseOffset + clippedCount] = Line(
            intersectionsBuffer[baseOffset + i].point,
            intersectionsBuffer[baseOffset + i + 1u].point
          );
          clippedCount = clippedCount + 1u;
        }
      }
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = Line(
        intersectionsBuffer[baseOffset + count - 1u].point,
        p2,
      );
      clippedCount = clippedCount + 1u;
    }
  }

  // Optional: Mark unused slots in buffers with a sentinel value
  for (var i = count; i < intersectionsPerLine; i = i + 1u) {
    intersectionsBuffer[baseOffset + i] = Intersection(vec2f(-1.0, -1.0), 0);
  }
}
