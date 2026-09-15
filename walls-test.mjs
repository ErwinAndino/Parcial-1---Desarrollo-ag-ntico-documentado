import { WALL_LAYOUT } from './src/walls.js';
import { createNavGrid } from './src/pathfinding.js';

let failures = 0;
const WORLD_W = 2000;
const WORLD_H = 1500;
const CELL = 40;
const HERO_HALF = 16;

const RECTS = WALL_LAYOUT.map(w => ({ x: w.x, y: w.y, width: w.w, height: w.h }));

function check(name, ok, detail = '') {
    if (!ok) {
        failures += 1;
        console.log(`FAIL ${name}${detail ? ` (${detail})` : ''}`);
    }
}

const left = w => w.x - w.width / 2;
const right = w => w.x + w.width / 2;
const top = w => w.y - w.height / 2;
const bottom = w => w.y + w.height / 2;

function overlaps(a, b) {
    return left(a) < right(b) && right(a) > left(b) && top(a) < bottom(b) && bottom(a) > top(b);
}

check('layout tiene 24 paredes', WALL_LAYOUT.length === 24, `hay ${WALL_LAYOUT.length}`);

const insideWorld = RECTS.every(w =>
    left(w) >= 0 && right(w) <= WORLD_W && top(w) >= 0 && bottom(w) <= WORLD_H
);
check('24 paredes dentro del mundo', insideWorld);

let overlapPairs = 0;
for (let i = 0; i < RECTS.length; i++) {
    for (let j = i + 1; j < RECTS.length; j++) {
        if (overlaps(RECTS[i], RECTS[j])) overlapPairs += 1;
    }
}
check('sin solapamiento entre paredes', overlapPairs === 0, `${overlapPairs} pares solapados`);

const spawnFree = !RECTS.some(w => {
    const hx = 400 + HERO_HALF > left(w) && 400 - HERO_HALF < right(w);
    const hy = 400 + HERO_HALF > top(w) && 400 - HERO_HALF < bottom(w);
    return hx && hy;
});
check('spawn del heroe (400,400) libre', spawnFree);

const nav = createNavGrid(RECTS, WORLD_W, WORLD_H, CELL);
const thinWallsBlocked = [4, 11].every(idx => {
    const w = RECTS[idx];
    const ci = Math.floor(w.x / CELL);
    const cj = Math.floor(w.y / CELL);
    return nav.blocked[cj * nav.cols + ci] === 1;
});
check('celda del centro de muros delgados 4 y 11 bloqueada', thinWallsBlocked);

if (failures > 0) {
    console.log(`${failures} caso(s) fallaron.`);
    process.exit(1);
}
console.log(`walls-test: 5 comprobaciones OK (${RECTS.length} paredes, ${overlapPairs} solapamientos, ${nav.freeCells.length} celdas libres)`);