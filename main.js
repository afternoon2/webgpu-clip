import "./style.css";
import { clipLinesTo } from "./src/clipLinesTo.simple.js";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

const polygon = [
    [
        { X: 100, Y: 100 },
        { X: 800, Y: 100 },
        { X: 800, Y: 800 },
        { X: 800, Y: 800 },
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
];

await clipLinesTo(CANVAS_WIDTH, CANVAS_HEIGHT, polygon, lines);
