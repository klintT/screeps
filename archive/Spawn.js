Spawn.prototype.run = function() {
  var clearCollectionTeams = function(co, tr) {
    for (c in co) {
      co[c].memory.roomName = null;
      co[c].memory.target = null;
    }

    for (t in tr) {
      tr[t].memory.roomName = null;
      tr[t].memory.target = null;
    }

    for (n in Game.rooms) {
      Game.rooms[n].memory.collectionTeams = null;
    }
  };
  // clearCollectionTeams(collectors, transporters);

  var creeps = _.filter(Game.creeps, (creep) => (creep.memory.renew == true && creep.pos.isNearTo(this)));
  this.renewCreep(creeps[0]);

  // If we are already spawning a creep just leave here
  if (this.spawning != null) return;

  if (this.room.controller.level < 3) {
    if (this.spawnHarvester()) return;
    if (this.spawnBuilder()) return;
    if (this.spawnUpgrader()) return;
    return;
  }

  if (this.spawnCollector()) return;
  if (this.spawnBaseManager()) return;
  if (this.spawnTransporter()) return;
  if (this.spawnArmy()) return;
  if (this.spawnGuard()) return;
  if (this.spawnConqueror()) return;
  if (this.spawnScavenger()) return;
  if (this.spawnBuilder()) return;
  if (this.spawnUpgrader()) return;
  if (this.spawnNomad()) return;
};

Spawn.prototype.getAffordableParts = function(desiredParts, type) {
  var getPartCost = function(part) {
    switch(part) {
      case WORK:
        return 100;
      case MOVE:
      case CARRY:
        return 50;
      case ATTACK:
        return 80;
      case RANGED_ATTACK:
        return 150;
      case HEAL:
        return 250;
      case CLAIM:
        return 600;
      case TOUGH:
        return 10;
    }
  };

  var extensions = this.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_EXTENSION }});
  var spawns = this.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_SPAWN }});
  var capacity = (spawns.length * 300) + (extensions.length * 50);

  var cost = 0;
  var affordableParts = [];
  for (i in desiredParts) {
    var evalPart = desiredParts[i];
    var evalCost = getPartCost(evalPart.toString());
    if (cost + evalCost < capacity) {
      affordableParts.push(evalPart);
      cost += evalCost;
    } else {
      return affordableParts;
    }
  }

  return affordableParts;
};

Spawn.prototype.spawnHarvester = function() {
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  if (harvesters.length < 8) {
    var desiredParts = [
      WORK,
      CARRY,
      MOVE,
      WORK,
      CARRY,
      MOVE
    ];

    var parts = this.getAffordableParts(desiredParts, 'h');
    this.createCreep(parts, null, {role: 'harvester'});
    return true;
  }
}

Spawn.prototype.spawnBuilder = function() {
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
  if (builders.length < 4) {
    var desiredParts = [
      WORK,
      CARRY,
      MOVE,
      MOVE,
      CARRY,
      WORK,
      MOVE,
      CARRY,
      WORK,
      MOVE,
      CARRY,
      WORK
    ];

    var parts = this.getAffordableParts(desiredParts);
    this.createCreep(parts, null, {role: 'builder'});
    return true;
  }
}

Spawn.prototype.spawnUpgrader = function() {
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  if (upgraders.length < 1) {
    var desiredParts = [
      WORK,
      CARRY,
      MOVE,
      MOVE,
      CARRY,
      WORK,
      MOVE,
      CARRY,
      WORK,
      MOVE,
      CARRY,
      WORK
    ];

    var parts = this.getAffordableParts(desiredParts);
    this.createCreep(parts, null, {role: 'upgrader'});
    return true;
  }
}

Spawn.prototype.spawnCollector = function() {
  var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
  if (collectors.length < 4) {
    var desiredParts = [
      WORK, CARRY,
      MOVE, WORK,
      MOVE, WORK,
      MOVE, WORK,
      WORK, MOVE,
      MOVE, MOVE,
      MOVE, MOVE
    ];

    var parts = this.getAffordableParts(desiredParts);
    this.createCreep(parts, null, {role: 'collector'});
    return true;
  }
}

