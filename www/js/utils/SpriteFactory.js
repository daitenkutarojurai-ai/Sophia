/**
 * SpriteFactory — renders every texture procedurally to an off-screen canvas
 * and registers it with Phaser's Textures manager. Target: richer, layered
 * pixel art (base + highlight + shadow) within 480x270 constraints.
 *
 * Character strips (horizontal):
 *   sophia   6 frames × 28w × 40h  (0 idle, 1-2 run, 3 jump, 4 attack, 5 hurt)
 *   jesus    6 frames × 28w × 42h  (0 idle, 1-2 walk, 3 jump, 4 cast, 5 hurt)
 *   archon   2 frames × 28w × 28h  (0-1 walk)
 */
export default class SpriteFactory {
  static generate(scene) {
    SpriteFactory._sophia(scene);
    SpriteFactory._jesus(scene);
    SpriteFactory._archonScout(scene);
    SpriteFactory._spark(scene);
    SpriteFactory._orb(scene);
    SpriteFactory._seal(scene);
    SpriteFactory._portal(scene);
    SpriteFactory._platform(scene);
    SpriteFactory._bgStars(scene);
    SpriteFactory._bgNebula(scene);
    SpriteFactory._bgChaos(scene);
    SpriteFactory._bgAscent(scene);
    SpriteFactory._aeonGate(scene);
    SpriteFactory._yaldabaothSilhouette(scene);
    SpriteFactory._archonSilhouette(scene);
    SpriteFactory._authadesBoss(scene);
    SpriteFactory._fireball(scene);
    SpriteFactory._paraplexBoss(scene);
    SpriteFactory._shadowBolt(scene);
    SpriteFactory._hekateBoss(scene);
    SpriteFactory._mirrorOrb(scene);
    SpriteFactory._ariouthBoss(scene);
    SpriteFactory._rockShard(scene);
    SpriteFactory._crown(scene);
  }

  // ── Authades — the Self-Willed (Archon I, Fire) ────────────────────────────

