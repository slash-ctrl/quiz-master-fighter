export default class CharacterSelect extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelect' });
    this.selected = null;
    this.portraits = [];
  }

  create() {
    const { width, height } = this.scale;
    const characters = [
      { key: 'darrenPortrait', name: 'Darren' },
      { key: 'patPortrait',    name: 'Pat'    },
      { key: 'colmPortrait',   name: 'Colm'   },
      { key: 'johnPortrait',   name: 'John'   },
      { key: 'chrisPortrait',  name: 'Chris'  }
    ];

    const spacing = width / (characters.length + 1);
    const yPos = height * 0.4;

    characters.forEach((char, index) => {
      const xPos = spacing * (index + 1);
      const portrait = this.add.image(xPos, yPos, char.key);
      portrait.setScale(2);
      portrait.setInteractive({ useHandCursor: true });
      portrait.on('pointerdown', () => this.selectCharacter(index));
      // Name label
      this.add.text(xPos, yPos + portrait.displayHeight / 2 + 10, char.name, {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FFFFFF',
        align: 'center'
      }).setOrigin(0.5, 0);
      // Save reference
      this.portraits.push({ sprite: portrait, data: char });
    });

    // Instruction text
    this.add.text(width / 2, height * 0.15, 'CHOOSE YOUR QUIZMASTER', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Confirm button
    const confirm = this.add.text(width / 2, height * 0.8, 'START', {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: '#FFFFFF',
      backgroundColor: '#333333',
      padding: { x: 20, y: 10 },
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    confirm.on('pointerdown', () => {
      if (this.selected !== null) {
        const chosen = this.portraits[this.selected].data.name;
        this.scene.start('Stage1', { character: chosen });
      }
    });
  }

  selectCharacter(index) {
    // Deselect previous
    if (this.selected !== null) {
      this.portraits[this.selected].sprite.clearTint();
    }
    this.selected = index;
    // Highlight selected
    this.portraits[index].sprite.setTint(0xffff00);
  }
}