Spawn.prototype.spawnBaseManager = function() {
  var baseManagers = _.filter(Game.creeps, (creep) => creep.memory.role == 'baseManager');
  if (baseManagers.length < 1) {
    var desiredParts = [
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, MOVE,
      MOVE, MOVE,
      MOVE, MOVE
    ];

    var parts = this.getAffordableParts(desiredParts);
    this.createCreep(parts, null, {role: 'baseManager'});
    return true;
  }
}

Spawn.prototype.spawnTransporter = function() {
  var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
  if (transporters.length < 9) {
    var desiredParts = [
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, MOVE,
      MOVE, MOVE,
      MOVE, MOVE,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, MOVE,
      MOVE, MOVE,
      MOVE, MOVE
    ];

    var parts = this.getAffordableParts(desiredParts);
    this.createCreep(parts, null, {role: 'transporter'});
    return true;
  }
}

Spawn.prototype.spawnScavenger = function() {
  var scavengers = _.filter(Game.creeps, (creep) => creep.memory.role == 'scavenger');
  if (scavengers < 0) {
    var desiredParts = [
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, CARRY,
      MOVE, MOVE,
      MOVE, MOVE,
      MOVE, MOVE
    ];

    var parts = this.getAffordableParts(desiredParts);
    this.createCreep(parts, null, {role: 'scavenger'});
    return true;
  }
}

var claimFlags = 1;
Spawn.prototype.spawnGuard = function() {
  var guards = _.filter(Game.creeps, (creep) => creep.memory.role == 'guard');
  if (guards.length < claimFlags) {
    var desiredParts = [
      MOVE, ATTACK,
      MOVE, ATTACK,
      MOVE, ATTACK,
      MOVE, ATTACK,
      MOVE, ATTACK,
      TOUGH, TOUGH,
      TOUGH, TOUGH,
      TOUGH, TOUGH,
      TOUGH, TOUGH,
      TOUGH, TOUGH,
      TOUGH, TOUGH,
      TOUGH, TOUGH,
      TOUGH, TOUGH,
      TOUGH, TOUGH,
      TOUGH, TOUGH,
      TOUGH, TOUGH
    ];

    var parts = this.getAffordableParts(desiredParts);
    this.createCreep(parts, null, {role: 'guard'});
    return true;
  }
}

Spawn.prototype.spawnConqueror = function() {
  var conquerors = _.filter(Game.creeps, (creep) => creep.memory.role == 'conqueror');
  if (conquerors.length < claimFlags) {
    var desiredParts = [
      CLAIM,
      MOVE, MOVE,
      MOVE, MOVE,
      MOVE, MOVE
    ];

    var parts = this.getAffordableParts(desiredParts);
    this.createCreep(parts, null, {role: 'conqueror'});
    return true;
  }
}

Spawn.prototype.spawnNomad = function() {
  var nomads = _.filter(Game.creeps, (creep) => creep.memory.role == 'nomad');
  if (nomads.length < claimFlags) {
    var desiredParts = [
      WORK, MOVE,
      CARRY, MOVE,
      WORK, MOVE,
      CARRY, MOVE,
      CARRY, MOVE,
      CARRY, MOVE,
      WORK, WORK
    ];

    var parts = this.getAffordableParts(desiredParts);
    this.createCreep(parts, null, {role: 'nomad'});
    return true;
  }
}

Spawn.prototype.spawnArmy = function() {
  var warTime = false;
  if (!warTime) return;

  var tanks = _.filter(Game.creeps, (creep) => creep.memory.role == 'tank');
  var tankydps = _.filter(Game.creeps, (creep) => creep.memory.role == 'tankydps');
  var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');

  if (tanks.length < 2) {
    var err = this.createCreep(
      [
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        // TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        // TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        // ATTACK, ATTACK,
        ATTACK, ATTACK
      ],
      null, {role: 'tank'});
      return true;
  } else if (tankydps.length < 0) {
    this.createCreep(
      [
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        MOVE, MOVE,
        MOVE, MOVE,
        ATTACK, ATTACK,
        ATTACK, ATTACK,
        ATTACK, ATTACK,
        ATTACK, ATTACK,
        ATTACK, ATTACK,
        ATTACK, MOVE
      ],
      null, {role: 'tankydps'});
      return true;
  } else if (healers.length < 3) {
    this.createCreep(
      [
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        MOVE, MOVE,
        MOVE, MOVE,
        HEAL, HEAL,
        HEAL, MOVE
      ],
      null, {role: 'healer'});
      return true;
  }
}
