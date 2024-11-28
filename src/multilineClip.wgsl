@group(0) @binding(0) var<storage, read> polylineVertices: array<vec2f>; // Input polyline vertices
@group(0) @binding(1) var<storage, read> polygonEdges: array<Edge>;         // Clipping polygon edges
@group(0) @binding(2) var<storage, read_write> clippedPolyline: array<vec4f>; // Output clipped polyline

struct Edge {
  start: vec2f,
  end: vec2f
}

struct Intersection {
  point: vec2f,
  isValid: u32
}

fn pointInsidePolygon(p: vec2<f32>) -> bool {
    var windingNumber = 0;

    for (var i = 0u; i < arrayLength(&polygonEdges); i = i + 1u) {
        let edge = polygonEdges[i];

        if ((edge.start.y <= p.y && edge.end.y > p.y) || (edge.start.y > p.y && edge.end.y <= p.y)) {
          let slope = (edge.end.x - edge.start.x) / (edge.end.y - edge.start.y);
          let intersectX = edge.start.x + (p.y - edge.start.y) * slope;

          if (p.x < intersectX) {
            if (edge.start.y < edge.end.y) {
              windingNumber = windingNumber + 1;
            } else {
              windingNumber = windingNumber - 1;
            }
          }
        }
    }

    return windingNumber != 0;
}

fn lineIntersection(p1: vec2<f32>, p2: vec2<f32>, p3: vec2<f32>, p4: vec2<f32>) -> Intersection {
    let s1 = p2 - p1;
    let s2 = p4 - p3;

    let denom = -s2.x * s1.y + s1.x * s2.y;

    if (abs(denom) < 1e-6) {
        return Intersection(vec2<f32>(-1.0, -1.0), 0); // No intersection
    }

    let s = (-s1.y * (p1.x - p3.x) + s1.x * (p1.y - p3.y)) / denom;
    let t = (s2.x * (p1.y - p3.y) - s2.y * (p1.x - p3.x)) / denom;

    if (s >= 0.0 && s <= 1.0 && t >= 0.0 && t <= 1.0) {
        return Intersection(p1 + s * s1, 1); // Valid intersection
    }

    return Intersection(vec2<f32>(-1.0, -1.0), 0); // No intersection
}

// fn addValidPoint(point: vec2f) {
//     let idx = atomicAdd(&outputIndex, 1u); // Zwiększamy indeks o 3 (dla x, y, sentinel)
//     if (idx + 2u < arrayLength(&clippedPolyline)) { // Upewniamy się, że zmieści się x, y, sentinel
//         clippedPolyline[idx] = vec3f(point, 1.0); // Sentinel 1.0 oznacza ważny punkt
//     }
// }

// fn addSentinelPoint() {
//     let idx = atomicAdd(&outputIndex, 1u);
//     if (idx < arrayLength(&clippedPolyline)) {
//         clippedPolyline[idx] = vec3f(-1.0, -1.0, 0.0);
//     } else {
//         atomicSub(&outputIndex, 1u);
//     }
// }

var<workgroup> outputIndex: atomic<u32>;

@compute @workgroup_size(1) // One thread processes one polyline
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    // if (id.x == 0u) {
    //     atomicStore(&outputIndex, 0u);

    //     for (var i = 0u; i < arrayLength(&clippedPolyline); i = i + 1u) {
    //         clippedPolyline[i] = Outpoint(vec2f(0.0, 0.0), 0.0); // Wyczyść dane
    //     }
    // }

    var clippedStuff: array<vec3f, 128>;
    var clippedStuffCount = 0u;


    let numVertices = arrayLength(&polylineVertices);

    if (numVertices < 2u) {
        return; // Not enough points for a polyline
    }

    for (var i = 0u; i < numVertices - 1u; i = i + 1u) {
        let p1 = polylineVertices[i];
        let p2 = polylineVertices[i + 1u];

        // var intersections: array<Intersection, 32>; // Max 10 intersections
        // var intersectionCount = 0u;

        // // Compute intersections with polygon edges
        // for (var j = 0u; j < arrayLength(&polygonEdges); j = j + 1u) {
        //     let edge = polygonEdges[j];
        //     let intersection = lineIntersection(p1, p2, edge.start, edge.end);

        //     if (intersection.isValid == 1u) {
        //         intersections[intersectionCount] = intersection;
        //         intersectionCount = intersectionCount + 1u;
        //     }
        // }

        // Sort intersections along the segment (optional)
        // for (var i = 1u; i < intersectionCount; i = i + 1u) {
        //     let key = intersections[i];
        //     var j = i;

        //     while (j > 0u && distance(p1, intersections[j - 1u].point) > distance(p1, key.point)) {
        //         intersections[j] = intersections[j - 1u];
        //         j = j - 1u;
        //     }
        //     intersections[j] = key;
        // }

        // Process based on inside/outside classification
        let insideStart = pointInsidePolygon(p1);
        let insideEnd = pointInsidePolygon(p2);
        
        clippedStuff[clippedStuffCount] = vec3f(p1, 1.0);
        clippedStuffCount = clippedStuffCount + 1u;
        clippedStuff[clippedStuffCount] = vec3f(p2, 1.0);
        clippedStuffCount = clippedStuffCount + 1u;
        // if (!insideStart && !insideEnd) {
        //   // if (intersectionCount >= 1u) {
        //     for (var k = 0u; k < intersectionCount; k = k + 2u) {
        //       // add first intersection
        //       addValidPoint(intersections[k].point);
        //       // add second intersection
        //       addValidPoint(intersections[k + 1u].point);
        //       addSentinelPoint();
        //     }
        //   // }
        // } else if (!insideStart && insideEnd) {
        //   if (intersectionCount == 1u) {
        //     let intersection = intersections[0];
        //     addValidPoint(intersection.point);
        //     addValidPoint(p2);
        //   } else if (intersectionCount > 1u) {
        //     // skip last intersection
        //     for (var l = 0u; l < intersectionCount - 1u; l = l + 2u) {
        //         addValidPoint(intersections[l].point);
        //         addValidPoint(intersections[l + 1u].point);
        //         addSentinelPoint();
        //     }
        //     let lastIntersection = intersections[intersectionCount - 1u];
        //     addValidPoint(lastIntersection.point);
        //     addValidPoint(p2);
        //   }
        // } else if (insideStart && !insideEnd) {
        //     addValidPoint(intersections[0].point);
        //     addSentinelPoint();

        //     if (intersectionCount > 1) {
        //       for (var m = 1u; m < intersectionCount; m = m + 1u) {
        //         addValidPoint(intersections[m].point);
        //         addValidPoint(intersections[m + 1u].point);
        //         addSentinelPoint();
        //       }
        //     }
        // } else if (insideStart && insideEnd) {
        //   if (intersectionCount == 0) {
        //     addValidPoint(p2);
        //   } else if (intersectionCount > 1u) {
        //     addValidPoint(intersections[0].point);
        //     addSentinelPoint();

        //     for (var o = 1u; o < intersectionCount - 1u; o = o + 1u) {
        //       addValidPoint(intersections[o].point);
        //       addValidPoint(intersections[o + 1u].point);
        //       addSentinelPoint();
        //     }

        //     addValidPoint(intersections[intersectionCount - 1u].point);
        //     addValidPoint(p2);
        //     addSentinelPoint();
        //   } else {
        //     addValidPoint(p1);
        //     addValidPoint(p2);
        //   }
        // }
    }

    for (var z = 0u; z < clippedStuffCount; z = z + 1u) {
      clippedPolyline[z] = vec4f(clippedStuff[z], 2137.0);
    }
}