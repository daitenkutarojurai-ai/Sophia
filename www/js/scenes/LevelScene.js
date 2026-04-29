import { WIDTH, HEIGHT, LEVELS, BOSSES } from '../constants.js';
import Sophia from '../entities/Sophia.js';
import Jesus from '../entities/Jesus.js';
import ArchonScout from '../entities/ArchonScout.js';
import Authades from '../entities/Authades.js';
import Paraplex from '../entities/Paraplex.js';
import Hekate from '../entities/Hekate.js';
import Ariouth from '../entities/Ariouth.js';

const BOSS_CLASSES = {
  authades: Authades,
  paraplex: Paraplex,
  hekate: Hekate,
  ariouth: Ariouth,
};

export default class LevelScene extends Phaser.Scene {
  constructor() { super({ key: 'Level' }); }

  init(data) {
    this.levelIndex = data.levelIndex ?? 0;
    this.characterId = data.character ?? 'sophia';
    this.level = LEVELS[this.levelIndex];
    this.levelTimer = 0;
    this.finished = false;
    this.isPaused = false;
  }

  create() {
    const { worldWidth, bgTint, bgKey, decor } = this.level;

    // Physics + camera bounds
    this.physics.world.setBounds(0, 0, worldWidth, HEIGHT);
    this.cameras.main.setBounds(0, 0, worldWidth, HEIGHT);

    // Layered backdrop
    this.add.rectangle(0, 0, worldWidth, HEIGHT, bgTint)
      .setOrigin(0).setScrollFactor(0.05);
    this.bgFar = this.add.tileSprite(0, 0, WIDTH, HEIGHT, bgKey)
      .setOrigin(0).setScrollFactor(0).setAlpha(0.85);
    this.bgNear = this.add.tileSprite(0, 0, WIDTH, HEIGHT, 'bg_nebula')
      .setOrigin(0).setScrollFactor(0).setAlpha(0.55);

    this._buildDecor(decor, worldWidth);
    this._buildPlatforms();
    this._buildPlayer();
    this._buildSparks();
    this._buildEnemies();
    this._buildProjectiles();
    this._buildExit();
    this._buildBoss();
    this._buildAtmosphereFX();
    this._buildInput();
    this._buildCollisions();
    this._setupEvents();

    this.scene.launch('UI', {
      level: this.level,
      characterId: this.characterId,
    });

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  update(time, delta) {
    if (this.finished || this.isPaused) return;
    this.levelTimer += delta;
    this.player.update(time, delta);
    // Boss is also in `enemies`, so the forEach below covers its update().
    this.enemies.getChildren().forEach(e => e.update?.(time, delta));
    this._updateProjectiles(delta);
    this._updateBossTrigger();

    // Parallax
    const sx = this.cameras.main.scrollX;
    this.bgFar.tilePositionX  = sx * 0.25;
    this.bgNear.tilePositionX = sx * 0.5;
  }

  // ── Build ────────────────────────────────────────────────────────────────────

  _buildDecor(kind, worldWidth) {
    // Distant set-dressing that scrolls with parallax
    this.decorLayer = this.add.group();
    const count = Math.ceil(worldWidth / 400) + 1;
    for (let i = 0; i < count; i++) {
      const x = i * 400 + Phaser.Math.Between(-40, 40);
      if (kind === 'gates') {
        const g = this.add.image(x, 150, 'aeon_gate').setScale(0.55)
          .setAlpha(0.35).setScrollFactor(0.35);
        this.decorLayer.add(g);
      } else if (kind === 'shadows') {
        const a = this.add.image(x, 180, 'archon_shadow').setScale(0.7)
          .setAlpha(0.45).setScrollFactor(0.4);
        this.decorLayer.add(a);
        // Sinister eyes glow
        this.tweens.add({
          targets: a, alpha: 0.25,
          yoyo: true, repeat: -1, duration: 1500 + Math.random() * 800,
        });
      } else if (kind === 'ascending') {
        const g = this.add.image(x, 150, 'aeon_gate').setScale(0.65)
          .setAlpha(0.45).setScrollFactor(0.3).setTint(0xffe0a0);
        this.decorLayer.add(g);
      }
    }
  }

  _buildPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    for (const [x, y, w] of this.level.platforms) {
      this.add.tileSprite(x, y, w, 12, 'platform').setOrigin(0);
      const body = this.add.rectangle(x, y, w, 12, 0x000000, 0).setOrigin(0);
      this.physics.add.existing(body, true);
      this.platforms.add(body);
    }
  }

  _buildPlayer() {
    const startX = 40, startY = HEIGHT - 60;
    const Cls = this.characterId === 'jesus' ? Jesus : Sophia;
    this.player = new Cls(this, startX, startY);
  }

