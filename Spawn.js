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

  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
  var conquerors = _.filter(Game.creeps, (creep) => creep.memory.role == 'conqueror');

  var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector');
  var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
  // clearCollectionTeams(collectors, transporters);

  var claimFlags = 1;

  // TODO: Get these values from sources and energy levels
  if (collectors.length < 8) {
    this.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE], null, {role: 'collector'});
  } else if (transporters.length < 12) {
    this.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY,CARRY, CARRY, CARRY, CARRY], null, {role: 'transporter'});
  } else if (conquerors.length < claimFlags) {
    this.createCreep([CLAIM, MOVE, MOVE, MOVE, MOVE], null, {role: 'conqueror'});
  } else if (builders.length < 2) {
    this.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {role: 'builder'});
  } else if (upgraders.length < 3) {
    this.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], null, {role: 'upgrader'});
  }
};
