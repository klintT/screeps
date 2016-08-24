Creep.prototype.runTankyDPS = function() {
  this.say('BARBARBAR');
  // if (!this.groupUp()) {
    // this.planAttack();
  // }

  var getRoom = function(creep) {
    // TODO: Don't hard code this
    creep.memory.roomName = 'W52S38';
  };

  if (this.groupUp()) {
    return;
  }

  getRoom(this);
  if (!this.changeRooms()) {
    return;
  }

  this.planAttack();
};
