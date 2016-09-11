Creep.prototype.runScavenger = function() {
  var carryAmount = this.getTotalCarryAmount();
  if (this.memory.scavenging && carryAmount === 0) {
    this.memory.scavenging = false;
  }

  if (!this.memory.scavenging && carryAmount === this.carryCapacity) {
    this.memory.scavenging = true;
  }

  if (this.memory.scavenging) {
    var targets = this.findMineralStorage();
    if (targets.length > 0) {
      for (c in this.carry) {
        if(this.transfer(targets[0], c) == ERR_NOT_IN_RANGE) {
          this.moveTo(targets[0]);
        }
      }
    } else {
      this.runBaseManager();
    }
  } else {
    var target = this.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if (target) {
      if(this.pickup(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
      }
    } else {
      this.runBaseManager();
    }
  }
};

Creep.prototype.getTotalCarryAmount = function() {
  var amount = 0;
  for (c in this.carry) {
    amount += this.carry[c];
  }
  return amount;
}
