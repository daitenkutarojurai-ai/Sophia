import ArchonBoss from './ArchonBoss.js';

// Ariouth — Archon IV, "The Devourer", element Earth. Act 1 boss.
// Heavy ground-bound brute. Stays at ground level; teaches jumps + dashes.
// Phase 0: ground stomp → 3 falling rocks.
// Phase 1: shockwave (low-flying boulder that travels along the floor).
// Phase 2: triple stomp combo + boulder, alternating.
export default class Ariouth extends ArchonBoss {
  constructor(scene, x, y, config) {
    super(scene, x, y, config);
    this.setOrigin(0.5, 1);

    this._dustAura = scene.add.particles(0, 0, 'spark', {
      follow: this,
      followOffset: { x: 0, y: 14 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.55, end: 0 },
      speed: { min: 5, max: 30 },
      angle: { min: 200, max: 340 },
      tint: [0x806030, 0xa08040, 0x604020],
      lifespan: 500,
      frequency: 90,
    });
    this._dustAura.setDepth(this.depth - 1);

    this._lastAttack = 'none';
    this._stomping = false;
  }

  _onActivate() {
    this.scene.cameras.main.shake(260, 0.008);
    this.scene.cameras.main.flash(220, 200, 160, 80);
    this._showNamePlate();
  }

  _onPhaseChange(phase) {
    this.isInvulnerable = true;
    this.setTint(0xc0a060);
    this.scene.cameras.main.shake(180, 0.006);
    this.scene.time.delayedCall(380, () => {
      if (!this.isDead) {
        this.clearTint();
        this.isInvulnerable = false;
      }
    });
    if (phase >= 1) this.attackCooldown = 600;
  }

  _showNamePlate() {
    const cam = this.scene.cameras.main;
    const t = this.scene.add.text(cam.width / 2, 70,
      `${this.bossName.toUpperCase()}\n— ${this.bossTitle} —`, {
        fontFamily: 'monospace', fontSize: '14px',
        color: '#c0a060', stroke: '#000', strokeThickness: 3,
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(150)
      .setAlpha(0);
    this.scene.tweens.add({
      targets: t, alpha: 1, duration: 300,
      onComplete: () => {
        this.scene.time.delayedCall(1500, () => {
          this.scene.tweens.add({
            targets: t, alpha: 0, duration: 500,
            onComplete: () => t.destroy(),
          });
        });
      },
    });
  }

  _runAI(_time, _delta) {
    if (this._stomping) return;

    const player = this.scene.player;
    if (!player) return;
    this.setFlipX(player.x < this.x);

    if (this.attackCooldown > 0) {
      this.setVelocityX(0);
      return;
    }

    if (this.phaseIndex === 0) {
      this._stomp(3);
    } else if (this.phaseIndex === 1) {
      if (this._lastAttack === 'stomp') this._boulder(player);
      else this._stomp(3);
    } else {
      if (this._lastAttack === 'boulder') this._stomp(5);
      else this._boulder(player);
    }
  }

  _stomp(rockCount) {
    this._lastAttack = 'stomp';
    this._stomping = true;
    this.attackCooldown = this.phaseIndex === 2 ? 900 : 1300;
    this.setFrame(1);

    // Brief crouch then leap up.
    this.setVelocityY(-260);
    this.scene.cameras.main.shake(80, 0.003);

    // After leap apex, slam down and spawn rocks.
    this.scene.time.delayedCall(380, () => {
      if (this.isDead) return;
      this.setVelocityY(220);
      this.scene.time.delayedCall(280, () => {
        if (this.isDead) return;
        this.setFrame(0);
        this._stomping = false;
        this.scene.cameras.main.shake(180, 0.012);

        // Spawn falling rocks across the arena.
        const arena = this.scene._bossSpec;
        const minX = arena.arenaX + 30;
        const maxX = arena.arenaX + arena.arenaWidth - 30;
        for (let i = 0; i < rockCount; i++) {
          const rx = Phaser.Math.Between(minX, maxX);
          this.scene.time.delayedCall(i * 90, () => {
            if (this.isDead) return;
            this._spawnFallingRock(rx);
          });
        }
      });
    });
  }

  _spawnFallingRock(x) {
    const rock = this.scene.physics.add.image(x, 20, 'rock_shard')
      .setScale(1.1);
    rock.body.setAllowGravity(true);
    rock.body.setGravityY(180);
    rock.body.setSize(10, 10);
    rock.touchDamage = 1;
    rock.lifespan = 3500;

    this.scene.tweens.add({
      targets: rock, angle: 360,
      repeat: -1, duration: 700,
    });

    this.scene.enemyProjectiles.add(rock);
  }

  _boulder(player) {
    this._lastAttack = 'boulder';
    this.attackCooldown = this.phaseIndex === 2 ? 800 : 1200;
    this.setFrame(1);
    this.scene.time.delayedCall(220, () => { if (!this.isDead) this.setFrame(0); });

    const dir = player.x < this.x ? -1 : 1;
    const boulder = this.scene.physics.add.image(this.x + dir * 22, this.y - 18, 'rock_shard')
      .setScale(1.7);
    boulder.body.setAllowGravity(false);
    boulder.body.setSize(14, 14);
    boulder.setVelocity(dir * (this.phaseIndex === 2 ? 200 : 160), 0);
    boulder.touchDamage = 1;
    boulder.lifespan = 2800;

    this.scene.tweens.add({
      targets: boulder, angle: dir * 360,
      repeat: -1, duration: 600,
    });

    const trail = this.scene.add.particles(0, 0, 'spark', {
      follow: boulder,
      scale: { start: 0.55, end: 0 },
      alpha: { start: 0.7, end: 0 },
      speed: { min: 5, max: 20 },
      tint: [0xa08040, 0x806030, 0x402010],
      lifespan: 360, frequency: 50,
    });
    boulder.on('destroy', () => trail.destroy());

    this.scene.enemyProjectiles.add(boulder);
  }

  _onDeath() {
    this._dustAura?.destroy();
  }
}
