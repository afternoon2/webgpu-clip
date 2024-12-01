import './style.css';
import { setupMultilineClip } from './src/lib';
import { polygon, polylines } from './src/data';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

const multilineClip = await setupMultilineClip();

const result = await Promise.all(
  polylines.map((polyline) => multilineClip(polyline, polygon)),
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

polylines.forEach((polyline) => {
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

result.forEach((polylines) => {
  polylines.forEach((polyline) => {
    polyline.forEach((pt, i, arr) => {
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
