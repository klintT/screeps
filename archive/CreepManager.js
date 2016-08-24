var Harvester = require('Harvester');
var Builder = require('Builder');
var Upgrader = require('Upgrader');
var Transporter = require('Transporter');
var Collector = require('Collector');
var Conqueror = require('Conqueror');

var Scavenger = require('Scavenger');
var BaseManager = require('BaseManager');

var Tank = require('Tank');
var TankDPS = require('TankyDPS');
var Healer = require('Healer');

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
    case 'tank':
      this.runTank();
      break;
    case 'tankydps':
      this.runTankyDPS();
      break;
    case 'healer':
      this.runHealer();
      break;
    case 'scavenger':
      this.runScavenger();
      break;
    case 'baseManager':
      this.runBaseManager();
      break;
    default:
      this.runScavenger();
      // console.log('Unimplemented role!');
  }
};

Creep.prototype.findEnergyStorageWithEnergy = function(requestedEnergy) {
  var neededEnergy = (requestedEnergy) ? requestedEnergy : 50;
  return this.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > neededEnergy);
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
        return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
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

Creep.prototype.groupUp = function() {
  var flag = this.pos.findClosestByRange(FIND_FLAGS, { filter: { color: COLOR_GREEN, secondaryColor: COLOR_GREEN } });
  if (flag) {
    this.moveTo(flag);
    return true;
  }

  //TODO: Need false condition
  return false;
};

Creep.prototype.planAttack = function() {
  if (this.memory.target && Game.creeps[this.memory.target]) {
    this.doAttack(Game.creeps[this.memory.target]);
  }

  var flag = this.pos.findClosestByRange(FIND_FLAGS, { filter: { color: COLOR_RED, secondaryColor: COLOR_RED } });
  if (flag) {
    let structures = flag.pos.lookFor(LOOK_STRUCTURES);
    if (structures.length && structures[0] instanceof Structure) {
      this.doAttack(structures[0], false);
    } else {
      flag.remove();
    }
    return;
  }

  var hostiles = this.room.find(FIND_HOSTILE_CREEPS);
  if (hostiles.length) {
    this.doAttack(hostiles[0], true);
  }
};

Creep.prototype.doAttack = function(target, focusTarget) {
  if (!this.pos.inRangeTo(target, this.getActiveBodyparts(ATTACK) ? 1 : 3)) {
    this.moveTo(target);
  }

  if (this.getActiveBodyparts(ATTACK)) {
    this.attack(target);
  }

  if (this.getActiveBodyparts(RANGED_ATTACK)) {
    this.rangedAttack(target);
  }

  if (focusTarget) {
    this.memory.target = target.name;
  }
}
