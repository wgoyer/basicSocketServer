var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var baseEvents = require('./socks/baseEvents.js');
var dj = require('./socks/customEvents.js');

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
  baseEvents.addBaseEvents(socket);
  dj.addCustomEvents(socket);
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

http.listen(3000, function(){
  console.log('listening on *:3000');
});