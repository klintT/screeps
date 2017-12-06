Creep.prototype.runNomad = function() {
  var getRoom = function(creep) {
    // TODO: Don't hard code this
    creep.memory.roomName = 'W33S22';
  };

  var gatherEnergy = function(creep) {
    var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: { resourceType: RESOURCE_ENERGY }});
    if (target) {
      if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    } else {
      if (creep.carry.energy > 0) {
        creep.memory.building = true;
      }
    }
  };

  var repairStructures = function(creep) {
    //Repair
    var damaged = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.hits < (structure.hitsMax / 2));
      }
    });

    if (damaged && damaged.length) {
      if (creep.repair(damaged[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(damaged[0]);
        return;
      }
      return true;
    }
  };

  var buildStructures = function(creep) {
    //Build
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    var highPrio = _.filter(targets, (target) => target.structureType != STRUCTURE_ROAD);
    var target = (highPrio.length) ? highPrio[0] : targets[0];

    if (target) {
      if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
  };

  getRoom(this);
  if (!this.changeRooms()) {
    return;
  }

  if (this.memory.building && this.carry.energy == 0) {
    this.memory.building = false;
  }

  if (!this.memory.building && this.carry.energy == this.carryCapacity) {
    this.memory.building = true;
  }

  if (this.memory.building) {
    if (!repairStructures(this)) {
      buildStructures(this);
    }
  } else {
    gatherEnergy(this);
  }
};
