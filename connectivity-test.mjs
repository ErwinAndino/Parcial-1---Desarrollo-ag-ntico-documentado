import { WALL_LAYOUT } from './src/walls.js';
import { createNavGrid } from './src/pathfinding.js';

let failures = 0;
const WORLD_W = 2000;
const WORLD_H = 1500;
const CELL = 40;

const RECTS = WALL_LAYOUT.map(w => ({ x: w.x, y: w.y, width: w.w, height: w.h }));

function check(name, ok, detail = '') {
    if (!ok) {
        failures += 1;
        console.log(`FAIL ${name}${detail ? ` (${detail})` : ''}`);
    }
}

const nav = createNavGrid(RECTS, WORLD_W, WORLD_H, CELL);
const si = Math.floor(400 / CELL);
const sj = Math.floor(400 / CELL);
const startIdx = sj * nav.cols + si;

const index = (i, j) => j * nav.cols + i;
const visited = new Uint8Array(nav.cols * nav.rows);
const queue = [startIdx];
visited[startIdx] = 1;
let reachable = 0;

while (queue.length > 0) {
    const cur = queue.pop();
    reachable += 1;
    const ci = cur % nav.cols;
    const cj = Math.floor(cur / nav.cols);
    const neighbors = [
        { i: ci + 1, j: cj }, { i: ci - 1, j: cj },
        { i: ci, j: cj + 1 }, { i: ci, j: cj - 1 }
    ];
    for (const n of neighbors) {
        if (n.i < 0 || n.i >= nav.cols || n.j < 0 || n.j >= nav.rows) continue;
        const idx = index(n.i, n.j);
        if (visited[idx]) continue;
        if (nav.blocked[idx]) continue;
        visited[idx] = 1;
        queue.push(idx);
    }
}

check('spawn dentro del mundo', si >= 0 && si < nav.cols && sj >= 0 && sj < nav.rows);
check('celda del spawn libre', nav.blocked[startIdx] === 0);
check('todas las celdas libres conectadas desde el spawn', reachable === nav.freeCells.length,
    `alcanzables ${reachable}, libres ${nav.freeCells.length}`);

if (failures > 0) {
    console.log(`${failures} caso(s) fallaron.`);
    process.exit(1);
}
console.log(`connectivity-test: ${reachable}/${nav.freeCells.length} celdas libres conectadas OK`);