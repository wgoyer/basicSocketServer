var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin', function(req, res) {
  res.sendFile(__dirname + '/public/admin.html');
})

app.get('/socket.js', function(req, res) {
  res.sendFile(__dirname + '/public/socket.js');
});

io.on('connection', function(socket){
  socket.broadcast.emit('clientClient', socket.id);
  console.log('a user connected');

  socket.on('hello', function(data) {
    console.log(data);
  });

  socket.on('getClients', function() {
    socket.emit('clientList', io.clients);
  });

  socket.on('adminMsg', function(data) {
    console.log('admin msg received');
    console.log(data);
    socket.broadcast.emit(data.messageType, data.messageContent);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});