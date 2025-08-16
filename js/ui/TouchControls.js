export default class TouchControls {
  /**
   * Simple touch controls for mobile devices. Creates on-screen areas for moving left/right
   * and buttons for punch, kick, jump and special. Sets boolean flags that scenes can
   * query each frame. The control layout is fixed relative to the screen size.
   * @param {Phaser.Scene} scene The scene this UI belongs to.
   */
  constructor(scene) {
    this.scene = scene;
    this.state = {
      left: false,
      right: false,
      punch: false,
      kick: false,
      jump: false,
      special: false
    };
    this.createControls();
  }

  /**
   * Builds the interactive touch regions on the screen. We use simple
   * rectangular zones: the left half of the lower third of the screen
   * controls left/right movement depending on where you press, and the
   * right half contains four buttons. Each button toggles its respective
   * action flag on pointerdown and resets it on pointerup.
   */
  createControls() {
    const { width, height } = this.scene.scale;
    const input = this.scene.input;

    // Movement zone covers left third of screen height, full width
    const moveZone = this.scene.add.zone(0, height * 0.55, width * 0.5, height * 0.45)
      .setOrigin(0)
      .setInteractive();
    moveZone.on('pointerdown', (pointer) => {
      // If touch is on left half of move zone, go left; otherwise right
      const localX = pointer.x;
      const mid = width * 0.25;
      if (localX < mid) {
        this.state.left = true;
      } else {
        this.state.right = true;
      }
    });
    moveZone.on('pointerup', () => {
      this.state.left = false;
      this.state.right = false;
    });

    // Create four action buttons in lower right corner
    const btnSize = 56;
    const margin = 12;
    const labels = ['P', 'K', 'J', 'S'];
    const keys = ['punch', 'kick', 'jump', 'special'];
    for (let i = 0; i < 4; i++) {
      const x = width - (btnSize + margin);
      const y = height - (btnSize + margin) - i * (btnSize + margin * 0.5);
      // Draw a circle using graphics and generate a texture
      const gfx = this.scene.add.graphics();
      gfx.fillStyle(0x444444, 0.7);
      gfx.fillCircle(btnSize / 2, btnSize / 2, btnSize / 2);
      gfx.lineStyle(2, 0xffffff);
      gfx.strokeCircle(btnSize / 2, btnSize / 2, btnSize / 2);
      const key = `btnTexture${i}`;
      gfx.generateTexture(key, btnSize, btnSize);
      gfx.destroy();
      const btn = this.scene.add.image(x, y, key).setOrigin(1, 1).setInteractive();
      // Add label text
      this.scene.add.text(x - btnSize / 2, y - btnSize / 2, labels[i], {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center'
      }).setOrigin(0.5);
      // Register events
      btn.on('pointerdown', () => {
        this.state[keys[i]] = true;
      });
      btn.on('pointerup', () => {
        this.state[keys[i]] = false;
      });
      btn.on('pointerout', () => {
        // If finger slides off, reset
        this.state[keys[i]] = false;
      });
    }
  }
}