  _buildSparks() {
    this.sparks = this.physics.add.group({
      allowGravity: false, immovable: true,
    });
    const tints = this._getSparkTint();
    for (const [x, y] of this.level.sparks) {
      const s = this.sparks.create(x, y, 'orb');
      s.body.setSize(14, 14);
      this.tweens.add({
        targets: s, y: y - 5,
        yoyo: true, repeat: -1,
        duration: 800 + Math.random() * 400,
        ease: 'Sine.easeInOut',
      });
      this.add.particles(x, y, 'spark', {
        scale: { start: 0.22, end: 0 },
        alpha: { start: 0.5, end: 0 },
        speed: { min: 5, max: 18 },
        lifespan: 900,
        frequency: 300,
        quantity: 1,
        tint: tints,
        follow: s,
      });
    }
  }

  _getSparkTint() {
    const { decor } = this.level;
    if (decor === 'gates')     return [0xe8d0ff, 0xffffff, 0xc8a0ff];
    if (decor === 'shadows')   return [0xff6080, 0xff3050, 0xcc0030];
    if (decor === 'ascending') return [0xffe080, 0xffc040, 0xffffff];
    return [0xffffff, 0xffe0ff, 0xc8a0ff];
  }

  _buildEnemies() {
    this.enemies = this.physics.add.group({ runChildUpdate: false });
    for (const [x, y, behavior] of this.level.enemies) {
      const e = new ArchonScout(this, x, y, behavior, this.levelIndex);
      this.enemies.add(e);
    }
  }

  _buildProjectiles() {
    this.projectiles = this.physics.add.group({ allowGravity: false });
    this.enemyProjectiles = this.physics.add.group({ allowGravity: false });
  }

  _buildExit() {
    const [x, y] = this.level.exit;
    this.exit = this.physics.add.staticImage(x, y, 'portal');
    this.exit.body.setSize(32, 48).setOffset(4, 4);

    // Boss levels keep the exit sealed until the Archon falls.
    this._exitSealed = !!this.level.boss;
    if (this._exitSealed) {
      this.exit.setVisible(false);
      this.exit.body.enable = false;
    }

    // Pulsing glow + scale breathe on portal
    this.tweens.add({
      targets: this.exit,
      alpha: 0.75, scaleY: 1.06,
      yoyo: true, repeat: -1,
      duration: 900, ease: 'Sine.easeInOut',
    });

    // Richer beam particles
    this._exitParticles = this.add.particles(x, y + 8, 'spark', {
      x: { min: -13, max: 13 },
      y: { min: -26, max: 26 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.9, end: 0 },
      speed: { min: 15, max: 55 },
      tint: [0xffffff, 0xffe0ff, 0xc8a0ff, 0xa080ff],
      lifespan: 1000,
      frequency: 55,
      quantity: 2,
      blendMode: 'ADD',
    });
    if (this._exitSealed) this._exitParticles.stop();

    // Spinning rune ring orbiting the portal
    const runeGfx = this.add.graphics();
    runeGfx.setDepth(1);
    this._exitRunes = runeGfx;
    if (this._exitSealed) runeGfx.setVisible(false);
    let runeAngle = 0;
    this.time.addEvent({
      delay: 33, repeat: -1,
      callback: () => {
        if (this.finished || !runeGfx.visible) return;
        runeGfx.clear();
        runeAngle += 4;
        for (let i = 0; i < 6; i++) {
          const a = Phaser.Math.DegToRad(runeAngle + i * 60);
          const rx = x + Math.cos(a) * 26;
          const ry = y + Math.sin(a) * 13;
          const alpha = 0.45 + Math.sin(Phaser.Math.DegToRad(runeAngle * 3 + i * 60)) * 0.3;
          runeGfx.fillStyle(0xb090ff, alpha);
          runeGfx.fillCircle(rx, ry, 2.5);
        }
      },
    });
  }

  // ── Boss arena ─────────────────────────────────────────────────────────────

  _buildBoss() {
    const cfg = this.level.boss;
    if (!cfg) return;
    const data = BOSSES[cfg.id];
    const Cls = BOSS_CLASSES[cfg.id];
    if (!data || !Cls) return;

    this._bossSpec = cfg;
    this.boss = new Cls(this, cfg.spawnX, cfg.spawnY, data);
    // Drop boss into the enemies group so existing platform/melee/projectile
    // collisions cover it automatically.
    this.enemies.add(this.boss);
    // Boss starts hidden + still until the player crosses triggerX.
    this.boss.setAlpha(0);
    this.boss.setActive(false);
    this.boss.body.enable = false;
    this._bossTriggered = false;
    this._arenaWalls = [];
  }

