Creep.prototype.runConqueror = function() {
  var getRoom = function(creep) {
    if (!creep.memory.roomName) {
      var room;
      for (var name in Game.rooms) {
        room = Game.rooms[name];
        if (room.memory.action == 'reserve' && !room.memory.conqueror) {
          creep.memory.roomName = name;
          room.memory.conqueror = creep.name;
          return;
        }
      }
    }
  };

  getRoom(this);
  this.say('By My Will!');
  if (this.memory.roomName && this.changeRooms() && this.room.controller) {
    if (this.reserveController(this.room.controller) == ERR_NOT_IN_RANGE) {
      this.moveTo(this.room.controller);
    }
  }
};
