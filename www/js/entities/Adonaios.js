import ArchonBoss from './ArchonBoss.js';

// Adonaios — Archon VII, "The Hidden Lord", element Void. Act II boss.
// Cloaked specter who flickers in and out of sight, ruling the empty places
// of Chaos. Uses near-invisibility + void orbs as his calling card.
//
// Phase 0: single homing-ish void orb (slow tracker).
// Phase 1: alternates triple void burst and a "veil" pass — Adonaios fades to
//   near-transparent (alpha 0.15) and drifts to a new arena position, then
//   reappears.
// Phase 2: faster veils, 5-orb spread fan, and lays a "void zone" — a
//   stationary damaging orb that lingers for a few seconds.
export default class Adonaios extends ArchonBoss {
  constructor(scene, x, y, config) {
    super(scene, x, y, config);
    this.setOrigin(0.5, 0.5);
    this.body.setAllowGravity(false);
    this.setVelocity(0, 0);

    this._voidAura = scene.add.particles(0, 0, 'spark', {
      follow: this,
      scale: { start: 0.65, end: 0 },
      alpha: { start: 0.65, end: 0 },
      speed: { min: 15, max: 70 },
      angle: { min: 0, max: 360 },
      tint: [0x200840, 0x4020a0, 0x100020, 0x8060c0],
      lifespan: 720,
      frequency: 70,
      blendMode: 'ADD',
    });
    this._voidAura.setDepth(this.depth - 1);

    this._veiling = false;
    this._lastAttack = 'none';
    this._anchorY = y;
    this._bobT = 0;
  }

  _onActivate() {
    this.scene.cameras.main.shake(260, 0.008);
    this.scene.cameras.main.flash(260, 60, 30, 120);
    this._showNamePlate();
  }

  _onPhaseChange(phase) {
    this.isInvulnerable = true;
    this.setTint(0xa080ff);
    this.scene.cameras.main.shake(180, 0.006);
    this.scene.time.delayedCall(380, () => {
      if (!this.isDead) {
        this.clearTint();
        this.isInvulnerable = false;
      }
    });
    if (phase >= 1) this.attackCooldown = 600;
  }

  _runAI(_time, delta) {
    this._bobT += delta;
    if (!this._veiling) {
      this.y = this._anchorY + Math.sin(this._bobT / 360) * 6;
    }

    const player = this.scene.player;
    if (!player) return;
    if (!this._veiling) this.setFlipX(player.x < this.x);

    if (this._veiling || this.attackCooldown > 0) return;

    if (this.phaseIndex === 0) {
      this._voidBurst(player, 1);
    } else if (this.phaseIndex === 1) {
      if (this._lastAttack === 'burst') this._veil();
      else this._voidBurst(player, 3);
    } else {
      if (this._lastAttack === 'zone') this._voidBurst(player, 5);
      else if (this._lastAttack === 'veil') this._voidZone(player);
      else this._veil();
    }
  }

  _voidBurst(player, count = 1) {
    this._lastAttack = 'burst';
    this.attackCooldown = this.phaseIndex === 2 ? 700 : 1100;
    this.setFrame(1);
    this.scene.time.delayedCall(180, () => { if (!this.isDead) this.setFrame(0); });

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const baseAngle = Math.atan2(dy, dx);
    const speed = this.phaseIndex === 2 ? 180 : 150;

    for (let i = 0; i < count; i++) {
      const spread = (i - (count - 1) / 2) * 0.24;
      this._spawnOrb(this.x, this.y, baseAngle + spread, speed);
    }
  }

