export default class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'Boot' }); }

  create() {
    // Make the canvas keyboard-focusable so arrow/Z keys are captured
    // reliably even when the user clicks the page outside the canvas.
    const canvas = this.game.canvas;
    canvas.tabIndex = 0;
    canvas.style.outline = 'none';
    canvas.focus();
    // Refocus on any interaction so the game never loses keyboard input.
    const refocus = () => canvas.focus();
    canvas.addEventListener('pointerdown', refocus);
    canvas.addEventListener('click', refocus);
    window.addEventListener('focus', refocus);

    this.registry.set('progress', { currentLevel: 0, totalSparks: 0 });
    this.scene.start('Preload');
  }
}
