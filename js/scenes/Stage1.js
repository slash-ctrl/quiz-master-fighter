import TouchControls from '../ui/TouchControls.js';
import Enemy from '../systems/EnemyAI.js';
import { hitEnemy, playerDamaged } from '../systems/Combat.js';

export default class Stage1 extends Phaser.Scene {
  constructor() {
    super({ key: 'Stage1' });
    this.controls = null;
    this.enemies = [];
    this.playerHP = 100;
    this.score = 0;
    this.comboCount = 0;
    this.lastHitTime = 0;
    this.comboTimeout = 2000; // ms

    // world size for scrolling level
    this.worldWidth = 2048;
  }

  init(data) {
    this.selectedCharacter = data.character || 'Unknown';
  }

  create() {
    const { width, height } = this.scale;
    // Extend the world horizontally for scrolling gameplay
    const worldWidth = this.worldWidth;
    this.physics.world.setBounds(0, 0, worldWidth, height);
    this.cameras.main.setBounds(0, 0, worldWidth, height);
    // Set arcade gravity for jumping
    this.physics.world.gravity.y = 400;

    // Parallax backgrounds (create enough copies to fill world)
    const segments = Math.ceil(worldWidth / 1024);
    const bgScaleY = height / 256;
    this.parallax = [];
    for (let i = 0; i < segments; i++) {
      // far layer
      const far = this.add.image(i * 1024, 0, 'bgFar').setOrigin(0, 0);
      far.setScale(1, bgScaleY);
      far.setScrollFactor(0.2);
      this.parallax.push(far);
      // mid layer
      const mid = this.add.image(i * 1024, 0, 'bgMid').setOrigin(0, 0);
      mid.setScale(1, bgScaleY);
      mid.setScrollFactor(0.5);
      this.parallax.push(mid);
      // near layer
      const near = this.add.image(i * 1024, 0, 'bgNear').setOrigin(0, 0);
      near.setScale(1, bgScaleY);
      near.setScrollFactor(0.8);
      this.parallax.push(near);
    }

    // Ground as invisible platform spanning entire level
    const ground = this.add.rectangle(worldWidth / 2, height - 20, worldWidth, 40, 0x000000, 0);
    this.physics.add.existing(ground, true);

    // Player sprite and physics
    this.player = this.physics.add.sprite(100, height - 100, 'playerIdle');
    this.player.setScale(2);
    this.player.body.setSize(32, 40);
    this.player.setCollideWorldBounds(true);
    // Create animations for player if not yet created
    if (!this.anims.exists('playerIdleAnim')) {
      this.anims.create({
        key: 'playerIdleAnim',
        frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: -1
      });
    }
    if (!this.anims.exists('playerWalkAnim')) {
      this.anims.create({
        key: 'playerWalkAnim',
        frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
      });
    }
    if (!this.anims.exists('playerPunchAnim')) {
      this.anims.create({
        key: 'playerPunchAnim',
        frames: this.anims.generateFrameNumbers('playerPunch', { start: 0, end: 5 }),
        frameRate: 12,
        repeat: 0
      });
    }
    this.player.play('playerIdleAnim');
    // Collide player with ground
    this.physics.add.collider(this.player, ground);

    // Camera follows the player smoothly
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Apply tint based on selected character to differentiate heroes
    switch ((this.selectedCharacter || '').toLowerCase()) {
      case 'pat':
        this.player.setTint(0xff4444);
        break;
      case 'colm':
        this.player.setTint(0x44ff44);
        break;
      case 'john':
        this.player.setTint(0xaa8844);
        break;
      case 'chris':
        this.player.setTint(0xffcc44);
        break;
      default:
        // Darren or unknown uses default blue sprite without tint
        break;
    }

    // Touch controls
    this.controls = new TouchControls(this);

    // Create enemy animations
    const enemyKeys = ['enemyDrunkA_walk', 'enemyDrunkB_walk', 'enemyNerdA_walk', 'enemyNerdB_walk', 'enemyOldMan_walk'];
    enemyKeys.forEach(key => {
      const animKey = key + 'Anim';
      if (!this.anims.exists(animKey)) {
        const tex = this.textures.get(key);
        const total = tex.frameTotal;
        this.anims.create({
          key: animKey,
          frames: this.anims.generateFrameNumbers(key, { start: 0, end: total - 1 }),
          frameRate: 8,
          repeat: -1
        });
      }
    });

    // Spawn enemies spaced along the level
    this.enemies = [];
    const enemyPositions = [
      { type: 'drunkA', x: 400, y: height - 100 },
      { type: 'drunkB', x: 800, y: height - 100 },
      { type: 'nerdA',  x: 1200, y: height - 100 },
      { type: 'nerdB',  x: 1600, y: height - 100 },
      { type: 'oldMan', x: 1900, y: height - 100 }
    ];
    enemyPositions.forEach(p => {
      const enemy = new Enemy(this, p.type, p.x, p.y);
      this.physics.add.collider(enemy.sprite, ground);
      this.enemies.push(enemy);
    });
    // Prevent enemies overlapping player horizontally but allow pass-through vertically
    this.enemies.forEach(enemy => {
      this.physics.add.collider(this.player, enemy.sprite);
    });

    // HUD texts and bars
    this.healthText = this.add.text(10, 10, '', { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff' }).setScrollFactor(0);
    this.scoreText  = this.add.text(10, 35, '', { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff' }).setScrollFactor(0);
    this.comboText  = this.add.text(10, 60, '', { fontFamily: 'Arial', fontSize: '20px', color: '#ffff00' }).setScrollFactor(0);
    this.charText   = this.add.text(10, 85, 'Character: ' + this.selectedCharacter, { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff' }).setScrollFactor(0);

    this.healthBarBg = this.add.rectangle(width / 2 - 150, 10, 300, 15, 0x444444).setOrigin(0, 0).setScrollFactor(0);
    this.healthBar   = this.add.rectangle(width / 2 - 150, 10, 300, 15, 0xff3333).setOrigin(0, 0).setScrollFactor(0);

    // Attack cooldowns
    this.lastPunchTime  = 0;
    this.lastKickTime   = 0;
    this.lastSpecialTime= 0;
  }

  update(time, delta) {
    // Update HUD values
    this.healthText.setText('HP: ' + this.playerHP);
    this.scoreText.setText('Score: ' + this.score);
    // Combo resets
    if (this.comboCount > 0 && (time - this.lastHitTime) > this.comboTimeout) {
      this.comboCount = 0;
    }
    this.comboText.setText(this.comboCount > 1 ? 'Combo: ' + this.comboCount : '');
    // Update health bar width
    this.healthBar.width = (this.playerHP / 100) * 300;

    // Player movement and animation
    const moveSpeed = 120;
    let moving = false;
    if (this.controls.state.left) {
      this.player.setVelocityX(-moveSpeed);
      this.player.setFlipX(true);
      moving = true;
    } else if (this.controls.state.right) {
      this.player.setVelocityX(moveSpeed);
      this.player.setFlipX(false);
      moving = true;
    } else {
      this.player.setVelocityX(0);
    }
    // Play appropriate animation if not attacking
    if (!this.player.anims.isPlaying || (this.player.anims.currentAnim.key === 'playerIdleAnim' || this.player.anims.currentAnim.key === 'playerWalkAnim')) {
      if (moving) {
        this.player.play('playerWalkAnim', true);
      } else {
        this.player.play('playerIdleAnim', true);
      }
    }
    // Jumping
    if (this.controls.state.jump && this.player.body.touching.down) {
      this.player.setVelocityY(-250);
    }
    // Attacks
    if (this.controls.state.punch && (time - this.lastPunchTime) > 400) {
      this.performAttack('punch');
      this.lastPunchTime = time;
    }
    if (this.controls.state.kick && (time - this.lastKickTime) > 600) {
      this.performAttack('kick');
      this.lastKickTime = time;
    }
    if (this.controls.state.special && (time - this.lastSpecialTime) > 2000) {
      this.performSpecial();
      this.lastSpecialTime = time;
    }
    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.update();
    });
  }

  /**
   * Perform a basic melee attack. Checks nearby enemies and applies damage.
   * @param {string} type 'punch' or 'kick'
   */
  performAttack(type) {
    const reach = type === 'kick' ? 70 : 50;
    const damage = type === 'kick' ? 20 : 15;
    // Play punch animation for both punch and kick actions; kicks reuse punch frames for now
    if (type === 'punch' || type === 'kick') {
      this.player.play('playerPunchAnim', true);
    }
    this.enemies.forEach(enemy => {
      if (!enemy.dead) {
        const dx = Math.abs(enemy.sprite.x - this.player.x);
        const dy = Math.abs(enemy.sprite.y - this.player.y);
        if (dx < reach && dy < 40) {
          hitEnemy(this, enemy, damage);
        }
      }
    });
  }

  /**
   * Executes the hero's special attack. Each character has a unique effect.
   */
  performSpecial() {
    const hero = this.selectedCharacter.toLowerCase();
    const x = this.player.x;
    const y = this.player.y - 10;
    switch (hero) {
      case 'darren':
        // Throw a quiz card boomerang (we'll reuse the star icon as projectile)
        this.spawnProjectile('iconStar', x, y, this.player.flipX ? -200 : 200, 0, 30);
        break;
      case 'pat':
        // Rapid-fire punches: multiple quick attacks
        for (let i = 0; i < 3; i++) {
          this.time.delayedCall(i * 150, () => this.performAttack('punch'));
        }
        break;
      case 'colm':
        // Energy wave: hits all enemies in front of player
        this.enemies.forEach(enemy => {
          if (!enemy.dead) {
            const inFront = this.player.flipX ? enemy.sprite.x < this.player.x : enemy.sprite.x > this.player.x;
            const distance = Math.abs(enemy.sprite.x - this.player.x);
            if (inFront && distance < 200) {
              hitEnemy(this, enemy, 25);
            }
          }
        });
        break;
      case 'john':
        // Flying headbutt: dash forward and damage enemies hit
        const dashSpeed = this.player.flipX ? -250 : 250;
        const originalVelX = this.player.body.velocity.x;
        this.player.setVelocityX(dashSpeed);
        this.time.delayedCall(400, () => {
          this.player.setVelocityX(originalVelX);
        });
        this.performAttack('kick');
        break;
      case 'chris':
        // Beer splash: spawn puddle that stuns enemies
        this.spawnProjectile('iconPint', x, y, this.player.flipX ? -150 : 150, 0, 10, true);
        break;
      default:
        this.performAttack('kick');
        break;
    }
  }

  /**
   * Spawns a projectile sprite that travels and damages enemies on contact.
   * @param {string} texture Key of the texture to use
   * @param {number} x
   * @param {number} y
   * @param {number} velX Horizontal velocity
   * @param {number} velY Vertical velocity
   * @param {number} damage Damage dealt to enemies
   * @param {boolean} stun Whether to stun rather than damage
   */
  spawnProjectile(texture, x, y, velX, velY, damage = 20, stun = false) {
    const proj = this.physics.add.image(x, y, texture).setScale(0.8);
    proj.setVelocity(velX, velY);
    proj.body.allowGravity = false;
    // Collision with enemies
    this.enemies.forEach(enemy => {
      this.physics.add.overlap(proj, enemy.sprite, () => {
        if (!enemy.dead) {
          if (stun) {
            // Stun: slow enemy speed temporarily
            enemy.speed *= 0.3;
            this.time.delayedCall(1000, () => { enemy.speed *= (1 / 0.3); });
          } else {
            hitEnemy(this, enemy, damage);
          }
          proj.destroy();
        }
      }, null, this);
    });
    // Destroy projectile after 3 seconds
    this.time.delayedCall(3000, () => { if (proj && proj.active) proj.destroy(); });
  }
}