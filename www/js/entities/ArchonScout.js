export default class ArchonScout extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, behavior = 'patrol', levelIndex = 0) {
    super(scene, x, y, 'archon_scout', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(16, 20).setOffset(4, 4);
    this.setCollideWorldBounds(true);

    // Scale difficulty per act (1.0 → 1.22 → 1.44)
    const speedScale = 1 + levelIndex * 0.22;
    this.maxHp = 2 + levelIndex;
    this.hp = this.maxHp;
    this.behavior = behavior;
    this.patrolSpeed = 55 * speedScale;
    this.chaseSpeed  = 90 * speedScale;
    this.speed = this.patrolSpeed;
    this.direction = 1;
    this.startX = x;
    this.patrolRange = 80;
    this.touchDamage = 1;
    this.isDead = false;
    this._isChasing = false;

    ArchonScout._defineAnims(scene);
    this.play('scout_walk');

    this._hpBar = scene.add.graphics();
    this._drawHpBar();
  }

  update(time, delta) {
    if (this.isDead) return;

    if (this.y > 400) { this._die(); return; }

    const player = this.scene.player;
    if (!player) return;

    const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const nowChasing = this.behavior === 'chase' && dist < 200;

    if (nowChasing !== this._isChasing) {
      this._isChasing = nowChasing;
      // Glow red when switching to chase; clear when returning to patrol
      if (!this.isDead) {
        nowChasing ? this.setTint(0xff7040) : this.clearTint();
      }
    }

    if (nowChasing) {
      this.setVelocityX((player.x < this.x ? -1 : 1) * this.chaseSpeed);
    } else {
      this.setVelocityX(this.patrolSpeed * this.direction);
      if (this.x > this.startX + this.patrolRange) this.direction = -1;
      if (this.x < this.startX - this.patrolRange) this.direction = 1;
      if (this.body.blocked.left)  this.direction = 1;
      if (this.body.blocked.right) this.direction = -1;
    }

    if (this.body.blocked.down && !nowChasing) {
      if (!this._hasGroundAhead(this.body.velocity.x > 0 ? 1 : -1)) {
        this.direction *= -1;
        this.setVelocityX(this.patrolSpeed * this.direction);
      }
    }

    this.setFlipX(this.body.velocity.x < 0);
    this._drawHpBar();
  }

  _drawHpBar() {
    if (!this._hpBar?.active) return;
    this._hpBar.clear();
    const w = 18, h = 3;
    const bx = this.x - w / 2;
    const by = this.y - this.height / 2 - 7;
    this._hpBar.fillStyle(0x330000, 0.85);
    this._hpBar.fillRect(bx, by, w, h);
    const ratio = this.hp / this.maxHp;
    this._hpBar.fillStyle(ratio > 0.5 ? 0xff4040 : 0xff1010, 1);
    this._hpBar.fillRect(bx, by, w * ratio, h);
  }

  _hasGroundAhead(dir) {
    const probeX = this.x + dir * 14;
    const probeY = this.y + this.height / 2 + 4;
    const platforms = this.scene.platforms?.getChildren() ?? [];
    for (const p of platforms) {
      const px = p.x, py = p.y, pw = p.width;
      if (probeX >= px && probeX <= px + pw && probeY >= py && probeY <= py + 14) {
        return true;
      }
    }
    return false;
  }

  takeDamage(amount = 1) {
    if (this.isDead) return;
    this.hp -= amount;
    this.setTint(0xff2020);
    this.setVelocity((this.flipX ? 1 : -1) * 160, -120);
    this.scene.time.delayedCall(180, () => {
      if (!this.isDead) {
        this._isChasing ? this.setTint(0xff7040) : this.clearTint();
      }
    });
    if (this.hp <= 0) this._die();
  }

  _die() {
    this.isDead = true;
    this.body.enable = false;
    if (this._hpBar) { this._hpBar.destroy(); this._hpBar = null; }
    this.scene.events.emit('enemy_killed', { x: this.x, y: this.y });
    this.scene.tweens.add({
      targets: this,
      alpha: 0, y: this.y - 18,
      duration: 380,
      onComplete: () => this.destroy(),
    });
  }

  static _defineAnims(scene) {
    if (scene.anims.exists('scout_walk')) return;
    scene.anims.create({
      key: 'scout_walk',
      frames: scene.anims.generateFrameNumbers('archon_scout', { start: 0, end: 1 }),
      frameRate: 6, repeat: -1,
    });
  }
}
