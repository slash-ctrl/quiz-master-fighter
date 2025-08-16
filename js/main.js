import Boot from './scenes/Boot.js';
import Preload from './scenes/Preload.js';
import Title from './scenes/Title.js';
import CharacterSelect from './scenes/CharacterSelect.js';
import Stage1 from './scenes/Stage1.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Boot, Preload, Title, CharacterSelect, Stage1]
};

const game = new Phaser.Game(config);

export default game;