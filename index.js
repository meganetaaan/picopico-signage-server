var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('app'));
app.get('/', function(req, res){
    //res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('connected');
    socket.on('signage message', function (msg) {
        console.log('signage message: ' + msg);
        io.emit('disp message', msg);
        //io.sockets.in('edison').emit('signage message', msg);
    });
    socket.on('chat message', function(msg){
        console.log('chat message: ' + msg);
    });
});

var port = process.env.PORT || 3000
http.listen(port, function(){
    console.log('listening on *:' + port);
});
