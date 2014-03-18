var ChatApp = window.ChatApp = window.ChatApp || {};

ChatApp.ChatUI = function(){
  $("#chat-form").on("submit", this.sendChat);
  var socket = io.connect();
  ChatApp.ChatInstance = new ChatApp.Chat(socket);
  socket.on("message", this.receiveMessage);
}

ChatApp.ChatUI.prototype.sendChat = function(event){
  console.log("send fired");
  event.preventDefault();
  var $form = $(event.target);
  var text = $form.find("#chat-text").val();
  console.log("submitted text: " + text);
  ChatApp.ChatInstance.sendMessage(text);
}

ChatApp.ChatUI.prototype.receiveMessage = function(data) {
  console.log("receive fired");
  console.log("data received: " + data);
  $("#chats").append("<li>" + data["text"] + "</li>");
}