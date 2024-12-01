# webgpu-clip

## POC of (poly)line clipping using WebGPU's compute shaders

Clipping lines and polylines is especially useful in pen plotter art, where, if you want to fill a shape with color, you need to hatch it with lines. In other words: to create a bunch of lines covering the bounding box of a polygon, and then to clip them.

Clipping lines and polylines on CPU is feasible, but might be slow, especially when having many shapes to fill. That's why I created this POC.

This repository contains 2 functions, one for clipping lines (2-points long arrays), which is useful for fast shape filling with color. The second one is for complex polylines, such as patterns that should intersect a given shape.

**Both functions are not fully tested and might produce incorrect result**

### Line clipping

```ts
const lineClip = await setupLineClip();

/* a polygon as a bunch of rings filled with points in { X: number, Y: number } format */
const polygon = [
const lines = [
  [{ X: 10, Y: 10 }, { 1000, 10 },]  /* etc. */
];

const result = await lineClip(lines, polygon);

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// draw clipping polygon
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

// draw unclipped lines (the input)
ctx.strokeStyle = 'rgba(255, 0, 0, 0.45)';

lines.forEach((line) => {
  ctx.beginPath();
  ctx.moveTo(line[0].X, line[0].Y);
  ctx.lineTo(line[1].X, line[1].Y);
  ctx.stroke();
});

// draw clipped result
ctx.strokeStyle = 'yellow';

result.forEach((line) => {
  ctx.beginPath();
  ctx.moveTo(line[0].X, line[0].Y);
  ctx.lineTo(line[1].X, line[1].Y);
  ctx.closePath();
  ctx.stroke();
});
```

The function takes an array of 2-points-long lines and a polygon as params and returns an array of clipped lines in return.

### Polyline clipping

```ts
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

const polygon = [
  /* a polygon as a bunch of rings filled with points in { X: number, Y: number } format */
];
const polyline = [
  { X: 10, Y: 10 },
  { X: 30, Y: 39 },
  { X: 21, Y: 37 } /* array of connected points */,
];

const multilineClip = await setupMultilineClip();

const result = await Promise.all(
  polylines.map((polyline) => multilineClip(polyline, polygon)),
);

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

ctx.strokeStyle = 'white';

// draw clipping polygon
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

// draw unclipped polyline (the input)
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

ctx.strokeStyle = 'yellow';

// draw clipped polylines
result.forEach((polylines) => {
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
});
```

The function takes an array of connected points and a polygon as params and returns an array of clipped polylines in return.

### Point format

Point format (`{ X: number; Y: number; }`) is the same as the format of famous and briliant [Javascript Clipper library](https://sourceforge.net/p/jsclipper/wiki/documentation/).
