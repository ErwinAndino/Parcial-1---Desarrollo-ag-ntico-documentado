import { WALL_LAYOUT } from './src/walls.js';
import { createNavGrid, findPath, hasClearLine, BODY_CLEARANCE } from './src/pathfinding.js';

let failures = 0;
const WORLD_W = 2000;
const WORLD_H = 1500;
const CELL = 40;
const TOTAL = 2000;

const RECTS = WALL_LAYOUT.map(w => ({ x: w.x, y: w.y, width: w.w, height: w.h }));
const nav = createNavGrid(RECTS, WORLD_W, WORLD_H, CELL);

function check(name, ok, detail = '') {
    if (!ok) {
        failures += 1;
        console.log(`FAIL ${name}${detail ? ` (${detail})` : ''}`);
    }
}

function randomFreeCell() {
    return nav.freeCells[Math.floor(Math.random() * nav.freeCells.length)];
}

function inWallRect(x, y) {
    return RECTS.some(w =>
        x >= w.x - w.width / 2 && x <= w.x + w.width / 2 &&
        y >= w.y - w.height / 2 && y <= w.y + w.height / 2
    );
}

let withPath = 0;
let clipped = 0;
let sameCell = 0;

function cellGap(a, b) {
    return Math.max(Math.abs(Math.floor(a.x / CELL) - Math.floor(b.x / CELL)),
        Math.abs(Math.floor(a.y / CELL) - Math.floor(b.y / CELL)));
}

for (let i = 0; i < TOTAL; i++) {
    let s = randomFreeCell();
    let g = randomFreeCell();
    if (s.x === g.x && s.y === g.y) {
        sameCell += 1;
        continue;
    }
    const path = findPath(nav, s.x, s.y, g.x, g.y);
    if (!path) continue;
    withPath += 1;
    for (let k = 0; k < path.length - 1; k++) {
        if (inWallRect(path[k].x, path[k].y) || inWallRect(path[k + 1].x, path[k + 1].y)) {
            clipped += 1;
            continue;
        }
        if (cellGap(path[k], path[k + 1]) > 1 &&
            !hasClearLine(nav, path[k].x, path[k].y, path[k + 1].x, path[k + 1].y, BODY_CLEARANCE)) {
            clipped += 1;
        }
    }
}

check('ningun recorte de esquina en las rutas', clipped === 0, `${clipped} tramos recortados`);
check('ruta directa en campo abierto preservada', (() => {
    const open = findPath(nav, 100, 100, 100, 160);
    return open !== null && open.length === 2 && hasClearLine(nav, 100, 100, 100, 160, BODY_CLEARANCE);
})());
check('la mayoria de las rutas aleatorias encuentra camino', withPath > 1000, `${withPath}/${TOTAL}`);

if (failures > 0) {
    console.log(`${failures} caso(s) fallaron.`);
    process.exit(1);
}
console.log(`route-test: 4 comprobaciones OK (${withPath}/${TOTAL} rutas con camino, ${sameCell} pares misma celda, ${clipped} recortes)`);