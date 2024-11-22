import "./style.css";
import { clipLinesWithCompute } from "./src/clip.compute.js";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

const polygon = [
    [
        { X: 100, Y: 100 },
        { X: 800, Y: 100 },
        { X: 800, Y: 800 },
        { X: 100, Y: 800 },
        { X: 100, Y: 100 },
    ],
];

const lines = [
    [
        { X: 10, Y: 200 },
        { X: 1500, Y: 200 },
    ],
    [
        { X: 10, Y: 210 },
        { X: 1000, Y: 210 },
    ],
    [
        { X: 10, Y: 220 },
        { X: 1000, Y: 220 },
    ],
];

const result = await clipLinesWithCompute(lines, polygon);

const canvas = document.querySelector("canvas");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext("2d");
ctx.fillStyle = "black";

ctx.strokeStyle = "white";

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

ctx.strokeStyle = "red";

lines.forEach((line) => {
    ctx.beginPath();
    ctx.moveTo(line[0].X, line[0].Y);
    ctx.lineTo(line[1].X, line[1].Y);
    ctx.closePath();
    ctx.stroke();
});

ctx.strokeStyle = "yellow";

result.forEach((line) => {
    ctx.beginPath();
    ctx.moveTo(line[0].X, line[0].Y);
    ctx.lineTo(line[1].X, line[1].Y);
    ctx.closePath();
    ctx.stroke();
});

console.log(result);
