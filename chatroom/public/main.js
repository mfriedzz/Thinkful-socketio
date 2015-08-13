$(document).ready(function() {
  var socket = io();
  var input = $('input');
  var messages = $('#messages');

  var addMessage = function(message) {
    messages.append('<div>' + message + '</div>');
  };

  input.on('keydown', function(event) {
    if (event.keyCode != 13) {
      return;
    }

    var message = input.val();
    addMessage(message);
    socket.emit('message', message);
    input.val('');
  });

  socket.on('connect', function(){
    var name = prompt('What is your name?');
    socket.emit('set nickname', name);
  });

  socket.on('activeUsers', function(count){
    var activeUsers = $('#activeUsersAmount');
    activeUsers.text(count);
  });

  socket.on('connectedUsers', function(connectedUsers){
    var connectedUsersDetails = '';
    connectedUsers.forEach(function(user){
      connectedUsersDetails += "<tr><td>"+ user.id + "</td><td>" + user.nickname + "</td></tr>";
    });
    var activeUsersDetails = $('#activeUsersDetails');
    activeUsersDetails.append(connectedUsersDetails);

    $("#activeUsersDetails tr").on("click", function(){ 
      socket.emit('privateMessage', {id:$(this)[0].cells[0].innerText, message:"This is only for you!"});
    });
  });
  
  socket.on('pm', function(message){
    alert("This is only for you: " + message);
  });

  socket.on('message', addMessage);
});