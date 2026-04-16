import { WIDTH, HEIGHT, GAME_VERSION } from '../constants.js';

export default class MainMenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MainMenu' }); }

  create() {
    // Deep space background
    this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x020008).setOrigin(0);

    this.stars = this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_stars')
      .setOrigin(0);
    this.nebula = this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_nebula')
      .setOrigin(0).setAlpha(0.9);

    // Distant Aeon gates (parallax)
    this.add.image(90, 130, 'aeon_gate').setScale(0.6).setAlpha(0.25);
    this.add.image(WIDTH - 90, 130, 'aeon_gate').setScale(0.6).setAlpha(0.25);

    // Central Pleroma light
    const center = this.add.circle(WIDTH / 2, 90, 50, 0xc8a0ff, 0.08);
    this.tweens.add({
      targets: center,
      scale: 1.3, alpha: 0.18,
      yoyo: true, repeat: -1, duration: 2400, ease: 'Sine.easeInOut',
    });

    // Falling sparks
    this.add.particles(0, -20, 'spark', {
      x: { min: 0, max: WIDTH },
      y: { min: -10, max: 0 },
      speedY: { min: 10, max: 40 },
      speedX: { min: -5, max: 5 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 0.5, end: 0 },
      tint: [0xc8a0ff, 0xffffff, 0xffe080],
      lifespan: 5000,
      frequency: 120,
      quantity: 1,
    });

    // Title — layered for glow
    this.add.text(WIDTH / 2 + 1, 70 + 1, 'SOPHIA', {
      fontFamily: 'monospace', fontSize: '42px', color: '#301060',
    }).setOrigin(0.5);
    const title = this.add.text(WIDTH / 2, 70, 'SOPHIA', {
      fontFamily: 'monospace', fontSize: '42px', color: '#ffe8ff',
      stroke: '#6020a0', strokeThickness: 4,
    }).setOrigin(0.5);
    this.tweens.add({
      targets: title,
      alpha: { from: 0.85, to: 1 },
      yoyo: true, repeat: -1, duration: 1600, ease: 'Sine.easeInOut',
    });

    // Subtitle
    this.add.text(WIDTH / 2, 108, '— THE FALL OF LIGHT —', {
      fontFamily: 'monospace', fontSize: '10px', color: '#c8a0ff',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5);

    // Epigraph (Pistis Sophia ref)
    this.add.text(WIDTH / 2, 140,
      '"She who fell from the Pleroma\nshall rise as the Light-Maiden."', {
        fontFamily: 'monospace', fontSize: '8px', color: '#8060c0',
        align: 'center', lineSpacing: 4,
        fontStyle: 'italic',
      }).setOrigin(0.5);

    this.add.text(WIDTH / 2, 162, '— Pistis Sophia, Codex Askewianus', {
      fontFamily: 'monospace', fontSize: '6px', color: '#604090',
    }).setOrigin(0.5);

    // Menu
    this._addBtn(WIDTH / 2, 192, 'BEGIN THE DESCENT',
      () => this.scene.start('Prologue'));
    this._addBtn(WIDTH / 2, 214, 'SKIP PROLOGUE',
      () => this.scene.start('CharacterSelect'));

    // Controls hint
    this.add.text(WIDTH / 2, 240,
      'Arrows — move / jump      Z — strike / seal', {
        fontFamily: 'monospace', fontSize: '7px', color: '#604090',
      }).setOrigin(0.5);

    this.add.text(WIDTH - 4, HEIGHT - 4, 'v' + GAME_VERSION, {
      fontFamily: 'monospace', fontSize: '6px', color: '#2a1050',
    }).setOrigin(1);

    this.input.keyboard.once('keydown-ENTER',
      () => this.scene.start('Prologue'));

    this.cameras.main.fadeIn(700, 0, 0, 0);
  }

  update() {
    this.stars.tilePositionX -= 0.08;
    this.stars.tilePositionY -= 0.03;
    this.nebula.tilePositionX += 0.04;
  }

  _addBtn(x, y, label, cb) {
    const t = this.add.text(x, y, label, {
      fontFamily: 'monospace', fontSize: '11px', color: '#c8a0ff',
      stroke: '#1a0040', strokeThickness: 3,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    t.on('pointerover', () => t.setColor('#ffffff').setScale(1.08));
    t.on('pointerout',  () => t.setColor('#c8a0ff').setScale(1));
    t.on('pointerdown', cb);
  }
}
