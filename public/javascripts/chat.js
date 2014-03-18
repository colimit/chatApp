var ChatApp = window.ChatApp = window.ChatApp || {};

ChatApp.Chat = function(socket){
  this.socket = socket;
}

ChatApp.Chat.prototype.sendMessage = function(text){
  this.socket.emit("message", {text: text});
}
