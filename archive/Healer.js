Creep.prototype.runHealer = function() {
  this.say('I Heal The!');
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

  if (target) {
    if (this.heal(target) == ERR_NOT_IN_RANGE) {
      this.moveTo(target);
    }
    return true;
  }
};
