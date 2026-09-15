import Phaser from 'phaser';
import { WALL_LAYOUT, WALL_COLOR } from './walls.js';
import { createNavGrid, findPath, hasClearLine, worldToCell, sameCell, BODY_CLEARANCE } from './pathfinding.js';

const CONFIG = {
    WIDTH: 800,
    HEIGHT: 600,
    WORLD_WIDTH: 2000,
    WORLD_HEIGHT: 1500,
    PLAYER_SPEED: 200,
    PLAYER_MAX_HP: 3,
    ENEMY_MAX_HP: 3,
    XP_PER_KILL: 5,
    XP_PER_LEVEL: 25,
    MAX_LEVEL: 3,
    HEARTS_PER_LEVEL: 1,
    ATTACK_RADIUS: 70,
    ATTACK_HALF_ANGLE: Phaser.Math.DegToRad(50),
    ATTACK_DURATION: 250,
    ATTACK_COOLDOWN: 600,
    ENEMY_AGGRO_RANGE: 300,
    ENEMY_PATROL_SPEED: 50,
    ENEMY_CHASE_SPEED: 130,
    ENEMY_PATROL_RADIUS: 90,
    PLAYER_INVULN_TIME: 1200,
    MIN_SPAWN_DIST: 240,
    SPAWN_MARGIN: 40,
    ENEMY_MIN_SPAWN_DIST: 120,
    INITIAL_ENEMIES: 5,
    ENEMIES_PER_LEVEL: 2,
    WORLD_MARGIN: 80,
    NAV_CELL: 40,
    WALL_PADDING: 8,
    PATH_RECOMPUTE_MS: 300,
    PATH_STUCK_MS: 500
};

