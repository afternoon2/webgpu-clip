async function clip(canvas, canvasWidth, canvasHeight, polygon, lines) {
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    const context = canvas.getContext("webgpu");
    context.configure({
        device,
        format: "bgra8unorm",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
        size: { width: canvasWidth, height: canvasHeight },
    });

    const polygonMask = createPolygonMask(canvasWidth, canvasHeight, polygon);
    const lineMask = createLineMask(canvasWidth, canvasHeight, lines);

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

    const canvasSizeBuffer = device.createBuffer({
        size: 8,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(
        canvasSizeBuffer,
        0,
        new Float32Array([canvasWidth, canvasHeight]),
    );

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
        code: `@vertex
        fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
          var positions = array<vec2<f32>, 6>(
            vec2<f32>(-1.0, -1.0), // Bottom-left
            vec2<f32>( 1.0, -1.0), // Bottom-right
            vec2<f32>(-1.0,  1.0), // Top-left
            vec2<f32>(-1.0,  1.0), // Top-left
            vec2<f32>( 1.0, -1.0), // Bottom-right
            vec2<f32>( 1.0,  1.0)  // Top-right
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

          // Read the polygon and line masks
          let polygonMask = textureSample(u_polygonTexture, u_polygonSampler, uv).r;
          let lineMask = textureSample(u_lineTexture, u_lineSampler, uv).r;

          // If both the polygon and line mask are active, render the clipped line
          if (polygonMask > 0.5 && lineMask > 0.5) {
            return vec4<f32>(1.0, 0.0, 0.0, 1.0); // Red for visible segments
          }

          // Otherwise, render nothing
          return vec4<f32>(0.0, 0.0, 0.0, 1.0);
        }`,
    });

    const pipeline = device.createRenderPipeline({
        vertex: {
            module: shaderModule,
            entryPoint: "vs_main",
        },
        fragment: {
            module: shaderModule,
            entryPoint: "fs_main",
            targets: [{ format: "bgra8unorm" }],
        },
        primitive: {
            topology: "triangle-list",
        },
        layout: device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout],
        }),
    });

    const commandEncoder = device.createCommandEncoder();
    const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
            {
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                storeOp: "store",
                clearValue: { r: 0, g: 0, b: 0, a: 1 },
            },
        ],
    });

    renderPass.setPipeline(pipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.draw(6); // 6 vertices for a full-screen quad
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
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
