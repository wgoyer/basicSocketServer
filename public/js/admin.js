var socket;
window.onload = function() {
  var connectButton = document.querySelector('#connect');
      
  connectButton.addEventListener('click', function(e) {
    if(typeof(io) == 'object') {
      socket.connect();
    } else {
      socket = io();
      addSocketListeners(socket);
      addElementListeners(socket);
    }
  });
  updateLog('pageOpened', 'Admin Page Opened');
}

function addElementListeners(socket) {
  var sendMsgButton = document.querySelector('#broadcast-msg'),
      sendMsgType = document.querySelector('#msg-type'),
      sendMsgContent = document.querySelector('#msg-content'),
      disconnectButton = document.querySelector('#disconnect');

  disconnectButton.addEventListener('click', function(e) {
    updateLog('Admin Disconnect', {})
    socket.close();
    setConnectState(false);
  });

  sendMsgButton.addEventListener('click', function(e) {
    var msgType = sendMsgType.value;
    var msgContent = sendMsgContent.value;
    var messageToSend = {};
    messageToSend['messageType'] = msgType;
    messageToSend['messageContent'] = msgContent;
    socket.emit('adminMsg', messageToSend);
    updateLog('adminMsg', {id: socket.id, messageToSend});
  });
}

function setConnectState(connected) {
  var connectElements = 'connect',
      disconnectElements = 'disconnect';
  if(connected) {
    hideElementsByClass(disconnectElements);
    unhideElementsByClass(connectElements);
  } else {
    hideElementsByClass(connectElements);
    unhideElementsByClass(disconnectElements);
  }
}

function hideElementsByClass(selector) {
  var elements = document.querySelectorAll(`.${selector}`);
  for(var i = 0; i < elements.length; i++) {
    elements[i].classList.add('hidden');
  }
}

function unhideElementsByClass(selector) {
  var elements = document.querySelectorAll(`.${selector}`);
  for(var i = 0; i < elements.length; i++) {
    elements[i].classList.remove('hidden');
  }
}

function updateRoomTable(data) {
  console.log('updateRoomTable todo');
  console.log(data);
}