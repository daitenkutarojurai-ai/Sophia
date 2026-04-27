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
      '← →  MOVE   ↑  JUMP   Z  ' +
        (charData.attack === 'melee' ? 'STRIKE' : 'CAST') +
        '   ESC  PAUSE',
      style(7, '#a080d0'))
      .setOrigin(0.5).setScrollFactor(0).setDepth(100);

    // Floating lore banner — non-blocking, auto-fade
    this._buildLoreBanner();
    this._buildComboCounter();
    this._buildBossBar();
    this._buildPauseOverlay();

    // Subscribe to level events
    const levelScene = this.scene.get('Level');
    levelScene.events.on('hp_updated',     hp => this._updateHp(hp));
    levelScene.events.on('sparks_updated', n  => this._sparks.setText(String(n)));
    levelScene.events.on('combo_hit',      () => this._onComboHit());
    levelScene.events.on('game_paused',    p  => this._setPaused(p));
    levelScene.events.on('boss_activated', b  => this._onBossActivated(b));
    levelScene.events.on('boss_hp',        d  => this._onBossHp(d));
    levelScene.events.on('boss_killed',    () => this._onBossKilled());

    // ESC resumes game while UI scene is active (level scene may be paused)
    this.input.keyboard.on('keydown-ESC', () => {
      const lvl = this.scene.get('Level');
      if (lvl?.isPaused) lvl._togglePause();
    });
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

  _buildComboCounter() {
    this._comboCount = 0;
    this._comboTimer = null;
    this._comboText = this.add.text(WIDTH - 8, HEIGHT - 22, '', {
      fontFamily: 'monospace', fontSize: '9px',
      color: '#ffb040', stroke: '#000', strokeThickness: 2,
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);
  }

  _onComboHit() {
    this._comboCount++;
    if (this._comboTimer) this._comboTimer.remove();
    if (this._comboCount > 1) {
      this._comboText.setText(`${this._comboCount}× HIT!`);
      this.tweens.killTweensOf(this._comboText);
      this._comboText.setScale(1.4);
      this.tweens.add({
        targets: this._comboText, scaleX: 1, scaleY: 1, duration: 130,
        ease: 'Sine.easeOut',
      });
    }
    this._comboTimer = this.time.delayedCall(1500, () => {
      this._comboCount = 0;
      this._comboText.setText('');
    });
  }

  _buildBossBar() {
    const w = WIDTH - 60, h = 6;
    const cx = WIDTH / 2, y = HEIGHT - 32;
    const frame = this.add.rectangle(cx, y, w + 4, h + 4, 0x000000, 0.8)
      .setScrollFactor(0).setDepth(140);
    const fill = this.add.rectangle(cx - w / 2, y, w, h, 0xff5020, 1)
      .setOrigin(0, 0.5).setScrollFactor(0).setDepth(141);
    const label = this.add.text(cx, y - 11, '', {
      fontFamily: 'monospace', fontSize: '8px',
      color: '#ffe060', stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(141);

    this._bossBar = { frame, fill, label, fullWidth: w };
    [frame, fill, label].forEach(o => o.setVisible(false));
  }

  _onBossActivated(boss) {
    if (!this._bossBar) return;
    const { frame, fill, label } = this._bossBar;
    label.setText(`${boss.bossName.toUpperCase()} — ${boss.bossTitle}`);
    [frame, fill, label].forEach(o => { o.setVisible(true); o.setAlpha(0); });
    fill.width = this._bossBar.fullWidth;
    this.tweens.add({ targets: [frame, fill, label], alpha: 1, duration: 350 });
  }

  _onBossHp({ hp, max }) {
    if (!this._bossBar?.fill.visible) return;
    const ratio = Math.max(0, hp / max);
    this.tweens.killTweensOf(this._bossBar.fill);
    this.tweens.add({
      targets: this._bossBar.fill,
      width: this._bossBar.fullWidth * ratio,
      duration: 200, ease: 'Sine.easeOut',
    });
  }

  _onBossKilled() {
    if (!this._bossBar) return;
    const { frame, fill, label } = this._bossBar;
    this.tweens.add({
      targets: [frame, fill, label], alpha: 0, duration: 600,
      onComplete: () => [frame, fill, label].forEach(o => o.setVisible(false)),
    });
  }

  _buildPauseOverlay() {
    const bg = this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x000000, 0.72)
      .setScrollFactor(0).setDepth(200);
    const title = this.add.text(WIDTH / 2, HEIGHT / 2 - 18, 'PAUSED', {
      fontFamily: 'monospace', fontSize: '22px',
      color: '#c8a0ff', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
    const hint = this.add.text(WIDTH / 2, HEIGHT / 2 + 6, 'Press ESC to resume', {
      fontFamily: 'monospace', fontSize: '7px', color: '#8060b0',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
    this._pauseObjects = [bg, title, hint];
    this._pauseObjects.forEach(o => o.setVisible(false));
  }

  _setPaused(paused) {
    this._pauseObjects?.forEach(o => o.setVisible(paused));
  }

  _updateHp(hp) {
    this._hearts.forEach((h, i) => {
      h.setColor(i < hp ? '#ff5090' : '#401020');
      h.setText(i < hp ? '♥' : '♡');
    });
  }
}