  static _authadesBoss(scene) {
    const fw = 56, fh = 56, frames = 2;
    const { canvas, ctx } = SpriteFactory._canvas(fw * frames, fh);

    for (let i = 0; i < frames; i++) {
      const ox = i * fw;
      const cx = ox + fw / 2;
      const bob = i === 0 ? 0 : -1;

      // Outer fire halo
      const halo = ctx.createRadialGradient(cx, 28 + bob, 6, cx, 28 + bob, 30);
      halo.addColorStop(0, 'rgba(255, 220, 80, 0.55)');
      halo.addColorStop(0.5, 'rgba(255, 100, 30, 0.35)');
      halo.addColorStop(1, 'rgba(120, 0, 0, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(ox, 0, fw, fh);

      // Mane (jagged spikes around head)
      ctx.fillStyle = '#a02010';
      const spikeOffset = i === 0 ? 0 : 1;
      for (let s = 0; s < 14; s++) {
        const a = (s / 14) * Math.PI * 2 + spikeOffset * 0.1;
        const r1 = 16, r2 = 24 + (s % 2) * 2;
        SpriteFactory._triangle(ctx,
          cx + Math.cos(a) * r1, 24 + bob + Math.sin(a) * r1,
          cx + Math.cos(a + 0.18) * r1, 24 + bob + Math.sin(a + 0.18) * r1,
          cx + Math.cos(a + 0.09) * r2, 24 + bob + Math.sin(a + 0.09) * r2);
      }
      // Mane gradient highlight
      ctx.fillStyle = 'rgba(255, 120, 30, 0.6)';
      for (let s = 0; s < 7; s++) {
        const a = (s / 7) * Math.PI * 2 + spikeOffset * 0.1;
        SpriteFactory._triangle(ctx,
          cx + Math.cos(a) * 14, 24 + bob + Math.sin(a) * 14,
          cx + Math.cos(a + 0.15) * 14, 24 + bob + Math.sin(a + 0.15) * 14,
          cx + Math.cos(a + 0.07) * 22, 24 + bob + Math.sin(a + 0.07) * 22);
      }

      // Lion head body
      ctx.fillStyle = '#7a1010';
      SpriteFactory._circle(ctx, cx, 24 + bob, 14);
      // Face plate
      const faceG = ctx.createLinearGradient(0, 18 + bob, 0, 36 + bob);
      faceG.addColorStop(0, '#c04020');
      faceG.addColorStop(1, '#5a0808');
      ctx.fillStyle = faceG;
      SpriteFactory._circle(ctx, cx, 24 + bob, 11);

      // Snout
      ctx.fillStyle = '#3a0808';
      ctx.fillRect(cx - 4, 28 + bob, 8, 5);
      // Nose
      ctx.fillStyle = '#1a0000';
      ctx.fillRect(cx - 2, 29 + bob, 4, 2);

      // Glowing burning eyes
      const eyeGlow = ctx.createRadialGradient(cx, 22 + bob, 0.5, cx, 22 + bob, 7);
      eyeGlow.addColorStop(0, '#ffffe0');
      eyeGlow.addColorStop(0.5, '#ffa030');
      eyeGlow.addColorStop(1, 'rgba(180, 30, 0, 0)');
      ctx.fillStyle = eyeGlow;
      ctx.fillRect(cx - 8, 18 + bob, 16, 8);
      ctx.fillStyle = '#ffe040';
      ctx.fillRect(cx - 5, 22 + bob, 3, 2);
      ctx.fillRect(cx + 2, 22 + bob, 3, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 5, 22 + bob, 1, 1);
      ctx.fillRect(cx + 2, 22 + bob, 1, 1);

      // Fangs
      ctx.fillStyle = '#fff8d0';
      SpriteFactory._triangle(ctx, cx - 3, 32 + bob, cx - 1, 32 + bob, cx - 2, 36 + bob);
      SpriteFactory._triangle(ctx, cx + 1, 32 + bob, cx + 3, 32 + bob, cx + 2, 36 + bob);

      // Crown / horn (sign of the Self-Willed)
      ctx.fillStyle = '#ffd040';
      SpriteFactory._triangle(ctx, cx - 4, 11 + bob, cx, 5 + bob, cx + 4, 11 + bob);
      ctx.fillStyle = '#ff8020';
      ctx.fillRect(cx - 1, 7 + bob, 2, 4);

      // Lower body silhouette / claws
      ctx.fillStyle = '#3a0408';
      ctx.fillRect(cx - 12, 40, 24, 12);
      // Claws
      for (let c = 0; c < 4; c++) {
        SpriteFactory._triangle(ctx,
          cx - 12 + c * 8, 52,
          cx - 10 + c * 8, 56,
          cx - 8 + c * 8, 52);
      }

      // Hurt overlay (frame 1 = subtle damage tint)
      if (i === 1) {
        ctx.fillStyle = 'rgba(255, 200, 100, 0.15)';
        ctx.fillRect(ox, 0, fw, fh);
      }
    }

    SpriteFactory._addSheet(scene, 'authades', canvas, fw, fh);
  }

  // ── Fireball — boss projectile ─────────────────────────────────────────────

  static _fireball(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(16, 16);
    // Outer flame halo
    const halo = ctx.createRadialGradient(8, 8, 1, 8, 8, 8);
    halo.addColorStop(0, '#fff8c0');
    halo.addColorStop(0.4, '#ff8020');
    halo.addColorStop(1, 'rgba(180, 0, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 16, 16);
    // Hot core
    ctx.fillStyle = '#ffe060';
    SpriteFactory._circle(ctx, 8, 8, 3);
    ctx.fillStyle = '#ffffff';
    SpriteFactory._circle(ctx, 7, 7, 1.2);
    SpriteFactory._addImage(scene, 'fireball', canvas);
  }

  // ── Paraplex — the Confuser (Archon II, Shadow) ────────────────────────────

  static _paraplexBoss(scene) {
    const fw = 56, fh = 56, frames = 2;
    const { canvas, ctx } = SpriteFactory._canvas(fw * frames, fh);

    for (let i = 0; i < frames; i++) {
      const ox = i * fw;
      const cx = ox + fw / 2;
      const bob = i === 0 ? 0 : -2;

      // Outer void halo
      const halo = ctx.createRadialGradient(cx, 28 + bob, 4, cx, 28 + bob, 30);
      halo.addColorStop(0, 'rgba(120, 80, 220, 0.55)');
      halo.addColorStop(0.5, 'rgba(60, 20, 150, 0.35)');
      halo.addColorStop(1, 'rgba(20, 0, 60, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(ox, 0, fw, fh);

      // Trailing shadow tendrils
      ctx.fillStyle = 'rgba(60, 20, 120, 0.65)';
      for (let s = 0; s < 8; s++) {
        const a = (s / 8) * Math.PI * 2 + (i ? 0.15 : 0);
        const r1 = 16, r2 = 26 + (s % 2) * 3;
        SpriteFactory._triangle(ctx,
          cx + Math.cos(a) * r1, 28 + bob + Math.sin(a) * r1,
          cx + Math.cos(a + 0.22) * r1, 28 + bob + Math.sin(a + 0.22) * r1,
          cx + Math.cos(a + 0.11) * r2, 28 + bob + Math.sin(a + 0.11) * r2);
      }

      // Hooded body
      const robeG = ctx.createLinearGradient(0, 14 + bob, 0, 48);
      robeG.addColorStop(0, '#3a1080');
      robeG.addColorStop(0.6, '#1a0050');
      robeG.addColorStop(1, '#08001a');
      ctx.fillStyle = robeG;
      ctx.beginPath();
      ctx.moveTo(cx - 8, 14 + bob);
      ctx.quadraticCurveTo(cx - 16, 28, cx - 14, 48);
      ctx.lineTo(cx + 14, 48);
      ctx.quadraticCurveTo(cx + 16, 28, cx + 8, 14 + bob);
      ctx.quadraticCurveTo(cx, 6 + bob, cx - 8, 14 + bob);
      ctx.closePath();
      ctx.fill();

      // Hood interior shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.beginPath();
      ctx.moveTo(cx - 6, 16 + bob);
      ctx.quadraticCurveTo(cx, 12 + bob, cx + 6, 16 + bob);
      ctx.lineTo(cx + 7, 30 + bob);
      ctx.quadraticCurveTo(cx, 33 + bob, cx - 7, 30 + bob);
      ctx.closePath();
      ctx.fill();

      // Multiple eyes (glowing violet)
      const eyeColors = ['#c0a0ff', '#a080ff', '#ffe0ff'];
      const eyes = [
        [cx - 4, 21 + bob], [cx + 4, 21 + bob],
        [cx - 2, 26 + bob], [cx + 2, 26 + bob],
      ];
      for (let e = 0; e < eyes.length; e++) {
        const [ex, ey] = eyes[e];
        const eg = ctx.createRadialGradient(ex, ey, 0.5, ex, ey, 4);
        eg.addColorStop(0, eyeColors[e % eyeColors.length]);
        eg.addColorStop(1, 'rgba(80, 30, 180, 0)');
        ctx.fillStyle = eg;
        ctx.fillRect(ex - 4, ey - 4, 8, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ex, ey, 1, 1);
      }

      // Crown of thorns
      ctx.strokeStyle = '#8060c0';
      ctx.lineWidth = 1;
      for (let h = 0; h < 5; h++) {
        const hx = cx - 8 + h * 4;
        ctx.beginPath();
        ctx.moveTo(hx, 14 + bob);
        ctx.lineTo(hx + 1, 8 + bob);
        ctx.stroke();
      }

      if (i === 1) {
        ctx.fillStyle = 'rgba(200, 160, 255, 0.18)';
        ctx.fillRect(ox, 0, fw, fh);
      }
    }

    SpriteFactory._addSheet(scene, 'paraplex', canvas, fw, fh);
  }

  static _shadowBolt(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(16, 16);
    const halo = ctx.createRadialGradient(8, 8, 1, 8, 8, 8);
    halo.addColorStop(0, '#e0c0ff');
    halo.addColorStop(0.4, '#6040c0');
    halo.addColorStop(1, 'rgba(20, 0, 60, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 16, 16);
    // Dark core
    ctx.fillStyle = '#200050';
    SpriteFactory._circle(ctx, 8, 8, 3);
    // Inner spark
    ctx.fillStyle = '#c0a0ff';
    SpriteFactory._circle(ctx, 8, 8, 1.5);
    ctx.fillStyle = '#ffffff';
    SpriteFactory._circle(ctx, 7, 7, 0.8);
    SpriteFactory._addImage(scene, 'shadow_bolt', canvas);
  }

  // ── Hekate — the Triple-Faced (Archon III, Illusion) ──────────────────────

  static _hekateBoss(scene) {
    const fw = 56, fh = 56, frames = 2;
    const { canvas, ctx } = SpriteFactory._canvas(fw * frames, fh);

    for (let i = 0; i < frames; i++) {
      const ox = i * fw;
      const cx = ox + fw / 2;
      const bob = i === 0 ? 0 : -1;

      // Mirror halo (cyan)
      const halo = ctx.createRadialGradient(cx, 26 + bob, 4, cx, 26 + bob, 28);
      halo.addColorStop(0, 'rgba(160, 240, 255, 0.55)');
      halo.addColorStop(0.5, 'rgba(60, 160, 220, 0.3)');
      halo.addColorStop(1, 'rgba(0, 40, 80, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(ox, 0, fw, fh);

      // Triple silhouette: side faces fainter
      const drawHead = (offsetX, alpha, scale) => {
        ctx.globalAlpha = alpha;
        const headG = ctx.createLinearGradient(0, 10 + bob, 0, 30 + bob);
        headG.addColorStop(0, '#e0f8ff');
        headG.addColorStop(1, '#4080a0');
        ctx.fillStyle = headG;
        SpriteFactory._circle(ctx, cx + offsetX, 18 + bob, 7 * scale);
        // Eyes
        ctx.fillStyle = '#001020';
        ctx.fillRect(cx + offsetX - 3, 17 + bob, 1, 2);
        ctx.fillRect(cx + offsetX + 2, 17 + bob, 1, 2);
        ctx.fillStyle = '#80ffff';
        ctx.fillRect(cx + offsetX - 3, 17 + bob, 1, 1);
        ctx.fillRect(cx + offsetX + 2, 17 + bob, 1, 1);
        ctx.globalAlpha = 1;
      };
      drawHead(-9, 0.5, 0.9);
      drawHead(9, 0.5, 0.9);

      // Robed body
      const robeG = ctx.createLinearGradient(0, 22 + bob, 0, 50);
      robeG.addColorStop(0, '#80c0e0');
      robeG.addColorStop(0.5, '#4080b0');
      robeG.addColorStop(1, '#101a40');
      ctx.fillStyle = robeG;
      ctx.beginPath();
      ctx.moveTo(cx - 10, 22 + bob);
      ctx.lineTo(cx + 10, 22 + bob);
      ctx.lineTo(cx + 16, 50);
      ctx.lineTo(cx - 16, 50);
      ctx.closePath();
      ctx.fill();

      // Mirror disc on chest
      const disc = ctx.createRadialGradient(cx, 32 + bob, 1, cx, 32 + bob, 6);
      disc.addColorStop(0, '#ffffff');
      disc.addColorStop(0.6, '#80ffff');
      disc.addColorStop(1, 'rgba(40, 120, 180, 0)');
      ctx.fillStyle = disc;
      ctx.fillRect(cx - 6, 26 + bob, 12, 12);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, 32 + bob, 5, 0, Math.PI * 2);
      ctx.stroke();

      // Center face (the "real" face)
      drawHead(0, 1, 1);

      // Triple crown points
      ctx.fillStyle = '#80ffff';
      SpriteFactory._triangle(ctx, cx - 4, 11 + bob, cx, 5 + bob, cx + 4, 11 + bob);
      ctx.fillStyle = '#a0e0ff';
      SpriteFactory._triangle(ctx, cx - 8, 13 + bob, cx - 6, 8 + bob, cx - 4, 13 + bob);
      SpriteFactory._triangle(ctx, cx + 4, 13 + bob, cx + 6, 8 + bob, cx + 8, 13 + bob);

      // Lower hem
      ctx.fillStyle = '#08102a';
      ctx.fillRect(cx - 16, 50, 32, 4);

      if (i === 1) {
        ctx.fillStyle = 'rgba(200, 240, 255, 0.18)';
        ctx.fillRect(ox, 0, fw, fh);
      }
    }

    SpriteFactory._addSheet(scene, 'hekate', canvas, fw, fh);
  }

  static _mirrorOrb(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(16, 16);
    const halo = ctx.createRadialGradient(8, 8, 1, 8, 8, 8);
    halo.addColorStop(0, '#ffffff');
    halo.addColorStop(0.4, '#80ffff');
    halo.addColorStop(1, 'rgba(40, 120, 180, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = '#a0ffff';
    SpriteFactory._circle(ctx, 8, 8, 3);
    // Mirror sheen
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(7, 7, 2, Math.PI * 0.2, Math.PI * 0.7);
    ctx.stroke();
    SpriteFactory._addImage(scene, 'mirror_orb', canvas);
  }

  // ── Ariouth — the Devourer (Archon IV, Earth) ──────────────────────────────

  static _ariouthBoss(scene) {
    const fw = 64, fh = 56, frames = 2;
    const { canvas, ctx } = SpriteFactory._canvas(fw * frames, fh);

    for (let i = 0; i < frames; i++) {
      const ox = i * fw;
      const cx = ox + fw / 2;
      const bob = i === 0 ? 0 : 1;

      // Earthen aura (dust glow)
      const halo = ctx.createRadialGradient(cx, 36 + bob, 6, cx, 36 + bob, 32);
      halo.addColorStop(0, 'rgba(200, 160, 80, 0.4)');
      halo.addColorStop(0.6, 'rgba(120, 80, 30, 0.2)');
      halo.addColorStop(1, 'rgba(40, 20, 0, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(ox, 0, fw, fh);

      // Massive squat body
      const bodyG = ctx.createLinearGradient(0, 22 + bob, 0, 54);
      bodyG.addColorStop(0, '#806030');
      bodyG.addColorStop(0.5, '#604020');
      bodyG.addColorStop(1, '#201808');
      ctx.fillStyle = bodyG;
      ctx.beginPath();
      ctx.moveTo(cx - 20, 22 + bob);
      ctx.lineTo(cx + 20, 22 + bob);
      ctx.lineTo(cx + 24, 54);
      ctx.lineTo(cx - 24, 54);
      ctx.closePath();
      ctx.fill();

      // Crusted shell pattern
      ctx.fillStyle = '#a08040';
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 5; c++) {
          ctx.fillRect(cx - 18 + c * 8, 26 + r * 6 + bob, 3, 2);
        }
      }

      // Maw — gaping toothed mouth
      ctx.fillStyle = '#100408';
      ctx.beginPath();
      ctx.moveTo(cx - 14, 30 + bob);
      ctx.quadraticCurveTo(cx, 48 + bob, cx + 14, 30 + bob);
      ctx.lineTo(cx + 12, 32 + bob);
      ctx.quadraticCurveTo(cx, 44 + bob, cx - 12, 32 + bob);
      ctx.closePath();
      ctx.fill();

      // Inner maw glow (red)
      const mawG = ctx.createRadialGradient(cx, 38 + bob, 1, cx, 38 + bob, 10);
      mawG.addColorStop(0, '#ffa040');
      mawG.addColorStop(0.6, '#a02010');
      mawG.addColorStop(1, 'rgba(40, 0, 0, 0)');
      ctx.fillStyle = mawG;
      ctx.fillRect(cx - 12, 32 + bob, 24, 14);

      // Teeth (top row + bottom row)
      ctx.fillStyle = '#fff8d0';
      for (let t = 0; t < 6; t++) {
        const tx = cx - 12 + t * 5;
        SpriteFactory._triangle(ctx, tx, 31 + bob, tx + 2, 31 + bob, tx + 1, 36 + bob);
      }
      for (let t = 0; t < 5; t++) {
        const tx = cx - 10 + t * 5;
        SpriteFactory._triangle(ctx, tx, 46 + bob, tx + 2, 46 + bob, tx + 1, 41 + bob);
      }

      // Two tiny eyes above the maw
      const eg = ctx.createRadialGradient(cx, 22 + bob, 0.5, cx, 22 + bob, 6);
      eg.addColorStop(0, '#ffe080');
      eg.addColorStop(1, 'rgba(180, 30, 0, 0)');
      ctx.fillStyle = eg;
      ctx.fillRect(cx - 10, 18 + bob, 20, 8);
      ctx.fillStyle = '#ffe040';
      ctx.fillRect(cx - 6, 22 + bob, 2, 2);
      ctx.fillRect(cx + 4, 22 + bob, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 6, 22 + bob, 1, 1);
      ctx.fillRect(cx + 4, 22 + bob, 1, 1);

      // Stone horns
      ctx.fillStyle = '#604020';
      SpriteFactory._triangle(ctx, cx - 22, 22 + bob, cx - 18, 12 + bob, cx - 14, 22 + bob);
      SpriteFactory._triangle(ctx, cx + 14, 22 + bob, cx + 18, 12 + bob, cx + 22, 22 + bob);

      // Heavy claws
      ctx.fillStyle = '#1a1004';
      for (let c = 0; c < 5; c++) {
        SpriteFactory._triangle(ctx,
          cx - 22 + c * 11, 54,
          cx - 19 + c * 11, 56,
          cx - 16 + c * 11, 54);
      }

      if (i === 1) {
        ctx.fillStyle = 'rgba(255, 200, 100, 0.12)';
        ctx.fillRect(ox, 0, fw, fh);
      }
    }

    SpriteFactory._addSheet(scene, 'ariouth', canvas, fw, fh);
  }

  static _rockShard(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(16, 16);
    // Outer dust glow
    const halo = ctx.createRadialGradient(8, 8, 1, 8, 8, 8);
    halo.addColorStop(0, 'rgba(200, 160, 80, 0.4)');
    halo.addColorStop(1, 'rgba(40, 20, 0, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 16, 16);
    // Jagged rock body
    ctx.fillStyle = '#806030';
    ctx.beginPath();
    ctx.moveTo(3, 8);
    ctx.lineTo(7, 2);
    ctx.lineTo(13, 5);
    ctx.lineTo(14, 11);
    ctx.lineTo(9, 14);
    ctx.lineTo(2, 12);
    ctx.closePath();
    ctx.fill();
    // Highlight
    ctx.fillStyle = '#a88440';
    ctx.beginPath();
    ctx.moveTo(5, 6);
    ctx.lineTo(8, 4);
    ctx.lineTo(9, 7);
    ctx.lineTo(6, 8);
    ctx.closePath();
    ctx.fill();
    // Shadow
    ctx.fillStyle = '#402008';
    ctx.fillRect(9, 11, 4, 2);
    SpriteFactory._addImage(scene, 'rock_shard', canvas);
  }

  // ── Sophia — the Light-Maiden, angelic gold form ──────────────────────────

  static _sophia(scene) {
    const fw = 36, fh = 44, frames = 6;
    const { canvas, ctx } = SpriteFactory._canvas(fw * frames, fh);

    for (let i = 0; i < frames; i++) {
      const ox = i * fw;
      const cx = ox + fw / 2;
      const bob = (i === 0 || i === 5) ? 0 : (i === 1 ? -1 : (i === 2 ? 1 : 0));

      // ── Radiant aura (back halo of light) ──
      const aura = ctx.createRadialGradient(cx, 20 + bob, 4, cx, 20 + bob, 22);
      aura.addColorStop(0, 'rgba(255, 255, 200, 0.55)');
      aura.addColorStop(0.5, 'rgba(255, 220, 120, 0.25)');
      aura.addColorStop(1, 'rgba(255, 200, 80, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(ox, 0, fw, fh);

      // ── Wings (feathered, symmetrical) ──
      const wingFlap = (i === 1 || i === 3) ? 1 : (i === 2 || i === 4 ? -1 : 0);
      const wingG = ctx.createLinearGradient(0, 14, 0, 32);
      wingG.addColorStop(0, '#ffffff');
      wingG.addColorStop(0.5, '#fff0b0');
      wingG.addColorStop(1, '#d8a050');
      ctx.fillStyle = wingG;
      // Left wing
      ctx.beginPath();
      ctx.moveTo(cx - 5, 18 + bob);
      ctx.quadraticCurveTo(cx - 18 - wingFlap, 14, cx - 16, 28);
      ctx.quadraticCurveTo(cx - 14, 26, cx - 8, 26 + bob);
      ctx.closePath();
      ctx.fill();
      // Right wing
      ctx.beginPath();
      ctx.moveTo(cx + 5, 18 + bob);
      ctx.quadraticCurveTo(cx + 18 + wingFlap, 14, cx + 16, 28);
      ctx.quadraticCurveTo(cx + 14, 26, cx + 8, 26 + bob);
      ctx.closePath();
      ctx.fill();
      // Wing feather outlines
      ctx.strokeStyle = 'rgba(200, 140, 40, 0.7)';
      ctx.lineWidth = 1;
      for (const s of [-1, 1]) {
        for (let f = 0; f < 3; f++) {
          ctx.beginPath();
          ctx.moveTo(cx + s * (6 + f * 3), 20 + bob);
          ctx.lineTo(cx + s * (14 + f * 1), 24 + f * 2);
          ctx.stroke();
        }
      }

      // ── Hair back layer (platinum-gold, flowing) ──
      const hairGrad = ctx.createLinearGradient(0, 6 + bob, 0, 30);
      hairGrad.addColorStop(0, '#fff6c0');
      hairGrad.addColorStop(1, '#d8a040');
      ctx.fillStyle = hairGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 7, 8 + bob);
      ctx.quadraticCurveTo(cx - 13, 18, cx - 11, 32);
      ctx.lineTo(cx - 4, 30);
      ctx.lineTo(cx - 4, 8 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 7, 8 + bob);
      ctx.quadraticCurveTo(cx + 13, 18, cx + 11, 32);
      ctx.lineTo(cx + 4, 30);
      ctx.lineTo(cx + 4, 8 + bob);
      ctx.closePath();
      ctx.fill();

      // ── Robe body (white → gold gradient) ──
      const robeGrad = ctx.createLinearGradient(0, 16 + bob, 0, 42);
      robeGrad.addColorStop(0, '#ffffff');
      robeGrad.addColorStop(0.5, '#ffe080');
      robeGrad.addColorStop(1, '#a06020');
      ctx.fillStyle = robeGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 5, 16 + bob);
      ctx.lineTo(cx + 5, 16 + bob);
      ctx.lineTo(cx + 10, 40);
      ctx.lineTo(cx - 10, 40);
      ctx.closePath();
      ctx.fill();

      // Sash (bright gold)
      ctx.fillStyle = '#ffd040';
      ctx.fillRect(cx - 7, 26 + bob, 14, 2);
      ctx.fillStyle = '#ff8020';
      ctx.fillRect(cx - 7, 28 + bob, 14, 1);

      // Robe fold highlights
      ctx.strokeStyle = 'rgba(255, 220, 120, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 1, 18 + bob);
      ctx.lineTo(cx - 3, 38);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 2, 18 + bob);
      ctx.lineTo(cx + 4, 38);
      ctx.stroke();

      // ── Halo (ring above head) ──
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, 6 + bob, 7, Math.PI, 0);
      ctx.stroke();
      ctx.strokeStyle = '#ffe060';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, 6 + bob, 8, Math.PI, 0);
      ctx.stroke();
      // Halo disc glow
      const haloDisc = ctx.createRadialGradient(cx, 8 + bob, 1, cx, 8 + bob, 9);
      haloDisc.addColorStop(0, 'rgba(255, 255, 220, 0.9)');
      haloDisc.addColorStop(1, 'rgba(255, 220, 100, 0)');
      ctx.fillStyle = haloDisc;
      ctx.fillRect(cx - 10, bob - 2, 20, 16);

      // ── Head ──
      ctx.fillStyle = '#fff2d8';
      SpriteFactory._circle(ctx, cx, 12 + bob, 5);
      // Cheek blush
      ctx.fillStyle = 'rgba(255, 180, 140, 0.5)';
      SpriteFactory._circle(ctx, cx - 2, 14 + bob, 1.2);
      SpriteFactory._circle(ctx, cx + 2, 14 + bob, 1.2);

      // ── Hair front bangs (gold) ──
      ctx.fillStyle = '#ffe060';
      ctx.fillRect(cx - 5, 7 + bob, 10, 3);
      ctx.fillRect(cx - 4, 9 + bob, 2, 2);
      ctx.fillRect(cx + 2, 9 + bob, 2, 2);

      // ── Eyes (bright cyan, luminous) ──
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 3, 12 + bob, 2, 2);
      ctx.fillRect(cx + 1, 12 + bob, 2, 2);
      ctx.fillStyle = '#40c0ff';
      ctx.fillRect(cx - 3, 13 + bob, 1, 1);
      ctx.fillRect(cx + 2, 13 + bob, 1, 1);
      // Eye highlight
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 2, 12 + bob, 1, 1);
      ctx.fillRect(cx + 2, 12 + bob, 1, 1);

      // ── Arms (ivory) ──
      ctx.fillStyle = '#fff0d0';
      if (i === 4) {
        // Attack: arm extended right with golden crescent slash
        ctx.fillRect(cx + 2, 18 + bob, 10, 3);
        // Crescent slash
        const slashGrad = ctx.createLinearGradient(cx + 8, 14, cx + 22, 26);
        slashGrad.addColorStop(0, '#ffffff');
        slashGrad.addColorStop(0.6, '#ffe060');
        slashGrad.addColorStop(1, 'rgba(255, 200, 40, 0)');
        ctx.strokeStyle = slashGrad;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx + 12, 20 + bob, 8, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx + 12, 20 + bob, 11, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
      } else if (i === 1) {
        ctx.fillRect(cx - 8, 20 + bob, 4, 2);
        ctx.fillRect(cx + 4, 18 + bob, 4, 2);
      } else if (i === 2) {
        ctx.fillRect(cx - 8, 18 + bob, 4, 2);
        ctx.fillRect(cx + 4, 20 + bob, 4, 2);
      } else {
        ctx.fillRect(cx - 7, 20 + bob, 3, 3);
        ctx.fillRect(cx + 4, 20 + bob, 3, 3);
      }

      // ── Legs (gold sandal / bare) ──
      ctx.fillStyle = '#c08030';
      if (i === 1) {
        ctx.fillRect(cx - 5, 40, 3, 4);
        ctx.fillRect(cx + 2, 40, 3, 2);
      } else if (i === 2) {
        ctx.fillRect(cx - 5, 40, 3, 2);
        ctx.fillRect(cx + 2, 40, 3, 4);
      } else if (i === 3) {
        ctx.fillRect(cx - 4, 38, 3, 4);
        ctx.fillRect(cx + 1, 38, 3, 4);
      } else {
        ctx.fillRect(cx - 5, 40, 3, 4);
        ctx.fillRect(cx + 2, 40, 3, 4);
      }

      // Hurt frame: red wash (still angelic but in pain)
      if (i === 5) {
        ctx.fillStyle = 'rgba(255, 60, 80, 0.35)';
        ctx.fillRect(ox, 0, fw, fh);
      }
    }

