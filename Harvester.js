Creep.prototype.runHarvester = function() {
  if(this.carry.energy < this.carryCapacity) {
    var sources = this.room.find(FIND_SOURCES);
    if (!this.memory.target && this.memory.target !== 0) {
      this.memory.target = Math.floor(Math.random() * sources.length);
    }

    var target = this.memory.target;
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
