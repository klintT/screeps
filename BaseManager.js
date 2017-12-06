Creep.prototype.runBaseManager = function() {
  var loadTower = function(creep) {
    var towers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity / 1.25));
      }
    });

    if (towers.length) {
      // Load Turrets
      if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(towers[0]);
      }
      return true;
    }
  };

  var collectFromBaseLink = function(creep) {
    // TODO: Use flags to specify this location instead of hard coding it
    var baseLink = _.filter(creep.room.lookForAt('structure', 16, 12), (struct) => struct.structureType == STRUCTURE_LINK);
    if (baseLink && baseLink.length > 0 && baseLink[0].energy > 0) {
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
    if (loadTower(this)) return;

    var targets = this.findNotFullEnergyStorage();
    if (targets.length > 0) {
      if (this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
