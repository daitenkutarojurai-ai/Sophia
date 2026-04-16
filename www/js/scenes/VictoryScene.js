import { WIDTH, HEIGHT, CHARACTERS } from '../constants.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() { super({ key: 'Victory' }); }

  init(data) {
    this.totalSparks = data?.totalSparks ?? 0;
    this.characterId = data?.character ?? 'sophia';
  }

  create() {
    // Blaze of restored light
    this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x1a0030).setOrigin(0);
    this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_ascent')
      .setOrigin(0).setAlpha(0.75);
    this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_stars')
      .setOrigin(0).setAlpha(0.4);

    // Radial light rays
    const rays = this.add.graphics();
    for (let i = 0; i < 14; i++) {
      rays.fillStyle(0xffe0a0, 0.04);
      const a = (i / 14) * Math.PI * 2;
      const ax = WIDTH / 2, ay = HEIGHT / 2;
      rays.beginPath();
      rays.moveTo(ax, ay);
      rays.lineTo(ax + Math.cos(a - 0.08) * 500,
                  ay + Math.sin(a - 0.08) * 500);
      rays.lineTo(ax + Math.cos(a + 0.08) * 500,
                  ay + Math.sin(a + 0.08) * 500);
      rays.closePath();
      rays.fillPath();
    }
    this.tweens.add({ targets: rays, rotation: Math.PI * 2,
      duration: 18000, repeat: -1 });

    // Central figure with crown
    const cx = WIDTH / 2, cy = HEIGHT / 2 - 10;
    const haloBehind = this.add.circle(cx, cy, 60, 0xffe080, 0.2);
    this.tweens.add({ targets: haloBehind,
      scale: 1.3, alpha: 0.4,
      yoyo: true, repeat: -1, duration: 1600 });

    const figure = this.add.sprite(cx, cy + 6, 'sophia', 0).setScale(3);
    this.add.image(cx, cy - 26, 'crown').setScale(0.9);

    // Falling divine sparks
    this.add.particles(0, 0, 'spark', {
      x: { min: 0, max: WIDTH }, y: -10,
      speedY: { min: 15, max: 50 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.6, end: 0 },
      tint: [0xffffff, 0xffe080, 0xc8a0ff],
      lifespan: 5000, frequency: 90, quantity: 1,
    });

    // Title
    this.add.text(WIDTH / 2, 34, 'THE LIGHT IS RESTORED', {
      fontFamily: 'monospace', fontSize: '16px',
      color: '#ffffff', stroke: '#604020', strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 54,
      'Sophia is crowned the Light-Maiden.', {
        fontFamily: 'monospace', fontSize: '9px',
        color: '#ffe080', fontStyle: 'italic',
      }).setOrigin(0.5);

    this.add.text(WIDTH / 2, HEIGHT - 80,
      '"And the Aeons sang: Thou art restored,\n the scattered light is remembered."', {
        fontFamily: 'monospace', fontSize: '7px',
        color: '#d8b0ff', align: 'center',
        fontStyle: 'italic', lineSpacing: 3,
      }).setOrigin(0.5);

    this.add.text(WIDTH / 2, HEIGHT - 60, '— Pistis Sophia, final chapter', {
      fontFamily: 'monospace', fontSize: '6px', color: '#8060c0',
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, HEIGHT - 42,
      `Sparks of Light gathered: ${this.totalSparks}`, {
        fontFamily: 'monospace', fontSize: '9px', color: '#ffe080',
      }).setOrigin(0.5);

    this._btn(HEIGHT - 22, 'RETURN TO THE PLEROMA',
      () => this.scene.start('MainMenu'));

    this.cameras.main.fadeIn(900, 255, 240, 200);
  }

  _btn(y, label, cb) {
    const t = this.add.text(WIDTH / 2, y, label, {
      fontFamily: 'monospace', fontSize: '9px',
      color: '#ffffff', stroke: '#6040a0', strokeThickness: 2,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    t.on('pointerover', () => t.setColor('#ffe080').setScale(1.05));
    t.on('pointerout',  () => t.setColor('#ffffff').setScale(1));
    t.on('pointerdown', cb);
  }
}
