struct Line {
      start: vec2<f32>,
      end: vec2<f32>
    };

    struct Edge {
      start: vec2<f32>,
      end: vec2<f32>
    };

    @group(0) @binding(0) var<storage, read> lines: array<Line>;
    @group(0) @binding(1) var<storage, read> edges: array<Edge>;
    @group(0) @binding(2) var<storage, read_write> clippedLines: array<Line>;

    fn lineIntersection(p1: vec2<f32>, p2: vec2<f32>, p3: vec2<f32>, p4: vec2<f32>) -> vec2<f32> {
      let s1 = p2 - p1;
      let s2 = p4 - p3;

      let denom = -s2.x * s1.y + s1.x * s2.y;

      if (abs(denom) < 1e-6) {
        return vec2<f32>(-1.0, -1.0); // Sentinel value for no intersection
      }

      let s = (-s1.y * (p1.x - p3.x) + s1.x * (p1.y - p3.y)) / denom;
      let t = (s2.x * (p1.y - p3.y) - s2.y * (p1.x - p3.x)) / denom;

      if (s >= 0.0 && s <= 1.0 && t >= 0.0 && t <= 1.0) {
        return p1 + t * s1; // Intersection point
      }

      return vec2<f32>(-1.0, -1.0); // Sentinel value for no intersection
    }

    @compute @workgroup_size(1)
    fn main(@builtin(global_invocation_id) id: vec3<u32>) {
      let lineIndex = id.x;
      if (lineIndex >= arrayLength(&lines)) {
        return;
      }

      let line = lines[lineIndex];
      var intersectionPoints: array<vec2<f32>, 2> = array<vec2<f32>, 2>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(-1.0, -1.0)
      );

      var count = 0u;

      for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
        let edge = edges[i];

        let intersection = lineIntersection(line.start, line.end, edge.start, edge.end);

        if (intersection.x != -1.0 || intersection.y != -1.0) {
          if (count < 2u) {
            intersectionPoints[count] = intersection;
            count = count + 1u;
          }
        }
      }

      // Ensure intersections are in the correct order (closest to start point first)
      if (count == 2u) {
        let d1 = distance(intersectionPoints[0], line.start);
        let d2 = distance(intersectionPoints[1], line.start);
        if (d1 > d2) {
          let temp = intersectionPoints[0];
          intersectionPoints[0] = intersectionPoints[1];
          intersectionPoints[1] = temp;
        }
      }

      // If there are 2 valid intersection points, use them as the clipped line
      if (count == 2u) {
        clippedLines[lineIndex] = Line(intersectionPoints[0], intersectionPoints[1]);
      } else {
        // If no valid clipped line, store the original line
        clippedLines[lineIndex] = Line(line.start, line.end);
      }
    }
