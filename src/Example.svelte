<script lang="ts">
  let {
    title,
    children,
    timing,
    canvasSize,
    canvas = $bindable(),
  }: {
    title: string;
    children: any;
    timing: number | null;
    canvasSize: number;
    canvas: HTMLCanvasElement;
  } = $props();
</script>

<fieldset>
  <legend>{title}</legend>
  <div class="example">
    <div class="container">
      <canvas bind:this={canvas} width={canvasSize} height={canvasSize}
      ></canvas>
      <div class="results">
        {#if timing}
          <p>
            Clipping (instantiation, loading, clipping, and reading the
            results): <b>{timing.toFixed(4)} sec</b>
          </p>
        {/if}
        {@render children?.()}
      </div>
    </div>
  </div>
</fieldset>

<style>
  fieldset {
    width: 50%;
    margin-bottom: 1rem;
    min-height: 750px;
  }

  legend {
    font-family: monospace;
    font-size: 16px;
    padding: 10px;
  }

  .example {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .container {
    display: flex;
    flex-direction: column;
  }

  canvas {
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .results {
    display: flex;
    flex-direction: column;
  }
</style>
