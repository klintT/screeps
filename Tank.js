Creep.prototype.runTank = function() {
  this.say('My Shield!');
  if (!this.groupUp()) {
    this.planAttack();
  }
};
