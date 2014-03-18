var socketio = require("socket.io");//
// var http = require("http");

var setSocket = function(server){
  var io = socketio.listen(server);
  io.sockets.on('connection', function(socket) {
    socket.emit('welcome', { hello: "sup" });
    socket.on("message", function(data) {
      io.sockets.emit('message', {text: data["text"]});
    })
  })
};

module.exports.setSocket = setSocket;