  _spawnOrb(x, y, angle, speed) {
    const orb = this.scene.physics.add.image(x, y, 'void_orb')
      .setScale(1.1);
    orb.body.setAllowGravity(false);
    orb.body.setSize(10, 10);
    orb.setRotation(angle);
    orb.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    orb.touchDamage = 1;
    orb.lifespan = 2600;

    this.scene.tweens.add({
      targets: orb, scale: 1.35, alpha: 0.7,
      yoyo: true, repeat: -1, duration: 220,
    });

    const trail = this.scene.add.particles(0, 0, 'spark', {
      follow: orb,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.75, end: 0 },
      speed: { min: 5, max: 25 },
      tint: [0x4020a0, 0x8060c0, 0x100020],
      lifespan: 360, frequency: 40, blendMode: 'ADD',
    });
    orb.on('destroy', () => trail.destroy());

    this.scene.enemyProjectiles.add(orb);
  }

  _veil() {
    this._lastAttack = 'veil';
    this._veiling = true;
    this.attackCooldown = this.phaseIndex === 2 ? 600 : 900;

    const arena = this.scene._bossSpec;
    const minX = arena.arenaX + 40;
    const maxX = arena.arenaX + arena.arenaWidth - 40;
    const newX = Phaser.Math.Between(minX, maxX);
    const newY = Phaser.Math.Between(130, 200);

    const fadeMs = this.phaseIndex === 2 ? 260 : 340;

    // Fade to near-invisible (not zero — leaves a ghostly hint of presence).
    this.scene.tweens.add({
      targets: this, alpha: 0.15, duration: fadeMs,
      onComplete: () => {
        if (this.isDead) { this._veiling = false; return; }

        // Drift while veiled.
        this.scene.tweens.add({
          targets: this, x: newX, y: newY,
          duration: fadeMs + 120, ease: 'Sine.easeInOut',
          onComplete: () => {
            if (this.isDead) { this._veiling = false; return; }
            this._anchorY = newY;

            // Telegraph burst at new spot before reappearing.
            const tele = this.scene.add.particles(newX, newY, 'spark', {
              scale: { start: 0.9, end: 0 },
              speed: { min: 30, max: 110 },
              alpha: { start: 0.9, end: 0 },
              lifespan: 380,
              quantity: 8,
              emitting: false,
              tint: [0x8060ff, 0x4020a0, 0xffffff],
              blendMode: 'ADD',
            });
            tele.explode(8);
            this.scene.time.delayedCall(420, () => tele.destroy());

            this.scene.tweens.add({
              targets: this, alpha: 1, duration: fadeMs,
              onComplete: () => { this._veiling = false; },
            });
          },
        });
      },
    });
  }

  _voidZone(player) {
    this._lastAttack = 'zone';
    this.attackCooldown = 1000;
    this.setFrame(1);
    this.scene.time.delayedCall(220, () => { if (!this.isDead) this.setFrame(0); });

    const arena = this.scene._bossSpec;
    const minX = arena.arenaX + 28;
    const maxX = arena.arenaX + arena.arenaWidth - 28;
    const zx = Phaser.Math.Clamp(player.x, minX, maxX);
    const zy = 218; // near floor

    const zone = this.scene.physics.add.image(zx, zy, 'void_orb')
      .setScale(2.0);
    zone.body.setAllowGravity(false);
    zone.body.setSize(22, 22);
    zone.setAlpha(0.85);
    zone.setTint(0x6040c0);
    zone.touchDamage = 1;
    zone.lifespan = 3200;

    this.scene.tweens.add({
      targets: zone, scale: 2.6, alpha: 0.55,
      yoyo: true, repeat: -1, duration: 240,
    });

    const trail = this.scene.add.particles(0, 0, 'spark', {
      follow: zone,
      scale: { start: 0.7, end: 0 },
      alpha: { start: 0.75, end: 0 },
      speed: { min: 10, max: 45 },
      tint: [0x4020a0, 0x8060c0, 0x200840],
      lifespan: 480, frequency: 30, blendMode: 'ADD',
    });
    zone.on('destroy', () => trail.destroy());

    this.scene.cameras.main.shake(140, 0.004);
    this.scene.enemyProjectiles.add(zone);
  }

  _onDeath() {
    this._voidAura?.destroy();
  }
}
