import { WIDTH, HEIGHT, CHARACTERS } from '../constants.js';

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() { super({ key: 'CharacterSelect' }); }

  create() {
    this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x050010).setOrigin(0);
    this.stars = this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_stars')
      .setOrigin(0).setAlpha(0.8);
    this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_nebula')
      .setOrigin(0).setAlpha(0.8);

    // Light rays radiating from centre top
    const rays = this.add.graphics();
    for (let i = 0; i < 7; i++) {
      rays.fillStyle(0xc8a0ff, 0.05 + 0.01 * i);
      rays.beginPath();
      const ax = WIDTH / 2, ay = -10;
      const spread = 40 + i * 15;
      rays.moveTo(ax, ay);
      rays.lineTo(ax - spread, HEIGHT);
      rays.lineTo(ax + spread, HEIGHT);
      rays.closePath();
      rays.fillPath();
    }

    // Header
    this.add.text(WIDTH / 2, 20, 'CHOOSE YOUR LIGHT', {
      fontFamily: 'monospace', fontSize: '13px', color: '#c8a0ff',
      stroke: '#1a0030', strokeThickness: 3,
    }).setOrigin(0.5);
    this.add.text(WIDTH / 2, 36,
      'Two paths of gnosis. The same restoration.', {
        fontFamily: 'monospace', fontSize: '7px', color: '#8060c0',
        fontStyle: 'italic',
      }).setOrigin(0.5);

    this._buildCard(WIDTH * 0.27, HEIGHT / 2 + 12, 'sophia', CHARACTERS.sophia);
    this._buildCard(WIDTH * 0.73, HEIGHT / 2 + 12, 'jesus',  CHARACTERS.jesus);

    this.add.text(WIDTH / 2, HEIGHT - 14, 'Click a figure to begin.', {
      fontFamily: 'monospace', fontSize: '7px', color: '#604090',
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-ESC', () => this.scene.start('MainMenu'));

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  update() {
    this.stars.tilePositionX += 0.05;
  }

  _buildCard(cx, cy, id, data) {
    // Ornate frame
    const frame = this.add.graphics();
    frame.lineStyle(1, 0x6040a0, 0.7);
    frame.strokeRoundedRect(cx - 60, cy - 80, 120, 160, 4);
    frame.lineStyle(1, 0x3a2070, 0.5);
    frame.strokeRoundedRect(cx - 62, cy - 82, 124, 164, 5);

    // Halo behind portrait
    const halo = this.add.circle(cx, cy - 34, 26,
      Phaser.Display.Color.HexStringToColor(data.color).color, 0.2);
    this.tweens.add({
      targets: halo, scale: 1.18, alpha: 0.35,
      yoyo: true, repeat: -1, duration: 1300, ease: 'Sine.easeInOut',
    });

    const portrait = this.add.sprite(cx, cy - 30, data.texture, 0).setScale(2.4);
    this.tweens.add({
      targets: portrait, y: cy - 34,
      yoyo: true, repeat: -1, duration: 1000, ease: 'Sine.easeInOut',
    });

    // Name + lore
    this.add.text(cx, cy + 22, data.name.toUpperCase(), {
      fontFamily: 'monospace', fontSize: '12px', color: data.color,
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5);

    this.add.text(cx, cy + 38, data.tagline, {
      fontFamily: 'monospace', fontSize: '7px', color: '#c8a0ff',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    this.add.text(cx, cy + 54, data.loreLine, {
      fontFamily: 'monospace', fontSize: '6px', color: '#8060c0',
      align: 'center', wordWrap: { width: 110 }, lineSpacing: 2,
    }).setOrigin(0.5);

    this.add.text(cx, cy + 70,
      data.attack === 'melee' ? 'Z — Slash of Light' : 'Z — Seal Projectile',
      { fontFamily: 'monospace', fontSize: '7px', color: data.color,
      }).setOrigin(0.5);

    // Click target
    const hit = this.add.rectangle(cx, cy, 120, 160, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });
    hit.on('pointerover', () => {
      portrait.setScale(2.6);
      frame.clear();
      frame.lineStyle(2, Phaser.Display.Color.HexStringToColor(data.color).color, 0.9);
      frame.strokeRoundedRect(cx - 60, cy - 80, 120, 160, 4);
    });
    hit.on('pointerout', () => {
      portrait.setScale(2.4);
      frame.clear();
      frame.lineStyle(1, 0x6040a0, 0.7);
      frame.strokeRoundedRect(cx - 60, cy - 80, 120, 160, 4);
      frame.lineStyle(1, 0x3a2070, 0.5);
      frame.strokeRoundedRect(cx - 62, cy - 82, 124, 164, 5);
    });
    hit.on('pointerdown', () => {
      this.registry.set('character', id);
      this.registry.set('progress', { currentLevel: 0, totalSparks: 0 });
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(450, () =>
        this.scene.start('Level', { levelIndex: 0, character: id }));
    });
  }
}
