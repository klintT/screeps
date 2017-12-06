Creep.prototype.runHarvester = function() {
  var isMineralHarvester = (this.memory.role == 'mineral_harvester') ? true : false;
  var transferType = (isMineralHarvester) ? RESOURCE_HYDROGEN : RESOURCE_ENERGY;
  var amt = this.carry[transferType];
  if (this.memory.harvesting && amt == this.carryCapacity) {
    this.memory.harvesting = false;
  }

  if (!this.memory.harvesting && (amt == 0 || amt == undefined)) {
    this.memory.harvesting = true;
  }

  // TODO: Update this with a lookup for mineral type
  if (this.memory.harvesting) {
    var targetType  = (isMineralHarvester) ? FIND_MINERALS : FIND_SOURCES;
    var targets = this.room.find(targetType);
    var target = 0;
    if (this.harvest(targets[target]) == ERR_NOT_IN_RANGE) {
      this.moveTo(targets[target]);
    }
  } else {
    if (!isMineralHarvester) this.loadTower();
    var storageCallback = (isMineralHarvester) ? this.findMineralStorage.bind(this) : this.findNotFullEnergyStorage.bind(this);
    var targets = storageCallback(isMineralHarvester);
    if (targets.length > 0) {
      if (this.transfer(targets[0], transferType) == ERR_NOT_IN_RANGE) {
        this.moveTo(targets[0]);
      }
    }
  }
};
