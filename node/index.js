var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendfile('index2.html');
});
var usersOnline = 0;
var idSeed = 0;

io.on('connection', function (socket) {
    var id = idSeed++;
    var nick = "";
    usersOnline++;
    io.emit('online', usersOnline);
    socket.on('usrconnect', function (nickname) {
        if (nickname != undefined && nickname != "") {
            nick = nickname;
            io.emit('system message', "User " + nickname + " connected.");
            console.log("User " + nickname + " connected.");
            io.emit('online', usersOnline);
        }
    });
    socket.on('disconnect', function () {
        usersOnline--;
        io.emit('online', usersOnline);
        if (nick != "") {
            io.emit('system message', "User " + nick + " disconnected.");
            console.log("User " + nick + " disconnected.");
        }
    });
    socket.on('chat message', function (msg) {
        if (msg != undefined && msg != "") {
            io.emit('chat message', msg, nick);
            console.log(nick + ": " + msg);
        }
    });

});

http.listen(17777, function () {
    console.log('listening on *:17777');
});