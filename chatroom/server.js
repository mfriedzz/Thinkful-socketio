// var express = require('express');
// var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();

app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function (socket) {
  socket.on('set nickname', function(name){
    socket.nickname = name;
    // Update active users
    io.sockets.emit('activeUsers', socket.server.engine.clientsCount);

    console.log(io.sockets.connected);
    // Prepare connected users array
    var connectedUsers = [];
    for (var prop in io.sockets.connected) {
      if(io.sockets.connected[prop].id && io.sockets.connected[prop].nickname){
        connectedUsers.push({ id:io.sockets.connected[prop].id, nickname:io.sockets.connected[prop].nickname });
      }
    }
    io.sockets.emit('connectedUsers', connectedUsers);
  });

  socket.on('privateMessage', function(selectedSocket){
    console.log(selectedSocket);
    io.sockets.connected[selectedSocket.id].emit('pm', selectedSocket.message);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(8080, function(){
  console.log('Running on port: 8080');
});