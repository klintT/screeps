var Harvester = require('Harvester');
var Builder = require('Builder');
var Upgrader = require('Upgrader');
var Transporter = require('Transporter');
var Collector = require('Collector');
var Conqueror = require('Conqueror');

var Nomad = require('Nomad');
var Scavenger = require('Scavenger');
var BaseManager = require('BaseManager');

var Tank = require('Tank');
var TankDPS = require('TankyDPS');
var Healer = require('Healer');
var Baiter = require('Baiter');

var Guard = require('Guard');

Creep.prototype.run = function() {
  switch (this.memory.role) {
    case 'harvester':
      if (this.flee()) return;
      this.safeRunTask(this.runHarvester.bind(this));
      break;
    case 'builder':
      if (this.flee()) return;
      this.safeRunTask(this.runBuilder.bind(this));
      break;
    case 'upgrader':
      if (this.flee()) return;
      this.safeRunTask(this.runUpgrader.bind(this));
      break;
    case 'collector':
      if (this.flee()) return;
      this.safeRunTask(this.runCollector.bind(this));
      break;
    case 'transporter':
      if (this.flee()) return;
      this.safeRunTask(this.runTransporter.bind(this));
      break;
    case 'conqueror':
      if (this.flee()) return;
      this.safeRunTask(this.runConqueror.bind(this));
      break;
    case 'tank':
      this.safeRunTask(this.runTank.bind(this));
      break;
    case 'tankydps':
      this.safeRunTask(this.runTankyDPS.bind(this));
      break;
    case 'healer':
      this.safeRunTask(this.runHealer.bind(this));
      break;
    case 'scavenger':
      if (this.flee()) return;
      this.safeRunTask(this.runScavenger.bind(this));
      break;
    case 'baseManager':
      if (this.flee()) return;
      this.safeRunTask(this.runBaseManager.bind(this));
      break;
    case 'nomad':
      if (this.flee()) return;
      this.safeRunTask(this.runNomad.bind(this));
      break;
    case 'guard':
      this.safeRunTask(this.runGuard.bind(this));
      break;
    case 'baiter':
      this.safeRunTask(this.runBaiter.bind(this));
      break;
    default:
      console.log('Unimplemented role! ' + this.memory.role);
  }
};

Creep.prototype.safeRunTask = function(callback) {
  try {
    callback();
  } catch (err) {
    console.log('Creep Error: ' + err);
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
  var target = this.pos.findClosestByRange(FIND_STRUCTURES, { filter: function(structure) {
      return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
  }});
  if (target){
    //TODO: unArry this
    return [target];
  } else {
    return this.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
      }
    });
  }
};

Creep.prototype.onEdge = function() {
  return (this.pos.x <= 1 || this.pos.x > 48 || this.pos.y <= 0 || this.pos.y > 48);
};

Creep.prototype.changeRooms = function(sayRoom) {
  if (this.memory.roomName != this.room.name || this.onEdge()) {
    if (sayRoom) this.say(this.memory.roomName);
    this.moveTo(new RoomPosition(25, 25, this.memory.roomName));
    return false;
  }

  return true;
};

Creep.prototype.getOutOfTheWay = function() {
  this.moveTo(new RoomPosition(25, 25, this.memory.roomName));
};

Creep.prototype.waitBySpawn = function() {
  // TODO: un-hard code this. Possibly pass into here as param
  var targetSpawn = Game.spawns.Spawn1;
  if (!this.pos.isNearTo(targetSpawn)) {
    this.memory.renew = false;
    this.moveTo(targetSpawn);
  } else {
    this.memory.renew = true;
  }
};

Creep.prototype.movingToFlag = function(colorOne, colorTwo, _range) {
  var range = (!_range) ? 1 : _range;
  var flags = _.filter(Game.flags, (flag) => (flag.color == colorOne && flag.secondaryColor == colorTwo));
  if (!flags[0]) return true;

  if (!this.pos.inRangeTo(flags[0], range)) {
    this.moveTo(flags[0]);
    return true;
  }

  return false;
};

Creep.prototype.groupUp = function() {
  return this.movingToFlag(COLOR_GREEN, COLOR_GREEN);
};

// TODO: This needs tested.
Creep.prototype.flee = function() {
  if (!this.memory.hasFled) {
    var hostiles = this.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length && this.hits < this.hitsMax) {
      this.memory.returnName = this.memory.roomName;
      this.memory.roomName = (!this.room.memory.safeRoom) ? this.getSafeRoomName() : this.room.memory.safeRoom;
      this.memory.hasFled = true;
      this.changeRooms(false);
    }
  } else {
    var returnRooms = _.filter(Game.rooms, (room) => (room.name == this.memory.returnRoom));
    if (returnRooms.length) {
      var hostiles = returnRooms[0].find(FIND_HOSTILE_CREEPS);
      if (!hostiles.length) {
        this.memory.safeRoom = this.memory.roomName;
        this.memory.roomName = this.room.memory.returnRoomName;
        this.memory.hasFled = false;
        this.changeRooms(false);
      }
    }
  }
};

Creep.prototype.getSafeRoomName = function() {
  // if (this.room.roomName == 'W52S38') {
  return 'W52S39';
  // }
};

Creep.prototype.planAttack = function(overrideTarget) {
  var defaultTargeting = (overrideTarget) ? overrideTarget : true;

  if (this.memory.target && Game.creeps[this.memory.target]) {
    this.doAttack(Game.creeps[this.memory.target]);
  }

  var flag = this.pos.findClosestByRange(FIND_FLAGS, { filter: { color: COLOR_RED, secondaryColor: COLOR_RED } });
  if (flag) {
    let structures = flag.pos.lookFor(LOOK_STRUCTURES);
    if (structures.length && structures[0] instanceof Structure) {
      this.doAttack(structures[0], false && defaultTargeting);
    } else {
      flag.remove();
    }
    return true;
  }

  var hostiles = this.room.find(FIND_HOSTILE_CREEPS);
  if (hostiles.length) {
    this.doAttack(hostiles[0], true && defaultTargeting);
    return true;
  }

  return false;
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
