function addCustomEvents(io) {
  io.on('connection', function(socket){
    socket.on('getIndex', function(data) {
      console.log('hello');
    });
  });
}

module.exports = {
  addCustomEvents: addCustomEvents
};