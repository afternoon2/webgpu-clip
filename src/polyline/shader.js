export const getShader = (
  workgroupSize = 64,
  maxIntersectionsPerSegment = 32,
) => /* wgsl */ `
@group(0) @binding(0) var<storage, read> vertices: array<vec2f>; // Input polyline vertices
@group(0) @binding(1) var<storage, read> edges: array<vec4f>;    // Clipping polygon edges
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

fn pointOnEdge(p: vec2f, p1: vec2f, p2: vec2f) -> bool {
  let crossProduct = (p.y - p1.y) * (p2.x - p1.x) - (p.x - p1.x) * (p2.y - p1.y);

  // Collinearity check
  if (abs(crossProduct) > 1e-6) {
      return false; // Not on the edge
  }

  // Check if the point is strictly between the edge bounds
  let minX = min(p1.x, p2.x);
  let maxX = max(p1.x, p2.x);
  let minY = min(p1.y, p2.y);
  let maxY = max(p1.y, p2.y);

  if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
      return false; // Outside the edge bounds
  }

  return true; // Valid point on edge
}

fn isPointInsidePolygon(testPoint: vec2f) -> bool {
  var windingNum = 0;

  for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
    let edge = edges[i];
    let p1 = edge.xy; // Start point of edge
    let p2 = edge.zw; // End point of edge

    // Check if testPoint is exactly on the edge
    if (pointOnEdge(testPoint, p1, p2)) {
        return true; // Consider points on edges as inside the polygon
    }

    if (p1.y <= testPoint.y) {
        // Upward crossing
        if (p2.y > testPoint.y) {
            let isLeft = (p2.x - p1.x) * (testPoint.y - p1.y) - (testPoint.x - p1.x) * (p2.y - p1.y);
            if (isLeft > 0.0) {
                windingNum = windingNum + 1;
            }
        }
    } else {
        // Downward crossing
        if (p2.y <= testPoint.y) {
            let isLeft = (p2.x - p1.x) * (testPoint.y - p1.y) - (testPoint.x - p1.x) * (p2.y - p1.y);
            if (isLeft < 0.0) {
                windingNum = windingNum - 1;
            }
        }
    }
}
  // If the winding number is non-zero, the point is inside the polygon.
  return windingNum != 0;
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
