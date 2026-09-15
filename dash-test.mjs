import { computeDashEnd } from './src/dash.js';
import { WALL_LAYOUT } from './src/walls.js';

let failures = 0;
const WORLD_W = 2000;
const WORLD_H = 1500;
const HALF = 20;

function check(name, ok, detail = '') {
    if (!ok) {
        failures += 1;
        console.log(`FAIL ${name}${detail ? ` (${detail})` : ''}`);
    }
}

function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

check('open space reaches full distance', (() => {
    const r = computeDashEnd(300, 300, 1, 0, 140, [], WORLD_W, WORLD_H, HALF);
    return Math.abs(dist(300, 300, r.x, r.y) - 140) < 0.01 && r.y === 300;
})());

check('open space diagonal keeps magnitude', (() => {
    const r = computeDashEnd(300, 300, 1, 1, 140, [], WORLD_W, WORLD_H, HALF);
    return Math.abs(dist(300, 300, r.x, r.y) - 140) < 1;
})());

check('wall stops dash at face without penetrating', (() => {
    const walls = [{ x: 200, y: 100, w: 24, h: 24 }];
    const r = computeDashEnd(100, 100, 1, 0, 140, walls, WORLD_W, WORLD_H, HALF);
    const left = 200 - 12;
    return Math.abs(r.x - 168) < 0.01 && r.y === 100 && r.x + HALF <= left;
})());

check('world border clamps dash to body margin', (() => {
    const r = computeDashEnd(50, 50, 0, -1, 140, [], WORLD_W, WORLD_H, HALF);
    return r.y >= HALF && r.y <= HALF + 4 && r.x === 50;
})());

check('blocked start stays in place', (() => {
    const walls = [{ x: 200, y: 100, w: 24, h: 24 }];
    const r = computeDashEnd(180, 100, 1, 0, 140, walls, WORLD_W, WORLD_H, HALF);
    return r.x === 180 && r.y === 100;
})());

check('zero direction returns start', (() => {
    const r = computeDashEnd(100, 100, 0, 0, 140, [], WORLD_W, WORLD_H, HALF);
    return r.x === 100 && r.y === 100;
})());

let openOk = true;
for (let i = 0; i < 200; i++) {
    const x = 300 + Math.random() * (WORLD_W - 600);
    const y = 300 + Math.random() * (WORLD_H - 600);
    const a = Math.random() * Math.PI * 2;
    const r = computeDashEnd(x, y, Math.cos(a), Math.sin(a), 140, [], WORLD_W, WORLD_H, HALF);
    if (Math.abs(dist(x, y, r.x, r.y) - 140) > 1) openOk = false;
    if (r.x - HALF < 0 || r.x + HALF > WORLD_W || r.y - HALF < 0 || r.y + HALF > WORLD_H) openOk = false;
}
check('200 random open-space dashes reach full distance inside world', openOk);

let wallOk = true;
for (let i = 0; i < 500; i++) {
    const x = 40 + Math.random() * (WORLD_W - 80);
    const y = 40 + Math.random() * (WORLD_H - 80);
    const a = Math.random() * Math.PI * 2;
    const r = computeDashEnd(x, y, Math.cos(a), Math.sin(a), 140, WALL_LAYOUT, WORLD_W, WORLD_H, HALF);
    if (r.x - HALF < 0 || r.x + HALF > WORLD_W || r.y - HALF < 0 || r.y + HALF > WORLD_H) wallOk = false;
    for (const w of WALL_LAYOUT) {
        const left = w.x - w.width / 2;
        const right = w.x + w.width / 2;
        const top = w.y - w.height / 2;
        const bottom = w.y + w.height / 2;
        if (r.x + HALF > left && r.x - HALF < right && r.y + HALF > top && r.y - HALF < bottom) {
            wallOk = false;
        }
    }
}
check('500 random dashes never end inside a wall or outside the world', wallOk);

if (failures > 0) {
    console.log(`${failures} caso(s) fallaron.`);
    process.exit(1);
}
console.log('dash-test: 8 comprobaciones OK');