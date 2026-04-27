// ArchonBoss — reusable base class for the 13 Archon boss fights.
// Subclasses implement _runAI(time, delta) and may override _onActivate /
// _onPhaseChange / _onDeath. Phase index advances as HP drops in equal slices
// across `phaseCount` (default 3).
export default class ArchonBoss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.texture, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.config = config;
    this.archonId = config.archonId;
    this.bossName = config.name;
    this.bossTitle = config.title;
    this.element = config.element;
    this.phaseCount = config.phaseCount ?? 3;
    this.maxHp = config.hp ?? 12;
    this.hp = this.maxHp;

    this.body
      .setSize(config.bodyW ?? 36, config.bodyH ?? 36)
      .setOffset(config.bodyOX ?? 10, config.bodyOY ?? 10);
    this.body.setAllowGravity(config.allowGravity ?? true);
    this.setCollideWorldBounds(true);

    this.touchDamage = config.touchDamage ?? 1;
    this.isDead = false;
    this.isInvulnerable = false;
    this.activated = false;
    this.phaseIndex = 0;
    this.attackCooldown = config.firstAttackDelay ?? 1100;
    this.startX = x;
    this.startY = y;
  }

  activate() {
    if (this.activated || this.isDead) return;
    this.activated = true;
    this.scene.events.emit('boss_activated', this);
    this._onActivate?.();
  }

  update(time, delta) {
    if (this.isDead || !this.activated) return;
    if (this.attackCooldown > 0) this.attackCooldown -= delta;
    this._runAI(time, delta);
  }

  // Subclasses override.
  _runAI(_time, _delta) {}

  takeDamage(amount = 1) {
    if (this.isDead || this.isInvulnerable) return;
    this.hp = Math.max(0, this.hp - amount);
    this.scene.events.emit('boss_hp', { hp: this.hp, max: this.maxHp });

    this.setTint(0xfff0a0);
    this.isInvulnerable = true;
    this.scene.time.delayedCall(160, () => {
      if (!this.isDead) {
        this.clearTint();
        this.isInvulnerable = false;
      }
    });

    const newPhase = Math.min(
      this.phaseCount - 1,
      Math.floor((1 - this.hp / this.maxHp) * this.phaseCount),
    );
    if (newPhase !== this.phaseIndex && this.hp > 0) {
      this.phaseIndex = newPhase;
      this._onPhaseChange?.(newPhase);
    }

    if (this.hp <= 0) this._die();
  }

  _die() {
    this.isDead = true;
    this.setVelocity(0, 0);
    if (this.body) this.body.enable = false;

    this.scene.cameras.main.shake(420, 0.014);
    this.scene.cameras.main.flash(500, 255, 220, 140);

    const burst = this.scene.add.particles(this.x, this.y, 'spark', {
      scale: { start: 1.4, end: 0 },
      speed: { min: 60, max: 220 },
      alpha: { start: 1, end: 0 },
      lifespan: 800,
      quantity: 28,
      emitting: false,
      tint: this.config.deathTints ?? [0xffffff, 0xffe080, 0xff8040],
      blendMode: 'ADD',
    });
    burst.explode(28);
    this.scene.time.delayedCall(900, () => burst.destroy());

    this._onDeath?.();
    this.scene.events.emit('boss_killed', this.config);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: this.scaleX * 1.6,
      scaleY: this.scaleY * 1.6,
      duration: 700,
      ease: 'Sine.easeOut',
      onComplete: () => this.destroy(),
    });
  }
}
