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

  var buildWarUnits = function(spawn) {
    var tanks = _.filter(Game.creeps, (creep) => creep.memory.role == 'tank');
    var tankydps = _.filter(Game.creeps, (creep) => creep.memory.role == 'tankydps');
    var healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');

    if (tanks.length < 1) {
      spawn.createCreep(
        [
          TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
          TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
          TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
          TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
          MOVE, MOVE,
          MOVE, MOVE,
          MOVE, MOVE,
          ATTACK, ATTACK
        ],
        null, {role: 'tank'});
    } else if (tankydps.length < 1) {
      spawn.createCreep(
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
        null, {role: 'tankydps'});
    } else if (healers < 1) {
      spawn.createCreep(
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
    }
  };

  // TODO: I don't actually need to do this if I build a creep. Like if I
  // build a collector there is no reason to filter the rest of these.
  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  var conquerors = _.filter(Game.creeps, (creep) => creep.memory.role == 'conqueror');

  var baseManagers = _.filter(Game.creeps, (creep) => creep.memory.role == 'baseManager');
  var scavengers = _.filter(Game.creeps, (creep) => creep.memory.role == 'scavenger');
  var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
  var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
  // clearCollectionTeams(collectors, transporters);

  var claimFlags = 1;
  var warTime = false;

  // TODO: Get these values from sources and energy levels
  if (collectors.length < 8) {
    this.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE], null, {role: 'collector'});
  } else if (baseManagers.length < 1) {
    this.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY,CARRY, CARRY, CARRY, CARRY], null, {role: 'baseManager'});
  } else if (transporters.length < 9) {
    this.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY,CARRY, CARRY, CARRY, CARRY], null, {role: 'transporter'});
  } else if (warTime) {
    buildWarUnits(this);
  } else if (conquerors.length < claimFlags) {
    this.createCreep([CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], null, {role: 'conqueror'});
  } else if (scavengers < 1) {
    this.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY,CARRY, CARRY, CARRY, CARRY], null, {role: 'scavenger'});
  } else if (builders.length < 2) {
    this.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {role: 'builder'});
  } else if (upgraders.length < 3) {
    this.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], null, {role: 'upgrader'});
  }
};
