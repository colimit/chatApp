var ChatApp = window.ChatApp = window.ChatApp || {};

ChatApp.Chat = function(socket){
  this.socket = socket;
  this.currentRoom = "lobby";
}

ChatApp.Chat.prototype.sendMessage = function(text){
  this.socket.emit("message", {
    text: text,
    room: this.currentRoom
  });
}
