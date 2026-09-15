import { WALL_LAYOUT } from './src/walls.js';
import { createNavGrid } from './src/pathfinding.js';

let failures = 0;
const WORLD_W = 2000;
const WORLD_H = 1500;
const CELL = 40;
const MIN_SPAWN_DIST = 240;
const ENEMY_MIN_SPAWN_DIST = 120;
const SPAWN_MARGIN = 40;
const WALL_PADDING = 8;
const BODY_HALF = 16 + WALL_PADDING;
const INITIAL_ENEMIES = 5;
const ENEMIES_PER_LEVEL = 2;

const RECTS = WALL_LAYOUT.map(w => ({ x: w.x, y: w.y, width: w.w, height: w.h }));
const nav = createNavGrid(RECTS, WORLD_W, WORLD_H, CELL);

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

function distanceToNearestEnemy(x, y, enemies) {
    let min = Infinity;
    for (const e of enemies) {
        const d = dist(x, y, e.x, e.y);
        if (d < min) min = d;
    }
    return min;
}

function randomPointFarFromPlayer(px, py, enemies) {
    for (let i = 0; i < 120; i++) {
        const x = randInt(SPAWN_MARGIN, WORLD_W - SPAWN_MARGIN);
        const y = randInt(SPAWN_MARGIN, WORLD_H - SPAWN_MARGIN);
        if (dist(x, y, px, py) < MIN_SPAWN_DIST) continue;
        if (overlapsWalls(x, y)) continue;
        if (distanceToNearestEnemy(x, y, enemies) < ENEMY_MIN_SPAWN_DIST) continue;
        return { x, y };
    }
    for (let i = 0; i < 40; i++) {
        const cell = randomFreeCell();
        if (!cell) break;
        if (dist(cell.x, cell.y, px, py) < MIN_SPAWN_DIST) continue;
        if (distanceToNearestEnemy(cell.x, cell.y, enemies) < ENEMY_MIN_SPAWN_DIST) continue;
        return cell;
    }
    return randomFreeCell();
}

function validPoint(p, px, py, enemies) {
    if (p.x - BODY_HALF < 0 || p.x + BODY_HALF > WORLD_W || p.y - BODY_HALF < 0 || p.y + BODY_HALF > WORLD_H) return false;
    if (overlapsWalls(p.x, p.y)) return false;
    if (dist(p.x, p.y, px, py) < MIN_SPAWN_DIST) return false;
    if (distanceToNearestEnemy(p.x, p.y, enemies) < ENEMY_MIN_SPAWN_DIST) return false;
    return true;
}

const PLAYER = { x: 400, y: 400 };
const enemies = [];
let violations = 0;

for (let i = 0; i < INITIAL_ENEMIES; i++) {
    const p = randomPointFarFromPlayer(PLAYER.x, PLAYER.y, enemies);
    if (!validPoint(p, PLAYER.x, PLAYER.y, enemies)) violations += 1;
    enemies.push(p);
}

for (let i = 0; i < ENEMIES_PER_LEVEL; i++) {
    const p = randomPointFarFromPlayer(PLAYER.x, PLAYER.y, enemies);
    if (!validPoint(p, PLAYER.x, PLAYER.y, enemies)) violations += 1;
    enemies.push(p);
}

for (let i = 0; i < 500; i++) {
    const victim = Math.floor(Math.random() * enemies.length);
    const others = enemies.filter((_, idx) => idx !== victim);
    const p = randomPointFarFromPlayer(PLAYER.x, PLAYER.y, others);
    if (!validPoint(p, PLAYER.x, PLAYER.y, others)) violations += 1;
    enemies[victim] = p;
}

if (violations > 0) {
    failures += 1;
    console.log(`FAIL spawn-multi: ${violations} violaciones`);
}

if (failures > 0) {
    console.log(`${failures} caso(s) fallaron.`);
    process.exit(1);
}
console.log(`spawn-multi-test: ${enemies.length} enemigos y 500 respawns, 0 violaciones (sin pared, >=${MIN_SPAWN_DIST} px del jugador, >=${ENEMY_MIN_SPAWN_DIST} px de otros enemigos)`);