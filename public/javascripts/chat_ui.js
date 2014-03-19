var ChatApp = window.ChatApp = window.ChatApp || {};

ChatApp.ChatUI = function(){
  $("#chat-form").on("submit", this.sendChat);
  $("#tabs").on("click", "button", this.displayRoom);
  var socket = io.connect();
  ChatApp.ChatInstance = new ChatApp.Chat(socket);
  socket.on("message", this.receiveMessage);
  socket.on("nicknameChangeResult", this.receiveNicknameChangeResult);
  socket.on("welcome", this.initRoom);
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
  $("#chats-" + data["room"]).append("<li>" + data["text"] + "</li>");
}

ChatApp.ChatUI.prototype.receiveNicknameChangeResult = function(data){
  console.log(data["room"]);
  if (data["success"]){
    var oldNameContainer = $("#users-" + data["room"]).find("li#" + data["oldName"]);
    oldNameContainer.remove();

    $("#users-" + data["room"]).append("<li id=" + data["newName"] + ">" + data["newName"] + "</li>");
    $("#chats-" + data["room"]).append("<li>" + "User " + data["oldName"] + " has changed nicks to " + data["newName"]);
  } else {
    $("#chats-" + data["room"]).append("<li>" + data["text"] + "</li>");
  }
}

ChatApp.ChatUI.prototype.displayRoom = function(event){
  $("h1").text($(event.target).data("room"));

  $("#users").children().each(function(index, roomUsers) {
    if ($(roomUsers).data("room") === $(event.target).data("room")) {
      $(roomUsers).removeClass("hidden");
    } else {
      $(roomUsers).addClass("hidden");
    }
  });

  $("#chats").children().each(function(index, roomChats) {
    if ($(roomChats).data("room") === $(event.target).data("room")) {
      $(roomChats).removeClass("hidden");
    } else {
      $(roomChats).addClass("hidden");
    }
  });
  ChatApp.ChatInstance.currentRoom = $(event.target).data("room");
}

ChatApp.ChatUI.prototype.initRoom = function(data){
  var usersContainer = $("<ul data-room='" + data["room"] + "' id=users-" + data["room"] + ">");
  data.nicknames.forEach(function(nickname){
    usersContainer.append("<li id=" + nickname + ">" + nickname + "</li>");
  });
  $("#users").append(usersContainer);

  var chatContainer = $("<ul data-room='" + data["room"] + "' id=chats-" + data["room"] + ">");
  $("#chats").append(chatContainer);

  var roomTab = $("<button data-room='" + data["room"] + "'>" + data["room"] + "</button>");
  $("#tabs").append(roomTab);

  roomTab.trigger("click");
}

ChatApp.ChatUI.prototype.removeNickname = function(data){
  var oldNameContainer = $("#users-" + data["room"]).find("li#" + data["nickname"]);
  oldNameContainer.remove();
  $("#chats-" + data["room"]).append("<li>" + data["nickname"] + " has left.</li>");
}

ChatApp.ChatUI.prototype.addNickname = function(data) {
  $("#chats-" + data["room"]).append("<li>" + "User " + data["nickname"] + " has joined the room.");
  $("#users-" + data["room"]).append("<li id=" + data["nickname"] + ">" + data["nickname"] + "</li>");
}