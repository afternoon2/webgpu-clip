const SHADER = `
    struct Line {
      start: vec2<f32>,
      end: vec2<f32>
    };

    struct Edge {
      start: vec2<f32>,
      end: vec2<f32>
    };

    @group(0) @binding(0) var<storage, read> lines: array<Line>; // Read-only storage
    @group(0) @binding(1) var<storage, read> edges: array<Edge>; // Read-only storage
    @group(0) @binding(2) var<storage, read_write> clippedLines: array<Line>; // Read-write storage

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
      var newStart: vec2<f32> = line.start;
      var newEnd: vec2<f32> = line.end;

      for (var i = 0u; i < arrayLength(&edges); i = i + 1u) {
        let edge = edges[i];

        let intersection = lineIntersection(line.start, line.end, edge.start, edge.end);

        // Check for valid intersection
        if (intersection.x != -1.0 || intersection.y != -1.0) {
          let point = intersection;
          if (dot(point - line.start, line.end - line.start) > 0.0) {
            newEnd = point;
          } else {
            newStart = point;
          }
        }
      }

      clippedLines[lineIndex] = Line(newStart, newEnd);
    }
`;

export async function clipLinesWithCompute(lines, polygon) {
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    // Prepare the data
    const lineData = new Float32Array(
        lines.flatMap(([start, end]) => [start.X, start.Y, end.X, end.Y]),
    );
    const edgeData = new Float32Array(
        polygon[0]
            .map((point, i, points) => {
                const nextPoint = points[(i + 1) % points.length];
                return [point.X, point.Y, nextPoint.X, nextPoint.Y];
            })
            .flat(),
    );

    // Buffers
    const lineBuffer = device.createBuffer({
        size: lineData.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(lineBuffer, 0, lineData);

    const edgeBuffer = device.createBuffer({
        size: edgeData.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(edgeBuffer, 0, edgeData);

    const clippedLineBuffer = device.createBuffer({
        size: lineData.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    // Bind group layout
    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "read-only-storage" },
            },
            {
                binding: 1,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "read-only-storage" },
            },
            {
                binding: 2,
                visibility: GPUShaderStage.COMPUTE,
                buffer: { type: "storage" },
            },
        ],
    });

    // Bind group
    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: { buffer: lineBuffer } },
            { binding: 1, resource: { buffer: edgeBuffer } },
            { binding: 2, resource: { buffer: clippedLineBuffer } },
        ],
    });

    // Compute pipeline
    const shaderModule = device.createShaderModule({
        code: SHADER,
    });

    const computePipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout],
        }),
        compute: {
            module: shaderModule,
            entryPoint: "main",
        },
    });

    // Read back clipped lines
    const clippedLineData = new Float32Array(lineData.length);
    const readBuffer = device.createBuffer({
        size: clippedLineData.byteLength,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    // Dispatch Compute Pass
    const computeEncoder = device.createCommandEncoder();
    const passEncoder = computeEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(lines.length);
    passEncoder.end();
    device.queue.submit([computeEncoder.finish()]);

    // Copy Results to Readable Buffer
    const copyEncoder = device.createCommandEncoder();
    copyEncoder.copyBufferToBuffer(
        clippedLineBuffer,
        0,
        readBuffer,
        0,
        clippedLineData.byteLength,
    );
    device.queue.submit([copyEncoder.finish()]);

    // Wait for GPU to finish processing and map the result buffer
    await device.queue.onSubmittedWorkDone();

    await readBuffer.mapAsync(GPUMapMode.READ);
    const data = new Float32Array(readBuffer.getMappedRange());
    const clippedLines = [];
    for (let i = 0; i < data.length; i += 4) {
        clippedLines.push([
            { X: data[i], Y: data[i + 1] },
            { X: data[i + 2], Y: data[i + 3] },
        ]);
    }
    readBuffer.unmap();

    return clippedLines;
}
