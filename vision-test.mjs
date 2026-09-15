import { WALL_LAYOUT } from './src/walls.js';
import { createNavGrid, hasClearLine, BODY_CLEARANCE } from './src/pathfinding.js';

let failures = 0;
const WORLD_W = 2000;
const WORLD_H = 1500;
const CELL = 40;

const RECTS = WALL_LAYOUT.map(w => ({ x: w.x, y: w.y, width: w.w, height: w.h }));
const nav = createNavGrid(RECTS, WORLD_W, WORLD_H, CELL);

function check(name, ok, detail = '') {
    if (!ok) {
        failures += 1;
        console.log(`FAIL ${name}${detail ? ` (${detail})` : ''}`);
    }
}

let crossed = 0;
const wallChecks = RECTS.map((w) => {
    const blocked = !hasClearLine(nav, w.x - 320, w.y, w.x + 320, w.y);
    if (blocked) crossed += 1;
    return blocked;
});
check('linea de vision corta cada una de las 24 paredes', crossed === 24, `cortadas ${crossed}/24`);

check('campo abierto mantiene linea libre', hasClearLine(nav, 100, 100, 100, 150) === true);

const faceWall = RECTS[13];
const yNearFace = faceWall.y - faceWall.height / 2 - 12;
const rayClear = hasClearLine(nav, faceWall.x - 200, yNearFace, faceWall.x + 200, yNearFace, 0);
const bodyBlocked = hasClearLine(nav, faceWall.x - 200, yNearFace, faceWall.x + 200, yNearFace, BODY_CLEARANCE);
check('tramo a 12 px de un muro: rayo libre, cuerpo bloqueado', rayClear === true && bodyBlocked === false,
    `rayo=${rayClear}, cuerpo=${bodyBlocked}`);

function skipBehind(enemy, path) {
    let idx = 0;
    while (idx + 1 < path.length &&
        Math.hypot(path[idx].x - enemy.x, path[idx].y - enemy.y) >
        Math.hypot(path[idx + 1].x - enemy.x, path[idx + 1].y - enemy.y) &&
        hasClearLine(nav, enemy.x, enemy.y, path[idx + 1].x, path[idx + 1].y, BODY_CLEARANCE)) {
        idx += 1;
    }
    return idx;
}

const waypoints = [
    { x: 1700, y: 100 },
    { x: 1800, y: 100 },
    { x: 1600, y: 100 }
];
const behind = skipBehind({ x: 1760, y: 100 }, waypoints);
check('waypoint superado se saltea', behind === 1, `index ${behind}`);
check('waypoint valido no se saltea', skipBehind({ x: 1705, y: 100 }, waypoints) === 0);

const wallLeft = faceWall.x - faceWall.width / 2;
const noClearEnemy = { x: wallLeft - 5, y: yNearFace };
const noClearPath = [
    { x: wallLeft - 200, y: yNearFace },
    { x: wallLeft - 40, y: yNearFace }
];
const noClearIdx = skipBehind(noClearEnemy, noClearPath);
check('skip no salta si el tramo no deja holgura', noClearIdx === 0, `index ${noClearIdx}`);

check('distancia nula devuelve linea libre con holgura', hasClearLine(nav, 800, 900, 800, 900, BODY_CLEARANCE) === true);

if (failures > 0) {
    console.log(`${failures} caso(s) fallaron.`);
    process.exit(1);
}
console.log('vision-test: 30 comprobaciones OK (24 paredes cortadas + 6 miscelaneos, incluido el salto de waypoints)');