export async function getGPUDevice(): Promise<GPUDevice> {
  if (!navigator.gpu) {
    return Promise.reject('WebGPU is not supported on this browser');
  }

  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) {
    return Promise.reject('Failed to get GPU adapter');
  }

  return adapter.requestDevice();
}
