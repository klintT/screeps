Creep.prototype.runBuilder = function() {
  var gatherEnergy = function(creep) {
    var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if (target) {
      if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    } else {
      collectFromStorage(creep);
    }
  };

  var collectFromStorage = function(creep) {
    var stores = creep.findEnergyStorageWithEnergy();
    if (stores.length) {
      //Draw energy from storage
      var err = creep.withdraw(stores[0], RESOURCE_ENERGY);
      if (err == ERR_NOT_IN_RANGE) {
        creep.moveTo(stores[0]);
      }
    } else {
      //Harvest
      // var sources = creep.room.find(FIND_SOURCES);
      // var target = 1;
      // if(creep.harvest(sources[target]) == ERR_NOT_IN_RANGE) {
        // creep.moveTo(sources[target]);
      // }
    }
  };

  if (this.memory.building && this.carry.energy == 0) {
    this.memory.building = false;
  }

  if (!this.memory.building && this.carry.energy == this.carryCapacity) {
    this.memory.building = true;
  }

  if (this.memory.building) {
    //Build
    var targets = this.room.find(FIND_CONSTRUCTION_SITES);
    var highPrio = _.filter(targets, (target) => target.structureType != STRUCTURE_ROAD);
    var target = (highPrio.length) ? highPrio[0] : targets[0];

    if (target) {
      if (this.build(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
    } else {
      this.runUpgrader();
    }
  } else {
    gatherEnergy(this);
  }
};
