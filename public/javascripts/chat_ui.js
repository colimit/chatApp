var ChatApp = window.ChatApp = window.ChatApp || {};

ChatApp.ChatUI = function(){
  $("#chat-form").on("submit", this.sendChat);
  var socket = io.connect();
  ChatApp.ChatInstance = new ChatApp.Chat(socket);
  socket.on("message", this.receiveMessage);
  socket.on("nicknameChangeResult", this.receiveNicknameChangeResult);
  socket.on("welcome", this.populateNicknames);
  socket.on("userLeave", this.removeNickname);
  socket.on("userJoin", this.addNickname);
}

ChatApp.ChatUI.prototype.sendChat = function(event){
  event.preventDefault();
  var $form = $(event.target);
  var text = $form.find("#chat-text").val();
  ChatApp.ChatInstance.sendMessage(text);
  $form.find("#chat-text").val("");
}

ChatApp.ChatUI.prototype.receiveMessage = function(data) {
  $("#chats").append("<li>" + data["text"] + "</li>");
}

ChatApp.ChatUI.prototype.receiveNicknameChangeResult = function(data){
  if (data["success"]){
    var oldNameContainer = $("#users").find("li#" + data["oldName"]);
    oldNameContainer.remove();

    $("#users").append("<li id=" + data["newName"] + ">" + data["newName"] + "</li>");
    $("#chats").append("<li>" + "User " + data["oldName"] + " has changed nicks to " + data["newName"]);
  } else {
    $("#chats").append("<li>" + data["text"] + "</li>");
  }
}

ChatApp.ChatUI.prototype.populateNicknames = function(data){
  $("#users").empty();
  data.nicknames.forEach(function(nickname){
    $("#users").append("<li id=" + nickname + ">" + nickname + "</li>");
  });
  $("h1").text(data["room"]);
  $("#chats").empty();
}

ChatApp.ChatUI.prototype.removeNickname = function(data){
  var oldNameContainer = $("#users").find("li#" + data["nickname"]);
  oldNameContainer.remove();
  $("#chats").append("<li>" + data["nickname"] + " has left.</li>");
}

ChatApp.ChatUI.prototype.addNickname = function(data) {
  console.log("addNickname fired");
  $("#chats").append("<li>" + "User " + data["nickname"] + " has joined the room.");
  $("#users").append("<li id=" + data["nickname"] + ">" + data["nickname"] + "</li>");
}