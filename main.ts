import { Polyline } from './src/lib';
import { polygon } from './src/data';
import { PolylineClipper } from './src/lib/polylineClip/PolylineClipper';
import { getGPUDevice } from './src/lib/utils';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

const device = await getGPUDevice();
const clipper = new PolylineClipper({
  device,
  polygon,
  maxIntersectionsPerSegment: 32,
  maxClippedPolylinesPerSegment: 128,
  workgroupSize: 64,
});

const sinusoid = Array.from({ length: 10 }, (_, i) => {
  const amplitude = 50 + i * 10;
  const frequency = 0.01 + i * 0.005;
  const startX = 50;
  const endX = 450;
  const numPoints = 100;

  const points = [];
  for (let x = startX; x <= endX; x += (endX - startX) / numPoints) {
    const y = 250 + amplitude * Math.sin(frequency * x); // Sinusoidal equation
    points.push({ X: x, Y: y });
  }
  return points as Polyline;
});

const result = await Promise.all(
  sinusoid.map((polyline) => clipper.clip(polyline)),
);

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

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

ctx.strokeStyle = 'yellow';

result.forEach((res) => {
  res.forEach((p) => {
    p.forEach((pt, i, arr) => {
      if (i === 0) {
        ctx.beginPath();
        ctx.moveTo(pt.X, pt.Y);
      } else if (i === arr.length - 1) {
        ctx.lineTo(pt.X, pt.Y);
        // ctx.closePath();
        ctx.stroke();
      } else {
        ctx.lineTo(pt.X, pt.Y);
      }
    });
  });
});
