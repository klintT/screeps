Creep.prototype.runGuard = function() {
  this.say('Not Today Scumbag');
  var getRoom = function(creep) {
    // TODO: Don't hard code this
    creep.memory.roomName = 'W52S38';
  };

  if (this.planAttack()) return;

  getRoom(this);
  if (!this.changeRooms()) {
    return;
  }

  if (!this.movingToFlag(COLOR_BLUE, COLOR_BLUE, 1)) {
    this.planAttack(false);
  }
};
