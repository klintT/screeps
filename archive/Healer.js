Creep.prototype.runHealer = function() {
  this.say('I Heal The!');
  if (!this.groupUp()) {
     var damagedCreep = this.pos.findClosestByPath(FIND_MY_CREEPS, {
        filter: function(c) {
            return c !== this && c.hits < c.hitsMax;
        }
    });
    
    if (damagedCreep) {
         if (!this.pos.inRangeTo(damagedCreep, 1))
                this.moveTo(damagedCreep);
        this.heal(damagedCreep);
    }
  }
};
