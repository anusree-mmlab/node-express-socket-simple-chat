const http = require('http');
const app = require('./app');
const socketio = require('socket.io');
const _ = require('lodash');
const fs = require('fs');

const server = http.createServer(app);
const io = socketio(server);

var socketArrObj = [];

resetSocketArray = function () {
    socketArrObj = [];
}

io.on('connection', (socketClient) =>{
    socketClient.on('join', (username) => {
        console.log(username);
        const itemIndex = _.findIndex(socketArrObj, {user: username});
        if(itemIndex === -1) {
            socketArrObj.push({user:username, socket: socketClient});
        }
    });

    socketClient.on('logout', (username) => {
        console.log('before', socketArrObj.length);
        const itemIndex = _.findIndex(socketArrObj, {user: username});
        if(itemIndex !== -1) {
            
            console.log('after ',socketArrObj.length);

/*             socket.on('disconnect', function(){
                console.log('user disconnected');
            }); */

            socketArrObj.splice(itemIndex,1);
        }
    });

    socketClient.emit('messages', 'Hello from server');

    socketClient.on('onChat', (data) => {
        socketClient.emit('broad',data);//For the sender of the chat
        socketClient.broadcast.emit('broad',data); // For all the connected users other than the sender
    });
    
    socketClient.on('reset', () => {
        console.log('B4 reset', socketArrObj);
        resetSocketArray();
    });
    

    socketClient.on('file', (stream,data) => {
        console.log('On file',stream,data);
       

        //var filename = path.basename(data.name);
        var filename = __dirname+'/'+data.name;
        //stream.pipe(fs.createWriteStream(filename));
        fs.createWriteStream(filename);
    });
        
    socketClient.on('privateMessage', (privateUser,username,message) => {
        const itemIndex = _.findIndex(socketArrObj, {user: privateUser});
        //console.log('privateMessage', privateUser, username , itemIndex);
        if(itemIndex !== -1) {
            socketArrObj[itemIndex].socket.emit('privateMessage', {
                from:username,
                msg:message
            });
        } else {
            console.log('No user found');
        }
    });

    
});

server.listen(4005, (res) => {
    console.log("Server listens on 4005");
});