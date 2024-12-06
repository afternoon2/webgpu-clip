export const code = /*wgsl*/ `
@group(0) @binding(0) var<storage, read> lines: array<vec4f>;
@group(0) @binding(1) var<storage, read> edges: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> intersectionsBuffer: array<vec3f>;
@group(0) @binding(3) var<storage, read_write> clippedLinesBuffer: array<vec4f>;

fn lineIntersection(p1: vec2f, p2: vec2f, p3: vec2f, p4: vec2f) -> vec3f {
  let s1 = vec2<f32>(p2.x - p1.x, p2.y - p1.y);
  let s2 = vec2<f32>(p4.x - p3.x, p4.y - p3.y);

  let denom = -s2.x * s1.y + s1.x * s2.y;

  if (abs(denom) < 1e-6) { // Adjust epsilon as needed
    return vec3f(-1.0, -1.0, 0.0); // No intersection
  }

  let s = (-s1.y * (p1.x - p3.x) + s1.x * (p1.y - p3.y)) / denom;
  let t = (s2.x * (p1.y - p3.y) - s2.y * (p1.x - p3.x)) / denom;

  if (s >= -1e-6 && s <= 1.0 + 1e-6 && t >= -1e-6 && t <= 1.0 + 1e-6) {
    return vec3f(p1.x + t * s1.x, p1.y + t * s1.y, 1.0);
  }

  return vec3f(-1.0, -1.0, 0.0); // No intersection
}

fn isPointInsidePolygon(testPoint: vec2<f32>) -> bool {
  var leftNodes = 0;
  var rightNodes = 0;

  for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
    let edge = edges[i];

    // Check if the edge crosses the Y threshold of the test point
    if ((edge.y <= testPoint.y && edge.w > testPoint.y) || 
      (edge.y > testPoint.y && edge.w <= testPoint.y)) {
      
      // Calculate the X-coordinate of the intersection
      let slope = (edge.z - edge.x) / (edge.z - edge.y);
      let intersectX = edge.x + (testPoint.y - edge.y) * slope;

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
    let result = lineIntersection(lines[lineIndex].xy, lines[lineIndex].zw, edge.xy, edge.zw);

    if (result.z == 1.0) { // check if intersection is valid
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
        intersectionsBuffer[baseOffset + i].x, intersectionsBuffer[baseOffset + i].y),
        vec2<f32>(lines[lineIndex].x, lines[lineIndex].y)
      );
      let d2 = distance(vec2<f32>(
        intersectionsBuffer[baseOffset + j].x, intersectionsBuffer[baseOffset + j].y),
        vec2<f32>(lines[lineIndex].x, lines[lineIndex].y)
      );

      if (d2 < d1) {
        let temp = intersectionsBuffer[baseOffset + i];
        intersectionsBuffer[baseOffset + i] = intersectionsBuffer[baseOffset + j];
        intersectionsBuffer[baseOffset + j] = temp;
      }
    }
  }

  let p1 = lines[lineIndex].xy;
  let p2 = lines[lineIndex].zw;

  let p1Inside = isPointInsidePolygon(p1);
  let p2Inside = isPointInsidePolygon(p2);

  if (clippedCount == 1u) {
    if (!p1Inside) {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        intersectionsBuffer[baseOffset].xy,
        lines[lineIndex].zw
      );
      clippedCount = clippedCount + 1u;
    } else if (!p2Inside) {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        lines[lineIndex].xy,
        intersectionsBuffer[baseOffset].xy,
      );
      clippedCount = clippedCount + 1u;
    }
  } else {
    if (!p1Inside && !p2Inside) {
      // Create clipped line segments from pairs of intersections
      for (var i = 0u; i + 1u < count; i = i + 2u) {
        if (clippedCount < intersectionsPerLine) {
          clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
            intersectionsBuffer[baseOffset + i].xy,
            intersectionsBuffer[baseOffset + i + 1u].xy
          );
          clippedCount = clippedCount + 1u;
        }
      }
    } else if (p1Inside && !p2Inside) {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        lines[lineIndex].xy,
        intersectionsBuffer[baseOffset].xy,
      );
      clippedCount = clippedCount + 1u;

      for (var i = 1u; i + 1u < count; i = i + 2u) {
        if (clippedCount < intersectionsPerLine) {
          clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
            intersectionsBuffer[baseOffset + i].xy,
            intersectionsBuffer[baseOffset + i + 1u].xy
          );
          clippedCount = clippedCount + 1u;
        }
      }
    } else if (!p1Inside && p2Inside) {
      for (var i = 0u; i + 1u < count - 1u; i = i + 2u) {
        if (clippedCount < intersectionsPerLine) {
          clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
            intersectionsBuffer[baseOffset + i].xy,
            intersectionsBuffer[baseOffset + i + 1u].xy
          );
          clippedCount = clippedCount + 1u;
        }
      }
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        intersectionsBuffer[baseOffset + count - 1u].xy,
        p2,
      );
      clippedCount = clippedCount + 1u;
    } else {
      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        lines[lineIndex].xy,
        intersectionsBuffer[baseOffset].xy,
      );
      clippedCount = clippedCount + 1u;
      
      // Create clipped line segments from pairs of intersections
      for (var i = 1u; i + 1u < count - 1; i = i + 2u) {
        if (clippedCount < intersectionsPerLine) {
          clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
            intersectionsBuffer[baseOffset + i].xy,
            intersectionsBuffer[baseOffset + i + 1u].xy
          );
          clippedCount = clippedCount + 1u;
        }
      }

      clippedLinesBuffer[clippedBaseOffset + clippedCount] = vec4f(
        intersectionsBuffer[baseOffset + count - 1].xy,
        lines[lineIndex].zw,
      );
      clippedCount = clippedCount + 1u;
    }
  }

  // Optional: Mark unused slots in buffers with a sentinel value
  for (var i = count; i < intersectionsPerLine; i = i + 1u) {
    intersectionsBuffer[baseOffset + i] = vec3f(-1.0, -1.0, 0.0);
  }
}

`;
