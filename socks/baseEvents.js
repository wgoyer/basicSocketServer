function addBaseEvents(io) {
  io.on('connection', function(socket){
    socket.to('admin').emit('clientConnected', {id: socket.id});
    // socket.join('lobby', function() {
    //   socket.to('lobby').to('admin').emit('roomJoined', {roomName: 'lobby', id: socket.id});
    // });

    socket.on('joinAdmin', function() {
      socket.join('admin');
      // socket.leave('lobby');
      getClientsList(socket.id, function(err, clients){
        if(err) {
          socket.emit('err', err);
        } else {
          socket.emit('clientList', clients);
        }
      });
    }); 

    socket.on('joinRoom', function(data) {
      socket.join(data.newRoom, function() {
        socket.to('admin').to(data.newRoom).emit('roomJoined', {roomName: data.newRoom, id: socket.id});
      });

      socket.leave(data.currentRoom, function() {
        socket.to('admin').to(data.currentRoom).emit('roomLeft', {roomName: data.currentRoom, id: socket.id});
      });
    });

    socket.on('getRooms', function(data){
      socket.emit(io.rooms);
    });

    socket.on('getClients', function() {
      getClientsList(function(err, clients) {
        if(err) {
          socket.emit('err', err);
        } else {
          socket.emit('clientList', clients);
        }
      });
    });

    socket.on('adminMsg', function(data) {
      if(data.addressee) {
        if(data.addressee.type === 'client') {
          io.sockets.connected[data.addressee.name].emit(data.messageType, data.messageContent);
        }
        if(data.addressee.type === 'room') {
          socket.to(data.addressee.name).emit(data.messageType, data.messageContent);
        }
      } else {
        socket.broadcast.emit(data.messageType, data.messageContent);
      }
    });

    socket.on('disconnect', function(data) {
      socket.to('admin').emit('clientDisconnect', {id: socket.id, message: data});
    });

    function getClientsList(requesterId, callback) {
      var clients = {};
      io.clients(function(err, clientsArray) {
        if(err) return callback(err, null);
        if(clientsArray.length > 0) {
          clientsArray.splice(clientsArray.indexOf(requesterId), 1);
          for(var i = 0; i < clientsArray.length; i++) {
            var clientId = clientsArray[i];
            var clientRooms = Object.keys(io.sockets.connected[clientId].rooms);
            for(var y = 0; y < clientRooms.length; y++) {
              if(clientRooms[y] != clientsArray[i]) {
                clients[clientsArray[i]] = clientRooms[y];
              }
            }
          }
          return callback(null, clients);
        }
      });
    }
  });
}

module.exports = {
  addBaseEvents: addBaseEvents
}