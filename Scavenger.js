Creep.prototype.runScavenger = function() {
  if (this.memory.scavenging && this.carry.energy === 0) {
    this.memory.scavenging = false;
  }

  if (!this.memory.scavenging && this.carry.energy == this.carryCapacity) {
    this.memory.scavenging = true;
  }


  if (this.memory.scavenging) {
    var targets = this.findNotFullEnergyStorage();
    if(targets.length > 0) {
      if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0]);
      }
    } else {
      this.runBaseManager();
    }
  } else {
    var target = this.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if (target) {
      if(this.pickup(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
    } else {
      this.runBaseManager();
    }
  }
};
