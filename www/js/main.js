import BootScene             from './scenes/BootScene.js';
import PreloadScene          from './scenes/PreloadScene.js';
import MainMenuScene         from './scenes/MainMenuScene.js';
import PrologueScene         from './scenes/PrologueScene.js';
import CharacterSelectScene  from './scenes/CharacterSelectScene.js';
import LevelScene            from './scenes/LevelScene.js';
import UIScene               from './scenes/UIScene.js';
import GameOverScene         from './scenes/GameOverScene.js';
import VictoryScene          from './scenes/VictoryScene.js';

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 270,
  backgroundColor: '#000000',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 700 }, debug: false },
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    PrologueScene,
    CharacterSelectScene,
    LevelScene,
    UIScene,
    GameOverScene,
    VictoryScene,
  ],
};

window.game = new Phaser.Game(config);
