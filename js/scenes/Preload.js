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
    // Static enemy fallback images (unused after animations are implemented)
    this.load.image('enemyDrunkA', 'assets/sprites/enemies/drunk_a.png');
    this.load.image('enemyDrunkB', 'assets/sprites/enemies/drunk_b.png');
    this.load.image('enemyNerdA',  'assets/sprites/enemies/nerd_a.png');
    this.load.image('enemyNerdB',  'assets/sprites/enemies/nerd_b.png');
    this.load.image('enemyOldMan','assets/sprites/enemies/old_man.png');

    // Animated enemy sprite sheets (64×64 frames)
    this.load.spritesheet('enemyDrunkA_walk', 'assets/sprites/enemies/drunkA_walk.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('enemyDrunkB_walk', 'assets/sprites/enemies/drunkB_walk.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('enemyNerdA_walk',  'assets/sprites/enemies/nerdA_walk.png',  { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('enemyNerdB_walk',  'assets/sprites/enemies/nerdB_walk.png',  { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('enemyOldMan_walk','assets/sprites/enemies/old_man_walk.png',{ frameWidth: 64, frameHeight: 64 });

    // Boss sprite
    this.load.image('bossSmartphone','assets/sprites/boss/smartphone_boss.png');
    // HUD icons
    this.load.image('iconHeart','assets/hud/heart.png');
    this.load.image('iconStar', 'assets/hud/star.png');
    this.load.image('iconPint', 'assets/hud/pint.png');

    // Player animations (base sprite sheets)
    this.load.spritesheet('playerWalk','assets/sprites/player/player_walk.png',{ frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerPunch','assets/sprites/player/player_punch.png',{ frameWidth: 64, frameHeight: 64 });
    // Keep the idle for fallback/idle frames
    this.load.spritesheet('playerIdle', 'assets/sprites/player/player_idle.png', {
      frameWidth: 64,
      frameHeight: 64
    });

    // Level 1 parallax backgrounds
    this.load.image('bgFar','assets/backgrounds/level1/bg_far.png');
    this.load.image('bgMid','assets/backgrounds/level1/bg_mid.png');
    this.load.image('bgNear','assets/backgrounds/level1/bg_near.png');
  }

  create() {
    this.scene.start('Title');
  }
}