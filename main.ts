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
const polylineResult = await polylineClipper.clip([
  [
    { X: 305.08, Y: 241.97 },
    { X: 306, Y: 251.51 },
    { X: 308.18, Y: 256.39 },
    { X: 311.72, Y: 259.09 },
    { X: 317.31, Y: 260.01 },
    { X: 324.71, Y: 259.01 },
    { X: 332.45, Y: 255.86 },
    { X: 335.57, Y: 257.53 },
    { X: 337.6, Y: 260.44 },
    { X: 336.94, Y: 262.33 },
    { X: 328.27, Y: 268.74 },
    { X: 317.89, Y: 273.41 },
    { X: 307.94, Y: 275.49 },
    { X: 296.26, Y: 275.23 },
    { X: 286.64, Y: 272.99 },
    { X: 279.78, Y: 269.31 },
    { X: 274.14, Y: 263.55 },
    { X: 271.65, Y: 260.21 },
    { X: 269.2, Y: 261.06 },
    { X: 254.83, Y: 268.51 },
    { X: 242.11, Y: 272.97 },
    { X: 227.59, Y: 275.23 },
    { X: 209.91, Y: 275.48 },
    { X: 197.47, Y: 273.63 },
    { X: 187.91, Y: 270.13 },
    { X: 180.48, Y: 265.09 },
    { X: 175.32, Y: 258.88 },
    { X: 172.2, Y: 251.44 },
    { X: 171.1, Y: 242.23 },
    { X: 172.24, Y: 233.63 },
    { X: 175.49, Y: 226.24 },
    { X: 181, Y: 219.54 },
    { X: 189.42, Y: 213.3 },
    { X: 201.36, Y: 207.73 },
    { X: 217.23, Y: 203.25 },
    { X: 238.28, Y: 200.1 },
    { X: 265.24, Y: 198.78 },
    { X: 269.37, Y: 198.47 },
    { X: 269.98, Y: 182.93 },
    { X: 268.74, Y: 171.32 },
    { X: 266.05, Y: 163.7 },
    { X: 261.58, Y: 157.72 },
    { X: 255.24, Y: 153.24 },
    { X: 247.06, Y: 150.32 },
    { X: 235.44, Y: 149.13 },
    { X: 224.71, Y: 150.05 },
    { X: 215.91, Y: 153 },
    { X: 210.23, Y: 156.86 },
    { X: 207.64, Y: 160.85 },
    { X: 207.19, Y: 165.28 },
    { X: 209.34, Y: 169.86 },
    { X: 212.01, Y: 174.15 },
    { X: 212.14, Y: 177.99 },
    { X: 209.8, Y: 181.78 },
    { X: 204.22, Y: 185.79 },
    { X: 197.62, Y: 187.68 },
    { X: 188.65, Y: 187.43 },
    { X: 182.41, Y: 185.39 },
    { X: 178.45, Y: 181.77 },
    { X: 176.2, Y: 176.9 },
    { X: 176.03, Y: 170.64 },
    { X: 178.2, Y: 164.13 },
    { X: 183.09, Y: 157.69 },
    { X: 191.04, Y: 151.36 },
    { X: 202.01, Y: 145.82 },
    { X: 216.09, Y: 141.57 },
    { X: 232.08, Y: 139.24 },
    { X: 250.07, Y: 139.18 },
    { X: 266.13, Y: 141.23 },
    { X: 279.05, Y: 145.06 },
    { X: 289.15, Y: 150.3 },
    { X: 295.91, Y: 156.19 },
    { X: 300.73, Y: 163.41 },
    { X: 303.85, Y: 172.47 },
    { X: 305.07, Y: 183.78 },
    { X: 305.07, Y: 241.97 },
    { X: 305.08, Y: 241.97 },
  ],
  [
    { X: 243.99, Y: 64.95 },
    { X: 255.92, Y: 66.06 },
    { X: 266.21, Y: 69.28 },
    { X: 274.98, Y: 74.44 },
    { X: 280.64, Y: 80.19 },
    { X: 284.02, Y: 86.85 },
    { X: 285.26, Y: 94.52 },
    { X: 284.27, Y: 102.84 },
    { X: 281.24, Y: 109.66 },
    { X: 276.03, Y: 115.43 },
    { X: 267.89, Y: 120.46 },
    { X: 257.68, Y: 123.93 },
    { X: 245.79, Y: 125.33 },
    { X: 232.93, Y: 124.53 },
    { X: 222.21, Y: 121.74 },
    { X: 213.14, Y: 117.11 },
    { X: 207.36, Y: 111.92 },
    { X: 203.7, Y: 105.75 },
    { X: 201.94, Y: 98.18 },
    { X: 202.34, Y: 90.12 },
    { X: 204.86, Y: 83.4 },
    { X: 210.01, Y: 76.81 },
    { X: 217.49, Y: 71.33 },
    { X: 227.17, Y: 67.31 },
    { X: 238.35, Y: 65.2 },
    { X: 243.75, Y: 64.95 },
    { X: 243.99, Y: 64.95 },
  ],
  [
    { X: 269.99, Y: 212.88 },
    { X: 269.48, Y: 208.76 },
    { X: 266.59, Y: 208.36 },
    { X: 245.76, Y: 210.86 },
    { X: 230.95, Y: 214.67 },
    { X: 220.9, Y: 219.34 },
    { X: 213.82, Y: 224.85 },
    { X: 209.69, Y: 230.71 },
    { X: 207.92, Y: 237.03 },
    { X: 208.4, Y: 244.49 },
    { X: 210.86, Y: 250.57 },
    { X: 215.2, Y: 255.08 },
    { X: 221.69, Y: 258.13 },
    { X: 230.57, Y: 259.43 },
    { X: 242.52, Y: 258.58 },
    { X: 255.27, Y: 255.23 },
    { X: 266.07, Y: 250.04 },
    { X: 269.34, Y: 247.02 },
    { X: 269.99, Y: 244.81 },
    { X: 269.99, Y: 212.88 },
    { X: 269.99, Y: 212.88 },
  ],
  [
    { X: 243.63, Y: 73.34 },
    { X: 235.93, Y: 74.4 },
    { X: 230.07, Y: 77.36 },
    { X: 225.65, Y: 82.21 },
    { X: 223.05, Y: 88.57 },
    { X: 222.41, Y: 96.92 },
    { X: 223.94, Y: 104.53 },
    { X: 227.23, Y: 110.22 },
    { X: 231.99, Y: 114.29 },
    { X: 238.44, Y: 116.65 },
    { X: 246.81, Y: 116.94 },
    { X: 253.73, Y: 115.1 },
    { X: 258.87, Y: 111.5 },
    { X: 262.63, Y: 106.12 },
    { X: 264.64, Y: 98.93 },
    { X: 264.59, Y: 90.25 },
    { X: 262.47, Y: 83.41 },
    { X: 258.65, Y: 78.43 },
    { X: 253.37, Y: 75.08 },
    { X: 246.08, Y: 73.43 },
    { X: 243.68, Y: 73.34 },
    { X: 243.63, Y: 73.34 },
  ],
]);
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

// sinusoid.forEach((polyline) => {
//   polyline.forEach((pt, i, arr) => {
//     if (i === 0) {
//       ctx.beginPath();
//       ctx.moveTo(pt.X, pt.Y);
//     } else if (i === arr.length - 1) {
//       ctx.lineTo(pt.X, pt.Y);
//       ctx.stroke();
//     } else {
//       ctx.lineTo(pt.X, pt.Y);
//     }
//   });
// });

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

ctx.strokeStyle = 'rgba(0, 245, 0)';

polylineResult.forEach((polyline) => {
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
