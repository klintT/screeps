Room.prototype.run = function() {
  var initCollectionTeams = function(room) {
    var sources = room.find(FIND_SOURCES);
    for (name in sources) {
      console.log('here');
      var collectionTeam = {};
      var hasLink = false;
      if (this.controller && ((this.controller.level == 5 && name == 0) || this.controller.level > 5)) {
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
        console.log('Attack status - ' + towers[t].attack(hostiles[0]));
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
        return (structure.hits < (structure.hitsMax / 2));
      }
    });

    var turrets = getTowers(room);
    for (t in turrets) {
      turrets[t].repair(damaged[0]);
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

  // TODO: Seriously need flags to manage links. Hack for now because it's late
  var linkFrom = _.filter(this.lookForAt('structure', 41, 9), (struct) => struct.structureType == STRUCTURE_LINK);
  var linkTo = _.filter(this.lookForAt('structure', 27, 21), (struct) => struct.structureType == STRUCTURE_LINK);
  if (linkFrom[0] && linkTo[0]) {
    linkFrom[0].transferEnergy(linkTo[0]);
  }

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
