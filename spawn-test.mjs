import { WALL_LAYOUT } from './src/walls.js';
import { createNavGrid } from './src/pathfinding.js';

let failures = 0;
const WORLD_W = 2000;
const WORLD_H = 1500;
const CELL = 40;
const MIN_SPAWN_DIST = 240;
const SPAWN_MARGIN = 40;
const WALL_PADDING = 8;
const BODY_HALF = 16 + WALL_PADDING;

const RECTS = WALL_LAYOUT.map(w => ({ x: w.x, y: w.y, width: w.w, height: w.h }));
const nav = createNavGrid(RECTS, WORLD_W, WORLD_H, CELL);

function check(name, ok, detail = '') {
    if (!ok) {
        failures += 1;
        console.log(`FAIL ${name}${detail ? ` (${detail})` : ''}`);
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

function overlapsWalls(x, y) {
    for (const w of RECTS) {
        const left = w.x - w.width / 2;
        const right = w.x + w.width / 2;
        const top = w.y - w.height / 2;
        const bottom = w.y + w.height / 2;
        if (x + BODY_HALF > left && x - BODY_HALF < right && y + BODY_HALF > top && y - BODY_HALF < bottom) {
            return true;
        }
    }
    return false;
}

function randomFreeCell() {
    return nav.freeCells[randInt(0, nav.freeCells.length - 1)];
}

function randomPointFarFromPlayer(px, py) {
    for (let i = 0; i < 120; i++) {
        const x = randInt(SPAWN_MARGIN, WORLD_W - SPAWN_MARGIN);
        const y = randInt(SPAWN_MARGIN, WORLD_H - SPAWN_MARGIN);
        if (dist(x, y, px, py) < MIN_SPAWN_DIST) continue;
        if (overlapsWalls(x, y)) continue;
        return { x, y };
    }
    for (let i = 0; i < 40; i++) {
        const cell = randomFreeCell();
        if (!cell) break;
        if (dist(cell.x, cell.y, px, py) < MIN_SPAWN_DIST) continue;
        return cell;
    }
    return randomFreeCell();
}

function validPoint(p, px, py) {
    if (p.x - BODY_HALF < 0 || p.x + BODY_HALF > WORLD_W || p.y - BODY_HALF < 0 || p.y + BODY_HALF > WORLD_H) return false;
    if (overlapsWalls(p.x, p.y)) return false;
    if (dist(p.x, p.y, px, py) < MIN_SPAWN_DIST) return false;
    return true;
}

const PLAYER = { x: 400, y: 400 };
const TOTAL = 2000;
const violations = [];
for (let i = 0; i < TOTAL; i++) {
    const p = randomPointFarFromPlayer(PLAYER.x, PLAYER.y);
    if (!validPoint(p, PLAYER.x, PLAYER.y)) violations.push({ i, p });
}

check('2000 respawns validos', violations.length === 0, `${violations.length} violaciones`);

if (failures > 0) {
    console.log(`${failures} caso(s) fallaron.`);
    process.exit(1);
}
console.log(`spawn-test: ${TOTAL} respawns OK (0 en pared, 0 dentro de ${MIN_SPAWN_DIST} px del jugador)`);