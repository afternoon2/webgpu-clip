@group(0) @binding(0) var<storage, read> vertices: array<vec2f>;
@group(0) @binding(1) var<storage, read> edges: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> clippedPolylineBuffer: array<vec4f>;
@group(0) @binding(3) var<storage, read_write> debugBuffer: array<vec4f>;

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

fn isPointInsidePolygon(testPoint: vec2<f32>) -> bool {
  var leftNodes = 0;
  var rightNodes = 0;

  for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
    let edge = edges[i];

    // Check if the edge crosses the Y threshold of the test point
    if ((edge.y <= testPoint.y && edge.w > testPoint.y) || 
      (edge.y > testPoint.y && edge.w <= testPoint.y)) {
      
      // Calculate the X-coordinate of the intersection
      let slope = (edge.z - edge.x) / (edge.w - edge.y);
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

var<workgroup> outputIndex: atomic<u32>;
var<workgroup> debugIndex: atomic<u32>;

fn addPoint(point: vec2<f32>) {
  let idx = atomicAdd(&outputIndex, 1u);
  clippedPolylineBuffer[idx] = vec4f(point, 1.0, 0.0); // Add extra float for padding
}

fn addSentinel() {
  let idx = atomicAdd(&outputIndex, 1u);
  clippedPolylineBuffer[idx] = vec4f(-1.0, -1.0, -1.0, 0.0);
}

fn processSegment(p1: vec2f, p2: vec2f) {
  var intersections: array<vec2f, 64>;
  var intersectionCount = 0u;

  for (var n = 0u; n < 64; n = n + 1u) {
    intersections[n] = vec2f(0.0, 0.0);
  }

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

  let p1Inside = isPointInsidePolygon(p1);
  let p2Inside = isPointInsidePolygon(p2);

  if (p1Inside && p2Inside) {
    addPoint(p1);

    if (intersectionCount == 0u) {
      addPoint(p2);
    } else if (intersectionCount > 1u) {
      addPoint(intersections[0u]);
      addSentinel();

      for (var i = 1u; i < intersectionCount - 1u; i = i + 2u) {
        addPoint(intersections[i]);
        addPoint(intersections[i + 1u]);
        addSentinel();
      }

      addPoint(intersections[intersectionCount - 1u]);
      addPoint(p2);
    }
  } else if (p1Inside && !p2Inside) {
    addPoint(p1);
    addPoint(intersections[0]);
    addSentinel();

    if (intersectionCount > 1u) {
      for (var i = 1u; i < intersectionCount; i = i + 2u) {
        addPoint(intersections[i]);
        addPoint(intersections[i + 1u]);
        addSentinel();
      }
    }
  } else if (!p1Inside && p2Inside) {
    if (intersectionCount == 1u) {
      addPoint(intersections[0]);
      addPoint(p2);
    } else {
      for (var i = 0u; i < intersectionCount - 1u; i = i + 2u) {
        addPoint(intersections[i]);
        addPoint(intersections[i + 1u]);
        addSentinel();
      }
      addPoint(intersections[intersectionCount - 1u]);
      addPoint(p2);
      addSentinel();
    }
  } else {
    for (var i = 0u; i + 1u < intersectionCount; i = i + 2u) {
      addPoint(intersections[i]);
      addPoint(intersections[i + 1u]);
      addSentinel();
    }
  }
}

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  if (id.x == 0u) {
    atomicStore(&outputIndex, 0u);
    atomicStore(&debugIndex, 0u);

    for (var i = 0u; i < arrayLength(&debugBuffer); i = i + 1u) {
      debugBuffer[i] = vec4f(0.0, 0.0, 0.0, 0.0);
    }

    for (var i = 0u; i < arrayLength(&clippedPolylineBuffer); i = i + 1u) {
      clippedPolylineBuffer[i] = vec4f(0.0, 0.0, 0.0, 0.0);
    }
  }
  workgroupBarrier(); // Synchronize threads

  let segmentIndex = id.x;
  let totalSegments = arrayLength(&vertices) - 1u;

  if (segmentIndex >= totalSegments) {
    return;
  }

  let p1 = vertices[segmentIndex];
  let p2 = vertices[segmentIndex + 1u];

  let debugIdx = atomicAdd(&debugIndex, 1u);
  debugBuffer[debugIdx] = vec4f(f32(segmentIndex), p1.x, p1.y, 0.0);
  debugBuffer[debugIdx + 1] = vec4f(f32(segmentIndex), p2.x, p2.y, 0.0);

  processSegment(p1, p2);
}