Creep.prototype.runScavenger = function() {
  if (this.memory.transporting && this.carry.energy === 0) {
    this.memory.transporting = false;
  }

  if (!this.memory.transporting && this.carry.energy == this.carryCapacity) {
    this.memory.transporting = true;
  }


  if (this.memory.transporting) {
    var targets = this.findNotFullEnergyStorage();
    if(targets.length > 0) {
      if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0]);
      }
    }
  } else {
    var target = this.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if (target) {
      if(this.pickup(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
    }
  }
};