    SpriteFactory._addSheet(scene, 'sophia', canvas, fw, fh);
  }

  // ── Jesus ───────────────────────────────────────────────────────────────────

  static _jesus(scene) {
    const fw = 28, fh = 42, frames = 6;
    const { canvas, ctx } = SpriteFactory._canvas(fw * frames, fh);

    for (let i = 0; i < frames; i++) {
      const ox = i * fw;
      const cx = ox + fw / 2;
      const bob = (i === 0 || i === 5) ? 0 : (i === 1 ? -1 : (i === 2 ? 1 : 0));

      // ── Outer halo glow ──
      const haloGrad = ctx.createRadialGradient(cx, 8 + bob, 2, cx, 8 + bob, 10);
      haloGrad.addColorStop(0, 'rgba(255, 240, 140, 0.6)');
      haloGrad.addColorStop(1, 'rgba(255, 240, 140, 0)');
      ctx.fillStyle = haloGrad;
      ctx.fillRect(ox, 0, fw, 20);

      // ── Robe body (golden with shadows) ──
      const grad = ctx.createLinearGradient(0, 16 + bob, 0, 40);
      grad.addColorStop(0, '#f8e8a0');
      grad.addColorStop(0.6, '#e0c870');
      grad.addColorStop(1, '#8a7030');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx - 4, 16 + bob);
      ctx.lineTo(cx + 4, 16 + bob);
      ctx.lineTo(cx + 10, 40);
      ctx.lineTo(cx - 10, 40);
      ctx.closePath();
      ctx.fill();

      // Robe folds
      ctx.strokeStyle = 'rgba(140, 90, 30, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 2, 18 + bob);
      ctx.lineTo(cx - 4, 38);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 1, 18 + bob);
      ctx.lineTo(cx + 3, 38);
      ctx.stroke();

      // ── Red sash ──
      ctx.fillStyle = '#b03030';
      ctx.fillRect(cx - 6, 24 + bob, 12, 2);
      ctx.fillStyle = '#801818';
      ctx.fillRect(cx - 6, 26 + bob, 12, 1);

      // ── Head ──
      ctx.fillStyle = '#e8c490';
      SpriteFactory._circle(ctx, cx, 10 + bob, 5);
      // Cheek tone
      ctx.fillStyle = 'rgba(200, 140, 80, 0.4)';
      SpriteFactory._circle(ctx, cx - 2, 12 + bob, 1.2);
      SpriteFactory._circle(ctx, cx + 2, 12 + bob, 1.2);

      // ── Hair + beard ──
      ctx.fillStyle = '#6a3820';
      ctx.fillRect(cx - 5, 5 + bob, 10, 3);
      ctx.fillRect(cx - 6, 7 + bob, 2, 3);
      ctx.fillRect(cx + 4, 7 + bob, 2, 3);
      // Beard
      ctx.fillRect(cx - 3, 13 + bob, 6, 2);
      ctx.fillStyle = '#4a2818';
      ctx.fillRect(cx - 2, 14 + bob, 4, 1);

      // ── Halo ring ──
      ctx.strokeStyle = '#ffe060';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, 8 + bob, 6, Math.PI + 0.3, -0.3);
      ctx.stroke();

      // ── Eyes ──
      ctx.fillStyle = '#2a1808';
      ctx.fillRect(cx - 3, 10 + bob, 2, 2);
      ctx.fillRect(cx + 1, 10 + bob, 2, 2);

      // ── Arms / cast ──
      ctx.fillStyle = '#c8a050';
      if (i === 4) {
        // Cast: arm forward with seal glow
        ctx.fillRect(cx + 2, 20 + bob, 9, 3);
        const cg = ctx.createRadialGradient(cx + 12, 21 + bob, 1, cx + 12, 21 + bob, 6);
        cg.addColorStop(0, '#ffffff');
        cg.addColorStop(0.5, '#ffe080');
        cg.addColorStop(1, 'rgba(255, 224, 128, 0)');
        ctx.fillStyle = cg;
        ctx.fillRect(ox + fw - 10, 14 + bob, 10, 14);
      } else if (i === 1) {
        ctx.fillRect(cx - 8, 22 + bob, 4, 2);
        ctx.fillRect(cx + 4, 20 + bob, 4, 2);
      } else if (i === 2) {
        ctx.fillRect(cx - 8, 20 + bob, 4, 2);
        ctx.fillRect(cx + 4, 22 + bob, 4, 2);
      } else {
        ctx.fillRect(cx - 7, 21 + bob, 3, 3);
        ctx.fillRect(cx + 4, 21 + bob, 3, 3);
      }

      // ── Feet (sandals) ──
      ctx.fillStyle = '#6a4818';
      if (i === 1) {
        ctx.fillRect(cx - 6, 38, 4, 2);
        ctx.fillRect(cx + 2, 39, 4, 1);
      } else if (i === 2) {
        ctx.fillRect(cx - 6, 39, 4, 1);
        ctx.fillRect(cx + 2, 38, 4, 2);
      } else if (i === 3) {
        ctx.fillRect(cx - 4, 38, 3, 3);
        ctx.fillRect(cx + 1, 38, 3, 3);
      } else {
        ctx.fillRect(cx - 6, 39, 4, 1);
        ctx.fillRect(cx + 2, 39, 4, 1);
      }

      if (i === 5) {
        ctx.fillStyle = 'rgba(255, 120, 40, 0.4)';
        ctx.fillRect(ox, 0, fw, fh);
      }
    }

    SpriteFactory._addSheet(scene, 'jesus', canvas, fw, fh);
  }

  // ── Archon Scout ────────────────────────────────────────────────────────────

  static _archonScout(scene) {
    const fw = 28, fh = 28, frames = 2;
    const { canvas, ctx } = SpriteFactory._canvas(fw * frames, fh);

    for (let i = 0; i < frames; i++) {
      const ox = i * fw;
      const cx = ox + fw / 2;

      // Shadow aura behind
      const aura = ctx.createRadialGradient(cx, 14, 2, cx, 14, 14);
      aura.addColorStop(0, 'rgba(180, 0, 80, 0.4)');
      aura.addColorStop(1, 'rgba(80, 0, 40, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(ox, 0, fw, fh);

      // Tattered cloak body (dark purple)
      ctx.fillStyle = '#300050';
      ctx.beginPath();
      ctx.moveTo(cx - 8, 14);
      ctx.lineTo(cx + 8, 14);
      ctx.lineTo(cx + 9, 24);
      ctx.lineTo(cx + 6, 26);
      ctx.lineTo(cx + 3, 24);
      ctx.lineTo(cx, 26);
      ctx.lineTo(cx - 3, 24);
      ctx.lineTo(cx - 6, 26);
      ctx.lineTo(cx - 9, 24);
      ctx.closePath();
      ctx.fill();

      // Cloak highlights
      ctx.strokeStyle = 'rgba(160, 60, 200, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 6, 14);
      ctx.lineTo(cx - 5, 22);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 5, 14);
      ctx.lineTo(cx + 6, 22);
      ctx.stroke();

      // Head — skull-like
      ctx.fillStyle = '#c0a090';
      SpriteFactory._circle(ctx, cx, 8, 6);
      ctx.fillStyle = '#8a6878';
      ctx.fillRect(cx - 6, 10, 12, 2);

      // Glowing red eyes
      const eyeGlow = ctx.createRadialGradient(cx, 7, 0.5, cx, 7, 3);
      eyeGlow.addColorStop(0, '#ffe060');
      eyeGlow.addColorStop(1, 'rgba(255, 20, 20, 0)');
      ctx.fillStyle = eyeGlow;
      ctx.fillRect(cx - 5, 4, 10, 6);
      ctx.fillStyle = '#ff2020';
      ctx.fillRect(cx - 3, 7, 2, 2);
      ctx.fillRect(cx + 1, 7, 2, 2);
      ctx.fillStyle = '#ffff80';
      ctx.fillRect(cx - 3, 7, 1, 1);
      ctx.fillRect(cx + 1, 7, 1, 1);

      // Horns
      ctx.fillStyle = '#2a0030';
      ctx.beginPath();
      ctx.moveTo(cx - 5, 4);
      ctx.lineTo(cx - 7, 0);
      ctx.lineTo(cx - 3, 2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 5, 4);
      ctx.lineTo(cx + 7, 0);
      ctx.lineTo(cx + 3, 2);
      ctx.closePath();
      ctx.fill();

      // Claws / feet
      ctx.fillStyle = '#1a0020';
      if (i === 0) {
        SpriteFactory._triangle(ctx, cx - 8, 24, cx - 10, 28, cx - 5, 28);
        SpriteFactory._triangle(ctx, cx + 8, 24, cx + 10, 28, cx + 5, 28);
      } else {
        SpriteFactory._triangle(ctx, cx - 6, 24, cx - 8, 28, cx - 3, 28);
        SpriteFactory._triangle(ctx, cx + 6, 24, cx + 8, 28, cx + 3, 28);
      }
    }

    SpriteFactory._addSheet(scene, 'archon_scout', canvas, fw, fh);
  }

  // ── Collectibles & props ────────────────────────────────────────────────────

  static _spark(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(14, 14);
    const glow = ctx.createRadialGradient(7, 7, 0, 7, 7, 7);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.4, '#fff0b0');
    glow.addColorStop(1, 'rgba(255, 240, 180, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 14, 14);
    ctx.fillStyle = '#ffffc0';
    SpriteFactory._star(ctx, 7, 7, 4, 5, 2);
    SpriteFactory._addImage(scene, 'spark', canvas);
  }

  static _orb(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(18, 18);
    // Outer halo
    const halo = ctx.createRadialGradient(9, 9, 0, 9, 9, 9);
    halo.addColorStop(0, 'rgba(220, 180, 255, 0.6)');
    halo.addColorStop(1, 'rgba(120, 60, 200, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 18, 18);
    // Core
    ctx.fillStyle = '#e8c8ff';
    SpriteFactory._circle(ctx, 9, 9, 4);
    ctx.fillStyle = '#ffffff';
    SpriteFactory._circle(ctx, 8, 8, 1.5);
    SpriteFactory._addImage(scene, 'orb', canvas);
  }

  static _seal(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(14, 14);
    const glow = ctx.createRadialGradient(7, 7, 1, 7, 7, 7);
    glow.addColorStop(0, '#ffffff');
    glow.addColorStop(0.3, '#ffe080');
    glow.addColorStop(1, 'rgba(255, 180, 40, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 14, 14);
    // Inner cross
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(3, 7); ctx.lineTo(11, 7);
    ctx.moveTo(7, 3); ctx.lineTo(7, 11);
    ctx.stroke();
    SpriteFactory._addImage(scene, 'projectile', canvas);
  }

  static _portal(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(40, 56);
    // Stone frame
    ctx.fillStyle = '#3a1060';
    ctx.beginPath();
    ctx.moveTo(2, 56);
    ctx.lineTo(2, 24);
    ctx.quadraticCurveTo(20, -4, 38, 24);
    ctx.lineTo(38, 56);
    ctx.closePath();
    ctx.fill();
    // Inner glow
    const portalGlow = ctx.createLinearGradient(0, 0, 0, 56);
    portalGlow.addColorStop(0, '#ffffff');
    portalGlow.addColorStop(0.5, '#ffe0ff');
    portalGlow.addColorStop(1, '#8040c0');
    ctx.fillStyle = portalGlow;
    ctx.beginPath();
    ctx.moveTo(8, 56);
    ctx.lineTo(8, 26);
    ctx.quadraticCurveTo(20, 6, 32, 26);
    ctx.lineTo(32, 56);
    ctx.closePath();
    ctx.fill();
    // Core beam
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(19, 12, 2, 44);
    // Runes
    ctx.fillStyle = '#ffe080';
    ctx.fillRect(18, 22, 4, 1);
    ctx.fillRect(18, 32, 4, 1);
    ctx.fillRect(18, 42, 4, 1);
    SpriteFactory._addImage(scene, 'portal', canvas);
  }

  static _platform(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(64, 12);
    // Dark stone body
    ctx.fillStyle = '#200040';
    ctx.fillRect(0, 0, 64, 12);
    // Top highlight (ethereal)
    const topGrad = ctx.createLinearGradient(0, 0, 0, 4);
    topGrad.addColorStop(0, '#8060d0');
    topGrad.addColorStop(1, '#3a1070');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, 64, 3);
    // Glyph marks
    ctx.strokeStyle = 'rgba(200, 140, 255, 0.4)';
    ctx.lineWidth = 1;
    for (let x = 8; x < 64; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 6); ctx.lineTo(x + 3, 6);
      ctx.stroke();
    }
    // Bottom edge
    ctx.fillStyle = '#10002a';
    ctx.fillRect(0, 11, 64, 1);
    SpriteFactory._addImage(scene, 'platform', canvas);
  }

  // ── Backgrounds (tileable) ──────────────────────────────────────────────────

  static _bgStars(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(256, 256);
    ctx.fillStyle = '#020008';
    ctx.fillRect(0, 0, 256, 256);
    // Dust
    ctx.fillStyle = '#10062a';
    for (let i = 0; i < 200; i++) {
      const x = (i * 97) % 256, y = (i * 53) % 256;
      ctx.fillRect(x, y, 1, 1);
    }
    // Brighter stars
    const starColors = ['#8060c0', '#c0a0ff', '#ffffff', '#e8b0ff'];
    for (let i = 0; i < 80; i++) {
      const x = ((i * 223) + 17) % 256;
      const y = ((i * 311) + 29) % 256;
      ctx.fillStyle = starColors[i % starColors.length];
      ctx.fillRect(x, y, 1, 1);
    }
    // A few bigger glowing stars
    for (let i = 0; i < 10; i++) {
      const x = ((i * 137) + 23) % 256;
      const y = ((i * 199) + 41) % 256;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 3);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(1, 'rgba(200, 160, 255, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 3, y - 3, 6, 6);
    }
    SpriteFactory._addImage(scene, 'bg_stars', canvas);
  }

  static _bgNebula(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(256, 256);
    // Transparent nebula clouds
    for (const [x, y, r, col] of [
      [60, 80, 60, 'rgba(140, 50, 200, 0.12)'],
      [190, 130, 80, 'rgba(200, 80, 180, 0.1)'],
      [120, 200, 70, 'rgba(80, 40, 160, 0.12)'],
      [40, 220, 50, 'rgba(180, 60, 200, 0.08)'],
    ]) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, col);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }
    SpriteFactory._addImage(scene, 'bg_nebula', canvas);
  }

  static _bgChaos(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(256, 256);
    // Black void with cracks of red
    ctx.fillStyle = '#04000a';
    ctx.fillRect(0, 0, 256, 256);
    // Cracks
    ctx.strokeStyle = 'rgba(180, 20, 40, 0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const x0 = (i * 73) % 256, y0 = (i * 41) % 256;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      let x = x0, y = y0;
      for (let s = 0; s < 8; s++) {
        x += ((i + s) * 17) % 30 - 15;
        y += ((i + s) * 19) % 30 - 10;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // Dim red glow pools
    for (const [x, y, r] of [[80, 140, 50], [200, 80, 40], [160, 220, 60]]) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(140, 20, 40, 0.15)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }
    SpriteFactory._addImage(scene, 'bg_chaos', canvas);
  }

  static _bgAscent(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(256, 256);
    // Rising gold gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#f0c060');
    grad.addColorStop(0.4, '#804028');
    grad.addColorStop(1, '#1a0010');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    // Light rays from top
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 8; i++) {
      const x = 32 + i * 30;
      const g = ctx.createLinearGradient(x, 0, x, 256);
      g.addColorStop(0, 'rgba(255, 230, 160, 0.18)');
      g.addColorStop(1, 'rgba(255, 230, 160, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, 10, 256);
    }
    ctx.globalCompositeOperation = 'source-over';
    SpriteFactory._addImage(scene, 'bg_ascent', canvas);
  }

  // ── Decor silhouettes ──────────────────────────────────────────────────────

  static _aeonGate(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(96, 160);
    ctx.fillStyle = 'rgba(40, 10, 80, 0.55)';
    // Outer pillars
    ctx.fillRect(0, 20, 10, 140);
    ctx.fillRect(86, 20, 10, 140);
    // Arch
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.quadraticCurveTo(48, -20, 96, 20);
    ctx.lineTo(96, 40);
    ctx.quadraticCurveTo(48, 0, 0, 40);
    ctx.closePath();
    ctx.fill();
    // Glyphs
    ctx.fillStyle = 'rgba(180, 140, 255, 0.25)';
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(4, 40 + i * 20, 2, 8);
      ctx.fillRect(90, 40 + i * 20, 2, 8);
    }
    SpriteFactory._addImage(scene, 'aeon_gate', canvas);
  }

  static _yaldabaothSilhouette(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(160, 120);
    // Massive lion-headed silhouette (shadow)
    ctx.fillStyle = 'rgba(80, 0, 20, 0.65)';
    // Body
    ctx.fillRect(40, 60, 80, 60);
    // Mane halo
    const g = ctx.createRadialGradient(80, 40, 10, 80, 40, 50);
    g.addColorStop(0, 'rgba(200, 40, 20, 0.55)');
    g.addColorStop(1, 'rgba(80, 0, 10, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 160, 90);
    // Lion head
    ctx.fillStyle = 'rgba(60, 0, 20, 0.8)';
    SpriteFactory._circle(ctx, 80, 42, 26);
    // Mane spikes
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const x = 80 + Math.cos(a) * 30;
      const y = 42 + Math.sin(a) * 30;
      SpriteFactory._triangle(ctx,
        80 + Math.cos(a) * 22, 42 + Math.sin(a) * 22,
        x - 4, y - 4, x + 4, y + 4);
    }
    // Glowing eyes
    ctx.fillStyle = '#ffe000';
    ctx.fillRect(72, 40, 3, 3);
    ctx.fillRect(86, 40, 3, 3);
    SpriteFactory._addImage(scene, 'yaldabaoth', canvas);
  }

  static _archonSilhouette(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(60, 90);
    ctx.fillStyle = 'rgba(30, 0, 50, 0.7)';
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(50, 30);
    ctx.lineTo(54, 80);
    ctx.lineTo(42, 90);
    ctx.lineTo(18, 90);
    ctx.lineTo(6, 80);
    ctx.lineTo(10, 30);
    ctx.closePath();
    ctx.fill();
    // Mask face
    ctx.fillStyle = 'rgba(200, 180, 140, 0.6)';
    SpriteFactory._circle(ctx, 30, 22, 10);
    // Eye slits
    ctx.fillStyle = '#ff2020';
    ctx.fillRect(24, 20, 3, 2);
    ctx.fillRect(33, 20, 3, 2);
    SpriteFactory._addImage(scene, 'archon_shadow', canvas);
  }

  static _crown(scene) {
    const { canvas, ctx } = SpriteFactory._canvas(40, 24);
    const gg = ctx.createLinearGradient(0, 0, 0, 24);
    gg.addColorStop(0, '#ffffff');
    gg.addColorStop(0.4, '#ffe080');
    gg.addColorStop(1, '#a06020');
    ctx.fillStyle = gg;
    // Crown band
    ctx.fillRect(4, 14, 32, 8);
    // Points
    for (let i = 0; i < 5; i++) {
      const x = 4 + i * 8;
      SpriteFactory._triangle(ctx, x, 14, x + 4, 0, x + 8, 14);
    }
    // Gems
    ctx.fillStyle = '#ff80c0';
    ctx.fillRect(11, 18, 2, 2);
    ctx.fillStyle = '#80ffff';
    ctx.fillRect(19, 18, 2, 2);
    ctx.fillStyle = '#ffffc0';
    ctx.fillRect(27, 18, 2, 2);
    SpriteFactory._addImage(scene, 'crown', canvas);
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  static _canvas(w, h) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
  }

  static _addSheet(scene, key, canvas, fw, fh) {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addSpriteSheet(key, canvas, { frameWidth: fw, frameHeight: fh });
  }

  static _addImage(scene, key, canvas) {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, canvas);
  }

  static _circle(ctx, cx, cy, r) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  static _triangle(ctx, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
  }

  static _star(ctx, cx, cy, points, outerR, innerR) {
    ctx.beginPath();
    const step = Math.PI / points;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = i * step - Math.PI / 2;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
}
