export async function setup() {
  if (!navigator.gpu) {
    throw new Error('WebGPU is not supported on this browser.');
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error('Failed to get GPU adapter.');
  }

  return await adapter.requestDevice();
}
