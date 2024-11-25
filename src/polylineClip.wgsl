struct Point {
    X: f32,
    Y: f32,
};

struct Intersection {
    point: Point,
    isValid: u32
};

struct Edge {
    start: Point,
    end: Point,
};

@group(0) @binding(0) var<storage, read> polylineVertices: array<Point>;
@group(0) @binding(1) var<storage, read> edges: array<Edge>;
@group(0) @binding(2) var<storage, read_write> clippedVertices: array<Point>;

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

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    let polylineIndex = id.x;

    if (polylineIndex >= arrayLength(&polylineVertices)) {
        return;
    }

    var outputIndex: u32 = 0u;

    // Iterate through vertices and process segments
    for (var i = 0u; i < arrayLength(&polylineVertices); i = i + 1u) {
        let vertex = polylineVertices[i];

        // Process vertex (you can implement clipping or other logic here)
        let clippedPoint = Point(vertex.X, vertex.Y);

        // Write to output buffer
        clippedVertices[outputIndex] = clippedPoint;
        outputIndex = outputIndex + 1u;
    }

    // clippedVertices[polylineIndex] = polylineVertices[metadata.end + 1u];
}
