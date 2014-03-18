var socketio = require("socket.io");//
var escape = require('escape-html');
// var http = require("http");

var setSocket = function(server){
  var io = socketio.listen(server);
  var guestnumber = 1;
  var nicknames = {};
  var rooms = {};
  var server = this;
  io.sockets.on('connection', function(socket) {
    var newUserName = "guest" + guestnumber;
    guestnumber++;
    nicknames[socket.id] = newUserName;
    joinRoom.call(socket, "lobby");

    socket.on("message", respondToMessage);
    socket.on("disconnect", respondToDisconnect)
  });


  var respondToNickChangeRequest = function(data){
    var newName = data.text.slice(6);

    //conditionals go here
    if (obj_values(nicknames).indexOf(newName) > -1) {
      this.emit('nicknameChangeResult', {
        text: "That nickname is already taken.",
        success: false
      })
    } else if (newName.slice(0, 5).toLowerCase() === "guest") {
      this.emit('nicknameChangeResult', {
        text: "You cannot assign yourself a nickname beginning with 'guest'.",
        success: false
      })
    } else {
      var responseData = {
        oldName: nicknames[this.id],
        newName: newName,
        success: true
      };
      console.log(responseData);
      io.sockets.emit('nicknameChangeResult', {
        oldName: nicknames[this.id],
        newName: newName,
        success: true
      });
      nicknames[this.id] = newName;
    }
  };

  var respondToDisconnect = function(){
    io.sockets.emit('userLeave', {nickname: nicknames[this.id] });
    delete nicknames[this.id];
  };

  var respondToMessage = function(data) {
    data.text = escape(data.text);
    if (data.text.slice(0, 1) === "/"){
      processCommand.call(this, data);
    } else {
    io.sockets.emit('message', {text: nicknames[this.id] + ": " + data["text"]});
    }
  };

  var processCommand = function(data){
    if (data.text.slice(0, 5)==="/nick"){
      respondToNickChangeRequest.call(this, data);
    } else if (data.text.slice(0, 5)==="/join"){
      switchRooms.call(this, data["text"].slice(6));
    }
  }

  var switchRooms = function(room){
    console.log("Switching rooms...")
    leaveRoom.call(this, rooms[this.id]);
    joinRoom.call(this, room);
  }

  var joinRoom = function(room){
    this.join(room);
    this.broadcast.to(room).emit('userJoin', {
      nickname: nicknames[this.id]
    });

    var roomUsers = io.sockets.clients(room);
    console.log(room);
    var roomNicks = [];
    roomUsers.forEach(function(user) {
      roomNicks.push(nicknames[user.id])
    });
    this.emit("welcome", {
      nicknames: roomNicks,
      room: room
    });
    rooms[this.id] = room;
  }

  var leaveRoom = function(room){
    this.broadcast.to(room).emit('userLeave', {
      nickname: nicknames[this.id]
    });
    this.leave(room);
  }
};

var obj_values = function(object) {
  var keys = Object.keys(object);
  var values = keys.map(function(v) { return object[v]; });
  return values;
}


module.exports.setSocket = setSocket;