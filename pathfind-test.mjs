import { WALL_LAYOUT } from './src/walls.js';
import { createNavGrid, findPath, hasClearLine, BODY_CLEARANCE } from './src/pathfinding.js';

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

function inWallRect(x, y) {
    return RECTS.some(w =>
        x >= w.x - w.width / 2 && x <= w.x + w.width / 2 &&
        y >= w.y - w.height / 2 && y <= w.y + w.height / 2
    );
}

function freePoint() {
    return nav.freeCells[Math.floor(Math.random() * nav.freeCells.length)];
}

check('misma celda devuelve null', findPath(nav, 100, 100, 104, 104) === null);

const wall = RECTS[13];
check('meta bloqueada devuelve null', findPath(nav, 500, 500, wall.x, wall.y) === null);

const wallStart = RECTS[15];
check('origen bloqueado devuelve null', findPath(nav, wallStart.x, wallStart.y, 500, 500) === null);

check('origen fuera del mundo devuelve null', findPath(nav, -50, 100, 500, 500) === null);

check('meta fuera del mundo devuelve null', findPath(nav, 500, 500, 2100, 100) === null);

const far = freePoint();
const direct = findPath(nav, 400, 400, far.x, far.y);
check('camino en campo abierto no nulo', direct !== null);

check('waypoints en celdas libres', direct.every(p => !inWallRect(p.x, p.y)));

function cellGap(a, b) {
    return Math.max(Math.abs(Math.floor(a.x / CELL) - Math.floor(b.x / CELL)),
        Math.abs(Math.floor(a.y / CELL) - Math.floor(b.y / CELL)));
}

let clippedShorts = 0;
for (let i = 0; i < direct.length - 1; i++) {
    if (cellGap(direct[i], direct[i + 1]) <= 1) continue;
    if (!hasClearLine(nav, direct[i].x, direct[i].y, direct[i + 1].x, direct[i + 1].y, BODY_CLEARANCE)) {
        clippedShorts += 1;
    }
}
check('atajos podados sin recorte de esquina', clippedShorts === 0, `${clippedShorts} atajos recortados`);

const a = freePoint();
const b = freePoint();
const openPath = findPath(nav, a.x, a.y, b.x, b.y);
const openClear = hasClearLine(nav, a.x, a.y, b.x, b.y);
check('ruta lisa en campo abierto tiene 2 waypoints', !openClear || openPath.length === 2);

const wallA = RECTS[3];
const sx = wallA.x - wallA.width / 2 - 100;
const sy = wallA.y;
const gx = 700;
const gy = wallA.y;
const straightBlocked = hasClearLine(nav, sx, sy, gx, gy, 0) === false;
const p = findPath(nav, sx, sy, gx, gy);
const detourOk = straightBlocked && p !== null && p.length > 2 && p.every(po => !inWallRect(po.x, po.y));
check('desvio alrededor de una pared sin atravesarla', detourOk, `linea libre=${!straightBlocked}, path=${p ? p.length : null}`);

check('path de vuelta al spawn no nulo', findPath(nav, far.x, far.y, 400, 400) !== null);

let longOk = true;
let longCount = 0;
for (let i = 0; i < 200; i++) {
    const s = freePoint();
    const g = freePoint();
    const p = findPath(nav, s.x, s.y, g.x, g.y);
    if (p && p.some(po => inWallRect(po.x, po.y))) longOk = false;
    if (p !== null) longCount += 1;
}
check('200 rutas aleatorias con waypoints libres', longOk && longCount > 100, `${longCount}/200 con camino`);

if (failures > 0) {
    console.log(`${failures} caso(s) fallaron.`);
    process.exit(1);
}
console.log('pathfind-test: 12 comprobaciones OK');