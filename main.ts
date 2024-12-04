import { Line, Polyline } from './src/lib';
import { polygon } from './src/data';
import { PolylineClipper } from './src/lib/polyline';
import { getGPUDevice } from './src/lib/getGPUDevice';
import { LineClipper } from './src/lib/line';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

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

const lines: Line[] = [
  [
    { X: 140, Y: 200 },
    { X: 200, Y: 200 },
  ],
  [
    { X: 10, Y: 210 },
    { X: 1000, Y: 210 },
  ],
  [
    { X: 10, Y: 220 },
    { X: 800, Y: 220 },
  ],
  [
    { X: 10, Y: 240 },
    { X: 1000, Y: 240 },
  ],
];

const device = await getGPUDevice();

performance.mark('polylineClippingStart');
const polylineClipper = new PolylineClipper({
  device,
  polygon,
  workgroupSize: 64,
});
const polylineResult = await polylineClipper.clip(sinusoid);
performance.mark('polylineClippingEnd');
performance.measure(
  'polylinesClipping',
  'polylineClippingStart',
  'polylineClippingEnd',
);
const [entry] = performance.getEntriesByName('polylinesClipping');

console.log(
  `Preprocessing, clipping, and postprocessing takes: ${entry.duration / 1000} sec`,
);

// const lineClipper = new LineClipper({ device, polygon });
// const linesResult = await lineClipper.clip(lines);

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

// lines.forEach((line) => {
//   line.forEach((pt, i) => {
//     if (i === 0) {
//       ctx.beginPath();
//       ctx.moveTo(pt.X, pt.Y);
//     } else {
//       ctx.lineTo(pt.X, pt.Y);
//       ctx.stroke();
//     }
//   });
// });

ctx.strokeStyle = 'yellow';

polylineResult.forEach((polyline) => {
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

// linesResult.forEach((line) => {
//   line.forEach((pt, i) => {
//     if (i === 0) {
//       ctx.beginPath();
//       ctx.moveTo(pt.X, pt.Y);
//     } else {
//       ctx.lineTo(pt.X, pt.Y);
//       ctx.stroke();
//     }
//   });
// });
