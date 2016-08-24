Creep.prototype.runHarvester = function() {
  if(this.carry.energy < this.carryCapacity) {
    var sources = this.room.find(FIND_SOURCES);
    var target = 0;
    if(this.harvest(sources[target]) == ERR_NOT_IN_RANGE) {
      this.moveTo(sources[target]);
    }
  }
  else {
    var targets = this.findNotFullEnergyStorage();
    if(targets.length > 0) {
      if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0]);
      }
    }
  }
};
