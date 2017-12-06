Creep.prototype.runTank = function() {
  this.say('Tank&Spank!');
  if (this.beDecoy() && this.ticksToLive > 300) return;
  if (this.planAttack()) return;
  if (this.groupUp()) return;
  this.waitBySpawn();
};

Creep.prototype.beDecoy = function() {
  if (this.hits >= this.hitsMax / 1.5) {
    if (!this.movingToFlag(COLOR_RED, COLOR_BLUE, 1)) {
      // this.planAttack(false);
    }
  } else {
    if (!this.movingToFlag(COLOR_GREEN, COLOR_GREEN, 1)) {
      this.planAttack(false);
    }
  }

  return true;
};
