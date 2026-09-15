export const BODY_CLEARANCE = 16 + 2;

function worldToCell(nav, x, y) {
    return { i: Math.floor(x / nav.cell), j: Math.floor(y / nav.cell) };
}

function sameCell(a, b) {
    return a !== null && b !== null && a.i === b.i && a.j === b.j;
}

function inBounds(nav, i, j) {
    return i >= 0 && i < nav.cols && j >= 0 && j < nav.rows;
}

function cellIndex(nav, i, j) {
    return j * nav.cols + i;
}

function isBlocked(nav, i, j) {
    return nav.blocked[cellIndex(nav, i, j)] === 1;
}

export function createNavGrid(walls, worldWidth, worldHeight, cell) {
    const cols = Math.ceil(worldWidth / cell);
    const rows = Math.ceil(worldHeight / cell);
    const blocked = new Uint8Array(cols * rows);
    const freeCells = [];

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            const cx = i * cell + cell / 2;
            const cy = j * cell + cell / 2;
            if (walls.some((w) => pointInRect(cx, cy, w))) {
                blocked[j * cols + i] = 1;
            }
        }
    }

    for (const w of walls) {
        const i = Math.floor(w.x / cell);
        const j = Math.floor(w.y / cell);
        if (i >= 0 && i < cols && j >= 0 && j < rows) {
            blocked[j * cols + i] = 1;
        }
    }

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            if (!blocked[j * cols + i]) {
                freeCells.push({ x: i * cell + cell / 2, y: j * cell + cell / 2 });
            }
        }
    }

    return { cols, rows, cell, blocked, freeCells, walls };
}

function pointInRect(x, y, w) {
    return x >= w.x - w.width / 2 && x <= w.x + w.width / 2 &&
           y >= w.y - w.height / 2 && y <= w.y + w.height / 2;
}

export function findPath(nav, startX, startY, goalX, goalY) {
    const start = worldToCell(nav, startX, startY);
    const goal = worldToCell(nav, goalX, goalY);

    if (!inBounds(nav, start.i, start.j) || !inBounds(nav, goal.i, goal.j)) return null;
    if (start.i === goal.i && start.j === goal.j) return null;
    if (isBlocked(nav, goal.i, goal.j)) return null;
    if (isBlocked(nav, start.i, start.j)) return null;

    const cols = nav.cols;
    const rows = nav.rows;
    const goalIdx = cellIndex(nav, goal.i, goal.j);
    const startIdx = cellIndex(nav, start.i, start.j);

    const gScore = new Int32Array(cols * rows).fill(-1);
    const parent = new Int32Array(cols * rows).fill(-1);
    const closed = new Uint8Array(cols * rows);
    const open = new Set([startIdx]);
    gScore[startIdx] = 0;

    const heur = (i, j) => Math.abs(i - goal.i) + Math.abs(j - goal.j);

    while (open.size > 0) {
        let current = -1;
        let best = Infinity;
        for (const node of open) {
            const ni = node % cols;
            const nj = Math.floor(node / cols);
            const score = gScore[node] + heur(ni, nj);
            if (score < best) {
                best = score;
                current = node;
            }
        }

        if (current === goalIdx) break;
        open.delete(current);
        closed[current] = 1;

        const ci = current % cols;
        const cj = Math.floor(current / cols);
        const neighbors = [
            { i: ci + 1, j: cj },
            { i: ci - 1, j: cj },
            { i: ci, j: cj + 1 },
            { i: ci, j: cj - 1 }
        ];

        for (const n of neighbors) {
            if (!inBounds(nav, n.i, n.j)) continue;
            const nIdx = cellIndex(nav, n.i, n.j);
            if (closed[nIdx] === 1) continue;
            if (isBlocked(nav, n.i, n.j)) continue;

            const tentative = gScore[current] + 1;
            if (gScore[nIdx] === -1 || tentative < gScore[nIdx]) {
                gScore[nIdx] = tentative;
                parent[nIdx] = current;
                open.add(nIdx);
            }
        }
    }

    if (gScore[goalIdx] === -1) return null;

    const points = [];
    let node = goalIdx;
    while (node !== -1) {
        const ni = node % cols;
        const nj = Math.floor(node / cols);
        points.push({ x: ni * nav.cell + nav.cell / 2, y: nj * nav.cell + nav.cell / 2 });
        node = parent[node];
    }
    points.reverse();

    return prunePath(nav, points);
}

function prunePath(nav, points) {
    if (points.length <= 2) return points;

    const result = [points[0]];
    let current = points[0];

    for (let i = 1; i < points.length - 1; i++) {
        if (!segmentSweepClear(nav, current, points[i + 1])) {
            result.push(points[i]);
            current = points[i];
        }
    }

    result.push(points[points.length - 1]);
    return result;
}

function segmentSweepClear(nav, a, b, pad = BODY_CLEARANCE) {
    for (const w of nav.walls) {
        if (segmentIntersectsRect(a.x, a.y, b.x, b.y, w, pad)) return false;
    }

    return true;
}

export function hasClearLine(nav, x1, y1, x2, y2, pad = 0) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    if (dist < 1) return true;

    for (const w of nav.walls) {
        if (segmentIntersectsRect(x1, y1, x2, y2, w, pad)) return false;
    }

    return true;
}

function segmentIntersectsRect(x1, y1, x2, y2, r, pad = 0) {
    const left = r.x - r.width / 2 - pad;
    const right = r.x + r.width / 2 + pad;
    const top = r.y - r.height / 2 - pad;
    const bottom = r.y + r.height / 2 + pad;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const p = [-dx, dx, -dy, dy];
    const q = [x1 - left, right - x1, y1 - top, bottom - y1];

    let t0 = 0;
    let t1 = 1;

    for (let i = 0; i < 4; i++) {
        if (p[i] === 0) {
            if (q[i] < 0) return false;
        } else {
            const t = q[i] / p[i];
            if (p[i] < 0) {
                if (t > t1) return false;
                if (t > t0) t0 = t;
            } else {
                if (t < t0) return false;
                if (t < t1) t1 = t;
            }
        }
    }

    return true;
}

export { worldToCell, sameCell };