  _updateBossTrigger() {
    if (!this.boss || this._bossTriggered) return;
    if (this.player.x < this._bossSpec.triggerX) return;
    this._triggerBossArena();
  }

  _triggerBossArena() {
    this._bossTriggered = true;
    const { arenaX, arenaWidth } = this._bossSpec;
    const rightX = arenaX + arenaWidth;

    // Invisible arena walls — physics-only.
    const wallL = this.add.rectangle(arenaX - 4, 0, 4, HEIGHT, 0x000000, 0).setOrigin(0);
    const wallR = this.add.rectangle(rightX, 0, 4, HEIGHT, 0x000000, 0).setOrigin(0);
    [wallL, wallR].forEach(w => {
      this.physics.add.existing(w, true);
      this.platforms.add(w);
      this._arenaWalls.push(w);
    });

    // Camera locks onto the arena for the fight.
    this.cameras.main.setBounds(arenaX, 0, arenaWidth, HEIGHT);

    // Reveal + activate boss.
    this.boss.setActive(true);
    this.boss.body.enable = true;
    this.tweens.add({
      targets: this.boss, alpha: 1, duration: 400,
      onComplete: () => this.boss?.activate(),
    });
  }

  _onBossKilled(cfg) {
    // Drop arena walls + restore camera bounds.
    this._arenaWalls.forEach(w => {
      this.platforms.remove(w, true, true);
    });
    this._arenaWalls = [];
    this.cameras.main.setBounds(0, 0, this.level.worldWidth, HEIGHT);

    // Clear lingering enemy projectiles.
    this.enemyProjectiles.getChildren().forEach(p => p.destroy());

    // Reveal + arm exit.
    if (this._exitSealed) {
      this._exitSealed = false;
      this.exit.setVisible(true);
      this.exit.body.enable = true;
      this._exitParticles?.start();
      this._exitRunes?.setVisible(true);
      this.tweens.add({
        targets: this.exit, alpha: { from: 0, to: 1 },
        duration: 600,
      });
    }

    this._showBossLore(cfg);
  }

  _showBossLore(cfg) {
    const cam = this.cameras.main;
    const w = WIDTH - 60, h = 78;
    const cx = cam.width / 2, cy = cam.height / 2;
    const bg = this.add.rectangle(cx, cy, w, h, 0x000000, 0.82)
      .setScrollFactor(0).setDepth(160).setStrokeStyle(1, cfg.barColor ?? 0xffe060);
    const title = this.add.text(cx, cy - 26,
      `${cfg.name.toUpperCase()} — DEFEATED`, {
        fontFamily: 'monospace', fontSize: '10px',
        color: '#ffe060', stroke: '#000', strokeThickness: 3,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(161);
    const lore = this.add.text(cx, cy + 4, cfg.lore ?? '', {
        fontFamily: 'monospace', fontSize: '7px',
        color: '#c8a0ff', align: 'center', lineSpacing: 3,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(161);

    const group = [bg, title, lore];
    group.forEach(o => o.setAlpha(0));
    this.tweens.add({
      targets: group, alpha: 1, duration: 400,
      onComplete: () => {
        this.time.delayedCall(2800, () => {
          this.tweens.add({
            targets: group, alpha: 0, duration: 600,
            onComplete: () => group.forEach(o => o.destroy()),
          });
        });
      },
    });
  }

  _buildAtmosphereFX() {
    // Per-act particle mood
    if (this.level.decor === 'gates') {
      // Descending divine sparks
      this.add.particles(0, 0, 'spark', {
        x: { min: 0, max: WIDTH },
        y: -10,
        speedY: { min: 20, max: 60 },
        scale: { start: 0.3, end: 0 },
        alpha: { start: 0.35, end: 0 },
        lifespan: 5000, frequency: 250, quantity: 1,
        scrollFactor: 0, tint: [0xc8a0ff, 0xffffff],
      });
    } else if (this.level.decor === 'shadows') {
      // Rising fog motes
      this.add.particles(0, HEIGHT, 'spark', {
        x: { min: 0, max: WIDTH }, y: 0,
        speedY: { min: -20, max: -10 },
        scale: { start: 0.3, end: 0 },
        alpha: { start: 0.2, end: 0 },
        tint: 0x6a1030,
        lifespan: 6000, frequency: 400, quantity: 1,
        scrollFactor: 0,
      });
    } else if (this.level.decor === 'ascending') {
      // Golden rising motes
      this.add.particles(0, HEIGHT, 'spark', {
        x: { min: 0, max: WIDTH }, y: 0,
        speedY: { min: -40, max: -15 },
        scale: { start: 0.35, end: 0 },
        alpha: { start: 0.5, end: 0 },
        tint: [0xffe080, 0xffffff, 0xffc060],
        lifespan: 4000, frequency: 180, quantity: 1,
        scrollFactor: 0,
      });
    }
  }

  _buildInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.actionKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    // ESC toggles pause
    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey.on('down', () => { if (!this.finished) this._togglePause(); });
  }

  _togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.physics.pause();
      this.tweens.pauseAll();
    } else {
      this.physics.resume();
      this.tweens.resumeAll();
    }
    this.events.emit('game_paused', this.isPaused);
  }

  _buildCollisions() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.projectiles, this.platforms,
      (proj) => proj.destroy());
    this.physics.add.collider(this.enemyProjectiles, this.platforms,
      (proj) => proj.destroy());
    this.physics.add.overlap(this.player, this.enemyProjectiles, (_p, proj) => {
      if (!proj.active) return;
      this.player.takeDamage(proj.touchDamage ?? 1);
      proj.destroy();
    });

