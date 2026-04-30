import ArchonBoss from './ArchonBoss.js';

// Sabaoth — Archon VI, "Lord of Forces", element Storm. Act II boss.
// Hovering storm-king who rides the chaos winds.
// Phase 0: single aimed lightning bolt.
// Phase 1: alternates a 3-bolt fan and a "strike from above" — Sabaoth
//   teleports above the player, telegraphs with a glowing rune, then drops
//   a vertical bolt.
// Phase 2: alternates faster fan + strike, and casts a horizontal gale —
//   a wide low-flying shockwave that sweeps across the arena.
export default class Sabaoth extends ArchonBoss {
  constructor(scene, x, y, config) {
    super(scene, x, y, config);
    this.setOrigin(0.5, 0.5);
    this.body.setAllowGravity(false);
    this.setVelocity(0, 0);

    this._stormAura = scene.add.particles(0, 0, 'spark', {
      follow: this,
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.75, end: 0 },
      speed: { min: 30, max: 110 },
      angle: { min: 0, max: 360 },
      tint: [0x60a0ff, 0xa0e0ff, 0x4080c0, 0xffffff],
      lifespan: 580,
      frequency: 55,
      blendMode: 'ADD',
    });
    this._stormAura.setDepth(this.depth - 1);

    this._lastAttack = 'none';
    this._teleporting = false;
    this._anchorY = y;
    this._bobT = 0;
  }

  _onActivate() {
    this.scene.cameras.main.shake(280, 0.009);
    this.scene.cameras.main.flash(260, 160, 200, 255);
    this._showNamePlate();
  }

  _onPhaseChange(phase) {
    this.isInvulnerable = true;
    this.setTint(0xa0e0ff);
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
        color: '#a0e0ff', stroke: '#000', strokeThickness: 3,
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
    this._bobT += delta;
    if (!this._teleporting) {
      this.y = this._anchorY + Math.sin(this._bobT / 320) * 5;
    }

    const player = this.scene.player;
    if (!player) return;
    if (!this._teleporting) this.setFlipX(player.x < this.x);

    if (this._teleporting || this.attackCooldown > 0) return;

    if (this.phaseIndex === 0) {
      this._lightningBolt(player, 1);
    } else if (this.phaseIndex === 1) {
      if (this._lastAttack === 'fan') this._strikeFromAbove(player);
      else this._lightningBolt(player, 3);
    } else {
      if (this._lastAttack === 'gale') this._lightningBolt(player, 5);
      else if (this._lastAttack === 'strike') this._gale(player);
      else this._strikeFromAbove(player);
    }
  }

  _lightningBolt(player, count = 1) {
    this._lastAttack = 'fan';
    this.attackCooldown = this.phaseIndex === 2 ? 700 : 1100;
    this.setFrame(1);
    this.scene.time.delayedCall(180, () => { if (!this.isDead) this.setFrame(0); });

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const baseAngle = Math.atan2(dy, dx);
    const speed = this.phaseIndex === 2 ? 220 : 190;

    for (let i = 0; i < count; i++) {
      const spread = (i - (count - 1) / 2) * 0.22;
      this._spawnBolt(this.x, this.y, baseAngle + spread, speed);
    }
  }

  _strikeFromAbove(player) {
    this._lastAttack = 'strike';
    this._teleporting = true;
    this.attackCooldown = this.phaseIndex === 2 ? 700 : 1000;

    const arena = this.scene._bossSpec;
    const minX = arena.arenaX + 36;
    const maxX = arena.arenaX + arena.arenaWidth - 36;
    const targetX = Phaser.Math.Clamp(player.x, minX, maxX);
    const targetY = 80;

    // Fade out at current spot.
    const oldX = this.x, oldY = this.y;
    this.scene.tweens.add({
      targets: this, alpha: 0, duration: 180,
      onComplete: () => {
        if (this.isDead) return;
        const ghost = this.scene.add.particles(oldX, oldY, 'spark', {
          scale: { start: 0.9, end: 0 },
          speed: { min: 30, max: 100 },
          alpha: { start: 0.85, end: 0 },
          lifespan: 380,
          quantity: 8,
          emitting: false,
          tint: [0xa0e0ff, 0x60a0ff, 0xffffff],
          blendMode: 'ADD',
        });
        ghost.explode(8);
        this.scene.time.delayedCall(450, () => ghost.destroy());

        this.x = targetX;
        this.y = targetY;
        this._anchorY = targetY;

        this.scene.tweens.add({
          targets: this, alpha: 1, duration: 200,
          onComplete: () => {
            // Telegraph rune below — vertical column glow.
            const tele = this.scene.add.rectangle(targetX, 200, 18, 240,
              0x80c0ff, 0.18).setDepth(2);
            this.scene.tweens.add({
              targets: tele, alpha: 0.45, scaleX: 1.4,
              yoyo: true, repeat: 2, duration: 140,
              onComplete: () => tele.destroy(),
            });

            this.scene.time.delayedCall(520, () => {
              if (this.isDead) { this._teleporting = false; return; }
              // Drop a vertical lightning bolt straight down.
              this._spawnBolt(this.x, this.y + 8, Math.PI / 2,
                this.phaseIndex === 2 ? 320 : 260);
              this.scene.cameras.main.shake(140, 0.007);
              this.scene.cameras.main.flash(120, 220, 240, 255);
              this._teleporting = false;
            });
          },
        });
      },
    });
  }

  _gale(player) {
    this._lastAttack = 'gale';
    this.attackCooldown = 1100;
    this.setFrame(1);
    this.scene.time.delayedCall(220, () => { if (!this.isDead) this.setFrame(0); });

    const dir = player.x < this.x ? -1 : 1;
    const arena = this.scene._bossSpec;
    const startX = this.x + dir * 22;
    const gust = this.scene.physics.add.image(startX, 224, 'lightning_bolt')
      .setScale(2.4, 1.4);
    gust.body.setAllowGravity(false);
    gust.body.setSize(20, 14);
    gust.setVelocity(dir * 200, 0);
    gust.setTint(0xa0e0ff);
    gust.setAlpha(0.85);
    gust.touchDamage = 1;
    gust.lifespan = (arena.arenaWidth / 200) * 1000 + 400;

    this.scene.tweens.add({
      targets: gust, scaleY: 1.7, alpha: 0.55,
      yoyo: true, repeat: -1, duration: 140,
    });

    const trail = this.scene.add.particles(0, 0, 'spark', {
      follow: gust,
      scale: { start: 0.7, end: 0 },
      alpha: { start: 0.7, end: 0 },
      speed: { min: 10, max: 50 },
      tint: [0x60a0ff, 0xa0e0ff, 0xffffff],
      lifespan: 380, frequency: 25, blendMode: 'ADD',
    });
    gust.on('destroy', () => trail.destroy());

    this.scene.cameras.main.shake(160, 0.005);
    this.scene.enemyProjectiles.add(gust);
  }

  _spawnBolt(x, y, angle, speed) {
    const fb = this.scene.physics.add.image(x, y, 'lightning_bolt')
      .setScale(1.1);
    fb.body.setAllowGravity(false);
    fb.body.setSize(10, 10);
    fb.setRotation(angle);
    fb.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    fb.touchDamage = 1;
    fb.lifespan = 2400;

    this.scene.tweens.add({
      targets: fb, scale: 1.4, alpha: 0.7,
      yoyo: true, repeat: -1, duration: 90,
    });

    const trail = this.scene.add.particles(0, 0, 'spark', {
      follow: fb,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.85, end: 0 },
      speed: { min: 5, max: 25 },
      tint: [0x60a0ff, 0xa0e0ff, 0xffffff],
      lifespan: 320, frequency: 35, blendMode: 'ADD',
    });
    fb.on('destroy', () => trail.destroy());

    this.scene.enemyProjectiles.add(fb);
  }

  _onDeath() {
    this._stormAura?.destroy();
  }
}
