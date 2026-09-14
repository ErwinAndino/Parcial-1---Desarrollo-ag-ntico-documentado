import Phaser from 'phaser';

const CONFIG = {
    WIDTH: 800,
    HEIGHT: 600,
    PLAYER_SPEED: 200,
    PLAYER_MAX_HP: 3,
    ENEMY_MAX_HP: 3,
    XP_PER_KILL: 5,
    ATTACK_RADIUS: 70,
    ATTACK_HALF_ANGLE: Phaser.Math.DegToRad(50),
    ATTACK_DURATION: 250,
    ATTACK_COOLDOWN: 600,
    ENEMY_AGGRO_RANGE: 140,
    ENEMY_PATROL_SPEED: 50,
    ENEMY_CHASE_SPEED: 130,
    ENEMY_PATROL_RADIUS: 90,
    PLAYER_INVULN_TIME: 1200
};

class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }

    create() {
        this.physics.world.setBounds(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        this.player = this.add.rectangle(400, 400, 32, 32, 0x4dabf7);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.enemy = this.add.rectangle(200, 200, 32, 32, 0xff6b6b);
        this.physics.add.existing(this.enemy);
        this.enemy.body.setCollideWorldBounds(true);
        this.enemyHpText = this.add.text(this.enemy.x, this.enemy.y - 26, '', {
            fontSize: '16px',
            color: '#ff8c8c',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.attackArc = this.add.graphics();

        this.hud = this.add.text(16, 16, '', {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'monospace'
        });

        this.cursors = this.input.keyboard.addKeys('W,A,S,D');
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.playerHp = CONFIG.PLAYER_MAX_HP;
        this.enemyHp = CONFIG.ENEMY_MAX_HP;
        this.xp = 0;

        this.enemyHome = new Phaser.Math.Vector2(this.enemy.x, this.enemy.y);
        this.enemyMode = 'patrol';
        this.enemyPatrolTarget = this.randomPatrolTarget();

        this.facing = new Phaser.Math.Vector2(0, 1);
        this.aimAngle = 0;
        this.attacking = false;
        this.attackTimer = 0;
        this.attackCooldown = 0;
        this.attackHit = false;
        this.playerInvuln = 0;
        this.gameOver = false;

        this.updateHud();
        this.updateEnemyHpText();

        this.input.on('pointerdown', (pointer) => {
            if (this.gameOver || this.attacking) return;
            if (!pointer.leftButtonDown() || this.attackCooldown > 0) return;
            this.startAttack();
        });

        this.physics.add.overlap(this.player, this.enemy, () => this.damagePlayer());
    }

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
            this.scene.restart();
            return;
        }

        if (this.gameOver) {
            this.player.body.setVelocity(0, 0);
            this.enemy.body.setVelocity(0, 0);
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
        this.updateEnemy();
        this.updateAttack();
        this.updateHud();
        this.updateEnemyHpText();
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

    updateEnemy() {
        const distToPlayer = Phaser.Math.Distance.Between(
            this.enemy.x, this.enemy.y, this.player.x, this.player.y
        );

        if (distToPlayer <= CONFIG.ENEMY_AGGRO_RANGE) {
            this.enemyMode = 'chase';
            const dir = new Phaser.Math.Vector2(
                this.player.x - this.enemy.x,
                this.player.y - this.enemy.y
            ).normalize();
            this.enemy.body.setVelocity(
                dir.x * CONFIG.ENEMY_CHASE_SPEED,
                dir.y * CONFIG.ENEMY_CHASE_SPEED
            );
            return;
        }

        if (this.enemyMode === 'chase') this.enemyMode = 'patrol';

        const distToTarget = Phaser.Math.Distance.Between(
            this.enemy.x, this.enemy.y,
            this.enemyPatrolTarget.x, this.enemyPatrolTarget.y
        );
        if (distToTarget < 8) this.enemyPatrolTarget = this.randomPatrolTarget();

        const dir = new Phaser.Math.Vector2(
            this.enemyPatrolTarget.x - this.enemy.x,
            this.enemyPatrolTarget.y - this.enemy.y
        ).normalize();
        this.enemy.body.setVelocity(
            dir.x * CONFIG.ENEMY_PATROL_SPEED,
            dir.y * CONFIG.ENEMY_PATROL_SPEED
        );
    }

    randomPatrolTarget() {
        const a = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
        const r = Phaser.Math.Between(30, CONFIG.ENEMY_PATROL_RADIUS);
        const x = Phaser.Math.Clamp(this.enemyHome.x + Math.cos(a) * r, 40, CONFIG.WIDTH - 40);
        const y = Phaser.Math.Clamp(this.enemyHome.y + Math.sin(a) * r, 40, CONFIG.HEIGHT - 40);
        return new Phaser.Math.Vector2(x, y);
    }

    startAttack() {
        const pointer = this.input.activePointer;
        const dx = pointer.x - this.player.x;
        const dy = pointer.y - this.player.y;
        this.aimAngle = (Math.abs(dx) < 1 && Math.abs(dy) < 1)
            ? Math.atan2(this.facing.y, this.facing.x)
            : Math.atan2(dy, dx);

        this.attacking = true;
        this.attackTimer = CONFIG.ATTACK_DURATION;
        this.attackCooldown = CONFIG.ATTACK_COOLDOWN;
        this.attackHit = false;
        this.drawAttackArc();
    }

    updateAttack() {
        if (!this.attacking || this.attackHit) return;

        const toEnemy = new Phaser.Math.Vector2(
            this.enemy.x - this.player.x,
            this.enemy.y - this.player.y
        );
        const dist = toEnemy.length();
        if (dist > CONFIG.ATTACK_RADIUS) return;

        const enemyAngle = Math.atan2(toEnemy.y, toEnemy.x);
        const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(this.aimAngle - enemyAngle));
        if (angleDiff > CONFIG.ATTACK_HALF_ANGLE) return;

        this.attackHit = true;
        this.enemyHp -= 1;
        if (this.enemyHp <= 0) {
            this.onEnemyKilled();
        } else {
            this.updateEnemyHpText();
        }
    }

    onEnemyKilled() {
        this.xp += CONFIG.XP_PER_KILL;
        this.respawnEnemy();
        this.updateHud();
    }

    respawnEnemy() {
        this.enemyHp = CONFIG.ENEMY_MAX_HP;
        const x = Phaser.Math.Between(80, CONFIG.WIDTH - 80);
        const y = Phaser.Math.Between(80, CONFIG.HEIGHT - 80);
        this.enemy.setPosition(x, y);
        this.enemy.body.reset(x, y);
        this.enemyHome.set(x, y);
        this.enemyMode = 'patrol';
        this.enemyPatrolTarget = this.randomPatrolTarget();
        this.updateEnemyHpText();
    }

    damagePlayer() {
        if (this.playerInvuln > 0) return;
        this.playerHp = Math.max(0, this.playerHp - 1);
        this.playerInvuln = CONFIG.PLAYER_INVULN_TIME;
        if (this.playerHp <= 0) {
            this.gameOver = true;
            this.player.body.setVelocity(0, 0);
            this.enemy.body.setVelocity(0, 0);
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
        let text = `Vida: ${this.hearts(CONFIG.PLAYER_MAX_HP, this.playerHp)}\nXP: ${this.xp}`;
        if (this.gameOver) text += '\nDERROTA: presiona R para reiniciar';
        this.hud.setText(text);
    }

    updateEnemyHpText() {
        this.enemyHpText.setText(this.hearts(CONFIG.ENEMY_MAX_HP, this.enemyHp));
        this.enemyHpText.setPosition(this.enemy.x, this.enemy.y - 26);
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