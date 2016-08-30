Room.prototype.run = function() {
  var initCollectionTeams = function(room) {
    var sources = room.find(FIND_SOURCES);
    for (name in sources) {
      var collectionTeam = {};
      var hasLink = false;
      if (room.controller && ((room.controller.level == 5 && name == 0) || room.controller.level > 5)) {
        hasLink = true;
      }

      collectionTeam.sourceName = name;
      collectionTeam.collectors = [];
      collectionTeam.hasLink = hasLink;
      collectionTeam.transporters = [];
      room.memory.collectionTeams.push(collectionTeam);
    }
  };

  var getTowers = function(room) {
    var turrets = room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER);
      }
    });

    return turrets;
  };

  var attackHostiles = function(room) {
    var hostiles = room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length) {
      var towers = getTowers(room);
      for (t in towers) {
        towers[t].attack(hostiles[0]);
      }
      return true;
    }
    return false;
  };

  // var healCreep = function(room) {
  // var creeps = room;
  // };

  var repairStructures = function(room) {
    var damaged = room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.hits < (structure.hitsMax / 2) && (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART))
        );
      }
    });

    if (!damaged || damaged.length == 0) return;

    var towers = getTowers(room);
    for (t in towers) {
      if(towers[t].energy > (towers[t].energyCapacity / 2.5)) {
        towers[t].repair(damaged[0]);
      }
    }
  };

  //Threat Managment
  if (attackHostiles(this)) {
    return;
  }

  //Repair
  repairStructures(this);

  // Source Managment
  if (!this.memory.collectionTeams) {
    this.memory.collectionTeams = [];
    initCollectionTeams(this);
  }

  for (i in this.memory.collectionTeams) {
    var team = this.memory.collectionTeams[i];
    for (var i = team.collectors.length - 1; i >=0; i--) {
      var c = team.collectors[i];
      if (!Game.creeps[c]) {
        console.log('Collector ' + c + ' is ded');
        team.collectors.splice(i,1);
      }
    }

    for (var i = team.transporters.length - 1; i >=0; i--) {
      var c = team.transporters[i];
      if (!Game.creeps[c]) {
        console.log('Trasporter ' + c + ' is ded');
        team.transporters.splice(i,1);
      }
    }
  }

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
