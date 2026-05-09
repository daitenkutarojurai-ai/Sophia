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
    // Shooter: stagger initial cooldowns so squads don't fire in sync
    this._shootCooldown = 1800 + Math.random() * 1200;

    ArchonScout._defineAnims(scene);
    this.play('scout_walk');

    this._hpBar = scene.add.graphics();
    this._drawHpBar();
  }

  update(time, delta) {
    if (this.isDead) return;

    const player = this.scene.player;
    if (!player) return;

    const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const nowChasing = this.behavior === 'chase' && dist < 200;

    if (nowChasing !== this._isChasing) {
      this._isChasing = nowChasing;
      if (!this.isDead) {
        nowChasing ? this.setTint(0xff7040) : this.clearTint();
      }
    }

    if (this.behavior === 'shooter') {
      // Shooter: stand and fire; back away if too close
      this._shootCooldown -= delta;
      if (dist < 60) {
        const awayDir = this.x < player.x ? -1 : 1;
        this.setVelocityX(awayDir * this.patrolSpeed);
      } else {
        this.setVelocityX(0);
      }
      if (dist < 220 && this._shootCooldown <= 0) {
        this._fire(player);
        this._shootCooldown = 2000;
      }
      this.setFlipX(player.x < this.x);
    } else if (nowChasing) {
      this.setVelocityX((player.x < this.x ? -1 : 1) * this.chaseSpeed);
      this.setFlipX(this.body.velocity.x < 0);
    } else {
      this.setVelocityX(this.patrolSpeed * this.direction);
      if (this.x > this.startX + this.patrolRange) this.direction = -1;
      if (this.x < this.startX - this.patrolRange) this.direction = 1;
      if (this.body.blocked.left)  this.direction = 1;
      if (this.body.blocked.right) this.direction = -1;

      if (this.body.velocity.x !== 0 && this.body.blocked.down) {
        if (!this._hasGroundAhead(this.body.velocity.x > 0 ? 1 : -1)) {
          this.direction *= -1;
          this.setVelocityX(this.patrolSpeed * this.direction);
        }
      }
      this.setFlipX(this.body.velocity.x < 0);
    }

    this._drawHpBar();
  }

  _fire(player) {
    const dx = player.x - this.x;
    const dy = (player.y - 8) - this.y;
    const angle = Math.atan2(dy, dx);
    const speed = 140;

    const bolt = this.scene.physics.add.image(this.x, this.y - 4, 'shadow_bolt');
    bolt.body.setAllowGravity(false);
    bolt.body.setSize(8, 8);
    bolt.setRotation(angle);
    bolt.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    bolt.touchDamage = 1;
    bolt.lifespan = 2000;
    this.scene.enemyProjectiles.add(bolt);

    // Brief muzzle flash tint
    this.setTint(0xc080ff);
    this.scene.time.delayedCall(160, () => {
      if (!this.isDead) this.clearTint();
    });
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
