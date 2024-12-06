<script lang="ts">
  import { polygon } from './polygon';
  import { PolylineClipper, type Polyline } from './lib';
  import Example from './Example.svelte';

  const { device }: { device: GPUDevice } = $props();

  type Metadata = {
    polylines: number;
    vertices: number;
    segments: number;
    edges: number;
  };

  let canvas: HTMLCanvasElement = $state() as HTMLCanvasElement;
  let metadata: Metadata | undefined = $state();
  const canvasSize = 500;

  let timing: number | null = $state(null);

  const sinusoid = Array.from({ length: 10 }, (_, i) => {
    const amplitude = 20 + i * 10;
    const frequency = 0.01 + i * 0.005;
    const startX = 0;
    const endX = canvasSize;
    const numPoints = 100;

    const points = [];
    for (let x = startX; x <= endX; x += (endX - startX) / numPoints) {
      const y = 150 + amplitude * Math.sin(frequency * x); // Sinusoidal equation
      points.push({ X: x, Y: y });
    }
    return points as Polyline;
  });

  const getMetadataLabel = (label: keyof Metadata): string => {
    switch (label) {
      case 'edges':
        return 'Polygon edges';
      case 'polylines':
        return 'Polylines to clip';
      case 'segments':
        return 'Polyline segments';
      case 'vertices':
        return 'Total vertices';
    }
  };

  performance.mark('PolylineClipperStart');
  const clipper = new PolylineClipper({ device, polygon });

  const load = async () => {
    if (canvas) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const result = await clipper.clip(sinusoid);
      performance.mark('PolylineClipperEnd');
      performance.measure(
        'PolylineClipping',
        'PolylineClipperStart',
        'PolylineClipperEnd',
      );
      timing =
        performance.getEntriesByName('PolylineClipping')[0].duration / 1000;

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

      metadata = {
        edges: clipper.edgesCount,
        polylines: clipper.polylinesLength,
        segments: clipper.segmentsCount,
        vertices: clipper.verticesLength,
      };
    }
  };

  $effect(() => {
    load();
  });
</script>

<Example title="PolylineClipper" {timing} {canvasSize} bind:canvas>
  {#if metadata}
    {#each Object.entries(metadata) as [keyof Metadata, number][] as [label, value]}
      <span>{getMetadataLabel(label)}: <b>{value}</b></span>
    {/each}
  {/if}
</Example>
