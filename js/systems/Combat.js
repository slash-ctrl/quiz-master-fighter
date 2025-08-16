/**
 * Combat helper functions for handling damage, scoring and combos.
 * Scenes using this should maintain playerHP, comboCount, score and a
 * lastHitTime property to track combo timeouts.
 */
export function hitEnemy(scene, enemy, damage = 10) {
  if (!enemy || enemy.dead) return;
  enemy.hp -= damage;
  // Increase score and combo
  scene.score += 100;
  scene.comboCount++;
  scene.lastHitTime = scene.time.now;
  // Knock enemy back slightly
  enemy.sprite.setVelocityX(enemy.sprite.body.velocity.x * -0.5);
  if (enemy.hp <= 0) {
    enemy.dead = true;
    // Remove enemy sprite after a short delay
    enemy.sprite.disableBody(true, true);
    scene.score += 500;
  }
}

export function playerDamaged(scene, amount = 10) {
  scene.playerHP -= amount;
  if (scene.playerHP < 0) scene.playerHP = 0;
  // Reset combo on taking damage
  scene.comboCount = 0;
  // Trigger hurt effect: flash player
  scene.player.setTintFill(0xff0000);
  scene.time.delayedCall(100, () => {
    scene.player.clearTint();
  });
}