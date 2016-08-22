var Harvester = require('Harvester');
var Builder = require('Builder');
var Upgrader = require('Upgrader');
var Transporter = require('Transporter');
var Collector = require('Collector');
var Conqueror = require('Conqueror');

Creep.prototype.run = function() {
  switch (this.memory.role) {
    case 'harvester':
      this.runHarvester();
      break;
    case 'builder':
      this.runBuilder();
      break;
    case 'upgrader':
      this.runUpgrader();
      break;
    case 'collector':
      this.runCollector();
      break;
    case 'transporter':
      this.runTransporter();
      break;
    case 'conqueror':
      this.runConqueror();
      break;
    default:
      console.log('Unimplemented role!');
  }
};

Creep.prototype.findEnergyStorageWithEnergy = function(requestedEnergy) {
  var neededEnergy = (requestedEnergy) ? requestedEnergy : 50;
  return this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > neededEnergy);
    }
  });
};

Creep.prototype.findNotFullEnergyStorage = function() {
  var spawns = this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
    }
  });

  if (spawns.length > 0){
    return spawns;
  } else {
    return this.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
      }
    });
  }
};

Creep.prototype.onEdge = function() {
  return (this.pos.x == 0 || this.pos.x == 49 || this.pos.y == 0 || this.pos.y == 49);
};

Creep.prototype.changeRooms = function(sayRoom) {
  if (this.memory.roomName != this.room.name || this.onEdge()) {
    if (sayRoom) this.say(this.memory.roomName);
    this.moveTo(new RoomPosition(25, 25, this.memory.roomName));
    return false;
  }

  return true;
};
