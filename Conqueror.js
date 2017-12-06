Creep.prototype.runConqueror = function() {
  var getRoom = function(creep) {
    if (!creep.memory.roomName) {
      var room;
      for (var name in Game.rooms) {
        room = Game.rooms[name];
        if (room.memory.action == 'reserve' && !room.memory.conqueror) {
          creep.memory.roomName = name;
          creep.memory.action = 'reserve';
          room.memory.conqueror = creep.name;
          return;
        } else if (room.memory.action == 'claim' && !room.memory.conqueror) {
          creep.memory.roomName = name;
          creep.memory.action = 'claim';
          room.memory.conqueror = creep.name;
          return;
        } else if (room.memory.action == 'attack' && !room.memory.conqueror) {
          creep.memory.roomName = name;
          creep.memory.action = 'attack';
          room.memory.conqueror = creep.name;
          return;
        }

      }
    }
  };

  getRoom(this);
  this.say('By My Will!');
  if (this.memory.roomName && this.changeRooms() && this.room.controller) {
    var action;
    if (this.memory.action === 'reserve') {
      action = this.reserveController.bind(this);
    } else if (this.memory.action === 'claim') {
      action =this.claimController.bind(this);
    } else if (this.memory.action === 'attack') {
      action = this.attackController.bind(this);
    }

    if (action(this.room.controller) == ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller);
    }
  }
};
