Creep.prototype.runTransporter = function() {
  var getRoom = function(creep) {
    if (!creep.memory.roomName) {
      var room;
      for (var name in Game.rooms) {
        room = Game.rooms[name];
        // TODO: Check if the room is marked for harvest
        var ct = room.memory.collectionTeams;
        if (!ct) continue;

        var count = 0;
        var nonLinkCount = 0;
        for (team in ct) {
          count += ct[team].transporters.length;
          if (!ct[team].hasLink) {
            nonLinkCount += 1;
          }
        }

        if (count < (2 * nonLinkCount)) {
          creep.memory.roomName = name;
          return;
        }
      }
    }
  };

  var getTarget = function(creep) {
    var target;
    if (!creep.memory.target || !Game.creeps[creep.memory.target]) {
      var room = Game.rooms[creep.memory.roomName];
      if (!room) return;

      var collectionTeams = room.memory.collectionTeams;
      var lowestTeam = 0;
      for (var i = 0; i < collectionTeams.length; i++) {
        if (collectionTeams[lowestTeam].transporters.length > collectionTeams[i].transporters.length && !collectionTeams[i].hasLink) {
          lowestTeam = i;
        }

        var index = collectionTeams[i].transporters.indexOf(creep.name);
        if (~index) {
          collectionTeams[i].transporters.splice(index,1);
        }
      }

      if (!collectionTeams[lowestTeam]) {
        return;
      }

      var collector = collectionTeams[lowestTeam].collectors;
      if (collector && Game.creeps[collector] && Game.creeps[collector].carry.energy > 0) {
        room.memory.collectionTeams[lowestTeam].transporters.push(creep.name);
        target = creep.memory.target = collector;
      } else {
        // creep.getOutOfTheWay();
      }
    } else {
      target = creep.memory.target;
    }

    return Game.creeps[target];
  };

  if (this.memory.transporting && this.carry.energy === 0) {
    this.memory.transporting = false;
  }

  if (!this.memory.transporting && this.carry.energy == this.carryCapacity) {
    this.memory.transporting = true;
  }

  if (!this.memory.transporting) {
    getRoom(this);
    getTarget(this);
    if (this.changeRooms()) {
      var target = getTarget(this);
      if (target){
        // Move to the fullest collector
        this.moveTo(target);
        this.pickup(this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: { resourceType: RESOURCE_ENERGY }}));
      }
    }
  } else {
    // Take the energy to storage
    var targets = this.findNotFullEnergyStorage();
    if(targets.length > 0) {
      if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0]);
      }
    } else {
      this.moveTo(Game.spawns['Spawn1']);
    }
  }
};
