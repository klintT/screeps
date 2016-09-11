Creep.prototype.runTankyDPS = function() {
  this.say('BARBARBARBAR!');
  // if (this.beDecoy()) return;

  var secondColor = (this.memory.kamakazi) ? COLOR_WHITE : COLOR_RED;
  if (this.planAttack(true, secondColor)) return;
  if (this.groupUp()) return;
  this.waitBySpawn();
};
