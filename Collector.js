Creep.prototype.runCollector = function() {
  var getRoom = function(creep) {
    if (!creep.memory.roomName) {
      var room;
      for (var name in Game.rooms) {
        room = Game.rooms[name];
        // TODO: Check if the room is marked for harvest
        var ct = room.memory.collectionTeams;
        if (!ct) continue;

        var collectorsCount = 0;
        for (team in ct) {
          if (ct[team].collectors != null) {
            collectorsCount += 1;
          }
        }

        if (collectorsCount < (1 * ct.length)) {
          creep.memory.roomName = name;
          return true;
        }
      }
      return false;
    }

    return true;
  };

  var getTarget = function(creep) {
    var target;
    var room = Game.rooms[creep.memory.roomName];
    if (!creep.memory.target) {
      var collectionTeams = room.memory.collectionTeams;
      if (!collectionTeams) return;

      var emptyTeam = null;
      for (var i = 0; i < collectionTeams.length; i++) {
        if (collectionTeams[i].collectors == null) {
          emptyTeam = i;
          break;
        }
      }
      if (emptyTeam === null) return;

      room.memory.collectionTeams[emptyTeam].collectors = creep.name;
      target = creep.memory.target = collectionTeams[emptyTeam].sourceName;
      creep.memory.hasLink = collectionTeams[emptyTeam].hasLink;
    } else {
      target = creep.memory.target;
    }

    var sources = room.find(FIND_SOURCES);
    return sources[target];
  };

  if (!getRoom(this)) return;
  var target = getTarget(this);
  if (target && this.changeRooms()) {
    var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
    for (transporter in transporters) {
      this.transfer(transporters[transporter], RESOURCE_ENERGY);
    }

    if (this.carry.energy == this.carryCapacity && this.memory.hasLink) {
      // TODO: Don't hard code this
      // findClosestByRange the link flag
      var link;
      if (this.memory.target == 0) {
        link = _.filter(this.room.lookForAt('structure', 9, 25), (struct) => struct.structureType == STRUCTURE_LINK);
      } else {
        link = _.filter(this.room.lookForAt('structure', 7, 15), (struct) => struct.structureType == STRUCTURE_LINK);
      }

      if (link) {
        var err = this.transfer(link[0], RESOURCE_ENERGY);
        if (err == ERR_NOT_IN_RANGE) {
          this.moveTo(link[0]);
        }
      }
    } else {
      if (this.harvest(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
    }
  }
};
