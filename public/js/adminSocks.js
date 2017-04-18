function addSocketListeners(socket) {
  socket.on('connect', function(data) {
    updateLog('connect', socket.id);
    updateClientsTable('connect', {id: socket.id});
    setConnectState(true);
    socket.emit('joinAdmin');
  });

  socket.on('disconnect', function(data) {
    updateLog('disconnect', data);
    setConnectState(false);
  });

  socket.on('clientList', function(data) {
    updateLog('clientList', data);
    updateClientsTable('allClients', data);
  });

  socket.on('clientConnected', function(data) {
    updateLog('clientConnect', data);
    updateClientsTable('connect', data);
  });

  socket.on('clientDisconnect', function(data) {
    updateLog('clientDisconnect', data);
    updateClientsTable('disconnect', data);
  });

  socket.on('roomJoined', function(data) {
    updateLog('roomJoined', data);
    updateClientsTable('update', data);
    updateRoomTable(data);
  });
}
