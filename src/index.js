const express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var NODE_MODULES = __dirname + '/../node_modules/';

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/html/index.html')
});

// TODO: This is not best practice, but I don't know better.
app.use('/sketchpad', express.static(__dirname + "/static/sketchpad/scripts/"));

// Socket stuff.

// TODO: Add namespaces to support different pictionary rooms.
// For now, we just support one room, where everyone is in.
io.on('connection', function(socket) {
    socket.on('canvas update', function(canvas) {
        socket.broadcast.emit('canvas update', canvas);
    })
    socket.on('disconnect', function() {
        console.log('user disconnected');
    })
})

http.listen(3000, function() {
    console.log('listening on :3000')
});