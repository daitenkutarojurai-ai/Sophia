import { WIDTH, HEIGHT } from '../constants.js';

// 8-panel cinematic drawn from the Pistis Sophia (Askew Codex) and the
// Apocryphon of John. Each panel has lore text, a dominant color, and a
// "visual" function that composes background imagery behind the text.
const PANELS = [
  {
    text: 'In the beginning was the Pleroma —\nthe divine fullness of eternal Light.',
    color: '#ffffff',
    tint: 0x100040,
    visual: 'pleroma',
  },
  {
    text: 'Thirty-two Aeons dwelt within it,\nhalved into consorts of divine balance.',
    color: '#d8b0ff',
    tint: 0x1a0050,
    visual: 'aeons',
  },
  {
    text: 'Sophia, the last and youngest Aeon,\nstood closest to the outer boundary.',
    color: '#c8a0ff',
    tint: 0x200060,
    visual: 'sophia_edge',
  },
  {
    text: 'Moved by a desperate longing\nto know the unknowable Father,\nshe reached beyond the Veil —\nalone, without consort, without consent.',
    color: '#ff90d0',
    tint: 0x401030,
    visual: 'reaching',
  },
  {
    text: 'What emerged from her passion\nwas formless. Ignorant. Arrogant.\n\nYaldabaoth — the lion-faced Demiurge.',
    color: '#ff5040',
    tint: 0x500010,
    visual: 'yaldabaoth',
  },
  {
    text: 'In shame, she cast him\ninto the depths of Chaos\nand veiled him from the Aeons.',
    color: '#a050d0',
    tint: 0x1a0030,
    visual: 'chaos',
  },
  {
    text: 'But the Archons of the 13 Aeons,\ndrawn to her grief,\ndragged Sophia herself into the dark.',
    color: '#8040c0',
    tint: 0x0c0020,
    visual: 'archons',
  },
  {
    text: '"I cried out of the darkness —\nand the Light heard my voice."\n\nHer fall had begun.',
    color: '#ffe080',
    tint: 0x040010,
    visual: 'fall',
  },
];

export default class PrologueScene extends Phaser.Scene {
  constructor() { super({ key: 'Prologue' }); }

