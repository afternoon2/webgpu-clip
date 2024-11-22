async function clip(canvas, canvasWidth, canvasHeight, polygon, lines) {
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    const context = canvas.getContext("webgpu");
    context.configure({
        device,
        format: "bgra8unorm",
        size: { width: canvasWidth, height: canvasHeight },
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    });

    // Convert polygon and lines into masks
    const polygonMask = createPolygonMask(canvasWidth, canvasHeight, polygon);
    const lineMask = createLineMask(canvasWidth, canvasHeight, lines);

    // Create textures
    const polygonTexture = device.createTexture({
        size: {
            width: canvasWidth,
            height: canvasHeight,
            depthOrArrayLayers: 1,
        },
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });

    const lineTexture = device.createTexture({
        size: {
            width: canvasWidth,
            height: canvasHeight,
            depthOrArrayLayers: 1,
        },
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });

    // Write polygon and line masks into textures
    device.queue.writeTexture(
        { texture: polygonTexture },
        polygonMask,
        { bytesPerRow: canvasWidth * 4, rowsPerImage: canvasHeight },
        { width: canvasWidth, height: canvasHeight, depthOrArrayLayers: 1 },
    );

    device.queue.writeTexture(
        { texture: lineTexture },
        lineMask,
        { bytesPerRow: canvasWidth * 4, rowsPerImage: canvasHeight },
        { width: canvasWidth, height: canvasHeight, depthOrArrayLayers: 1 },
    );

    // Calculate aligned bytesPerRow
    const bytesPerPixel = 16; // RGBA32Float (4 channels, 4 bytes per channel)
    const unalignedBytesPerRow = canvasWidth * bytesPerPixel;
    const alignedBytesPerRow = Math.ceil(unalignedBytesPerRow / 256) * 256;

    // Create buffers for rendering output
    const outputBuffer = device.createBuffer({
        size: alignedBytesPerRow * canvasHeight, // Aligned bytesPerRow * number of rows
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const canvasSizeBuffer = device.createBuffer({
        size: 8, // vec2<f32> for canvas dimensions
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(
        canvasSizeBuffer,
        0,
        new Float32Array([canvasWidth, canvasHeight]),
    );

    // Create bind group layout and pipeline
    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                texture: { sampleType: "float" },
            },
            { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: { sampleType: "float" },
            },
            { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
            {
                binding: 4,
                visibility: GPUShaderStage.FRAGMENT,
                buffer: { type: "uniform" },
            },
        ],
    });

    const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
            { binding: 0, resource: polygonTexture.createView() },
            { binding: 1, resource: device.createSampler() },
            { binding: 2, resource: lineTexture.createView() },
            { binding: 3, resource: device.createSampler() },
            { binding: 4, resource: { buffer: canvasSizeBuffer } },
        ],
    });

    const shaderModule = device.createShaderModule({
        code: `
          @vertex
          fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
            var positions = array<vec2<f32>, 6>(
              vec2<f32>(-1.0, -1.0),
              vec2<f32>(1.0, -1.0),
              vec2<f32>(-1.0, 1.0),
              vec2<f32>(-1.0, 1.0),
              vec2<f32>(1.0, -1.0),
              vec2<f32>(1.0, 1.0)
            );
            let position = positions[vertexIndex];
            return vec4<f32>(position, 0.0, 1.0);
          }

          @group(0) @binding(0) var u_polygonTexture: texture_2d<f32>;
          @group(0) @binding(1) var u_polygonSampler: sampler;
          @group(0) @binding(2) var u_lineTexture: texture_2d<f32>;
          @group(0) @binding(3) var u_lineSampler: sampler;
          @group(0) @binding(4) var<uniform> u_canvasSize: vec2<f32>;

          @fragment
          fn fs_main(@builtin(position) coord: vec4<f32>) -> @location(0) vec4<f32> {
            let uv = coord.xy / u_canvasSize;
            let polygonMask = textureSample(u_polygonTexture, u_polygonSampler, uv).r;
            let lineMask = textureSample(u_lineTexture, u_lineSampler, uv).r;

            if (polygonMask > 0.5 && lineMask > 0.5) {
              // Encode the normalized line index into the red channel
              let lineIndex = floor(coord.x / u_canvasSize.x * 100.0); // Example encoding
              return vec4<f32>(lineIndex / 255.0, uv, 1.0); // Output lineIndex + UV
            }

            return vec4<f32>(0.0, 0.0, 0.0, 0.0); // Background
          }
        `,
    });

    const pipeline = device.createRenderPipeline({
        vertex: {
            module: shaderModule,
            entryPoint: "vs_main",
        },
        fragment: {
            module: shaderModule,
            entryPoint: "fs_main",
            targets: [{ format: "rgba32float" }],
        },
        primitive: {
            topology: "triangle-list",
        },
        layout: device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout],
        }),
    });

    // Render to an offscreen texture
    const outputTexture = device.createTexture({
        size: {
            width: canvasWidth,
            height: canvasHeight,
            depthOrArrayLayers: 1,
        },
        format: "rgba32float",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    });

    const commandEncoder = device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
            {
                view: outputTexture.createView(),
                loadOp: "clear",
                storeOp: "store",
                clearValue: { r: 0, g: 0, b: 0, a: 1 },
            },
        ],
    });

    renderPass.setPipeline(pipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.draw(6); // Full-screen quad
    renderPass.end();

    // Update CopyTextureToBuffer with aligned bytesPerRow
    commandEncoder.copyTextureToBuffer(
        { texture: outputTexture },
        {
            buffer: outputBuffer,
            bytesPerRow: alignedBytesPerRow, // Use aligned value
            rowsPerImage: canvasHeight,
        },
        {
            width: canvasWidth,
            height: canvasHeight,
            depthOrArrayLayers: 1,
        },
    );

    device.queue.submit([commandEncoder.finish()]);

    // Read back clipped line data
    await outputBuffer.mapAsync(GPUMapMode.READ);
    // Parse the buffer data into lines
    const data = new Float32Array(outputBuffer.getMappedRange());
    const groupedLines = {};

    // Group UV coordinates by line index
    for (let i = 0; i < data.length; i += 4) {
        const lineIndex = Math.floor(data[i] * 255); // Decode line index
        const u = data[i + 1]; // Normalized X
        const v = data[i + 2]; // Normalized Y

        // Ignore invalid data
        if (lineIndex === 0 || u === 0 || v === 0) continue;

        // Convert UV to original coordinates
        const x = u * canvasWidth;
        const y = v * canvasHeight;

        // Group by line index
        if (!groupedLines[lineIndex]) {
            groupedLines[lineIndex] = [];
        }
        groupedLines[lineIndex].push({ X: x, Y: y });
    }

    // Calculate start and end points for each line
    const clippedLines = [];
    for (const lineIndex in groupedLines) {
        const points = groupedLines[lineIndex];

        // Sort points by X or Y to determine start and end
        points.sort((a, b) => a.X - b.X || a.Y - b.Y);

        clippedLines.push([points[0], points[points.length - 1]]);
    }

    outputBuffer.unmap();

    return clippedLines;
}

