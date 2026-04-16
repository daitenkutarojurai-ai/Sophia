import { CHARACTERS } from '../constants.js';

const DATA = CHARACTERS.sophia;

export default class Sophia extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, DATA.texture, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(...DATA.bodySize).setOffset(...DATA.bodyOffset);
    this.setCollideWorldBounds(true);

    this.hp = 3;
    this.maxHp = 3;
    this.sparks = 0;
    this.isHurt = false;
    this.isAttacking = false;
    this.attackCooldown = 0;

    Sophia._defineAnims(scene);
    this.play('sophia_idle');

    // Radiant aura — bright golden particle halo that follows her
    this._aura = scene.add.particles(0, 0, 'spark', {
      follow: this,
      followOffset: { x: 0, y: 0 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.9, end: 0 },
      speed: { min: 10, max: 40 },
      angle: { min: 0, max: 360 },
      tint: [0xffffff, 0xffe080, 0xffc040],
      lifespan: 600,
      frequency: 60,
      quantity: 1,
      blendMode: 'ADD',
    });
    this._aura.setDepth(-1);

    // Soft behind-figure glow
    this._glow = scene.add.image(x, y, 'spark').setScale(6).setAlpha(0.25)
      .setTint(0xffe080).setBlendMode('ADD').setDepth(-2);
  }

  update(time, delta) {
    if (this.isHurt) return;

    const { cursors, actionKey } = this.scene;
    const onGround = this.body.blocked.down || this.body.touching.down;

    // Horizontal movement
    if (cursors.left.isDown) {
      this.setVelocityX(-DATA.speed);
      this.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(DATA.speed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // Jump
    if ((cursors.up.isDown || cursors.space?.isDown) && onGround) {
      this.setVelocityY(DATA.jumpForce);
    }

    // Attack (Z)
    if (Phaser.Input.Keyboard.JustDown(actionKey) && this.attackCooldown <= 0) {
      this._attack();
    }

    // Animation
    if (this.isAttacking) {
      // hold attack frame
    } else if (!onGround) {
      this.anims.stop();
      this.setFrame(3);
    } else if (this.body.velocity.x !== 0) {
      this.play('sophia_run', true);
    } else {
      this.play('sophia_idle', true);
    }

    if (this.attackCooldown > 0) this.attackCooldown -= delta;

    // Glow follows + breathes
    if (this._glow) {
      this._glow.setPosition(this.x, this.y);
      const pulse = 0.22 + Math.sin(time * 0.004) * 0.08;
      this._glow.setAlpha(pulse);
    }
  }

  takeDamage(amount = 1) {
    if (this.isHurt) return;
    this.hp = Math.max(0, this.hp - amount);
    this.isHurt = true;
    this.setTint(0xff4060);

    const dir = this.flipX ? 1 : -1;
    this.setVelocity(dir * 180, -220);

    this.scene.events.emit('hp_updated', this.hp);
    this.scene.time.delayedCall(500, () => {
      this.isHurt = false;
      this.clearTint();
    });

    if (this.hp <= 0) this.scene.events.emit('player_died');
  }

  collectSpark() {
    this.sparks++;
    this.scene.events.emit('sparks_updated', this.sparks);
  }

  _attack() {
    this.isAttacking = true;
    this.attackCooldown = 350;
    this.setFrame(4);

    const dir = this.flipX ? -1 : 1;
    const hitX = this.x + dir * DATA.attackRange / 2;
    const hitY = this.y;

    // Flash slash
    const flash = this.scene.add.rectangle(hitX, hitY, DATA.attackRange, 18, 0xffffff, 0.5);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 150,
      onComplete: () => flash.destroy(),
    });

    // Apply damage to enemies in range
    const enemies = this.scene.enemies?.getChildren() ?? [];
    for (const e of enemies) {
      if (e.active && Phaser.Math.Distance.Between(hitX, hitY, e.x, e.y) < DATA.attackRange) {
        e.takeDamage?.(DATA.attackDamage);
      }
    }

    this.scene.time.delayedCall(200, () => { this.isAttacking = false; });
  }

  static _defineAnims(scene) {
    if (scene.anims.exists('sophia_idle')) return;
    scene.anims.create({
      key: 'sophia_idle',
      frames: [{ key: 'sophia', frame: 0 }],
      frameRate: 1, repeat: -1,
    });
    scene.anims.create({
      key: 'sophia_run',
      frames: scene.anims.generateFrameNumbers('sophia', { frames: [1, 0, 2, 0] }),
      frameRate: 10, repeat: -1,
    });
    scene.anims.create({
      key: 'sophia_jump',
      frames: [{ key: 'sophia', frame: 3 }],
      frameRate: 1, repeat: 0,
    });
    scene.anims.create({
      key: 'sophia_hurt',
      frames: [{ key: 'sophia', frame: 5 }],
      frameRate: 1, repeat: 0,
    });
  }
}
