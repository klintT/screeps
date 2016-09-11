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

  if (!this.spawning) {
    this.memory.spawningRole = null;
  }

  // TODO: Make this a tiered system
  if (this.name === 'Spawn2') {
    this.spawnHarvester();
    if (this.spawnBuilder()) return;
    return;
  }

  if (this.spawnCollector()) return;
  if (this.spawnTransporter()) return;
  if (this.spawnBaseManager()) return;
  if (this.spawnArmy()) return;
  if (this.spawnMineralHarvester()) return;
  if (this.spawnUpgrader()) return;
  if (this.spawnConqueror()) return;
  if (this.spawnScavenger()) return;
  if (this.spawnGuard()) return;
  if (this.spawnBuilder()) return;
  if (this.spawnNomad()) return;
};

Spawn.prototype.checkRoomsForSpawnNeeds = function(role) {
  var room;
  var shouldSpawnCollector = false;
  for (i in this.room.memory.managedRooms) {
    var name = this.room.memory.managedRooms[i];
    room = Game.rooms[name];
    if (room && room.memory.needs[role] > 0) {
      shouldSpawnCollector = true;
      break;
    }
  }

  return {'room': room, 'shouldSpawn': shouldSpawnCollector};
};

Spawn.prototype.checkIfAlreadySpawning = function(role) {
  var spawn;
  for (i in this.memory.roomSpawns) {
    var name = this.memory.roomSpawns[i];
    spawn = Game.spawns[name];
    if (spawn && spawn.memory.spawningRole == role) return null;
  }
  return spawn;
};

Spawn.prototype.doSpawn = function(roleName, bodyParts) {
  var res = this.checkRoomsForSpawnNeeds(roleName);
  var room = res.room;
  var shouldSpawnCollector = res.shouldSpawn;

  var spawn = this.checkIfAlreadySpawning(roleName);

  if (room && shouldSpawnCollector && spawn) {
    var status = this.createCreep(
      bodyParts, null, {role: roleName}
    );

    if (_.isString(status)) {
      room.memory.needs[roleName] -= 1;
      spawn.memory.spawningRole = roleName;
    }

    return true;
  }

  return false;
};

Spawn.prototype.spawnCollector = function() {
  var bodyParts = [
    WORK,
    WORK,
    WORK,
    WORK,
    WORK,
    MOVE, MOVE,
    CARRY, MOVE
  ];

  return this.doSpawn('collector', bodyParts);
};

Spawn.prototype.spawnTransporter = function() {
  var bodyParts = [
    MOVE, MOVE,
    MOVE, MOVE,
    MOVE, MOVE,
    MOVE, MOVE,
    MOVE, MOVE,
    MOVE, CARRY,
    CARRY,CARRY,
    CARRY,CARRY,
    CARRY, CARRY,
    CARRY];

    return this.doSpawn('transporter', bodyParts);
};

Spawn.prototype.spawnHarvester = function() {
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  if (harvesters.length < 2) {
    this.createCreep(
      [
        WORK,
        WORK,
        WORK,
        CARRY, CARRY,
        CARRY, CARRY,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE], null, {role: 'harvester'}
    );
    return true;
  }
}

Spawn.prototype.spawnMineralHarvester = function() {
  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'mineral_harvester');
  if (harvesters.length < 1) {
    this.createCreep(
      [
        WORK,
        WORK,
        CARRY, CARRY,
        CARRY, CARRY,
        MOVE, MOVE,
        MOVE, MOVE], null, {role: 'mineral_harvester'}
    );
    return true;
  }
};

Spawn.prototype.spawnBaseManager = function() {
  var baseManagers = _.filter(Game.creeps, (creep) => creep.memory.role == 'baseManager');
  if (baseManagers.length < 2) {
    this.createCreep(
      [
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, CARRY,
        CARRY,CARRY,
        CARRY, CARRY,
        CARRY, CARRY,
        MOVE, CARRY
      ], null, {role: 'baseManager'}
    );
    return true;
  }
}

Spawn.prototype.spawnGuard = function() {
  var guards = _.filter(Game.creeps, (creep) => creep.memory.role == 'guard');
  if (guards.length < 1) {
    this.createCreep(
      [
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        MOVE, MOVE,
        MOVE, MOVE,
        ATTACK, ATTACK,
        ATTACK, ATTACK,
        ATTACK, MOVE
      ],
      null, {role: 'guard'});
      return true;
  }
}

Spawn.prototype.spawnConqueror = function() {
  var claimFlags = 1;
  var conquerors = _.filter(Game.creeps, (creep) => creep.memory.role == 'conqueror');
  if (conquerors.length < claimFlags) {
    this.createCreep(
      [
        CLAIM,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE
      ], null, {role: 'conqueror'}
    );
    return true;
  }
}

Spawn.prototype.spawnScavenger = function() {
  var scavengers = _.filter(Game.creeps, (creep) => creep.memory.role == 'scavenger');
  if (scavengers < 0) {
    this.createCreep(
      [
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, CARRY,
        CARRY, CARRY,
        CARRY, CARRY,
        CARRY], null, {role: 'scavenger'}
    );
    return true;
  }
}

Spawn.prototype.spawnBuilder = function() {
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
  if (builders.length < 3) {
    this.createCreep(
      [
        WORK,
        WORK,
        WORK,
        WORK,
        CARRY, CARRY,
        CARRY, CARRY,
        CARRY, CARRY,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE], null, {role: 'builder'}
    );
    return true;
  }
}

Spawn.prototype.spawnNomad = function() {
  var nomads = _.filter(Game.creeps, (creep) => creep.memory.role == 'nomad');
  if (nomads.length < 1) {
    this.createCreep(
      [
        WORK,
        WORK,
        WORK,
        WORK,
        CARRY, CARRY,
        CARRY, CARRY,
        MOVE, MOVE,
        MOVE, MOVE], null, {role: 'nomad'}
    );
    return true;
  }
}

Spawn.prototype.spawnUpgrader = function() {
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  //TODO: Do this better
  var almostDead = _.filter(upgraders, (upgrader) => upgrader.ticksToLive < 100);
  var amt = upgraders.length - almostDead.length;
  if (amt < 2) {
    this.createCreep(
      [
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        CARRY, CARRY,
        CARRY, CARRY,
        MOVE, MOVE,
        MOVE, MOVE ], null, {role: 'upgrader'}
    );
    return true;
  }
}

Spawn.prototype.spawnArmy = function() {
  var warTime = false;
  if (!warTime) return;

  var tanks = _.filter(Game.creeps, (creep) => creep.memory.role == 'tank');
  var tankydps = _.filter(Game.creeps, (creep) => creep.memory.role == 'tankydps');
  var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');

  if (healers.length < (0)) {
    this.createCreep(
      [
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        MOVE, MOVE,
        MOVE, MOVE,
        HEAL, HEAL,
        HEAL, HEAL,
        HEAL, HEAL,
        MOVE, MOVE,
        MOVE, MOVE,
        HEAL, MOVE
      ],
      null, {role: 'healer'});
      return true;
  } else if (tankydps.length < 4) {
    this.createCreep(
      [
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        ATTACK, ATTACK,
        ATTACK, ATTACK,
        ATTACK, ATTACK,
        ATTACK, ATTACK,
        ATTACK, ATTACK,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        MOVE, MOVE,
        ATTACK, MOVE
      ],
      null, {role: 'tankydps'});
      return true;
  } else if (tanks.length < 0) {
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
  }
}
