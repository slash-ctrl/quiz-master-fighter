import { playerDamaged } from './Combat.js';

/**
 * Generic enemy class implementing simple AI behaviour. Each enemy instance
 * holds a sprite, stats and update logic to chase and attack the player.
 */
export default class Enemy {
  /**
   * @param {Phaser.Scene} scene
   * @param {string} type One of 'drunkA','drunkB','nerdA','nerdB','oldMan'
   * @param {number} x X coordinate to spawn
   * @param {number} y Y coordinate to spawn
   */
  constructor(scene, type, x, y) {
    this.scene = scene;
    this.type = type;
    this.dead = false;
    // Stats based on type
    const stats = {
      drunkA: { key: 'enemyDrunkA', hp: 30, damage: 5, speed: 30, anim: 'enemyDrunkA_walkAnim' },
      drunkB: { key: 'enemyDrunkB', hp: 40, damage: 8, speed: 50, anim: 'enemyDrunkB_walkAnim' },
      nerdA:  { key: 'enemyNerdA',  hp: 20, damage: 4, speed: 40, anim: 'enemyNerdA_walkAnim' },
      nerdB:  { key: 'enemyNerdB',  hp: 25, damage: 5, speed: 30, anim: 'enemyNerdB_walkAnim' },
      oldMan: { key: 'enemyOldMan', hp: 35, damage: 6, speed: 20, anim: 'enemyOldMan_walkAnim' }
    }[type];
    this.hp = stats.hp;
    this.damage = stats.damage;
    this.speed = stats.speed;
    // keep reference to stats for animation key
    this.stats = stats;
    // Create physics sprite
    this.sprite = scene.physics.add.sprite(x, y, stats.key);
    this.sprite.setScale(2);
    this.sprite.setImmovable(false);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setSize(this.sprite.width * 0.6, this.sprite.height * 0.8);
    // Play walking animation if available
    if (stats.anim) {
      this.sprite.play(stats.anim);
    }
  }
  /**
   * Update called each frame. Move toward player and attack when close.
   */
  update() {
    if (this.dead) return;
    const player = this.scene.player;
    const dx = player.x - this.sprite.x;
    // Move horizontally toward player
    if (Math.abs(dx) > 10) {
      const dir = Math.sign(dx);
      this.sprite.setVelocityX(dir * this.speed);
      this.sprite.setFlipX(dir < 0);
      // Ensure walking animation plays while moving
      if (this.sprite.anims.currentAnim && this.sprite.anims.currentAnim.key !== this.stats.anim) {
        this.sprite.play(this.stats.anim, true);
      }
    } else {
      this.sprite.setVelocityX(0);
      // Attack if close enough and small cooldown
      if (!this.lastAttackTime || this.scene.time.now - this.lastAttackTime > 1000) {
        playerDamaged(this.scene, this.damage);
        this.lastAttackTime = this.scene.time.now;
      }
    }
  }
}