Creep.prototype.runUpgrader = function() {
  var collectFromStorage = function(creep) {
    var stores = creep.findEnergyStorageWithEnergy();
    if (stores.length) {
      //Draw energy from storage
      var err = creep.withdraw(stores[0], RESOURCE_ENERGY);
      if (err == ERR_NOT_IN_RANGE) {
        creep.moveTo(stores[0]);
      }
    }
  };

  if(this.memory.upgrading && this.carry.energy == 0) {
    this.memory.upgrading = false;
  }
  if(!this.memory.upgrading && this.carry.energy == this.carryCapacity) {
    this.memory.upgrading = true;
  }

  if(this.memory.upgrading) {
    var turrets = this.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity / 1.25));
      }
    });

    if (turrets.length) {
      // Load Turrets
      if(this.transfer(turrets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(turrets[0]);
      }
    } else {
      // Upgrade
      if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.room.controller);
      }
    }
  } else {
    collectFromStorage(this);
  }
};
