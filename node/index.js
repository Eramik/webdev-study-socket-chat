var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendfile('index2.html');
});
var usersOnline = 0;
var usersCount = 0;
var nicknames = new Array();

io.on('connection', function (socket) {
    var i = usersCount++;
    usersOnline++;
    io.emit('online', usersOnline);
    socket.on('usrconnect', function (nickname) {
        nicknames.push(nickname);
        io.emit('system message', "User " + nickname + " connected.");
        io.emit('online', usersOnline);
    });
    socket.on('disconnect', function (nickname) {
        usersOnline--;
        io.emit('system message', "User " + nicknames[i] + " disconnected.")
        nicknames[i] = "";
        io.emit('online', usersOnline);
    });
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg, nicknames[i]);
    });

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});