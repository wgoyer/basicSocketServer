var queueManager = require('../djify/queueManager.js');

function addCustomEvents(io) {
  io.on('connection', function(socket){
    socket.on('getIndex', function(data) {
      console.log('hello');
    });

    socket.on('djConnect', function(data) {
      socket.access_token=data.token;
      socket.refresh_token=data.refresh;
    });

    socket.on('addTrack', function(trackData) {
      queueManager.addTrackToQueue(trackData);
    });
  });
}

module.exports = {
  addCustomEvents: addCustomEvents
};