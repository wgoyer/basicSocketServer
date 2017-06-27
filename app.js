var app = require('express')();
var request = require('request')
var http = require('http').Server(app);
var io = require('socket.io')(http);

var baseEvents = require('./socks/baseEvents.js');
var dj = require('./socks/customEvents.js');
var creds = require('./creds.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/client.html');
});

app.get('/spotifyToken', function(req, res){
  res.redirect('https://accounts.spotify.com/authorize' + 
                `?response_type=code&client_id=${creds.clientId}` +
                `&scope=${encodeURIComponent(creds.scopes)}` + 
                `&redirect_uri=${encodeURIComponent(creds.redirectUrl)}`)
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

app.get('/djify', function(req, res) {
  res.sendFile(__dirname + '/public/djify.html');
});

app.get('/lobby', function(req, res) {
  var authCode = req.query.code;
  var b64Code = 'Basic ' + new Buffer(creds.clientId + ':' + creds.clientSecret).toString('base64');
  var clientRes = res;
  request.post(
    {
      url: `https://accounts.spotify.com/api/token`,
      form: {
        "grant_type": "authorization_code",
        "code": authCode,
        "redirect_uri": creds.redirectUrl
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization" : b64Code
      }
    }, function(err, req, res) {
    if(err) console.log(err);
    var parsedResponse = JSON.parse(res);
    clientRes.redirect('/newLobby?token=' + parsedResponse.access_token + '&refresh=' + parsedResponse.refresh_token);
  });
});

app.get('/newLobby', function(req, res) {
  res.send(`<html><head></head><body><h3>Access Token: ${req.query.token}</h3><h3>Refresh Token: ${req.query.refresh}</h3></body></html>`);
});

app.get('*', function(req, res) {
  res.send('404 son');
});

baseEvents.addBaseEvents(io);
dj.addCustomEvents(io);

http.listen(process.env.PORT || '3000', function(){
  console.log('listening on *:3000');
});
