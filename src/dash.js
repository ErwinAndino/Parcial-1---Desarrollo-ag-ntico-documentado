export function computeDashEnd(startX, startY, dirX, dirY, distance, walls, worldWidth, worldHeight, half) {
    const len = Math.hypot(dirX, dirY);
    const step = 4;
    let endX = startX;
    let endY = startY;

    if (len < 1e-6 || distance <= 0) return { x: startX, y: startY };

    const vx = dirX / len;
    const vy = dirY / len;

    for (let d = 0; d <= distance; d += step) {
        const x = startX + vx * d;
        const y = startY + vy * d;
        if (blockedAt(x, y, walls, worldWidth, worldHeight, half)) break;
        endX = x;
        endY = y;
    }

    return { x: endX, y: endY };
}

function blockedAt(x, y, walls, worldWidth, worldHeight, half) {
    if (x - half < 0 || x + half > worldWidth || y - half < 0 || y + half > worldHeight) return true;
    for (const w of walls) {
        const ww = w.width !== undefined ? w.width : w.w;
        const wh = w.height !== undefined ? w.height : w.h;
        const left = w.x - ww / 2;
        const right = w.x + ww / 2;
        const top = w.y - wh / 2;
        const bottom = w.y + wh / 2;
        if (x + half > left && x - half < right && y + half > top && y - half < bottom) return true;
    }
    return false;
}