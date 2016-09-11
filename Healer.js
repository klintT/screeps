Creep.prototype.runHealer = function() {
  // this.say('I Heal The!');
  // if (this.beDecoy()) return;
  if (this.planHeal()) return;
  if (this.groupUp()) return;
  this.waitBySpawn();
};

Creep.prototype.planHeal = function() {
  var target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: function(object) {
      return object.hits < object.hitsMax;
    }
  });

  if (this.hits < 1700) {
    if (!this.movingToFlag(COLOR_GREEN, COLOR_GREEN, 1)) {
      this.heal(target);
    }
    return true;
  }

  if (target) {
    if (this.heal(target) == ERR_NOT_IN_RANGE) {
      if (this.moveTo(target) === ERR_NO_PATH) {
        this.rangedHeal(target);
      }
    }
    return true;
  }
};
