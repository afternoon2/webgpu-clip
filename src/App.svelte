<script lang="ts">
  import Example from './Example.svelte';
  import { getGPUDevice } from './lib/getGPUDevice';
  import LinesExample from './LinesExample.svelte';
  import PolylinesExample from './PolylinesExample.svelte';

  const device = getGPUDevice();
</script>

<div class="container">
  <header>
    <h1>Line & Polyline Clipping With WebGPU Compute Shaders</h1>
    <hr />
  </header>
  <main>
    {#await device}
      <p>Loading</p>
    {:then device}
      <LinesExample {device} />
      <PolylinesExample {device} />
    {/await}
  </main>
</div>

<style>
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .container {
    width: 100%;
    height: 100vh;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    hr {
      border: 1px solid rgba(127, 255, 212, 0.1);
    }
  }

  main {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 16px;
    box-sizing: border-box;
  }
</style>
