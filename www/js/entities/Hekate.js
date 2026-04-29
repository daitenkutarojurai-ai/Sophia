import ArchonBoss from './ArchonBoss.js';

// Hekate — Archon III, "The Triple-Faced", element Illusion. Act 1 boss.
// Phase 0: triple mirror-orb fan aimed at Sophia.
// Phase 1: spawns one cosmetic decoy that fires harmless orbs;
//   Hekate strafes between two anchor points.
// Phase 2: two decoys + rotating triple-orb burst from the real Hekate.
export default class Hekate extends ArchonBoss {
  constructor(scene, x, y, config) {
    super(scene, x, y, config);
    this.setOrigin(0.5, 0.5);
    this.body.setAllowGravity(false);
    this.setVelocity(0, 0);

    this._mirrorAura = scene.add.particles(0, 0, 'spark', {
      follow: this,
      scale: { start: 0.55, end: 0 },
      alpha: { start: 0.7, end: 0 },
      speed: { min: 15, max: 60 },
      angle: { min: 0, max: 360 },
      tint: [0x40c0e0, 0x80ffff, 0x103060, 0xffffff],
      lifespan: 540,
      frequency: 70,
      blendMode: 'ADD',
    });
    this._mirrorAura.setDepth(this.depth - 1);

    this._lastAttack = 'none';
    this._strafeT = 0;
    this._anchorY = y;
    this._decoys = [];
  }

  _onActivate() {
    this.scene.cameras.main.shake(220, 0.006);
    this.scene.cameras.main.flash(220, 120, 220, 240);
    this._showNamePlate();
  }

  _onPhaseChange(phase) {
    this.isInvulnerable = true;
    this.setTint(0x80ffff);
    this.scene.cameras.main.shake(160, 0.005);
    this.scene.time.delayedCall(380, () => {
      if (!this.isDead) {
        this.clearTint();
        this.isInvulnerable = false;
      }
    });
    if (phase === 1) this._spawnDecoy(1);
    if (phase === 2) this._spawnDecoy(2);
    if (phase >= 1) this.attackCooldown = 600;
  }

  _showNamePlate() {
    const cam = this.scene.cameras.main;
    const t = this.scene.add.text(cam.width / 2, 70,
      `${this.bossName.toUpperCase()}\n— ${this.bossTitle} —`, {
        fontFamily: 'monospace', fontSize: '14px',
        color: '#80ffff', stroke: '#000', strokeThickness: 3,
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
    // Strafe horizontally inside arena.
    if (this.phaseIndex >= 1) {
      this._strafeT += delta;
      const arena = this.scene._bossSpec;
      const cx = arena.arenaX + arena.arenaWidth / 2;
      const halfRange = arena.arenaWidth * 0.32;
      this.x = cx + Math.sin(this._strafeT / 700) * halfRange;
    }
    this.y = this._anchorY + Math.sin(this._strafeT / 320) * 4;

    const player = this.scene.player;
    if (!player) return;
    this.setFlipX(player.x < this.x);

    if (this.attackCooldown > 0) return;

    if (this.phaseIndex === 0) {
      this._mirrorFan(player, 3);
    } else if (this.phaseIndex === 1) {
      this._mirrorFan(player, 3);
    } else {
      if (this._lastAttack === 'fan') this._rotaryBurst();
      else this._mirrorFan(player, 5);
    }
  }

  _mirrorFan(player, count = 3) {
    this._lastAttack = 'fan';
    this.attackCooldown = this.phaseIndex === 2 ? 750 : 1100;
    this.setFrame(1);
    this.scene.time.delayedCall(180, () => { if (!this.isDead) this.setFrame(0); });

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const baseAngle = Math.atan2(dy, dx);
    const speed = this.phaseIndex === 2 ? 200 : 170;

    for (let i = 0; i < count; i++) {
      const spread = (i - (count - 1) / 2) * 0.28;
      this._spawnOrb(this.x, this.y, baseAngle + spread, speed, 1);
    }
    // Decoys mirror the attack visually with cosmetic flares.
    this._fireFromDecoys();
  }

  _rotaryBurst() {
    this._lastAttack = 'burst';
    this.attackCooldown = 900;
    this.setFrame(1);
    this.scene.time.delayedCall(180, () => { if (!this.isDead) this.setFrame(0); });

    const speed = 160;
    const offset = Math.random() * Math.PI * 2;
    for (let i = 0; i < 6; i++) {
      const a = offset + (i / 6) * Math.PI * 2;
      this._spawnOrb(this.x, this.y, a, speed, 1);
    }
  }

  _spawnOrb(x, y, angle, speed, damage) {
    const fb = this.scene.physics.add.image(x, y, 'mirror_orb').setScale(1.0);
    fb.body.setAllowGravity(false);
    fb.body.setSize(10, 10);
    fb.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    fb.touchDamage = damage;
    fb.lifespan = 2400;

    this.scene.tweens.add({
      targets: fb, angle: 360,
      repeat: -1, duration: 600,
    });

    const trail = this.scene.add.particles(0, 0, 'spark', {
      follow: fb,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      speed: { min: 5, max: 25 },
      tint: [0x80ffff, 0x40c0e0, 0xffffff],
      lifespan: 320, frequency: 45, blendMode: 'ADD',
    });
    fb.on('destroy', () => trail.destroy());

    this.scene.enemyProjectiles.add(fb);
  }

  _spawnDecoy(_n) {
    const arena = this.scene._bossSpec;
    const cx = arena.arenaX + arena.arenaWidth / 2;
    // Place decoys at fractions of arena width.
    const slots = [-0.34, 0.34];
    const slotIdx = this._decoys.length % slots.length;
    const dx = cx + slots[slotIdx] * arena.arenaWidth;
    const dy = this._anchorY;

    const decoy = this.scene.add.sprite(dx, dy, this.config.texture, 0)
      .setAlpha(0)
      .setDepth(this.depth);
    decoy.setTint(0x80c0ff);
    decoy._bobT = Math.random() * 1000;
    decoy._homeX = dx;
    decoy._homeY = dy;
    this.scene.tweens.add({
      targets: decoy, alpha: 0.55, duration: 300,
    });
    this._decoys.push(decoy);
  }

  _fireFromDecoys() {
    // Cosmetic flare burst at each decoy — sells the illusion without
    // adding harmless physics projectiles that could touch the player.
    for (const d of this._decoys) {
      if (!d.active) continue;
      const burst = this.scene.add.particles(d.x, d.y, 'spark', {
        scale: { start: 0.7, end: 0 },
        speed: { min: 40, max: 110 },
        alpha: { start: 0.7, end: 0 },
        lifespan: 400,
        quantity: 6,
        emitting: false,
        tint: [0x80ffff, 0xffffff, 0x40c0e0],
        blendMode: 'ADD',
      });
      burst.explode(6);
      this.scene.time.delayedCall(500, () => burst.destroy());
    }
  }

  update(time, delta) {
    super.update(time, delta);
    // Decoy bob.
    for (const d of this._decoys) {
      if (!d.active) continue;
      d._bobT += delta;
      d.y = d._homeY + Math.sin(d._bobT / 280) * 3;
    }
  }

  _onDeath() {
    this._mirrorAura?.destroy();
    for (const d of this._decoys) {
      this.scene.tweens.add({
        targets: d, alpha: 0, duration: 350,
        onComplete: () => d.destroy(),
      });
    }
    this._decoys = [];
  }
}
