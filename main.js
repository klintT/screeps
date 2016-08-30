var CreepManager = require('CreepManager');
var RoomManager = require('RoomManager');
var Spawn = require('Spawn');

module.exports.loop = function () {
  //Optimize GC eventually
  for (var i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }

  for (var name in Game.rooms) {
    var room = Game.rooms[name];
    try{
    room.run();
    } catch (err){}
  }

  Game.spawns['Spawn1'].run();
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    creep.run();
  }
}
