import './style.css';
import { GPULineClipper } from './src/GPULineClipper.js';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

const polygon = [
  [
    { X: 346.2, Y: 66.31 },
    { X: 332.04, Y: 53.81 },
    { X: 316.43, Y: 43.18 },
    { X: 299.87, Y: 34.73 },
    { X: 282.39, Y: 28.44 },
    { X: 263.95, Y: 24.33 },
    { X: 245.15, Y: 22.56 },
    { X: 226.27, Y: 23.13 },
    { X: 207.6, Y: 26.04 },
    { X: 189.74, Y: 31.18 },
    { X: 172.67, Y: 38.53 },
    { X: 156.65, Y: 47.95 },
    { X: 141.69, Y: 59.49 },
    { X: 128.29, Y: 72.8 },
    { X: 116.65, Y: 87.67 },
    { X: 107.11, Y: 103.62 },
    { X: 99.64, Y: 120.65 },
    { X: 94.37, Y: 138.47 },
    { X: 91.33, Y: 157.11 },
    { X: 90.63, Y: 175.99 },
    { X: 92.25, Y: 194.8 },
    { X: 96.24, Y: 213.27 },
    { X: 102.42, Y: 230.8 },
    { X: 110.74, Y: 247.42 },
    { X: 121.26, Y: 263.1 },
    { X: 133.67, Y: 277.35 },
    { X: 147.74, Y: 289.95 },
    { X: 163.26, Y: 300.69 },
    { X: 179.77, Y: 309.25 },
    { X: 197.21, Y: 315.68 },
    { X: 215.62, Y: 319.92 },
    { X: 234.41, Y: 321.81 },
    { X: 253.29, Y: 321.38 },
    { X: 271.98, Y: 318.6 },
    { X: 289.87, Y: 313.58 },
    { X: 307, Y: 306.36 },
    { X: 323.08, Y: 297.05 },
    { X: 338.12, Y: 285.62 },
    { X: 351.62, Y: 272.39 },
    { X: 363.37, Y: 257.61 },
    { X: 373.02, Y: 241.73 },
    { X: 380.61, Y: 224.76 },
    { X: 386, Y: 206.97 },
    { X: 389.18, Y: 188.35 },
    { X: 390.01, Y: 169.48 },
    { X: 388.5, Y: 150.65 },
    { X: 384.65, Y: 132.16 },
    { X: 378.61, Y: 114.59 },
    { X: 370.4, Y: 97.91 },
    { X: 359.99, Y: 82.15 },
    { X: 347.69, Y: 67.81 },
    { X: 346.21, Y: 66.31 },
    { X: 346.2, Y: 66.31 },
  ],
  [
    { X: 375.03, Y: 172.21 },
    { X: 373.83, Y: 190.15 },
    { X: 370.54, Y: 206.57 },
    { X: 362.32, Y: 203.86 },
    { X: 365.47, Y: 187.07 },
    { X: 366.32, Y: 169.7 },
    { X: 364.79, Y: 152.38 },
    { X: 360.96, Y: 135.72 },
    { X: 354.9, Y: 119.76 },
    { X: 346.72, Y: 104.76 },
    { X: 336.39, Y: 90.77 },
    { X: 324.26, Y: 78.31 },
    { X: 320.42, Y: 74.77 },
    { X: 325.57, Y: 67.97 },
    { X: 338.69, Y: 80.27 },
    { X: 350.08, Y: 94.19 },
    { X: 359.52, Y: 109.5 },
    { X: 366.74, Y: 125.65 },
    { X: 371.75, Y: 142.61 },
    { X: 374.49, Y: 160.09 },
    { X: 375.03, Y: 172.07 },
    { X: 375.03, Y: 172.21 },
  ],
  [
    { X: 129.26, Y: 172.21 },
    { X: 130.44, Y: 156.06 },
    { X: 133.95, Y: 140.26 },
    { X: 139.75, Y: 125.15 },
    { X: 147.69, Y: 111.05 },
    { X: 157.6, Y: 98.25 },
    { X: 169.15, Y: 87.09 },
    { X: 174.15, Y: 94.2 },
    { X: 163.07, Y: 105.17 },
    { X: 153.78, Y: 117.67 },
    { X: 146.48, Y: 131.44 },
    { X: 141.37, Y: 146.16 },
    { X: 138.57, Y: 161.5 },
    { X: 138.13, Y: 177.08 },
    { X: 140.05, Y: 192.54 },
    { X: 140.87, Y: 196.58 },
    { X: 132.61, Y: 199.24 },
    { X: 129.82, Y: 183.3 },
    { X: 129.26, Y: 172.22 },
    { X: 129.26, Y: 172.21 },
  ],
  [
    { X: 327.6, Y: 172.21 },
    { X: 326.42, Y: 186.54 },
    { X: 325.14, Y: 191.85 },
    { X: 317.08, Y: 189.04 },
    { X: 318.83, Y: 175.67 },
    { X: 318.27, Y: 162.19 },
    { X: 315.43, Y: 149.02 },
    { X: 310.33, Y: 136.54 },
    { X: 303.19, Y: 125.11 },
    { X: 293.99, Y: 114.85 },
    { X: 292.48, Y: 113.21 },
    { X: 297.61, Y: 106.36 },
    { X: 307.64, Y: 116.67 },
    { X: 315.86, Y: 128.48 },
    { X: 322.02, Y: 141.47 },
    { X: 325.95, Y: 155.31 },
    { X: 327.56, Y: 169.6 },
    { X: 327.6, Y: 172 },
    { X: 327.6, Y: 172.21 },
  ],
  [
    { X: 153.01, Y: 172.21 },
    { X: 154.19, Y: 157.87 },
    { X: 157.7, Y: 143.91 },
    { X: 163.49, Y: 130.75 },
    { X: 171.35, Y: 118.7 },
    { X: 181.07, Y: 108.1 },
    { X: 183.26, Y: 106.49 },
    { X: 188.11, Y: 113.5 },
    { X: 178.65, Y: 123.52 },
    { X: 171.2, Y: 134.76 },
    { X: 165.8, Y: 147.12 },
    { X: 162.61, Y: 160.22 },
    { X: 161.7, Y: 173.67 },
    { X: 163.13, Y: 187.08 },
    { X: 163.36, Y: 189.28 },
    { X: 155.22, Y: 191.74 },
    { X: 153.18, Y: 177.51 },
    { X: 153.01, Y: 172.41 },
    { X: 153.01, Y: 172.21 },
  ],
  [
    { X: 303.92, Y: 172.21 },
    { X: 302.73, Y: 184.43 },
    { X: 294.39, Y: 181.76 },
    { X: 295.21, Y: 170.41 },
    { X: 293.65, Y: 159.13 },
    { X: 289.8, Y: 148.43 },
    { X: 283.81, Y: 138.76 },
    { X: 278.44, Y: 132.51 },
    { X: 283.57, Y: 125.63 },
    { X: 291.73, Y: 134.82 },
    { X: 297.98, Y: 145.38 },
    { X: 302.07, Y: 156.97 },
    { X: 303.83, Y: 169.12 },
    { X: 303.92, Y: 172.12 },
    { X: 303.92, Y: 172.21 },
  ],
  [
    { X: 200.38, Y: 172.21 },
    { X: 201.53, Y: 162.69 },
    { X: 204.93, Y: 153.75 },
    { X: 210.37, Y: 145.87 },
    { X: 211.36, Y: 145.15 },
    { X: 216.39, Y: 152.18 },
    { X: 211.93, Y: 159.27 },
    { X: 209.51, Y: 167.29 },
    { X: 209.16, Y: 174.43 },
    { X: 200.68, Y: 177.07 },
    { X: 200.38, Y: 172.28 },
    { X: 200.38, Y: 172.21 },
  ],
  [
    { X: 279.91, Y: 177.17 },
    { X: 271.39, Y: 174.36 },
    { X: 270.87, Y: 166.01 },
    { X: 268.12, Y: 158.1 },
    { X: 264.19, Y: 152.1 },
    { X: 269.5, Y: 145.05 },
    { X: 275.15, Y: 152.78 },
    { X: 278.81, Y: 161.63 },
    { X: 280.22, Y: 171.11 },
    { X: 279.93, Y: 177.09 },
    { X: 279.91, Y: 177.17 },
  ],
  [
    { X: 251.65, Y: 183.77 },
    { X: 247.81, Y: 186.59 },
    { X: 247.94, Y: 182.57 },
    { X: 251.37, Y: 183.68 },
    { X: 251.65, Y: 183.77 },
  ],
  [
    { X: 252.45, Y: 168.26 },
    { X: 254.89, Y: 165.21 },
    { X: 256.24, Y: 169.49 },
    { X: 252.54, Y: 168.29 },
    { X: 252.45, Y: 168.26 },
  ],
  [
    { X: 240.31, Y: 159.44 },
    { X: 238.03, Y: 156.13 },
    { X: 242.64, Y: 156.24 },
    { X: 240.35, Y: 159.38 },
    { X: 240.31, Y: 159.44 },
  ],
  [
    { X: 228.17, Y: 168.26 },
    { X: 224.41, Y: 169.28 },
    { X: 225.81, Y: 165.03 },
    { X: 228.11, Y: 168.18 },
    { X: 228.17, Y: 168.26 },
  ],
  [
    { X: 232.81, Y: 182.52 },
    { X: 232.69, Y: 186.53 },
    { X: 229.1, Y: 183.73 },
    { X: 232.52, Y: 182.62 },
    { X: 232.81, Y: 182.52 },
  ],
  [
    { X: 247.81, Y: 202.54 },
    { X: 255.59, Y: 199.43 },
    { X: 262.26, Y: 194.37 },
    { X: 266.99, Y: 188.75 },
    { X: 275.13, Y: 191.69 },
    { X: 269.46, Y: 199.41 },
    { X: 262.13, Y: 205.57 },
    { X: 253.54, Y: 209.81 },
    { X: 247.81, Y: 211.35 },
    { X: 247.81, Y: 211.35 },
    { X: 247.81, Y: 202.54 },
  ],
  [
    { X: 252.07, Y: 143.27 },
    { X: 243.96, Y: 141.16 },
    { X: 235.59, Y: 141.32 },
    { X: 228.44, Y: 143.13 },
    { X: 223.38, Y: 136.11 },
    { X: 232.48, Y: 133.12 },
    { X: 242.03, Y: 132.38 },
    { X: 251.47, Y: 133.94 },
    { X: 257.2, Y: 136.21 },
    { X: 252.09, Y: 143.25 },
    { X: 252.07, Y: 143.27 },
  ],
  [
    { X: 213.83, Y: 188.68 },
    { X: 219.16, Y: 195.14 },
    { X: 226, Y: 199.96 },
    { X: 232.81, Y: 202.54 },
    { X: 232.71, Y: 211.33 },
    { X: 223.6, Y: 208.4 },
    { X: 215.45, Y: 203.37 },
    { X: 208.72, Y: 196.55 },
    { X: 205.5, Y: 191.38 },
    { X: 213.77, Y: 188.7 },
    { X: 213.83, Y: 188.68 },
  ],
  [
    { X: 232.81, Y: 226.54 },
    { X: 232.63, Y: 235.34 },
    { X: 220.63, Y: 232.69 },
    { X: 209.38, Y: 227.76 },
    { X: 199.29, Y: 220.77 },
    { X: 190.72, Y: 211.98 },
    { X: 183.98, Y: 201.71 },
    { X: 182.64, Y: 198.8 },
    { X: 190.9, Y: 196.16 },
    { X: 196.92, Y: 205.81 },
    { X: 204.8, Y: 214.02 },
    { X: 214.19, Y: 220.45 },
    { X: 224.71, Y: 224.8 },
    { X: 232.61, Y: 226.52 },
    { X: 232.81, Y: 226.54 },
  ],
  [
    { X: 247.81, Y: 226.54 },
    { X: 258.86, Y: 223.83 },
    { X: 269.11, Y: 218.89 },
    { X: 278.13, Y: 211.95 },
    { X: 285.52, Y: 203.31 },
    { X: 289.8, Y: 196.15 },
    { X: 298.05, Y: 198.84 },
    { X: 291.84, Y: 209.44 },
    { X: 283.71, Y: 218.65 },
    { X: 273.98, Y: 226.14 },
    { X: 262.99, Y: 231.62 },
    { X: 251.15, Y: 234.87 },
    { X: 247.81, Y: 235.36 },
    { X: 247.81, Y: 235.36 },
    { X: 247.81, Y: 226.54 },
  ],
  [
    { X: 266.2, Y: 123.84 },
    { X: 255.67, Y: 119.53 },
    { X: 244.47, Y: 117.5 },
    { X: 233.1, Y: 117.82 },
    { X: 222.03, Y: 120.47 },
    { X: 214.38, Y: 123.79 },
    { X: 209.48, Y: 116.59 },
    { X: 220.74, Y: 111.68 },
    { X: 232.73, Y: 109.05 },
    { X: 245.01, Y: 108.77 },
    { X: 257.11, Y: 110.86 },
    { X: 268.58, Y: 115.25 },
    { X: 271.28, Y: 116.84 },
    { X: 266.35, Y: 123.63 },
    { X: 266.2, Y: 123.84 },
  ],
  [
    { X: 202.29, Y: 132.67 },
    { X: 194.93, Y: 141.35 },
    { X: 189.51, Y: 151.35 },
    { X: 186.28, Y: 162.26 },
    { X: 185.4, Y: 173.61 },
    { X: 186.15, Y: 181.89 },
    { X: 177.9, Y: 184.53 },
    { X: 176.7, Y: 172.31 },
    { X: 177.86, Y: 160.08 },
    { X: 181.36, Y: 148.31 },
    { X: 187.07, Y: 137.44 },
    { X: 194.76, Y: 127.86 },
    { X: 197.29, Y: 125.8 },
    { X: 202.24, Y: 132.6 },
    { X: 202.29, Y: 132.67 },
  ],
  [
    { X: 168.2, Y: 203.48 },
    { X: 174.63, Y: 215.34 },
    { X: 182.98, Y: 225.92 },
    { X: 193.01, Y: 234.94 },
    { X: 204.42, Y: 242.12 },
    { X: 216.89, Y: 247.24 },
    { X: 230.06, Y: 250.14 },
    { X: 232.81, Y: 250.45 },
    { X: 232.66, Y: 259.23 },
    { X: 218.49, Y: 256.8 },
    { X: 204.91, Y: 252.05 },
    { X: 192.3, Y: 245.13 },
    { X: 180.99, Y: 236.24 },
    { X: 171.29, Y: 225.63 },
    { X: 163.44, Y: 213.57 },
    { X: 160.07, Y: 206.12 },
    { X: 168.06, Y: 203.53 },
    { X: 168.2, Y: 203.48 },
  ],
  [
    { X: 247.81, Y: 250.45 },
    { X: 261.07, Y: 248.02 },
    { X: 273.72, Y: 243.35 },
    { X: 285.37, Y: 236.57 },
    { X: 295.71, Y: 227.91 },
    { X: 304.42, Y: 217.62 },
    { X: 311.26, Y: 206 },
    { X: 312.63, Y: 203.56 },
    { X: 320.64, Y: 206.36 },
    { X: 313.94, Y: 219.08 },
    { X: 305.24, Y: 230.53 },
    { X: 294.78, Y: 240.41 },
    { X: 282.86, Y: 248.46 },
    { X: 269.77, Y: 254.44 },
    { X: 255.89, Y: 258.16 },
    { X: 247.81, Y: 259.24 },
    { X: 247.81, Y: 259.24 },
    { X: 247.81, Y: 250.45 },
  ],
  [
    { X: 280.24, Y: 104.53 },
    { X: 268.09, Y: 98.68 },
    { X: 255.12, Y: 95 },
    { X: 241.71, Y: 93.61 },
    { X: 228.26, Y: 94.52 },
    { X: 215.16, Y: 97.73 },
    { X: 202.81, Y: 103.15 },
    { X: 200.26, Y: 104.37 },
    { X: 195.31, Y: 97.37 },
    { X: 208.19, Y: 90.97 },
    { X: 221.96, Y: 86.79 },
    { X: 236.22, Y: 84.94 },
    { X: 250.6, Y: 85.45 },
    { X: 264.69, Y: 88.31 },
    { X: 278.12, Y: 93.47 },
    { X: 285.33, Y: 97.52 },
    { X: 280.39, Y: 104.31 },
    { X: 280.24, Y: 104.53 },
  ],
  [
    { X: 240.31, Y: 69.84 },
    { X: 224.77, Y: 71.03 },
    { X: 209.88, Y: 74.47 },
    { X: 195.4, Y: 80.25 },
    { X: 186.27, Y: 85.13 },
    { X: 181.44, Y: 78.15 },
    { X: 195.74, Y: 70.56 },
    { X: 211, Y: 65.16 },
    { X: 226.88, Y: 62.04 },
    { X: 243.04, Y: 61.27 },
    { X: 259.14, Y: 62.84 },
    { X: 274.86, Y: 66.74 },
    { X: 289.83, Y: 72.9 },
    { X: 299.23, Y: 78.4 },
    { X: 294.06, Y: 85.16 },
    { X: 280.23, Y: 77.97 },
    { X: 265.47, Y: 72.98 },
    { X: 250.12, Y: 70.31 },
    { X: 240.53, Y: 69.84 },
    { X: 240.31, Y: 69.84 },
  ],
  [
    { X: 145.57, Y: 210.82 },
    { X: 152.56, Y: 224.76 },
    { X: 161.57, Y: 237.47 },
    { X: 172.4, Y: 248.69 },
    { X: 184.79, Y: 258.14 },
    { X: 198.47, Y: 265.6 },
    { X: 213.13, Y: 270.89 },
    { X: 228.42, Y: 273.88 },
    { X: 232.81, Y: 274.29 },
    { X: 232.64, Y: 282.91 },
    { X: 216.62, Y: 280.63 },
    { X: 201.1, Y: 276.02 },
    { X: 186.42, Y: 269.2 },
    { X: 172.89, Y: 260.32 },
    { X: 160.79, Y: 249.58 },
    { X: 150.36, Y: 237.2 },
    { X: 141.82, Y: 223.44 },
    { X: 137.42, Y: 213.47 },
    { X: 145.41, Y: 210.88 },
    { X: 145.57, Y: 210.82 },
  ],
  [
    { X: 247.81, Y: 274.29 },
    { X: 263.22, Y: 271.97 },
    { X: 277.81, Y: 267.44 },
    { X: 291.82, Y: 260.61 },
    { X: 304.63, Y: 251.73 },
    { X: 315.95, Y: 241.02 },
    { X: 325.54, Y: 228.73 },
    { X: 333.15, Y: 215.13 },
    { X: 335.12, Y: 210.85 },
    { X: 343.34, Y: 213.56 },
    { X: 336.21, Y: 228.09 },
    { X: 327.02, Y: 241.42 },
    { X: 316.02, Y: 253.29 },
    { X: 303.43, Y: 263.45 },
    { X: 289.49, Y: 271.68 },
    { X: 274.5, Y: 277.79 },
    { X: 258.77, Y: 281.63 },
    { X: 247.81, Y: 282.92 },
    { X: 247.81, Y: 282.92 },
    { X: 247.81, Y: 274.29 },
  ],
  [
    { X: 339.67, Y: 196.56 },
    { X: 342.21, Y: 181.18 },
    { X: 342.39, Y: 165.6 },
    { X: 340.21, Y: 150.16 },
    { X: 335.7, Y: 135.25 },
    { X: 328.96, Y: 121.19 },
    { X: 320.17, Y: 108.32 },
    { X: 309.54, Y: 96.93 },
    { X: 306.51, Y: 93.91 },
    { X: 311.67, Y: 87.25 },
    { X: 323.27, Y: 98.54 },
    { X: 333.13, Y: 111.37 },
    { X: 341.03, Y: 125.5 },
    { X: 346.77, Y: 140.63 },
    { X: 350.23, Y: 156.44 },
    { X: 351.35, Y: 172.59 },
    { X: 350.12, Y: 188.73 },
    { X: 347.95, Y: 199.24 },
    { X: 339.68, Y: 196.56 },
    { X: 339.67, Y: 196.56 },
  ],
  [
    { X: 313.32, Y: 59.03 },
    { X: 307.95, Y: 65.96 },
    { X: 292.96, Y: 57.76 },
    { X: 277, Y: 51.68 },
    { X: 260.35, Y: 47.83 },
    { X: 243.33, Y: 46.27 },
    { X: 225.96, Y: 47.04 },
    { X: 209.16, Y: 50.13 },
    { X: 192.93, Y: 55.47 },
    { X: 177.58, Y: 62.97 },
    { X: 172.26, Y: 65.87 },
    { X: 167.5, Y: 58.9 },
    { X: 182.96, Y: 50.31 },
    { X: 199.42, Y: 43.83 },
    { X: 216.59, Y: 39.58 },
    { X: 234.17, Y: 37.62 },
    { X: 252.15, Y: 38 },
    { X: 269.63, Y: 40.7 },
    { X: 286.6, Y: 45.68 },
    { X: 302.76, Y: 52.86 },
    { X: 313.12, Y: 58.91 },
    { X: 313.32, Y: 59.03 },
  ],
  [
    { X: 155.18, Y: 67.87 },
    { X: 160.1, Y: 75.09 },
    { X: 147.49, Y: 87.07 },
    { X: 136.63, Y: 100.65 },
    { X: 127.73, Y: 115.58 },
    { X: 121.08, Y: 131.32 },
    { X: 116.64, Y: 147.82 },
    { X: 114.48, Y: 164.77 },
    { X: 114.66, Y: 182.16 },
    { X: 117.15, Y: 199.06 },
    { X: 118.19, Y: 203.94 },
    { X: 110.01, Y: 206.46 },
    { X: 106.64, Y: 189.1 },
    { X: 105.59, Y: 171.14 },
    { X: 106.92, Y: 153.21 },
    { X: 110.56, Y: 135.9 },
    { X: 116.45, Y: 119.22 },
    { X: 124.48, Y: 103.46 },
    { X: 134.69, Y: 88.66 },
    { X: 146.78, Y: 75.33 },
    { X: 155.07, Y: 67.96 },
    { X: 155.18, Y: 67.87 },
  ],
  [
    { X: 114.68, Y: 220.85 },
    { X: 123.06, Y: 218.44 },
    { X: 130.42, Y: 233.86 },
    { X: 139.99, Y: 248.38 },
    { X: 151.44, Y: 261.46 },
    { X: 164.59, Y: 272.83 },
    { X: 179.16, Y: 282.33 },
    { X: 194.62, Y: 289.61 },
    { X: 210.92, Y: 294.7 },
    { X: 227.77, Y: 297.55 },
    { X: 232.81, Y: 297.95 },
    { X: 232.52, Y: 306.7 },
    { X: 214.97, Y: 304.52 },
    { X: 197.86, Y: 300.07 },
    { X: 181.48, Y: 293.39 },
    { X: 166.12, Y: 284.61 },
    { X: 151.82, Y: 273.7 },
    { X: 139.07, Y: 261.01 },
    { X: 128.13, Y: 246.73 },
    { X: 119.31, Y: 231.41 },
    { X: 114.72, Y: 220.97 },
    { X: 114.68, Y: 220.85 },
  ],
  [
    { X: 247.81, Y: 306.7 },
    { X: 248.04, Y: 297.93 },
    { X: 264.99, Y: 295.74 },
    { X: 281.48, Y: 291.27 },
    { X: 297.2, Y: 284.58 },
    { X: 311.88, Y: 275.83 },
    { X: 325.47, Y: 264.99 },
    { X: 337.44, Y: 252.39 },
    { X: 347.59, Y: 238.27 },
    { X: 355.57, Y: 223.16 },
    { X: 357.93, Y: 218.25 },
    { X: 365.83, Y: 221.11 },
    { X: 358.32, Y: 237.13 },
    { X: 348.6, Y: 252.26 },
    { X: 336.95, Y: 265.97 },
    { X: 323.6, Y: 278.02 },
    { X: 308.77, Y: 288.19 },
    { X: 292.99, Y: 296.19 },
    { X: 276.3, Y: 302.04 },
    { X: 258.98, Y: 305.63 },
    { X: 247.94, Y: 306.7 },
    { X: 247.81, Y: 306.7 },
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
  [
    { X: 10, Y: 240 },
    { X: 1000, Y: 240 },
  ],
];

const clipper = new GPULineClipper();

const result = await clipper.clipLines(lines, polygon);

const canvas = document.querySelector('canvas');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';

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

ctx.strokeStyle = 'red';

lines.forEach((line) => {
  ctx.beginPath();
  ctx.moveTo(line[0].X, line[0].Y);
  ctx.lineTo(line[1].X, line[1].Y);
  ctx.closePath();
  ctx.stroke();
});

ctx.strokeStyle = 'yellow';

result.forEach((line) => {
  ctx.beginPath();
  ctx.moveTo(line[0].X, line[0].Y);
  ctx.lineTo(line[1].X, line[1].Y);
  ctx.closePath();
  ctx.stroke();
});

console.log(result);
