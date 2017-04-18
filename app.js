var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var baseEvents = require('./socks/baseEvents.js');
var dj = require('./socks/customEvents.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/client.html');
});

app.get('/spotifyAuth', function(req, res){
  res.sendFile(__dirname + '/public/spotify.html');
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

baseEvents.addBaseEvents(io);
dj.addCustomEvents(io);

http.listen(process.env.PORT || '3000', function(){
  console.log('listening on *:3000');
});
