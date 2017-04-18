function updateClientsTable(type, data) {
  var innerHTML; 
      
  if(type === 'connect') {
    innerHTML = buildInnerHtml(type, data);
    addClientRecordToClientsTable(data.id, innerHTML);
  }

  if(type === 'allClients') {
    var clientsList = Object.keys(data);
    for(var i = 0; i < clientsList.length; i++) {
      innerHTML = buildInnerHtml(type, {id: clientsList[i], roomName: data[clientsList[i]]});
      addClientRecordToClientsTable(clientsList[i], innerHTML);
    }
  }

  var clientRow = document.getElementsByClassName(`${data.id}`)[0];
  if(type === 'update' && clientRow) {
    var tableMap = {
      "roomName":"room-name",
      "connectTime":"connect-time"
    }
    Object.keys(data).forEach(function(key) {
      if(tableMap[key]) {
        clientRow.getElementsByClassName(tableMap[key])[0].innerHTML = data[key];
      }
    });
  }
  if(type === 'disconnect' && clientRow) {
    clientRow.remove();
  }
}

function addClientRecordToClientsTable(socketID, innerHTML) {
  var appendableTable = document.querySelector('.connected-clients table');
  var clientRow = document.createElement('tr');
  clientRow.classList.add(socketID);
  clientRow.innerHTML = innerHTML;
  appendableTable.appendChild(clientRow);
  addClientMessageListener(socketID);
}

function buildInnerHtml(type, data) {
  var connectTime;
  if(type === 'connect') {
    connectTime = getTimeStamp();
  } 

  if(type === 'update') {
    var clientRow = document.getElementsByClassName(data.id)[0];
    connectTime = connectTimeSelector.querySelector('td.connect-time').innerHTML || "N/A";
  }

  if(type === 'allClients') {
    connectTime = "N/A";
  }
  
  var messageInputs = `
    <td>
      <input class='client-msg-type' type='text' placeholder='Message Type'></input>
      <input class='client-msg' type='text' placeholder='Message to client...'></input> 
      <button>Send</button>
    </td>
  `;

  if(type === 'update' || type === 'connect' || type === 'allClients') {
    if(!data.roomName) data.roomName = "NONE";
    innerHTML = `
    <td class='room-name'>${data.roomName}</td>
    <td class='socket-id'>${data.id}</td>
    <td class='connect-time'>${connectTime}</td>
    ${messageInputs}`
  }

  return innerHTML; 
}

function addClientMessageListener(socketID) {
  var clientRow = document.getElementsByClassName(socketID)[0];
  var clientSend = clientRow.querySelector('button');

  clientSend.addEventListener('click', function() {
    var message = {
      messageType: clientRow.querySelector('.client-msg-type').value,
      messageContent: clientRow.querySelector('.client-msg').value,
      addressee: {
        type: 'client',
        name: socketID
      }
    };
    socket.emit('adminMsg', message);
    updateLog('adminMsg', message);
  });
}
