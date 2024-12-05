export function getShader(
  workgroupSize: number,
  maxIntersectionsPerSegment: number,
): string {
  return /* wgsl */ `
@group(0) @binding(0) var<storage, read> vertices: array<vec4f>;
@group(0) @binding(1) var<storage, read> edges: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> clippedPolylineBuffer: array<vec4f>;
@group(0) @binding(3) var<uniform> maxClippedVerticesPerSegment: u32;

var<private> threadIndex: u32;
var<private> bufferIndex: u32;
var<private> polylineIndex: u32;

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

struct LineIntersectionsData {
  intersections: array<vec2f, ${maxIntersectionsPerSegment}>,
  intersectionCount: u32
}

fn getLineIntersectionsData(p1: vec4f, p2: vec4f) -> LineIntersectionsData {
  var intersections: array<vec2f, ${maxIntersectionsPerSegment}>;
  var intersectionCount = 0u;

  for (var j = 0u; j < arrayLength(&edges); j = j + 1u) {
    let edge = edges[j];
    let intersection = lineIntersection(p1.xy, p2.xy, edge.xy, edge.zw);

    if (intersection.z == 1.0) {
      intersections[intersectionCount] = intersection.xy;
      intersectionCount = intersectionCount + 1u;
    }
  }

  if (intersectionCount > 1u) {
    for (var k = 0u; k < intersectionCount - 1u; k = k + 1u) {
      for (var l = k + 1u; l < intersectionCount; l = l + 1u) {
        if (distance(p1.xy, intersections[l]) < distance(p1.xy, intersections[k])) {
          let temp = intersections[k];
          intersections[k] = intersections[l];
          intersections[l] = temp;
        }
      }
    }
  }

  return LineIntersectionsData(intersections, intersectionCount);
}

fn isPointInsidePolygon(point: vec2f) -> bool {
  var leftNodes = 0;
  for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
    let edge = edges[i];
    let start = edge.xy;
    let end = edge.zw;
    if ((start.y <= point.y && end.y > point.y) || (start.y > point.y && end.y <= point.y)) {
      let slope = (end.x - start.x) / (end.y - start.y);
      let intersectX = start.x + (point.y - start.y) * slope;
      if (point.x < intersectX) {
        leftNodes = leftNodes + 1;
      }
    }
  }
  return (leftNodes % 2) != 0;
}

fn addPoint(point: vec2f) {
  clippedPolylineBuffer[bufferIndex] = vec4f(point, f32(polylineIndex), 0.0);
  bufferIndex = bufferIndex + 1u;
  let segmentStart = threadIndex * maxClippedVerticesPerSegment;
  clippedPolylineBuffer[segmentStart].w = f32(bufferIndex - segmentStart);
}

fn addSentinel() {
  clippedPolylineBuffer[bufferIndex] = vec4f(-1.0, -1.0, -1.0, -1.0);
  bufferIndex = bufferIndex + 1u;
  let segmentStart = threadIndex * maxClippedVerticesPerSegment;
  clippedPolylineBuffer[segmentStart].w = f32(bufferIndex - segmentStart);
}

@compute @workgroup_size(${workgroupSize})
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
  threadIndex = globalId.x;

  if (threadIndex >= arrayLength(&vertices) - 1u || threadIndex == 0u) {
    return; // No segment to process
  }
  
  let p1 = vertices[threadIndex - 1u];
  let p2 = vertices[threadIndex];

  polylineIndex = u32(p1.z);


  let p1Inside = isPointInsidePolygon(p1.xy);
  let p2Inside = isPointInsidePolygon(p2.xy);

  let intersectionsData = getLineIntersectionsData(p1, p2);
  let intersections = intersectionsData.intersections;
  let intersectionCount = intersectionsData.intersectionCount;

  bufferIndex = threadIndex * maxClippedVerticesPerSegment;

  if (p1Inside && p2Inside) {
    addPoint(p1.xy);

    if (intersectionCount == 0u) {
      addPoint(p2.xy);
    } 
    else  {
      addPoint(intersections[0u]);
      addSentinel();

      for (var i = 1u; i < intersectionCount - 1u; i = i + 2u) {
        addPoint(intersections[i]);
        addPoint(intersections[i + 1u]);
        addSentinel();
      }

      addPoint(intersections[intersectionCount - 1u]);
      addPoint(p2.xy);
    }
  } else if (p1Inside && !p2Inside) {
    addPoint(p1.xy);
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
      addPoint(p2.xy);
    } else {
      for (var i = 0u; i < intersectionCount - 1u; i = i + 2u) {
        addPoint(intersections[i]);
        addPoint(intersections[i + 1u]);
        addSentinel();
      }
      addPoint(intersections[intersectionCount - 1u]);
      addPoint(p2.xy);
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
`;
}
