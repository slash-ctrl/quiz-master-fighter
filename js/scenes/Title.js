export default class Title extends Phaser.Scene {
  constructor() {
    super({ key: 'Title' });
  }

  create() {
    const { width, height } = this.scale;
    // Background image
    const bg = this.add.image(width / 2, height / 2, 'titleScreen');
    // Scale to fit while maintaining aspect ratio
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);

    // Prompt text
    this.prompt = this.add.text(width / 2, height * 0.85, 'TAP TO START', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    this.tweens.add({
      targets: this.prompt,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // On pointer down, go to character select
    this.input.once('pointerdown', () => {
      this.scene.start('CharacterSelect');
    });
  }
}