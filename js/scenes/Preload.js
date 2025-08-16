export default class Preload extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  preload() {
    // Title screen
    this.load.image('titleScreen', 'assets/backgrounds/title/title_screen.png');

    // Player portraits
    this.load.image('darrenPortrait', 'assets/sprites/player/portraits/darren_portrait.png');
    this.load.image('patPortrait',    'assets/sprites/player/portraits/pat_portrait.png');
    this.load.image('colmPortrait',   'assets/sprites/player/portraits/colm_portrait.png');
    this.load.image('johnPortrait',   'assets/sprites/player/portraits/john_portrait.png');
    this.load.image('chrisPortrait',  'assets/sprites/player/portraits/chris_portrait.png');

    // Enemy sprites
    this.load.image('enemyDrunkA', 'assets/sprites/enemies/drunk_a.png');
    this.load.image('enemyDrunkB', 'assets/sprites/enemies/drunk_b.png');
    this.load.image('enemyNerdA',  'assets/sprites/enemies/nerd_a.png');
    this.load.image('enemyNerdB',  'assets/sprites/enemies/nerd_b.png');
    this.load.image('enemyOldMan','assets/sprites/enemies/old_man.png');
    // Boss sprite
    this.load.image('bossSmartphone','assets/sprites/boss/smartphone_boss.png');
    // HUD icons
    this.load.image('iconHeart','assets/hud/heart.png');
    this.load.image('iconStar', 'assets/hud/star.png');
    this.load.image('iconPint', 'assets/hud/pint.png');

    // Placeholder player sprite (idle) – reuse for all characters for now
    this.load.spritesheet('playerIdle', 'assets/sprites/player/player_idle.png', {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    this.scene.start('Title');
  }
}