class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }

    create() {
        this.physics.world.setBounds(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);

        this.player = this.add.rectangle(400, 400, 32, 32, 0x4dabf7);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.createWalls();

        this.cameras.main.setBounds(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
        this.cameras.main.setRoundPixels(true);

        this.enemies = [];

        this.attackArc = this.add.graphics();

        this.hud = this.add.text(16, 16, '', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'monospace'
        });
        this.hud.setScrollFactor(0);
        this.hud.setDepth(100);

        this.cursors = this.input.keyboard.addKeys('W,A,S,D');
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.playerHp = CONFIG.PLAYER_MAX_HP;
        this.playerMaxHp = CONFIG.PLAYER_MAX_HP;
        this.playerLevel = 1;
        this.xp = 0;

        this.facing = new Phaser.Math.Vector2(0, 1);
        this.aimAngle = 0;
        this.attacking = false;
        this.attackTimer = 0;
        this.attackCooldown = 0;
        this.attackHitSet = new Set();
        this.playerInvuln = 0;
        this.gameOver = false;
        this.victory = false;

        for (let i = 0; i < CONFIG.INITIAL_ENEMIES; i++) {
            this.createEnemy();
        }

        this.updateHud();

        this.input.on('pointerdown', (pointer) => {
            if (this.gameOver || this.victory || this.attacking) return;
            if (!pointer.leftButtonDown() || this.attackCooldown > 0) return;
            this.startAttack();
        });
    }

    createWalls() {
        this.wallRects = [];
        for (const def of WALL_LAYOUT) {
            const rect = this.add.rectangle(def.x, def.y, def.w, def.h, WALL_COLOR);
            this.physics.add.existing(rect, true);
            this.wallRects.push(rect);
        }
        this.physics.add.collider(this.player, this.wallRects);
        this.nav = createNavGrid(this.wallRects, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT, CONFIG.NAV_CELL);
    }

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
            this.scene.restart();
            return;
        }

        if (this.gameOver || this.victory) {
            this.player.body.setVelocity(0, 0);
            for (const enemy of this.enemies) enemy.rect.body.setVelocity(0, 0);
            return;
        }

        if (this.attacking) {
            this.attackTimer -= delta;
            if (this.attackTimer <= 0) {
                this.attacking = false;
                this.attackArc.clear();
                this.attackArc.setVisible(false);
            } else {
                this.drawAttackArc();
            }
        }
        if (this.attackCooldown > 0) this.attackCooldown -= delta;
        if (this.playerInvuln > 0) {
            this.playerInvuln -= delta;
            this.player.setFillStyle(0xffffff, 0.7);
        } else {
            this.player.setFillStyle(0x4dabf7, 1);
        }

        this.handlePlayerMovement();
        for (const enemy of this.enemies) {
            this.updateEnemyAI(enemy, time, delta);
            this.updateEnemyHpText(enemy);
        }
        this.updateAttack();
        this.updateHud();
    }

    createEnemy() {
        const pos = this.randomPointFarFromPlayer();
        const rect = this.add.rectangle(pos.x, pos.y, 32, 32, 0xff6b6b);
        this.physics.add.existing(rect);
        rect.body.setCollideWorldBounds(true);
        this.physics.add.collider(rect, this.wallRects);
        this.physics.add.overlap(this.player, rect, () => this.damagePlayer());

        const enemyHpText = this.add.text(rect.x, rect.y - 26, '', {
            fontSize: '16px',
            color: '#ff8c8c',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        const enemy = {
            rect,
            hp: CONFIG.ENEMY_MAX_HP,
            home: new Phaser.Math.Vector2(rect.x, rect.y),
            mode: 'patrol',
            patrolTarget: null,
            hpText: enemyHpText,
            path: null,
            pathIndex: 0,
            pathTimer: 0,
            lastCell: null,
            stuckTimer: 0,
            lastX: rect.x,
            lastY: rect.y
        };
        enemy.patrolTarget = this.randomPatrolTarget(enemy);

        this.enemies.push(enemy);
        this.updateEnemyHpText(enemy);
        return enemy;
    }

    handlePlayerMovement() {
        const keys = this.cursors;
        let vx = 0;
        let vy = 0;
        if (keys.W.isDown) vy -= 1;
        if (keys.S.isDown) vy += 1;
        if (keys.A.isDown) vx -= 1;
        if (keys.D.isDown) vx += 1;

        if (vx === 0 && vy === 0) {
            this.player.body.setVelocity(0, 0);
            return;
        }

        const len = Math.hypot(vx, vy);
        this.facing.set(vx / len, vy / len);
        this.player.body.setVelocity(this.facing.x * CONFIG.PLAYER_SPEED, this.facing.y * CONFIG.PLAYER_SPEED);
    }

    updateEnemyAI(enemy, time, delta) {
        const distToPlayer = Phaser.Math.Distance.Between(
            enemy.rect.x, enemy.rect.y, this.player.x, this.player.y
        );

        let speed = CONFIG.ENEMY_PATROL_SPEED;
        if (distToPlayer <= CONFIG.ENEMY_AGGRO_RANGE) {
            enemy.mode = 'chase';
            speed = CONFIG.ENEMY_CHASE_SPEED;
        } else {
            if (enemy.mode === 'chase') enemy.mode = 'patrol';
        }

        this.updateStuckTracking(enemy, delta);

        if (enemy.mode === 'chase') {
            if (hasClearLine(this.nav, enemy.rect.x, enemy.rect.y, this.player.x, this.player.y, BODY_CLEARANCE)) {
                enemy.path = null;
                this.moveTo(enemy, this.player.x, this.player.y, speed);
                return;
            }
            this.updateChasePath(enemy, time);
            const finished = this.followPath(enemy, speed, delta);
            if (finished && !enemy.path) {
                this.moveTo(enemy, this.player.x, this.player.y, speed);
            }
            return;
        }

        const distToTarget = Phaser.Math.Distance.Between(
            enemy.rect.x, enemy.rect.y,
            enemy.patrolTarget.x, enemy.patrolTarget.y
        );
        if (distToTarget < 8) {
            enemy.patrolTarget = this.randomPatrolTarget(enemy);
        }
        if (hasClearLine(this.nav, enemy.rect.x, enemy.rect.y, enemy.patrolTarget.x, enemy.patrolTarget.y, BODY_CLEARANCE)) {
            enemy.path = null;
            this.moveTo(enemy, enemy.patrolTarget.x, enemy.patrolTarget.y, speed);
            return;
        }
        if (!enemy.path) {
            enemy.path = this.findGoalPath(enemy, enemy.patrolTarget.x, enemy.patrolTarget.y);
            enemy.pathIndex = 0;
            enemy.pathTimer = time;
        }
        if (enemy.path) {
            this.followPath(enemy, speed, delta);
        } else {
            this.moveTo(enemy, enemy.patrolTarget.x, enemy.patrolTarget.y, speed);
        }
    }

    updateStuckTracking(enemy, delta) {
        const moved = Phaser.Math.Distance.Between(enemy.rect.x, enemy.rect.y, enemy.lastX, enemy.lastY);
        enemy.lastX = enemy.rect.x;
        enemy.lastY = enemy.rect.y;
        if (moved < 0.5) {
            enemy.stuckTimer += delta;
        } else {
            enemy.stuckTimer = 0;
        }
        if (enemy.stuckTimer > CONFIG.PATH_STUCK_MS) {
            if (enemy.path) {
                enemy.pathIndex = Math.min(enemy.pathIndex + 1, enemy.path.length - 1);
            } else {
                enemy.path = null;
            }
            enemy.stuckTimer = 0;
        }
    }

    updateChasePath(enemy, time) {
        const playerCell = worldToCell(this.nav, this.player.x, this.player.y);
        const playerCellMoved = !sameCell(enemy.lastCell, playerCell);
        enemy.lastCell = playerCell;

        if (!enemy.path || playerCellMoved || time - enemy.pathTimer > CONFIG.PATH_RECOMPUTE_MS) {
            enemy.path = this.findGoalPath(enemy, this.player.x, this.player.y);
            enemy.pathIndex = 0;
            enemy.pathTimer = time;
        }
    }

    findGoalPath(enemy, tx, ty) {
        return findPath(this.nav, enemy.rect.x, enemy.rect.y, tx, ty);
    }

    followPath(enemy, speed, delta) {
        const path = enemy.path;
        if (!path) return true;
        if (enemy.pathIndex >= path.length) {
            enemy.path = null;
            return true;
        }

        this.skipWaypointsBehind(enemy, path);

        const target = path[enemy.pathIndex];
        const dist = this.moveTo(enemy, target.x, target.y, speed);
        if (dist === 0 || dist < 12) {
            enemy.pathIndex += 1;
            this.skipWaypointsBehind(enemy, path);
            if (enemy.pathIndex >= path.length) {
                enemy.path = null;
                return true;
            }
        }
        return false;
    }

    skipWaypointsBehind(enemy, path) {
        while (
            enemy.pathIndex + 1 < path.length &&
            this.distToPoint(enemy.rect.x, enemy.rect.y, path[enemy.pathIndex].x, path[enemy.pathIndex].y) >
            this.distToPoint(enemy.rect.x, enemy.rect.y, path[enemy.pathIndex + 1].x, path[enemy.pathIndex + 1].y) &&
            hasClearLine(
                this.nav, enemy.rect.x, enemy.rect.y,
                path[enemy.pathIndex + 1].x, path[enemy.pathIndex + 1].y,
                BODY_CLEARANCE
            )
        ) {
            enemy.pathIndex += 1;
        }
    }

    distToPoint(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    moveTo(enemy, tx, ty, speed) {
        const dx = tx - enemy.rect.x;
        const dy = ty - enemy.rect.y;
        const len = Math.hypot(dx, dy);
        if (len < 1) {
            enemy.rect.body.setVelocity(0, 0);
            return 0;
        }
        enemy.rect.body.setVelocity((dx / len) * speed, (dy / len) * speed);
        return len;
    }

    randomPatrolTarget(enemy) {
        const margin = CONFIG.WORLD_MARGIN;
        for (let i = 0; i < 40; i++) {
            const a = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
            const r = Phaser.Math.Between(30, CONFIG.ENEMY_PATROL_RADIUS);
            const x = Phaser.Math.Clamp(enemy.home.x + Math.cos(a) * r, margin, CONFIG.WORLD_WIDTH - margin);
            const y = Phaser.Math.Clamp(enemy.home.y + Math.sin(a) * r, margin, CONFIG.WORLD_HEIGHT - margin);
            if (!this.overlapsWalls(x, y)) {
                return new Phaser.Math.Vector2(x, y);
            }
        }
        const cell = this.randomFreeCell();
        if (cell) {
            return new Phaser.Math.Vector2(cell.x, cell.y);
        }
        return enemy.patrolTarget || new Phaser.Math.Vector2(enemy.home.x, enemy.home.y);
    }

    randomPointFarFromPlayer() {
        const margin = CONFIG.SPAWN_MARGIN;
        for (let i = 0; i < 120; i++) {
            const x = Phaser.Math.Between(margin, CONFIG.WORLD_WIDTH - margin);
            const y = Phaser.Math.Between(margin, CONFIG.WORLD_HEIGHT - margin);
            if (Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y) < CONFIG.MIN_SPAWN_DIST) continue;
            if (this.overlapsWalls(x, y)) continue;
            if (this.distanceToNearestEnemy(x, y) < CONFIG.ENEMY_MIN_SPAWN_DIST) continue;
            return new Phaser.Math.Vector2(x, y);
        }
        for (let i = 0; i < 40; i++) {
            const cell = this.randomFreeCell();
            if (!cell) break;
            if (Phaser.Math.Distance.Between(cell.x, cell.y, this.player.x, this.player.y) < CONFIG.MIN_SPAWN_DIST) continue;
            if (this.distanceToNearestEnemy(cell.x, cell.y) < CONFIG.ENEMY_MIN_SPAWN_DIST) continue;
            return new Phaser.Math.Vector2(cell.x, cell.y);
        }
        const cell = this.randomFreeCell();
        return new Phaser.Math.Vector2(cell.x, cell.y);
    }

    distanceToNearestEnemy(x, y) {
        let min = Infinity;
        for (const enemy of this.enemies) {
            const d = Phaser.Math.Distance.Between(x, y, enemy.rect.x, enemy.rect.y);
            if (d < min) min = d;
        }
        return min;
    }

    randomFreeCell() {
        if (!this.nav || this.nav.freeCells.length === 0) return null;
        const cells = this.nav.freeCells;
        return cells[Phaser.Math.Between(0, cells.length - 1)];
    }

    overlapsWalls(x, y) {
        const half = 16 + CONFIG.WALL_PADDING;
        for (const w of this.wallRects) {
            const left = w.x - w.width / 2;
            const right = w.x + w.width / 2;
            const top = w.y - w.height / 2;
            const bottom = w.y + w.height / 2;
            if (x + half > left && x - half < right && y + half > top && y - half < bottom) {
                return true;
            }
        }
        return false;
    }

    startAttack() {
        const pointer = this.input.activePointer;
        const world = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const dx = world.x - this.player.x;
        const dy = world.y - this.player.y;
        this.aimAngle = (Math.abs(dx) < 1 && Math.abs(dy) < 1)
            ? Math.atan2(this.facing.y, this.facing.x)
            : Math.atan2(dy, dx);

        this.attacking = true;
        this.attackTimer = CONFIG.ATTACK_DURATION;
        this.attackCooldown = CONFIG.ATTACK_COOLDOWN;
        this.attackHitSet = new Set();
        this.drawAttackArc();
    }

    updateAttack() {
        if (!this.attacking || this.victory || this.gameOver) return;

        const targets = [...this.enemies];
        for (const enemy of targets) {
            if (this.attackHitSet.has(enemy)) continue;
            if (!this.enemyTouchesSector(enemy)) continue;

            this.attackHitSet.add(enemy);
            enemy.hp -= 1;
            if (enemy.hp <= 0) {
                this.onEnemyKilled(enemy);
            } else {
                this.updateEnemyHpText(enemy);
            }
            if (this.victory || this.gameOver) break;
        }
    }

    inAttackSector(x, y) {
        const dx = x - this.player.x;
        const dy = y - this.player.y;
        if (Math.hypot(dx, dy) > CONFIG.ATTACK_RADIUS) return false;
        const angle = Math.atan2(dy, dx);
        return Math.abs(Phaser.Math.Angle.Wrap(this.aimAngle - angle)) <= CONFIG.ATTACK_HALF_ANGLE;
    }

    enemyTouchesSector(enemy) {
        const half = enemy.rect.width / 2;
        const left = enemy.rect.x - half;
        const right = enemy.rect.x + half;
        const top = enemy.rect.y - half;
        const bottom = enemy.rect.y + half;

        if (
            this.player.x >= left && this.player.x <= right &&
            this.player.y >= top && this.player.y <= bottom
        ) {
            return true;
        }

        const corners = [
            [left, top],
            [right, top],
            [right, bottom],
            [left, bottom]
        ];
        for (const [cx, cy] of corners) {
            if (this.inAttackSector(cx, cy)) return true;
        }

        const from = this.aimAngle - CONFIG.ATTACK_HALF_ANGLE;
        const to = this.aimAngle + CONFIG.ATTACK_HALF_ANGLE;
        const steps = 12;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const arcAngle = from + (to - from) * t;
            const arcX = this.player.x + Math.cos(arcAngle) * CONFIG.ATTACK_RADIUS;
            const arcY = this.player.y + Math.sin(arcAngle) * CONFIG.ATTACK_RADIUS;
            if (arcX >= left && arcX <= right && arcY >= top && arcY <= bottom) return true;

            for (const a of [from, to]) {
                const rayX = this.player.x + Math.cos(a) * CONFIG.ATTACK_RADIUS * t;
                const rayY = this.player.y + Math.sin(a) * CONFIG.ATTACK_RADIUS * t;
                if (rayX >= left && rayX <= right && rayY >= top && rayY <= bottom) return true;
            }
        }

        return false;
    }

    onEnemyKilled(enemy) {
        this.xp += CONFIG.XP_PER_KILL;
        this.respawnEnemy(enemy);
        this.checkLevelUp();
        this.updateHud();
    }

    checkLevelUp() {
        if (this.victory || this.gameOver) return;
        while (this.xp >= CONFIG.XP_PER_LEVEL) {
            this.xp -= CONFIG.XP_PER_LEVEL;
            this.playerLevel += 1;
            this.playerMaxHp += CONFIG.HEARTS_PER_LEVEL;
            this.playerHp = this.playerMaxHp;
            if (this.playerLevel >= CONFIG.MAX_LEVEL) {
                this.triggerVictory();
                return;
            }
for (let i = 0; i < CONFIG.ENEMIES_PER_LEVEL; i++) {
                this.createEnemy();
            }
            this.updateHud();
        }
    }

    triggerVictory() {
        this.victory = true;
        this.player.body.setVelocity(0, 0);
        for (const enemy of this.enemies) enemy.rect.body.setVelocity(0, 0);
        this.updateHud();
    }

    respawnEnemy(enemy) {
        enemy.hp = CONFIG.ENEMY_MAX_HP;
        const pos = this.randomPointFarFromPlayer();
        enemy.rect.setPosition(pos.x, pos.y);
        enemy.rect.body.reset(pos.x, pos.y);
        enemy.home.set(pos.x, pos.y);
        enemy.mode = 'patrol';
        enemy.patrolTarget = this.randomPatrolTarget(enemy);
        enemy.path = this.findGoalPath(enemy, enemy.patrolTarget.x, enemy.patrolTarget.y);
        enemy.pathIndex = 0;
        enemy.pathTimer = 0;
        enemy.lastCell = null;
        enemy.lastX = pos.x;
        enemy.lastY = pos.y;
        enemy.stuckTimer = 0;
        this.updateEnemyHpText(enemy);
    }

    damagePlayer() {
        if (this.playerInvuln > 0 || this.victory) return;
        this.playerHp = Math.max(0, this.playerHp - 1);
        this.playerInvuln = CONFIG.PLAYER_INVULN_TIME;
        if (this.playerHp <= 0) {
            this.gameOver = true;
            this.player.body.setVelocity(0, 0);
            for (const enemy of this.enemies) enemy.rect.body.setVelocity(0, 0);
        }
        this.updateHud();
    }

    drawAttackArc() {
        const g = this.attackArc;
        g.clear();
        g.setVisible(true);
        g.fillStyle(0xffd43b, 0.45);
        g.beginPath();
        g.moveTo(this.player.x, this.player.y);
        g.arc(
            this.player.x,
            this.player.y,
            CONFIG.ATTACK_RADIUS,
            this.aimAngle - CONFIG.ATTACK_HALF_ANGLE,
            this.aimAngle + CONFIG.ATTACK_HALF_ANGLE,
            false
        );
        g.closePath();
        g.fillPath();
    }

    updateHud() {
        let text = `Vida: ${this.hearts(this.playerMaxHp, this.playerHp)}\nNivel: ${this.playerLevel}\nXP: ${this.xp}`;
        if (this.victory) text += '\nVICTORIA: presiona R para reiniciar';
        else if (this.gameOver) text += '\nDERROTA: presiona R para reiniciar';
        this.hud.setText(text);
    }

    updateEnemyHpText(enemy) {
        enemy.hpText.setText(this.hearts(CONFIG.ENEMY_MAX_HP, enemy.hp));
        enemy.hpText.setPosition(enemy.rect.x, enemy.rect.y - 26);
    }

    hearts(max, current) {
        return '♥'.repeat(current) + '♡'.repeat(max - current);
    }
}

const config = {
    type: Phaser.AUTO,
    width: CONFIG.WIDTH,
    height: CONFIG.HEIGHT,
    backgroundColor: '#222222',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [GameScene]
};

new Phaser.Game(config);