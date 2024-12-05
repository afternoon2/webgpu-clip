<script lang="ts">
  import { polygon } from './polygon';
  import { PolylineClipper, type Polyline } from './lib';

  const { device }: { device: GPUDevice } = $props();

  let canvas: HTMLCanvasElement;
  const canvasSize = 500;

  const sinusoid = Array.from({ length: 4 }, (_, i) => {
    const amplitude = 100 + i * 10;
    const frequency = 0.01 + i * 0.005;
    const startX = 0;
    const endX = canvasSize;
    const numPoints = 100;

    const points = [];
    for (let x = startX; x <= endX; x += (endX - startX) / numPoints) {
      const y = 250 + amplitude * Math.sin(frequency * x); // Sinusoidal equation
      points.push({ X: x, Y: y });
    }
    return points as Polyline;
  });

  const clipper = new PolylineClipper({ device, polygon });

  const load = async () => {
    if (canvas) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const result = await clipper.clip(sinusoid);

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

      sinusoid.forEach((polyline) => {
        polyline.forEach((pt, i, arr) => {
          if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(pt.X, pt.Y);
          } else if (i === arr.length - 1) {
            ctx.lineTo(pt.X, pt.Y);
            ctx.stroke();
          } else {
            ctx.lineTo(pt.X, pt.Y);
          }
        });
      });

      ctx.strokeStyle = 'rgba(0, 245, 0)';
      ctx.lineWidth = 2;

      result.forEach((polyline) => {
        polyline.forEach((pt, i) => {
          if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(pt.X, pt.Y);
          } else {
            ctx.lineTo(pt.X, pt.Y);
          }
        });
        ctx.stroke();
      });
    }
  };

  $effect(() => {
    load();
  });
</script>

<canvas bind:this={canvas} width={canvasSize} height={canvasSize}></canvas>
