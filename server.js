// var http = require('http');
// var fs = require('fs')l
// var path = require('path');
// var mime = require('mime');
var static = require('node-static');

var chatServer = require("./lib/chat_server");
//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');

var staticServer = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response, function(error, result){
          if (error) {
            response.writeHead(error.status, error.headers);
            response.end();
          }
        });
    }).resume();
}).listen(8080);

chatServer.setSocket(staticServer);
