import { WIDTH, HEIGHT } from '../constants.js';
import SpriteFactory from '../utils/SpriteFactory.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: 'Preload' }); }

  create() {
    // Suppress silent audio 404s elsewhere
    this.load.on('loaderror', () => {});

    SpriteFactory.generate(this);

    // Brief loading flash, then menu
    this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x000000).setOrigin(0);
    this.add.text(WIDTH / 2, HEIGHT / 2, 'SOPHIA', {
      fontFamily: 'monospace', fontSize: '18px', color: '#c8a0ff',
    }).setOrigin(0.5);

    this.time.delayedCall(250, () => this.scene.start('MainMenu'));
  }
}
