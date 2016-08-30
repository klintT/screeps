Creep.prototype.runBaiter = function() {
  var collectFromStorage = function(creep) {
    var stores = creep.findEnergyStorageWithEnergy();
    if (stores.length) {
      //Draw energy from storage
      var err = creep.withdraw(stores[0], RESOURCE_ENERGY);
      if (err == ERR_NOT_IN_RANGE) {
        creep.moveTo(stores[0]);
      }
    }
  };

  if (this.carry.energy < this.carryCapacity) {
    collectFromStorage(this);
  } else {
    if (this.dropBait()) return;
    if (this.groupUp()) return;
  }
};

Creep.prototype.dropBait = function() {
  if (this.movingToFlag(COLOR_RED, COLOR_YELLOW)) {
    this.drop(RESOURCE_ENERGY, 10);
    return true;
  }

  return false;
};
