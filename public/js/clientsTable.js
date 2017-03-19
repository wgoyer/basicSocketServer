function updateClientsTable(type, data) {
  var innerHTML = buildInnerHtml(type, data);
      
  if(type === 'connect') {
    addClientRecordToClientsTable(data.id, innerHTML);
  } 

  var appendableRecord = document.getElementsByClassName(`${data.id}`);
  if(appendableRecord.length > 0) {
    if(type === 'update') {
      appendableRecord[0].innerHTML = innerHTML;
      addClientMessageListener(data.id);
    }
    if(type === 'disconnect') {
      document.getElementsByClassName(`${data.id}`)[0].remove();
    }
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
  var connectTime = getTimeStamp();
  var messageInputs = `
    <td>
      <input class='client-msg-type' type='text' placeholder='Message Type'></input>
      <input class='client-msg' type='text' placeholder='Message to client...'></input> 
      <button>Send</button>
    </td>
  `;
  if(type === 'update' || type === 'connect') {
    if(!data.roomName) data.roomName = "NONE";
    innerHTML = `
    <td>${data.roomName}</td>
    <td>${data.id}</td>
    <td>${connectTime}</td>
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