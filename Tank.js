Creep.prototype.runTank = function() {
  this.say('Tank&Spank!');
  if (this.beDecoy()) return;
  if (this.planAttack()) return;
  if (this.groupUp()) return;
  // this.waitBySpawn();
};

Creep.prototype.beDecoy = function() {
  // if (this.hits >= this.hitsMax / 1.2) {
  if (this.hits > 1800) {
    if (!this.movingToFlag(COLOR_RED, COLOR_BLUE, 1)) {
      // return false;
    }
  } else {
    if (!this.movingToFlag(COLOR_GREEN, COLOR_GREEN, 1)) {
      return false;
    }
  }

  return true;
};
