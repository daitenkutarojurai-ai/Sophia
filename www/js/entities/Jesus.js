import { CHARACTERS } from '../constants.js';

const DATA = CHARACTERS.jesus;

export default class Jesus extends Phaser.Physics.Arcade.Sprite {
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
    this.isCasting = false;
    this.attackCooldown = 0;

    Jesus._defineAnims(scene);
    this.play('jesus_idle');
  }

  update(time, delta) {
    if (this.isHurt) return;

    const { cursors, actionKey } = this.scene;
    const onGround = this.body.blocked.down || this.body.touching.down;

    if (cursors.left.isDown) {
      this.setVelocityX(-DATA.speed);
      this.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(DATA.speed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if ((cursors.up.isDown || cursors.space?.isDown) && onGround) {
      this.setVelocityY(DATA.jumpForce);
    }

    if (Phaser.Input.Keyboard.JustDown(actionKey) && this.attackCooldown <= 0) {
      this._castSeal();
    }

    if (this.isCasting) {
      // hold cast frame
    } else if (!onGround) {
      this.anims.stop();
      this.setFrame(3);
    } else if (this.body.velocity.x !== 0) {
      this.play('jesus_run', true);
    } else {
      this.play('jesus_idle', true);
    }

    if (this.attackCooldown > 0) this.attackCooldown -= delta;
  }

  takeDamage(amount = 1) {
    if (this.isHurt) return;
    this.hp = Math.max(0, this.hp - amount);
    this.isHurt = true;
    this.setTint(0xff8040);

    const dir = this.flipX ? 1 : -1;
    this.setVelocity(dir * 160, -200);

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

  _castSeal() {
    this.isCasting = true;
    this.attackCooldown = 550;
    this.setFrame(4);

    const dir = this.flipX ? -1 : 1;
    const px = this.x + dir * 12;
    const py = this.y;

    // Spawn seal projectile
    const proj = this.scene.physics.add.image(px, py, 'projectile');
    proj.body.allowGravity = false;
    proj.setVelocityX(dir * 320);
    proj.lifespan = 1200;
    proj.damage = DATA.attackDamage;
    this.scene.projectiles?.add(proj);

    // Trail tween
    this.scene.tweens.add({
      targets: proj,
      scale: 1.3,
      yoyo: true,
      duration: 200,
      repeat: -1,
    });

    this.scene.time.delayedCall(250, () => { this.isCasting = false; });
  }

  static _defineAnims(scene) {
    if (scene.anims.exists('jesus_idle')) return;
    scene.anims.create({
      key: 'jesus_idle',
      frames: [{ key: 'jesus', frame: 0 }],
      frameRate: 1, repeat: -1,
    });
    scene.anims.create({
      key: 'jesus_run',
      frames: scene.anims.generateFrameNumbers('jesus', { frames: [1, 0, 2, 0] }),
      frameRate: 8, repeat: -1,
    });
  }
}
