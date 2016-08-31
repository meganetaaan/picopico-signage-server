var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SEARCH_WORD = '#osc16ep';

/*
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/pps');

var signageMessageSchema = new mongoose.Schema({
        _id:Number,
        author:{type:String},
        bitmap:{type:String},
        description:{type:String}
});

var SignageMessage = mongoose.model('SignageMessage', signageMessageSchema);
*/

app.use(express.static('app'));
app.get('/', function(req, res){
    //res.send('<h1>Hello world</h1>');
    res.sendFile(__dirname + '/index.html');
});

var id = 0;
function saveMessage(message) {
    var signageMessage = new SignageMessage();
    signageMessage._id = id++;
    signageMessage.bitmap = message.bitmap;
    signageMessage.description = message.description;
    signageMessage.author = 'hoge';
    signageMessage.save(function(err){
        if(err){
            console.error(err);
        } else {
            console.log('signageMessage saved.')
        }
    });
}

io.on('connection', function(socket){
    console.log('connected');
    socket.on('signage message', function (msg) {
        console.log('signage message: ' + msg);
        io.emit('disp message', msg);
        //saveMessage(msg);
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

var twitter = require('twitter');
var twit = new twitter({
        consumer_key: 'ElKvAGlk4ksYZJR9cmElaIR9M',
        consumer_secret: 'AMzNhuqQX2Ej5ds7HohLCYPoGoye6eTe6F7sevUlYYEacnALKS',
        access_token_key: '54950393-KkcfA039Oc6l5s0TogazSL0fNbgbSgzg8qifiYzbM',
        access_token_secret: 'mfZj7jPfVffi3hH06PmNQli2xzFLgS49MgjZw2pGLJZeP'
});

var keyword = SEARCH_WORD;
var option = {'track' : keyword};
console.log(keyword + ' searching');

twit.stream('statuses/filter', option, function(stream){
    stream.on('data', function(data){
        var msg = {desc: data.text};
        io.sockets.emit('tweet', msg);
        console.log(data.text);
    });
});
