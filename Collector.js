Creep.prototype.runCollector = function() {
  var getRoom = function(creep) {
    if (!creep.memory.roomName) {
      var room;
      var failedName;
      for (var name in Game.rooms) {
        room = Game.rooms[name];
        // TODO: Check if the room is marked for harvest
        var ct = room.memory.collectionTeams;

        var collectorsCount = 0;
        for (team in ct) {
          collectorsCount += ct[team].collectors.length;
        }

        console.log('Collector count in room ' + name +' is ' + collectorsCount);
        if (collectorsCount < (2 * ct.length)) {
          console.log('Collector targeting room ' + name);
          creep.memory.roomName = name;
          return;
        }
        failedName = name;
      }

      console.log('Failed to find room with less than 2 collectors per source.');
      creep.memory.roomName = failedName;
    }
  };

  var getTarget = function(creep) {
    var target;
    var room = Game.rooms[creep.memory.roomName];
    if (!creep.memory.target) {
      var collectionTeams = room.memory.collectionTeams;

      var lowestTeam = 0;
      for (var i = 1; i < collectionTeams.length; i++) {
        if (collectionTeams[lowestTeam].collectors.length > collectionTeams[i].collectors.length) {
          lowestTeam = i;
        }
      }

      // console.log('adding ' + creep.name + ' to ' + JSON.stringify(collectionTeams[lowestTeam]));
      collectionTeams[lowestTeam].collectors.push(creep.name);
      target = creep.memory.target = collectionTeams[lowestTeam].sourceName;
    } else {
      target = creep.memory.target;
    }

    var sources = room.find(FIND_SOURCES);
    return sources[target];
  };

  getRoom(this);
  getTarget(this);
  if (this.changeRooms()) {
    var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
    for (transporter in transporters) {
      this.transfer(transporters[transporter], RESOURCE_ENERGY);
    }

    var target = getTarget(this);
    if(this.harvest(target) == ERR_NOT_IN_RANGE) {
      this.moveTo(target);
    }
  }
};
