import ArchonBoss from './ArchonBoss.js';

// Authades — Archon I, "The Self-Willed", element Fire. Act 1 mini-boss.
// Phase 0: single fireball spat toward Sophia.
// Phase 1: telegraphed lunging charge — teaches the dash mechanic.
// Phase 2: 3-fireball spread + faster charges, alternating.
export default class Authades extends ArchonBoss {
  constructor(scene, x, y, config) {
    super(scene, x, y, config);

    this._fireAura = scene.add.particles(0, 0, 'spark', {
      follow: this,
      scale: { start: 0.7, end: 0 },
      alpha: { start: 0.85, end: 0 },
      speed: { min: 30, max: 80 },
      angle: { min: 0, max: 360 },
      tint: [0xff8020, 0xffe060, 0xff4040, 0xffffff],
      lifespan: 520,
      frequency: 55,
      blendMode: 'ADD',
    });
    this._fireAura.setDepth(this.depth - 1);

    this.charging = false;
    this._lastAttack = 'none';
  }

  _onActivate() {
    this.scene.cameras.main.shake(220, 0.006);
    this.scene.cameras.main.flash(220, 255, 120, 40);
    this._showNamePlate();
  }

  _onPhaseChange(phase) {
    // Brief invuln flash + roar between phases
    this.isInvulnerable = true;
    this.setTint(0xffe060);
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
        color: '#ffe060', stroke: '#000', strokeThickness: 3,
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
    if (this.charging) {
      // Charge runs until a wall is hit or velocity drops.
      if (this.body.blocked.left || this.body.blocked.right) {
        this.charging = false;
        this.setVelocityX(0);
        this.attackCooldown = this.phaseIndex === 2 ? 700 : 1100;
      }
      return;
    }

    const player = this.scene.player;
    if (!player) return;

    // Face the player.
    this.setFlipX(player.x < this.x);

    if (this.attackCooldown > 0) {
      this.setVelocityX(0);
      return;
    }

    if (this.phaseIndex === 0) {
      this._fireball(player, 1);
    } else if (this.phaseIndex === 1) {
      this._charge(player);
    } else {
      // Phase 2: alternate fireball spread and charge.
      if (this._lastAttack === 'charge') this._fireball(player, 3);
      else this._charge(player);
    }
  }

  _fireball(player, count = 1) {
    this._lastAttack = 'fireball';
    this.attackCooldown = this.phaseIndex === 2 ? 800 : 1300;
    this.setFrame(1);
    this.scene.time.delayedCall(180, () => { if (!this.isDead) this.setFrame(0); });

    const dir = player.x < this.x ? -1 : 1;
    const baseSpeed = this.phaseIndex === 2 ? 200 : 170;

    for (let i = 0; i < count; i++) {
      const spread = (i - (count - 1) / 2) * 0.32;
      const fb = this.scene.physics.add.image(
        this.x + dir * 14, this.y - 4, 'fireball'
      ).setScale(1.1);
      fb.body.setAllowGravity(false);
      fb.body.setSize(10, 10);
      fb.setVelocity(dir * baseSpeed, spread * 220);
      fb.touchDamage = 1;
      fb.lifespan = 2400;

      // Flickering scale
      this.scene.tweens.add({
        targets: fb, scale: 1.35,
        yoyo: true, repeat: -1, duration: 110,
      });

      // Trailing particles
      const trail = this.scene.add.particles(0, 0, 'spark', {
        follow: fb,
        scale: { start: 0.55, end: 0 },
        alpha: { start: 0.9, end: 0 },
        speed: { min: 5, max: 25 },
        tint: [0xff8020, 0xffe060, 0xff4040],
        lifespan: 320, frequency: 40, blendMode: 'ADD',
      });
      fb.on('destroy', () => trail.destroy());

      this.scene.enemyProjectiles.add(fb);
    }
  }

  _charge(player) {
    this._lastAttack = 'charge';
    this.charging = true;
    const dir = player.x < this.x ? -1 : 1;

    // Telegraph: tint amber, brief halt, eye flash.
    this.setTint(0xffd040);
    this.setVelocityX(0);
    this.scene.cameras.main.shake(60, 0.003);

    this.scene.time.delayedCall(550, () => {
      if (this.isDead) return;
      this.clearTint();
      const speed = this.phaseIndex === 2 ? 360 : 280;
      this.setVelocityX(dir * speed);
      this.scene.cameras.main.shake(140, 0.007);
    });
  }

  _onDeath() {
    this._fireAura?.destroy();
  }
}
