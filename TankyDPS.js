Creep.prototype.runTankyDPS = function() {
  this.say('BARBARBARBAR!');
  if (this.planAttack()) return;
  if (this.groupUp()) return;
  this.waitBySpawn();
};
