export default class ArchonScout extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, behavior = 'patrol') {
    super(scene, x, y, 'archon_scout', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(16, 20).setOffset(4, 4);
    this.setCollideWorldBounds(true);

    this.hp = 2;
    this.behavior = behavior;
    this.speed = behavior === 'chase' ? 90 : 55;
    this.direction = 1;
    this.startX = x;
    this.patrolRange = 80;
    this.touchDamage = 1;
    this.isDead = false;

    ArchonScout._defineAnims(scene);
    this.play('scout_walk');
  }

  update(time, delta) {
    if (this.isDead) return;

    // Safety: destroyed if somehow fell off-world
    if (this.y > 400) { this._die(); return; }

    const player = this.scene.player;
    if (!player) return;

    const chasing = this.behavior === 'chase' &&
      Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) < 200;

    if (chasing) {
      this.setVelocityX((player.x < this.x ? -1 : 1) * this.speed);
    } else {
      this.setVelocityX(this.speed * this.direction);
      if (this.x > this.startX + this.patrolRange) this.direction = -1;
      if (this.x < this.startX - this.patrolRange) this.direction = 1;
      if (this.body.blocked.left)  this.direction = 1;
      if (this.body.blocked.right) this.direction = -1;
    }

    // Ledge detection: reverse when no ground ahead
    if (this.body.blocked.down && !chasing) {
      if (!this._hasGroundAhead(this.body.velocity.x > 0 ? 1 : -1)) {
        this.direction *= -1;
        this.setVelocityX(this.speed * this.direction);
      }
    }

    this.setFlipX(this.body.velocity.x < 0);
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
    this.setTint(0xff4040);
    this.setVelocity((this.flipX ? 1 : -1) * 160, -120);
    this.scene.time.delayedCall(180, () => this.clearTint());
    if (this.hp <= 0) this._die();
  }

  _die() {
    this.isDead = true;
    this.body.enable = false;
    this.scene.events.emit('enemy_killed', { x: this.x, y: this.y });
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: this.y - 16,
      duration: 350,
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