function createPolygonMask(canvasWidth, canvasHeight, polygon) {
    const mask = new Uint8Array(canvasWidth * canvasHeight * 4); // RGBA mask
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;

    ctx.fillStyle = "white";
    ctx.beginPath();
    polygon[0].forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.X, point.Y);
        else ctx.lineTo(point.X, point.Y);
    });
    ctx.closePath();
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < mask.length; i += 4) {
        mask[i] = imageData.data[i]; // Copy red channel
        mask[i + 1] = imageData.data[i]; // Copy green channel
        mask[i + 2] = imageData.data[i]; // Copy blue channel
        mask[i + 3] = 255; // Set alpha to fully opaque
    }

    return mask;
}

export function createLineMask(canvasWidth, canvasHeight, lines) {
    const mask = new Uint8Array(canvasWidth * canvasHeight * 4); // RGBA mask
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    lines.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(start.X, start.Y);
        ctx.lineTo(end.X, end.Y);
        ctx.stroke();
    });

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < mask.length; i += 4) {
        mask[i] = imageData.data[i]; // Copy red channel
        mask[i + 1] = imageData.data[i]; // Copy green channel
        mask[i + 2] = imageData.data[i]; // Copy blue channel
        mask[i + 3] = 255; // Set alpha to fully opaque
    }

    return mask;
}

export async function clipLinesTo(canvasWidth, canvasHeight, polygon, lines) {
    const canvas = document.createElement("canvas");

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    document.body.appendChild(canvas);

    return await clip(canvas, canvasWidth, canvasHeight, polygon, lines);
}
