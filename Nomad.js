Creep.prototype.runNomad = function() {
  var getRoom = function(creep) {
    // TODO: Don't hard code this
    creep.memory.roomName = 'W52S38';
  };

  var gatherEnergy = function(creep) {
    var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if (target) {
      if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
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
    //Build
    var targets = this.room.find(FIND_CONSTRUCTION_SITES);
    var highPrio = _.filter(targets, (target) => target.structureType != STRUCTURE_ROAD);
    var target = (highPrio.length) ? highPrio[0] : targets[0];

    if (target) {
      if (this.build(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
    }
  } else {
    gatherEnergy(this);
  }
};
