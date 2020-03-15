const express = require('express')
var app = express();
var http = require('http').createServer(app);

var NODE_MODULES = __dirname + '/../node_modules/';

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/html/index.html')
});

// TODO: This is not best practice, but I don't know better.
app.use('/sketchpad', express.static(__dirname + "/static/sketchpad/scripts/"));

http.listen(3000, function() {
    console.log('listening on :3000')
});