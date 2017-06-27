var socket;
window.onload = function() {
  socket = io();
  var url = window.location.href;
  socket.emit('djConnect', {token: getParameterByName('token'), refresh: getParameterByName('refresh')});
}

function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}