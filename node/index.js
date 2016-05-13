var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendfile('index2.html');
});
var usersOnline = 0;
var nicknamesOnline = [];
io.on('connection', function (socket) {
    var nick = "";
    usersOnline++;
    io.emit('online', usersOnline, nicknamesOnline);
    socket.on('usrconnect', function (nickname) {
        if (nickname != undefined && nickname != "") {
            nick = nickname;
            id = nickname.length;
            nicknamesOnline.push(nick);
            io.emit('system message', "User " + nickname + " connected.");
            console.log("User " + nickname + " connected.");
            io.emit('online', usersOnline, nicknamesOnline);
        }
    });
    socket.on('disconnect', function () {
        usersOnline--;
        if (nick != "") {
            deleteFromArray(nicknamesOnline, nick);
        }
        io.emit('online', usersOnline, nicknamesOnline);
        if (nick != "") {
            io.emit('system message', "User " + nick + " disconnected.");
            console.log("User " + nick + " disconnected.");
        }
    });
    socket.on('chat message', function (msg) {
        if (msg != undefined && msg != "") {
            socket.broadcast.emit('chat message', msg, nick);
            console.log(nick + ": " + msg);
        }
    });
    socket.on("userIsTyping", function (nick) {
        socket.broadcast.emit("userIsTyping", nick);
        //socket.emit("userIsTyping", nick); // for debug
    });

});

http.listen(17777, function () {
    console.log('listening on *:17777');
});

function findInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == value) {
            return i;
        }
    }
    return null;
}

function deleteFromArray(arr, value) {
    for (var i = findInArray(arr, value); i < arr.length - 2; i++) {
        arr[i] = arr[i + 1];
    }
    delete arr[i];
    arr.length--;
}