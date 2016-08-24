Creep.prototype.runBaseManager = function() {
  var loadTower = function(creep) {
    var towers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity / 1.25));
      }
    });

    for (t in towers) {
      if (creep.carry.energy < (towers[t].energyCapacity / 2.25)) {
        creep.memory.emergenyLoad = true;
        return;
      }

      // Load Turrets
      if(creep.transfer(towers[t], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(towers[t]);
      }
      creep.memory.emergenyLoad = false;
    }
  };

  var collectFromBaseLink = function(creep) {
    // TODO: Use flags to specify this location instead of hard coding it
    var baseLink = _.filter(creep.room.lookForAt('structure', 27, 21), (struct) => struct.structureType == STRUCTURE_LINK);
    if (baseLink) {
      //Draw energy from base link
      var err = creep.withdraw(baseLink[0], RESOURCE_ENERGY);
      if (err == ERR_NOT_IN_RANGE) {
        creep.moveTo(baseLink[0]);
      }
    }
  };

  if (this.memory.transporting && this.carry.energy === 0) {
    this.memory.transporting = false;
  }

  if (!this.memory.transporting && this.carry.energy == this.carryCapacity) {
    this.memory.transporting = true;
  }

  if (this.memory.transporting) {
    loadTower(this);

    var targets = this.findNotFullEnergyStorage();
    if(targets.length > 0) {
      if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0]);
      }
    }
  } else {
    collectFromBaseLink(this);

    if (this.memory.emergenyLoad) {
      var stores = this.findEnergyStorageWithEnergy();
      if (stores.length) {
        //Draw energy from storage
        var err = this.withdraw(stores[0], RESOURCE_ENERGY);
        if (err == ERR_NOT_IN_RANGE) {
          this.moveTo(stores[0]);
        }
      }
    }
  }
};
