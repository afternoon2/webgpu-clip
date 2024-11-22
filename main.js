import "./style.css";
import { clipLinesWithCompute } from "./src/clip.compute.js";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

const polygon = [
    [
        { X: 100, Y: 100 },
        { X: 800, Y: 100 },
        { X: 800, Y: 800 },
        { X: 100, Y: 1800 },
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

console.log(result);
