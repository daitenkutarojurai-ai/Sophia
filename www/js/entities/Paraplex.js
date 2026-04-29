import ArchonBoss from './ArchonBoss.js';

// Paraplex — Archon II, "The Confuser", element Shadow. Act 1 boss.
// Phase 0: single shadow bolt aimed at Sophia.
// Phase 1: blink-teleports across the arena, then double bolt.
// Phase 2: faster blinks + 5-bolt fan spread, alternating.
export default class Paraplex extends ArchonBoss {
  constructor(scene, x, y, config) {
    super(scene, x, y, config);
    this.setOrigin(0.5, 0.5);

    this._shadowAura = scene.add.particles(0, 0, 'spark', {
      follow: this,
      scale: { start: 0.55, end: 0 },
      alpha: { start: 0.7, end: 0 },
      speed: { min: 20, max: 70 },
      angle: { min: 0, max: 360 },
      tint: [0x3010a0, 0x6040c0, 0x100040, 0x8060ff],
      lifespan: 620,
      frequency: 70,
      blendMode: 'ADD',
    });
    this._shadowAura.setDepth(this.depth - 1);

    this.body.setAllowGravity(false);
    this.setVelocity(0, 0);
    this._teleporting = false;
    this._lastAttack = 'none';
    this._bobBase = y;
    this._bobT = 0;
  }

  _onActivate() {
    this.scene.cameras.main.shake(220, 0.006);
    this.scene.cameras.main.flash(220, 80, 30, 200);
    this._showNamePlate();
  }

  _onPhaseChange(phase) {
    this.isInvulnerable = true;
    this.setTint(0xa080ff);
    this.scene.cameras.main.shake(160, 0.005);
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
        color: '#a080ff', stroke: '#000', strokeThickness: 3,
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

  _runAI(_time, delta) {
    // Hover bob — Paraplex floats.
    this._bobT += delta;
    this.y = this._bobBase + Math.sin(this._bobT / 320) * 6;

    if (this._teleporting) return;

    const player = this.scene.player;
    if (!player) return;
    this.setFlipX(player.x < this.x);

    if (this.attackCooldown > 0) return;

    if (this.phaseIndex === 0) {
      this._shadowBolt(player, 1);
    } else if (this.phaseIndex === 1) {
      if (this._lastAttack === 'bolt') this._teleport();
      else this._shadowBolt(player, 2);
    } else {
      if (this._lastAttack === 'teleport') this._shadowBolt(player, 5);
      else this._teleport();
    }
  }

  _shadowBolt(player, count = 1) {
    this._lastAttack = 'bolt';
    this.attackCooldown = this.phaseIndex === 2 ? 700 : 1100;
    this.setFrame(1);
    this.scene.time.delayedCall(180, () => { if (!this.isDead) this.setFrame(0); });

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const baseAngle = Math.atan2(dy, dx);
    const speed = this.phaseIndex === 2 ? 200 : 170;

    for (let i = 0; i < count; i++) {
      const spread = (i - (count - 1) / 2) * 0.22;
      const a = baseAngle + spread;
      const fb = this.scene.physics.add.image(this.x, this.y, 'shadow_bolt')
        .setScale(1.1);
      fb.body.setAllowGravity(false);
      fb.body.setSize(10, 10);
      fb.setVelocity(Math.cos(a) * speed, Math.sin(a) * speed);
      fb.touchDamage = 1;
      fb.lifespan = 2400;

      this.scene.tweens.add({
        targets: fb, scale: 1.35,
        yoyo: true, repeat: -1, duration: 130,
      });

      const trail = this.scene.add.particles(0, 0, 'spark', {
        follow: fb,
        scale: { start: 0.5, end: 0 },
        alpha: { start: 0.8, end: 0 },
        speed: { min: 5, max: 25 },
        tint: [0x6040c0, 0x8060ff, 0x100040],
        lifespan: 360, frequency: 45, blendMode: 'ADD',
      });
      fb.on('destroy', () => trail.destroy());

      this.scene.enemyProjectiles.add(fb);
    }
  }

  _teleport() {
    this._lastAttack = 'teleport';
    this._teleporting = true;
    this.attackCooldown = this.phaseIndex === 2 ? 500 : 800;

    const arena = this.scene._bossSpec;
    const minX = arena.arenaX + 40;
    const maxX = arena.arenaX + arena.arenaWidth - 40;
    const newX = Phaser.Math.Between(minX, maxX);
    const newY = Phaser.Math.Between(140, 210);

    // Fade out at current spot.
    const fadeMs = 220;
    const oldX = this.x, oldY = this.y;
    this.scene.tweens.add({
      targets: this, alpha: 0, duration: fadeMs,
      onComplete: () => {
        if (this.isDead) return;
        // Burst at old position.
        const ghost = this.scene.add.particles(oldX, oldY, 'spark', {
          scale: { start: 0.8, end: 0 },
          speed: { min: 30, max: 90 },
          alpha: { start: 0.9, end: 0 },
          lifespan: 350,
          quantity: 8,
          emitting: false,
          tint: [0x8060ff, 0x4020a0, 0xffffff],
          blendMode: 'ADD',
        });
        ghost.explode(8);
        this.scene.time.delayedCall(400, () => ghost.destroy());

        this.x = newX;
        this.y = newY;
        this._bobBase = newY;

        this.scene.tweens.add({
          targets: this, alpha: 1, duration: fadeMs,
          onComplete: () => { this._teleporting = false; },
        });
      },
    });
  }

  _onDeath() {
    this._shadowAura?.destroy();
  }
}
