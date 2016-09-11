Creep.prototype.runBaseManager = function() {
  var collectFromBaseLink = function(creep) {
    // TODO: Use flags to specify this location instead of hard coding it
    var baseLink = _.filter(creep.room.lookForAt('structure', 27, 21), (struct) => struct.structureType == STRUCTURE_LINK);
    if (baseLink && baseLink[0].energy > 0) {
      //Draw energy from base link
      var err = creep.withdraw(baseLink[0], RESOURCE_ENERGY);
      if (err == ERR_NOT_IN_RANGE) {
        creep.moveTo(baseLink[0]);
      }
      return true;
    }
  };

  if (this.memory.transporting && this.carry.energy === 0) {
    this.memory.transporting = false;
  }

  if (!this.memory.transporting && this.carry.energy == this.carryCapacity) {
    this.memory.transporting = true;
  }

  if (this.memory.transporting) {
    this.loadTower();

    var targets = this.findNotFullEnergyStorage();
    if(targets.length > 0) {
      if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0]);
      }
    }
  } else {
    if (collectFromBaseLink(this)) return;

    var stores = this.findEnergyStorageWithEnergy();
    if (stores.length) {
      //Draw energy from storage
      var err = this.withdraw(stores[0], RESOURCE_ENERGY);
      if (err == ERR_NOT_IN_RANGE) {
        this.moveTo(stores[0]);
      }
    }
  }
};
