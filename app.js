var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/client.html');
});

app.get('/js/:file', function(req, res) {
  res.sendFile(`${__dirname}/public/js/${req.params.file}`);
});

app.get('/css/:file', function(req, res) {
  res.sendFile(`${__dirname}/public/css/${req.params.file}`);
});

app.get('/admin', function(req, res) {
  res.sendFile(__dirname + '/public/admin.html');
});

io.on('connection', function(socket){
  socket.to('admin').emit('clientConnected', {id: socket.id});
  socket.join('lobby', function() {
    socket.to('lobby').to('admin').emit('roomJoined', {roomName: 'lobby', id: socket.id});
  });

  socket.on('joinAdmin', function() {
    socket.join('admin');
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
    socket.emit('clientList', io.clients);
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

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});