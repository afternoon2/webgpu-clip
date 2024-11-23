import shader from "./lineClip.wgsl?raw";

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
        code: shader,
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
