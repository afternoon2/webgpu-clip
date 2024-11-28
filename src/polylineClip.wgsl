struct Intersection {
  point: vec2f,
  isValid: u32
}

struct Point {
  value: vec2f,
  isSentinel: u32
}

struct Edge {
  start: vec2f,
  end: vec2f
}

@group(0) @binding(0) var<storage, read> vertices: array<vec2f>;
@group(0) @binding(1) var<storage, read> edges: array<Edge>;
@group(0) @binding(2) var<storage, read_write> clippedPolylineBuffer: array<vec3f>;
@group(0) @binding(3) var<storage, read_write> debugBuffer: array<u32>;

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

var<workgroup> outputIndex: atomic<u32>;
var<workgroup> debugIndex: atomic<u32>;

fn addPoint(point: vec2<f32>) {
    let idx = atomicAdd(&outputIndex, 1u);
    if (idx < arrayLength(&clippedPolylineBuffer)) {
        clippedPolylineBuffer[idx] = vec3f(point, 1.0);
    } else {
        debugBuffer[atomicAdd(&debugIndex, 1u)] = 0xFFFFFFFFu; // Log overflow
    }
}

fn addSentinel() {
    let idx = atomicAdd(&outputIndex, 1u);
    if (idx < arrayLength(&clippedPolylineBuffer)) {
        clippedPolylineBuffer[idx] = vec3f(-1.0, -1.0, -1.0);
    } else {
        debugBuffer[atomicAdd(&debugIndex, 1u)] = 0xFFFFFFFFu; // Log overflow
    }
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let vertexIndex = id.x;

  if (id.x == 0u) {
    atomicStore(&outputIndex, 0u);
    atomicStore(&debugIndex, 0u);
  }
  workgroupBarrier();

  // if (atomicLoad(&outputIndex) >= arrayLength(&clippedPolylineBuffer)) {
  //   debugBuffer[atomicAdd(&debugIndex, 1u)] = 0xFFFFFFFFu; // Log overflow
  //   return;
  // }

  debugBuffer[atomicAdd(&debugIndex, 1u)] = id.x;

  if (vertexIndex >= arrayLength(&vertices)) {
    return;
  }

  let numPoints = arrayLength(&vertices);

  if (numPoints < 2u) {
    return;
  }

  var p1 = vertices[0];
  var p1Inside = isPointInsidePolygon(p1);
  
  for (var i = 1u; i < numPoints; i = i + 1u) {
    let p2 = vertices[i];
    let p2Inside = isPointInsidePolygon(p2);

    var intersections: array<vec2f, 32>;
    var intersectionCount = 0u;

    for (var j = 0u; j < arrayLength(&edges); j = j + 1u) {
      let edge = edges[j];
      let intersection = lineIntersection(p1, p2, edge.start, edge.end);

      if (intersection.isValid == 1u) {
        intersections[intersectionCount] = intersection.point;
        intersectionCount = intersectionCount + 1u;
      }
    }

    // // Sort intersections along the segment
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

    if (p1Inside && p2Inside) {
      addPoint(p1);

      for (var i = 0u; i < intersectionCount; i = i + 2u) {
        addPoint(intersections[i]);
        addPoint(intersections[i + 1u]);
        addSentinel();
      }
      addPoint(p2);
    } else if (p1Inside && !p2Inside) {
      addPoint(p1);
      addPoint(intersections[0]);

      if (intersectionCount == 1u) {
        addSentinel();
      } else {
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
        addSentinel();
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

    p1 = p2;
    p1Inside = p2Inside;
  }
}