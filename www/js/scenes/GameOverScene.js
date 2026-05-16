import { WIDTH, HEIGHT, LEVELS } from '../constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOver' }); }

  init(data) {
    this.levelIndex = data?.levelIndex ?? 0;
    this.characterId = data?.character ?? 'sophia';
  }

  create() {
    const level = LEVELS[this.levelIndex];

    this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x08000a).setOrigin(0);
    this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_chaos')
      .setOrigin(0).setAlpha(0.7);

    // Dark screen vignette edges
    const vig = this.add.graphics();
    vig.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000,
      0.7, 0.7, 0, 0);
    vig.fillRect(0, 0, WIDTH, HEIGHT / 2);
    vig.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000,
      0, 0, 0.7, 0.7);
    vig.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT / 2);

    // Falling crimson sparks (heavier than default)
    this.add.particles(0, 0, 'spark', {
      x: { min: 0, max: WIDTH }, y: -10,
      speedY: { min: 20, max: 60 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.35, end: 0 },
      tint: [0x801020, 0x400010],
      lifespan: 4500, frequency: 200, quantity: 1,
    });
    // Fast fine rain
    this.add.particles(0, 0, 'spark', {
      x: { min: 0, max: WIDTH }, y: -10,
      speedY: { min: 80, max: 140 },
      speedX: { min: -5, max: 5 },
      scale: { start: 0.15, end: 0 },
      alpha: { start: 0.5, end: 0 },
      tint: [0xff2040, 0x600010],
      lifespan: 2000, frequency: 80, quantity: 1,
    });

    const title = this.add.text(WIDTH / 2, 55, 'THE LIGHT IS LOST', {
      fontFamily: 'monospace', fontSize: '18px',
      color: '#ff4080', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);
    // Flicker + pulse on title
    this.tweens.add({
      targets: title, alpha: 0.7,
      yoyo: true, repeat: -1, duration: 1200,
    });
    this._flickerTitle(title);

    // Level name where player fell
    if (level) {
      this.add.text(WIDTH / 2, 78, `Fell in: ${level.name}`, {
        fontFamily: 'monospace', fontSize: '7px',
        color: '#804060', align: 'center',
      }).setOrigin(0.5);
    }

    this.add.text(WIDTH / 2, 100,
      '"I cried out of the darkness,\nand thou didst hear my voice."', {
        fontFamily: 'monospace', fontSize: '8px',
        color: '#a070c0', align: 'center',
        fontStyle: 'italic', lineSpacing: 4,
      }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 126,
      '— Pistis Sophia, 39th Repentance', {
        fontFamily: 'monospace', fontSize: '6px', color: '#604090',
      }).setOrigin(0.5);

    this._btn(168, 'RETURN TO THE AEON',
      () => this.scene.start('Level',
        { levelIndex: this.levelIndex, character: this.characterId }));
    this._btn(192, 'CHANGE VESSEL',
      () => this.scene.start('CharacterSelect'));
    this._btn(216, 'FALL INTO SILENCE',
      () => this.scene.start('MainMenu'));

    this.cameras.main.fadeIn(500, 40, 0, 0);
  }

  _flickerTitle(target) {
    const flicker = () => {
      if (!target.active) return;
      const delay = Phaser.Math.Between(2000, 5000);
      this.time.delayedCall(delay, () => {
        if (!target.active) return;
        const origAlpha = target.alpha;
        target.setAlpha(0.1);
        this.time.delayedCall(60, () => {
          if (!target.active) return;
          target.setAlpha(origAlpha);
          this.time.delayedCall(40, () => {
            if (!target.active) return;
            target.setAlpha(0.15);
            this.time.delayedCall(80, () => {
              if (!target.active) return;
              target.setAlpha(origAlpha);
              flicker();
            });
          });
        });
      });
    };
    flicker();
  }

  _btn(y, label, cb) {
    const t = this.add.text(WIDTH / 2, y, label, {
      fontFamily: 'monospace', fontSize: '10px',
      color: '#b080ff', stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    t.on('pointerover', () => t.setColor('#ffffff').setScale(1.05));
    t.on('pointerout',  () => t.setColor('#b080ff').setScale(1));
    t.on('pointerdown', cb);
  }
}
