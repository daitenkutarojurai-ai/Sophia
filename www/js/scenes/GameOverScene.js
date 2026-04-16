import { WIDTH, HEIGHT } from '../constants.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOver' }); }

  init(data) {
    this.levelIndex = data?.levelIndex ?? 0;
    this.characterId = data?.character ?? 'sophia';
  }

  create() {
    this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x08000a).setOrigin(0);
    this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_chaos')
      .setOrigin(0).setAlpha(0.7);

    // Cracks of red falling
    this.add.particles(0, 0, 'spark', {
      x: { min: 0, max: WIDTH }, y: -10,
      speedY: { min: 20, max: 60 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.35, end: 0 },
      tint: [0x801020, 0x400010],
      lifespan: 4500, frequency: 200, quantity: 1,
    });

    const title = this.add.text(WIDTH / 2, 70, 'THE LIGHT IS LOST', {
      fontFamily: 'monospace', fontSize: '18px',
      color: '#ff4080', stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);
    this.tweens.add({
      targets: title, alpha: 0.7,
      yoyo: true, repeat: -1, duration: 1200,
    });

    this.add.text(WIDTH / 2, 105,
      '"I cried out of the darkness,\nand thou didst hear my voice."', {
        fontFamily: 'monospace', fontSize: '8px',
        color: '#a070c0', align: 'center',
        fontStyle: 'italic', lineSpacing: 4,
      }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 135,
      '— Pistis Sophia, 39th Repentance', {
        fontFamily: 'monospace', fontSize: '6px', color: '#604090',
      }).setOrigin(0.5);

    this._btn(175, 'RETURN TO THE AEON',
      () => this.scene.start('Level',
        { levelIndex: this.levelIndex, character: this.characterId }));
    this._btn(200, 'CHANGE VESSEL',
      () => this.scene.start('CharacterSelect'));
    this._btn(225, 'FALL INTO SILENCE',
      () => this.scene.start('MainMenu'));

    this.cameras.main.fadeIn(500, 40, 0, 0);
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
