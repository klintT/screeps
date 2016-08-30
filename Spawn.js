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

  // TODO: Get these values from sources and energy levels
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

Spawn.prototype.spawnCollector = function() {
  var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
  if (collectors.length < 4) {
    this.createCreep(
      [
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        MOVE, MOVE,
        CARRY, MOVE
      ], null, {role: 'collector'}
    );
    return true;
  }
}

Spawn.prototype.spawnBaseManager = function() {
  var baseManagers = _.filter(Game.creeps, (creep) => creep.memory.role == 'baseManager');
  if (baseManagers.length < 1) {
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

Spawn.prototype.spawnTransporter = function() {
  var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
  if (transporters.length < 6) {
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
        CARRY], null, {role: 'transporter'}
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
  if (scavengers < 1) {
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
  if (builders.length < 2) {
    this.createCreep(
      [
        WORK,
        WORK,
        WORK,
        WORK,
        CARRY, CARRY,
        CARRY, CARRY,
        MOVE, MOVE,
        MOVE, MOVE], null, {role: 'builder'}
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
  if (upgraders.length < 3) {
    this.createCreep(
      [
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
  var warTime = true;
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
