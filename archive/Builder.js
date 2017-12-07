Creep.prototype.runBuilder = function() {
  var getRoom = function(creep) {
    // TODO: Don't hard code this
    creep.memory.roomName = 'W52S37';
  };

  var gatherEnergy = function(creep) {
    var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: { resourceType: RESOURCE_ENERGY }});
    if (target) {
      if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
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
      var sources = creep.room.find(FIND_SOURCES);
      var target = 0;
      if(creep.harvest(sources[target]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[target]);
      }
    }
  };

  if (this.memory.building && this.carry.energy == 0) {
    this.memory.building = false;
  }

  if (!this.memory.building && this.carry.energy == this.carryCapacity) {
    this.memory.building = true;
  }

  if (this.memory.building) {
    // getRoom(this);
    // if (!this.changeRooms()) {
      // return;
    // }

    //Build
    var target = this.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
    if (!target)  {
      var targets = Game.constructionSites;
      var highPrio = _.filter(targets, (target) => target.structureType != STRUCTURE_ROAD);
      target = (highPrio.length) ? highPrio[0] : targets[0];
    }

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
