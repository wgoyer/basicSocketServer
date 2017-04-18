// var socket = io("http://127.0.0.1:3000");
var socket = io();

socket.on('clientConnect', function(data) {
  console.log(data);
});