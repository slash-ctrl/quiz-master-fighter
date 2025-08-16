export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    // load minimal assets if needed
  }

  create() {
    // Start preload scene
    this.scene.start('Preload');
  }
}