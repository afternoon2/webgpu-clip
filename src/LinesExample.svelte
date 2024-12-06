<script lang="ts">
  import { polygon } from './polygon';
  import { LineClipper, type Line } from './lib';
  import Example from './Example.svelte';

  const { device }: { device: GPUDevice } = $props();

  let canvas: HTMLCanvasElement = $state() as HTMLCanvasElement;

  const linesCount = 50;
  const canvasSize = 500;
  const step = canvasSize / linesCount;
  const lines: Line[] = new Array(linesCount).fill(null).map((_, index) => {
    const x1 = 0;
    const x2 = canvasSize;

    return [
      {
        X: x1,
        Y: index * step,
      },
      {
        X: x2,
        Y: index * step,
      },
    ];
  });

  let timing: number | null = $state(null);

  performance.mark('LineClipperStart');
  const clipper = new LineClipper({ device, polygon });

  let edgesCount = $state(clipper.edgesCount);

  const load = async () => {
    if (canvas) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const result = await clipper.clip(lines);
      performance.mark('LineClipperEnd');
      performance.measure('LineClipping', 'LineClipperStart', 'LineClipperEnd');
      timing = performance.getEntriesByName('LineClipping')[0].duration / 1000;

      ctx.strokeStyle = 'white';

      polygon.forEach((ring) => {
        ctx.beginPath();
        ring.forEach((pt, i) => {
          if (i === 0) {
            ctx.moveTo(pt.X, pt.Y);
          } else {
            ctx.lineTo(pt.X, pt.Y);
          }
        });
        ctx.closePath();
        ctx.stroke();
      });

      ctx.strokeStyle = 'rgba(255, 0, 0, 0.45)';

      lines.forEach((line) => {
        line.forEach((pt, i) => {
          if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(pt.X, pt.Y);
          } else {
            ctx.lineTo(pt.X, pt.Y);
            ctx.stroke();
          }
        });
      });

      ctx.strokeStyle = 'rgba(0, 245, 0)';

      result.forEach((line) => {
        line.forEach((pt, i) => {
          if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(pt.X, pt.Y);
          } else {
            ctx.lineTo(pt.X, pt.Y);
            ctx.stroke();
          }
        });
      });
    }
  };

  $effect(() => {
    load();
  });
</script>

<Example title="LineClipper" {timing} {canvasSize} bind:canvas>
  <span>Polygon edges: <b>{edgesCount}</b></span>
  <span>Lines to clip: <b>{linesCount}</b></span>
</Example>
