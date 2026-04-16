import { WIDTH, HEIGHT, CHARACTERS } from '../constants.js';

export default class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UI' }); }

  init(data) {
    this.level = data.level;
    this.characterId = data.characterId;
  }

  create() {
    const charData = CHARACTERS[this.characterId];
    const style = (size = 8, color = '#c8a0ff') => ({
      fontFamily: 'monospace',
      fontSize: `${size}px`,
      color,
      stroke: '#000', strokeThickness: 2,
    });

    // HUD hearts
    this._hearts = [];
    for (let i = 0; i < 3; i++) {
      const h = this.add.text(8 + i * 12, 8, '♥', style(11, '#ff5090'))
        .setScrollFactor(0).setDepth(100);
      this._hearts.push(h);
    }

    // Spark counter
    this.add.text(8, 24, '✦', style(8, '#ffe060'))
      .setScrollFactor(0).setDepth(100);
    this._sparks = this.add.text(18, 24, '0', style(8, '#ffe060'))
      .setScrollFactor(0).setDepth(100);

    // Level title strip
    this.add.text(WIDTH / 2, 6, this.level.act, style(7, '#6040a0'))
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);
    this.add.text(WIDTH / 2, 16, this.level.name,
      style(8, this.level.worldColor))
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

    // Character badge
    this.add.text(WIDTH - 8, 8, charData.name.toUpperCase(),
      style(9, charData.color))
      .setOrigin(1, 0).setScrollFactor(0).setDepth(100);
    this.add.text(WIDTH - 8, 20, charData.tagline,
      style(6, '#ffd080'))
      .setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Bottom control hint (always visible)
    this.add.text(WIDTH / 2, HEIGHT - 10,
      '← →  MOVE     ↑  JUMP     Z  ' +
        (charData.attack === 'melee' ? 'STRIKE' : 'CAST'),
      style(7, '#a080d0'))
      .setOrigin(0.5).setScrollFactor(0).setDepth(100);

    // Floating lore banner — non-blocking, auto-fade
    this._buildLoreBanner();

    // Subscribe to level events
    const levelScene = this.scene.get('Level');
    levelScene.events.on('hp_updated',     hp => this._updateHp(hp));
    levelScene.events.on('sparks_updated', n  => this._sparks.setText(String(n)));
  }

  _buildLoreBanner() {
    // Small top-center ribbon that doesn't block gameplay
    const y = 40;
    const bg = this.add.rectangle(WIDTH / 2, y + 18, WIDTH - 40, 40,
      0x000000, 0.5).setScrollFactor(0).setDepth(90);
    const sub = this.add.text(WIDTH / 2, y + 8, this.level.subtitle, {
      fontFamily: 'monospace', fontSize: '8px',
      color: '#c8a0ff', fontStyle: 'italic',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(91);
    const lore = this.add.text(WIDTH / 2, y + 22, this.level.lore, {
      fontFamily: 'monospace', fontSize: '7px',
      color: '#a080d0', align: 'center', lineSpacing: 3,
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(91);

    const group = [bg, sub, lore];
    group.forEach(o => o.setAlpha(0));
    this.tweens.add({
      targets: group, alpha: 1, duration: 400,
      onComplete: () => {
        this.time.delayedCall(2600, () => {
          this.tweens.add({
            targets: group, alpha: 0, duration: 700,
            onComplete: () => group.forEach(o => o.destroy()),
          });
        });
      },
    });
  }

  _updateHp(hp) {
    this._hearts.forEach((h, i) => {
      h.setColor(i < hp ? '#ff5090' : '#401020');
      h.setText(i < hp ? '♥' : '♡');
    });
  }
}
