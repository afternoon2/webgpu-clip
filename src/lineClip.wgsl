struct Point {
  X: f32,
  Y: f32,
};

struct Line {
  start: Point,
  end: Point,
};

struct Edge {
  start: Point,
  end: Point,
};

struct Intersection {
  point: Point,
  isValid: bool,
};

@group(0) @binding(0) var<storage, read> lines: array<Line>;
@group(0) @binding(1) var<storage, read> edges: array<Edge>;
@group(0) @binding(2) var<storage, read_write> clippedLines: array<Line>;
@group(0) @binding(3) var<storage, read_write> debugBuffer: array<Point>;

fn lineIntersection(p1: Point, p2: Point, p3: Point, p4: Point) -> Intersection {
  let s1 = vec2<f32>(p2.X - p1.X, p2.Y - p1.Y);
  let s2 = vec2<f32>(p4.X - p3.X, p4.Y - p3.Y);

  let denom = -s2.x * s1.y + s1.x * s2.y;

  if (abs(denom) < 1e-6) {
    return Intersection(Point(0.0, 0.0), false); // No intersection
  }

  let s = (-s1.y * (p1.X - p3.X) + s1.x * (p1.Y - p3.Y)) / denom;
  let t = (s2.x * (p1.Y - p3.Y) - s2.y * (p1.X - p3.X)) / denom;

  if (s >= 0.0 && s <= 1.0 && t >= 0.0 && t <= 1.0) {
    return Intersection(Point(p1.X + t * s1.x, p1.Y + t * s1.y), true);
  }

  return Intersection(Point(0.0, 0.0), false); // No intersection
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let lineIndex = id.x;
  if (lineIndex >= arrayLength(&lines)) {
    return;
  }

  var intersections: array<Point, 16>;
  var count = 0u;
  let debugStartIndex = lineIndex * 16u;

  for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
    let edge = edges[i];
    let result = lineIntersection(lines[lineIndex].start, lines[lineIndex].end, edge.start, edge.end);

    if (result.isValid) {
      if (count < 16u) {
        intersections[count] = result.point;

        if (debugStartIndex + count < arrayLength(&debugBuffer)) {
          debugBuffer[debugStartIndex + count] = result.point;
        }

        count = count + 1u;
      }
    }
  }

  if (count == 0u) {
    return;
  }

  for (var i = 0u; i < count; i = i + 1u) {
    for (var j = i + 1u; j < count; j = j + 1u) {
      let d1 = distance(vec2<f32>(intersections[i].X, intersections[i].Y), vec2<f32>(lines[lineIndex].start.X, lines[lineIndex].start.Y));
      let d2 = distance(vec2<f32>(intersections[j].X, intersections[j].Y), vec2<f32>(lines[lineIndex].start.X, lines[lineIndex].start.Y));
      if (d2 < d1) {
        let temp = intersections[i];
        intersections[i] = intersections[j];
        intersections[j] = temp;
      }
    }
  }

  let outputStartIndex = lineIndex * 16u;
  var outputCount = 0u;

  for (var i = 0u; i + 1u < count; i = i + 2u) {
    if (outputStartIndex + outputCount < arrayLength(&clippedLines)) {
      clippedLines[outputStartIndex + outputCount] = Line(intersections[i], intersections[i + 1u]);
      outputCount = outputCount + 1u;
    }
  }
}