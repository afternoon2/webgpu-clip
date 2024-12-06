<script lang="ts">
  import { getGPUDevice } from './lib/getGPUDevice';
  import LinesExample from './LinesExample.svelte';
  import PolylinesExample from './PolylinesExample.svelte';

  const device = getGPUDevice();
</script>

<div class="container">
  <header>
    <h1>Line & Polyline Clipping With WebGPU Compute Shaders</h1>
    <h4>
      Both utilities are not fully tested and might produce incorrect results
    </h4>
    <hr />
  </header>
  <main>
    {#await device}
      <p>Loading</p>
    {:then device}
      <div class="content">
        <LinesExample {device} />
        <PolylinesExample {device} />
      </div>
    {:catch error}
      <div class="error">
        <span>{error}</span>
      </div>
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

  header {
    text-align: center;
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
    flex-direction: column;
    padding: 16px;
    box-sizing: border-box;
  }

  .content {
    max-width: 1100px;
    display: flex;
  }

  .error {
    padding: 20px;
    min-width: 120px;
    background-color: #976060;
    text-align: center;
    color: #fcfcfc;
    font-weight: bold;
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
