const http = require('http');
const app = require('./app');
const socketio = require('socket.io');
const _ = require('lodash');

const server = http.createServer(app);
const io = socketio(server);

var socketArrObj = [];

resetSocketArray = function () {
    socketArrObj = [];
}

io.on('connection', (socketClient) =>{
    console.log("A user connected");
    

    socketClient.on('join', (username) => {
        console.log(username);
        const itemIndex = _.findIndex(socketArrObj, {user: username});
        if(itemIndex === -1) {
            socketArrObj.push({user:username, socket: socketClient});
        }
        
        console.log(socketArrObj);
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
    
        
    socketClient.on('privateMessage', (privateUser,username) => {
        const itemIndex = _.findIndex(socketArrObj, {user: privateUser});
        console.log('privateMessage', privateUser, username , itemIndex);
        if(itemIndex !== -1) {
            socketArrObj[itemIndex].socket.emit('privateMessage', {
                from:username,
                msg:'Test private message'
            });
        } else {
            console.log('No user found',socketArrObj);
        }
    });

    
});

server.listen(4005, (res) => {
    console.log("Server listens on 4005");
});