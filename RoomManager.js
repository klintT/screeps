Room.prototype.run = function() {
  //Threat Managment
  if (this.attackHostiles()) return;

  //Repair
  this.repairStructures();

  // Source Managment
  if (!this.memory.collectionTeams && (this.memory.action === 'reserve' || this.memory.action === 'owned')) {
    this.memory.collectionTeams = [];
    this.initCollectionTeams();
  }

  for (i in this.memory.collectionTeams) {
    var team = this.memory.collectionTeams[i];
    var c = team.collectors;
    if (!Game.creeps[c] && c !== null) {
      console.log('Collector ' + c + ' is ded');
      team.collectors = null;
    }

    for (var i = team.transporters.length - 1; i >=0; i--) {
      var c = team.transporters[i];
      if (!Game.creeps[c]) {
        console.log('Trasporter ' + c + ' is ded');
        team.transporters.splice(i,1);
      }
    }
  }

  this.checkCreepNeeds();

  this.checkRoomLinks();

  // Conquering
  if (this.memory.action == 'reserve' && !Game.creeps[this.memory.conqueror]) {
    this.memory.conqueror = null;
  }

  // Auto-Build
  // if (this.name != 'W52S38') {
  // var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter');
  // for (t in transporters) {
  // var transporter = transporters[t];
  // this.createConstructionSite(transporter.pos, STRUCTURE_ROAD);
  // }
  // }
};

Room.prototype.initCollectionTeams = function() {
  var sources = this.find(FIND_SOURCES);
  for (name in sources) {
    var collectionTeam = {};
    var hasLink = false;
    if (this.controller && ((this.controller.level == 5 && name == 0) || this.controller.level > 5)) {
      hasLink = true;
    }

    collectionTeam.sourceName = name;
    collectionTeam.collectors = null;
    collectionTeam.hasLink = hasLink;
    collectionTeam.transporters = [];
    this.memory.collectionTeams.push(collectionTeam);
  }
};

Room.prototype.getTowers = function() {
  var turrets = this.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType == STRUCTURE_TOWER);
    }
  });

  return turrets;
};

Room.prototype.attackHostiles = function() {
  var hostiles = this.find(FIND_HOSTILE_CREEPS);
  if (hostiles.length) {
    var towers = this.getTowers();
    for (t in towers) {
      towers[t].attack(hostiles[0]);
    }
    return true;
  }
  return false;
};

Room.prototype.repairStructures = function() {
  var damaged = this.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        (structure.hits < (structure.hitsMax / 2) && (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART))
      );
    }
  });

  if (!damaged || damaged.length == 0) return;

  var towers = this.getTowers();
  for (t in towers) {
    if(towers[t].energy > (towers[t].energyCapacity / 2.5)) {
      towers[t].repair(damaged[0]);
    }
  }
};

Room.prototype.checkRoomLinks = function() {
  // TODO: Cache these
  var linkTo;
  for ( let f of this.find(FIND_FLAGS, { filter: { color: COLOR_YELLOW, secondaryColor: COLOR_WHITE } }) ) {
    for ( let e of f.pos.findInRange(FIND_MY_STRUCTURES, 1, { filter: { structureType: STRUCTURE_LINK } }) ) {
      linkTo = e;
      break;
    }
  }

  for ( let f of this.find(FIND_FLAGS, { filter: { color: COLOR_YELLOW, secondaryColor: COLOR_GREY } }) ) {
    for ( let e of f.pos.findInRange(FIND_MY_STRUCTURES, 1, { filter: { structureType: STRUCTURE_LINK } }) ) {
      if (e && linkTo) {
        e.transferEnergy(linkTo);
      }
    }
  }
};

Room.prototype.checkCreepNeeds = function() {
  if (!this.memory.needs) this.memory.needs = {};
  this.checkCollectorNeeds();
  this.checkTransporterNeeds();
};


// TODO: Maybe combine source related needs
Room.prototype.checkCollectorNeeds = function() {
  if (this.memory.needs['collector'] === undefined) this.memory.needs['collector'] = 0;

  var sources = this.find(FIND_SOURCES);
  var collectors = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector' && creep.memory.roomName === this.name);
  //TODO: Do this better
  var almostDead = _.filter(collectors, (collector) => collector.ticksToLive < 20);
  var amt = collectors.length - almostDead.length;
  this.memory.needs['collector'] = sources.length - amt;
};

Room.prototype.checkTransporterNeeds = function() {
  if (!this.collectionTeams) return;
  if (this.memory.needs['transporter'] === undefined) this.memory.needs['transporter'] = 0;

  var manualCollectionTeams = _.filter(this.collectionTeams, (ct) => ct.hasLink == false);
  var transporters = _.filter(Game.creeps, (creep) => creep.memory.role == 'transporter' && creep.memory.roomName === this.name);
  //TODO: Do this better
  var almostDead = _.filter(transporters, (transporter) => transporter.ticksToLive < 20);
  var amt = transporters.length - almostDead.length;
  this.memory.needs['transporter'] = (manualCollectionTeams.length * 2) - amt;
};
