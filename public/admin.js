window.onload = function() {
  var socket;

  var sendMsgButton = document.querySelector("#broadcast-msg"),
      sendMsgType = document.querySelector("#msg-type"),
      sendMsgContent = document.querySelector("#msg-content"),
      connectButton = document.querySelector("#connect"),
      disconnectButton = document.querySelector("#disconnect");
  
  connectButton.addEventListener('click', function(e) {
    if(typeof(io) == 'object') {
      socket.connect();
    } else {
      socket = io();
    }
  });

  disconnectButton.addEventListener('click', function(e) {
    updateLog('Closing socket', {})
    socket.close();
  });

  socket.on('connect', function(data) {
    updateLog('connect', data);
    updateClientsTable(data);
    toggleConnectButton();
  });

  socket.on('disconnect', function(data) {
    updateLog('disconnect', data);
    setDisconnectState();
  });

  socket.on('clientConnect', function(data) {
    updateLog('clientConnect', data);
    updateClientsTable(data);
  });

  socket.on('clientDisconnect', function(data) {
    updateLog('clientDisconnect', data);
    updateClientsTable(data);
  });

  socket.on('clientRoomChange', function(data) {
    updateLog('clientRoomChange', data);
    updateClientsTable(data);
    updateRoomTable(data);
  });

  socket.on('roomCreate', function(data){
    updateLog('roomCreate', data);
    updateRoomTable(data);
  });

  socket.on('roomRemove', function(data){
    updateLog('roomRemove', data);
    updateRoomTable(data);
  });

  
  sendMsgButton.addEventListener('click', function(e) {
    var msgType = sendMsgType.value;
    var msgContent = sendMsgContent.value;
    var messageToSend = {};
    messageToSend["messageType"] = msgType;
    messageToSend["messageContent"] = msgContent;
    socket.emit('adminMsg', messageToSend);
  });
}