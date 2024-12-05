<script lang="ts">
  import { polygon } from './polygon';
  import { LineClipper, type Line } from './lib';

  const { device }: { device: GPUDevice } = $props();

  let canvas: HTMLCanvasElement;

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

  const clipper = new LineClipper({ device, polygon });

  const load = async () => {
    if (canvas) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const result = await clipper.clip(lines);

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

<canvas bind:this={canvas} width={canvasSize} height={canvasSize}></canvas>
