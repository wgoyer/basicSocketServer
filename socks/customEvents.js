function addCustomEvents(socket) {
  socket.on('getIndex', function(data) {
    console.log('hello');
  });
}

module.exports = {
  addCustomEvents: addCustomEvents
};