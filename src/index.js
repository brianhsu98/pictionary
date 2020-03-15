const express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var NODE_MODULES = __dirname + '/../node_modules/';

var ROOMS = {};
var ROOM_TO_CURRENT_CANVAS = {};

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/html/index.html')
});


app.get('/rooms/:roomId', function(req, res) {
    // TODO: Implement functionality to ask for a name.
    // I suppose we could just have name be a URL parameter.
    // Then, in the index, we could have them put in a room ID and a name.
    // not sure if i love that flow, but it could work.

    var name = req.query.name;
    // Sockets require a "/" before the namespace.
    var roomId = "/" + req.params.roomId;

    // If we don't have the URL query parameter, boot them home.
    if (!name) {
        res.redirect('/');
    }

    if (roomId in ROOMS) {
        if (!ROOMS[roomId].includes(name)) {
            ROOMS[roomId].push(name)
        }
    } else {
        ROOMS[roomId] = [];
        ROOMS[roomId].push(name)
    }

    var nsp = io.of(roomId);
    nsp.on('connection', canvas_connection_handler);

    res.sendFile(__dirname + '/html/sketchpad.html');
})

// Socket connection handlers.
function canvas_connection_handler(socket) {
    console.log('user connected');

    var roomId = socket.nsp.name;
    
    // Display the current canvas ID to new users.
    if (roomId in ROOM_TO_CURRENT_CANVAS) {
        socket.emit('canvas update', ROOM_TO_CURRENT_CANVAS[roomId]);
    }

    socket.on('canvas update', function(canvas) {
        socket.broadcast.emit('canvas update', canvas);
        ROOM_TO_CURRENT_CANVAS[roomId] = canvas;
    })
    socket.on('disconnect', function() {
        console.log('user disconnected');
    })
}

app.use('/sketchpad', express.static(__dirname + "/static/sketchpad/scripts/"));

http.listen(3000, function() {
    console.log('listening on :3000')
});