    this.physics.add.overlap(this.player, this.sparks, (_p, spark) => {
      this._emitCollectFX(spark.x, spark.y);
      spark.destroy();
      this.player.collectSpark();
    });

    this.physics.add.overlap(this.player, this.enemies, (_p, enemy) => {
      if (!enemy.isDead) this.player.takeDamage(enemy.touchDamage ?? 1);
    });

    this.physics.add.overlap(this.projectiles, this.enemies, (proj, enemy) => {
      if (enemy.isDead) return;
      enemy.takeDamage(proj.damage ?? 1);
      proj._emitCombo?.();
      this.cameras.main.shake(40, 0.003);
      proj.destroy();
    });

    this.physics.add.overlap(this.player, this.exit, () => this._winLevel());
  }

  _setupEvents() {
    this.events.once('player_died', () => this._loseLevel());
    this.events.on('boss_killed', (cfg) => this._onBossKilled(cfg));
    this.events.on('enemy_killed', ({ x, y }) => {
      // Screen shake + death burst
      this.cameras.main.shake(65, 0.004);
      const burst = this.add.particles(x, y, 'spark', {
        scale: { start: 0.6, end: 0 },
        speed: { min: 40, max: 100 },
        alpha: { start: 0.9, end: 0 },
        lifespan: 350,
        quantity: 6,
        emitting: false,
        tint: [0xff4040, 0xff8040, 0xffffff],
        blendMode: 'ADD',
      });
      burst.explode(6);
      this.time.delayedCall(400, () => burst.destroy());

      // Drop a collectible spark
      const s = this.sparks.create(x, y - 8, 'orb');
      s.body.setSize(14, 14);
      this.tweens.add({
        targets: s, y: y - 14, yoyo: true, repeat: -1, duration: 900,
      });
    });
  }

  _emitCollectFX(x, y) {
    const burst = this.add.particles(x, y, 'spark', {
      scale: { start: 0.8, end: 0 },
      speed: { min: 50, max: 120 },
      alpha: { start: 1, end: 0 },
      lifespan: 400,
      quantity: 7,
      emitting: false,
      tint: this._getSparkTint(),
    });
    burst.explode(7);
    this.time.delayedCall(500, () => burst.destroy());
  }

  _updateProjectiles(delta) {
    for (const p of this.projectiles.getChildren()) {
      p.lifespan -= delta;
      if (p.lifespan <= 0) p.destroy();
    }
    for (const p of this.enemyProjectiles.getChildren()) {
      if (p.lifespan == null) continue;
      p.lifespan -= delta;
      if (p.lifespan <= 0) p.destroy();
    }
  }

  // ── Win / lose ──────────────────────────────────────────────────────────────

  _winLevel() {
    if (this.finished) return;
    this.finished = true;
    this.player.setVelocity(0, 0);
    this.cameras.main.flash(500, 220, 180, 255);

    const next = this.levelIndex + 1;
    const progress = this.registry.get('progress') ?? {};
    progress.totalSparks = (progress.totalSparks ?? 0) + this.player.sparks;
    progress.currentLevel = next;
    this.registry.set('progress', progress);

    this.cameras.main.fadeOut(800, 240, 220, 255);
    this.time.delayedCall(850, () => {
      this.scene.stop('UI');
      if (next < LEVELS.length) {
        this.scene.start('Level',
          { levelIndex: next, character: this.characterId });
      } else {
        this.scene.start('Victory',
          { totalSparks: progress.totalSparks, character: this.characterId });
      }
    });
  }

  _loseLevel() {
    if (this.finished) return;
    this.finished = true;
    this.cameras.main.fadeOut(700, 100, 0, 0);
    this.time.delayedCall(750, () => {
      this.scene.stop('UI');
      this.scene.start('GameOver', {
        levelIndex: this.levelIndex,
        character: this.characterId,
      });
    });
  }
}