  create() {
    this.panelIndex = 0;
    this.typingTimer = null;

    // Layered background — rebuilt per panel
    this.bgTint = this.add.rectangle(0, 0, WIDTH, HEIGHT, 0x000010)
      .setOrigin(0);
    this.bgStars = this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_stars')
      .setOrigin(0).setAlpha(0.75);
    this.bgNebula = this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_nebula')
      .setOrigin(0).setAlpha(0.9);

    this.visualLayer = this.add.container(0, 0);

    // Central lore glow
    this.centerGlow = this.add.circle(WIDTH / 2, HEIGHT / 2 - 20, 40,
      0xc8a0ff, 0.05);
    this.tweens.add({
      targets: this.centerGlow,
      scale: 1.25, alpha: 0.18,
      yoyo: true, repeat: -1, duration: 2200,
      ease: 'Sine.easeInOut',
    });

    // Falling spark particles for atmosphere
    this.add.particles(0, -20, 'spark', {
      x: { min: 0, max: WIDTH },
      y: { min: -10, max: 0 },
      speedY: { min: 15, max: 45 },
      speedX: { min: -8, max: 8 },
      scale: { start: 0.35, end: 0 },
      alpha: { start: 0.5, end: 0 },
      tint: [0xc8a0ff, 0xffffff, 0x8040ff],
      lifespan: 4000,
      frequency: 80,
      quantity: 1,
    });

    // Text box — typewriter target
    this.textBox = this.add.text(WIDTH / 2, HEIGHT / 2 + 40, '', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: WIDTH - 60 },
      lineSpacing: 6,
    }).setOrigin(0.5);

    // Progress dots
    this.dots = [];
    for (let i = 0; i < PANELS.length; i++) {
      const d = this.add.circle(
        WIDTH / 2 + (i - (PANELS.length - 1) / 2) * 10,
        HEIGHT - 14, 2, 0x4020a0
      );
      this.dots.push(d);
    }

    // Prompt
    this.skipText = this.add.text(WIDTH - 8, HEIGHT - 8, '▶ TAP / PRESS', {
      fontFamily: 'monospace', fontSize: '7px', color: '#6a40a0',
    }).setOrigin(1);
    this.tweens.add({
      targets: this.skipText,
      alpha: 0.3, yoyo: true, repeat: -1, duration: 800,
    });

    this.skipAllText = this.add.text(8, HEIGHT - 8, 'ESC — SKIP', {
      fontFamily: 'monospace', fontSize: '7px', color: '#4020a0',
    });

    // Inputs
    this.input.on('pointerdown', () => this._advance());
    this.input.keyboard.on('keydown', (e) => {
      if (e.key === 'Escape') this._endPrologue();
      else this._advance();
    });

    // Camera fade in, start first panel
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.time.delayedCall(600, () => this._showPanel(0));
  }

  update() {
    this.bgStars.tilePositionY -= 0.08;
    this.bgStars.tilePositionX -= 0.02;
    this.bgNebula.tilePositionY -= 0.03;
  }

  // ── Panel machinery ─────────────────────────────────────────────────────────

  _showPanel(idx) {
    const p = PANELS[idx];

    // Paint background tint
    this.tweens.add({
      targets: this.bgTint,
      fillColor: { from: this.bgTint.fillColor, to: p.tint },
      duration: 500,
    });

    // Update dots
    this.dots.forEach((d, i) =>
      d.setFillStyle(i <= idx ? 0xc8a0ff : 0x4020a0));

    // Rebuild visual
    this.visualLayer.removeAll(true);
    this._renderVisual(p.visual);

    // Typewriter text
    this.textBox.setColor(p.color);
    this._typeText(p.text, 28);
  }

  _typeText(full, cps) {
    if (this.typingTimer) this.typingTimer.remove();
    this.textBox.setText('');
    let i = 0;
    this.typingTimer = this.time.addEvent({
      delay: 1000 / cps,
      loop: true,
      callback: () => {
        i++;
        this.textBox.setText(full.slice(0, i));
        if (i >= full.length) {
          this.typingTimer.remove();
          this.typingTimer = null;
          this.isTyping = false;
        }
      },
    });
    this.isTyping = true;
  }

  _advance() {
    const p = PANELS[this.panelIndex];
    if (this.isTyping) {
      // Complete current panel's text immediately
      if (this.typingTimer) { this.typingTimer.remove(); this.typingTimer = null; }
      this.textBox.setText(p.text);
      this.isTyping = false;
      return;
    }
    this.panelIndex++;
    if (this.panelIndex >= PANELS.length) {
      this._endPrologue();
    } else {
      this._showPanel(this.panelIndex);
    }
  }

  _endPrologue() {
    if (this.typingTimer) this.typingTimer.remove();
    this.cameras.main.fadeOut(1200, 0, 0, 0);
    this.time.delayedCall(1300, () => this.scene.start('CharacterSelect'));
  }

  // ── Visuals per panel ───────────────────────────────────────────────────────

  _renderVisual(kind) {
    const cx = WIDTH / 2, cy = HEIGHT / 2 - 30;
    const layer = this.visualLayer;

    switch (kind) {
      case 'pleroma': {
        const glow = this.add.circle(cx, cy, 50, 0xffffff, 0.18);
        layer.add(glow);
        this.tweens.add({ targets: glow, scale: 1.15, yoyo: true,
          repeat: -1, duration: 1800, ease: 'Sine.easeInOut' });
        // Rays
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          const line = this.add.line(cx, cy, 0, 0,
            Math.cos(a) * 140, Math.sin(a) * 140, 0xc8a0ff, 0.2);
          line.setLineWidth(1);
          layer.add(line);
        }
        break;
      }
      case 'aeons': {
        // Two rows of paired gates
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 4; col++) {
            const gx = 60 + col * 100;
            const gy = 50 + row * 80;
            const g = this.add.image(gx, gy, 'aeon_gate').setScale(0.35)
              .setAlpha(0.5 + 0.1 * (col + row));
            layer.add(g);
          }
        }
        break;
      }
      case 'sophia_edge': {
        // Single gate with a figure on its edge
        const g = this.add.image(cx, cy, 'aeon_gate').setScale(0.6)
          .setAlpha(0.7);
        const s = this.add.sprite(cx, cy + 10, 'sophia', 0).setScale(2);
        const halo = this.add.circle(cx, cy - 8, 16, 0xc8a0ff, 0.25);
        layer.add(halo); layer.add(g); layer.add(s);
        this.tweens.add({ targets: halo, scale: 1.3, alpha: 0.4,
          yoyo: true, repeat: -1, duration: 1200 });
        break;
      }
      case 'reaching': {
        const s = this.add.sprite(cx - 30, cy, 'sophia', 0).setScale(2);
        // Reaching hand stylised as glowing arc
        const arcG = this.add.graphics();
        arcG.lineStyle(2, 0xffa0ff, 0.8);
        arcG.beginPath();
        arcG.moveTo(cx - 20, cy - 5);
        arcG.quadraticCurveTo(cx + 10, cy - 35, cx + 40, cy - 10);
        arcG.strokePath();
        // Forbidden veil
        const veil = this.add.rectangle(cx + 50, cy, 2, 100, 0xffffff, 0.7);
        layer.add(veil); layer.add(arcG); layer.add(s);
        this.tweens.add({ targets: veil, alpha: 0.3, yoyo: true,
          repeat: -1, duration: 400 });
        break;
      }
      case 'yaldabaoth': {
        const shadow = this.add.image(cx, cy + 10, 'yaldabaoth').setAlpha(0);
        layer.add(shadow);
        this.tweens.add({ targets: shadow, alpha: 1,
          scale: { from: 0.6, to: 1 }, duration: 1200 });
        // Red aura
        const pulse = this.add.circle(cx, cy, 60, 0xff2020, 0.1);
        layer.add(pulse);
        this.tweens.add({ targets: pulse, scale: 1.4, alpha: 0.2,
          yoyo: true, repeat: -1, duration: 900 });
        break;
      }
      case 'chaos': {
        // Dark pit with concentric rings
        const pit = this.add.graphics();
        pit.fillStyle(0x000000, 1);
        pit.fillCircle(cx, cy + 10, 50);
        pit.lineStyle(1, 0x601020, 0.6);
        for (let i = 1; i <= 5; i++) pit.strokeCircle(cx, cy + 10, i * 10);
        layer.add(pit);
        // Yaldabaoth falling inside
        const y = this.add.image(cx, cy + 10, 'yaldabaoth').setScale(0.35)
          .setAlpha(0.8);
        layer.add(y);
        this.tweens.add({ targets: y, y: cy + 40, alpha: 0.2,
          duration: 2500 });
        break;
      }
      case 'archons': {
        // Three looming Archon silhouettes closing in
        const positions = [[cx - 90, cy + 10], [cx + 90, cy + 10], [cx, cy - 10]];
        positions.forEach(([x, y]) => {
          const a = this.add.image(x, y, 'archon_shadow').setScale(0.8)
            .setAlpha(0.8);
          layer.add(a);
          this.tweens.add({ targets: a, x: cx, alpha: 1,
            duration: 2500, ease: 'Power2' });
        });
        // Sophia center, pulled
        const s = this.add.sprite(cx, cy + 10, 'sophia', 5).setScale(2)
          .setTint(0xff80b0);
        layer.add(s);
        break;
      }
      case 'fall': {
        // Sophia streaking downward through stars
        const s = this.add.sprite(cx, cy - 40, 'sophia', 3).setScale(2);
        layer.add(s);
        this.tweens.add({ targets: s, y: cy + 40,
          rotation: 0.3, repeat: -1, yoyo: true, duration: 1500 });
        // Trails
        for (let i = 0; i < 4; i++) {
          const t = this.add.rectangle(cx + (i - 2) * 6, cy - 20 + i * 12,
            2, 20, 0xffe080, 0.6);
          layer.add(t);
          this.tweens.add({ targets: t, alpha: 0, yoyo: true,
            repeat: -1, duration: 400 + i * 100 });
        }
        break;
      }
    }
  }
}
