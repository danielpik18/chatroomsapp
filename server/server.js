//CUSTOM FILES
const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');
const {
    isRealString
} = require('./utils/validation');
const {
    Users
} = require('./utils/users');
const {
    Rooms
} = require('./utils/rooms');

//-----------------

//INTEGRATED NODE PACKAGES
const path = require('path');
const http = require('http');

//THIRD PARTY LIBRARIES
const socketIO = require('socket.io');
const express = require('express');

//HEROKU
const port = process.env.PORT || 3000;


//      -- MAIN CODE --
//---------------------------------------------------------------------------------------------
const publicPath = path.join(__dirname, '../public');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();
const rooms = new Rooms();

//EXPRESS CONFIGURATION
app.use(express.static(publicPath));



const updateActiveRooms = () => {
    //Update active rooms on index page
    io.emit('activeRooms', rooms.getRoomsList());
};

io.on('connection', socket => {
    let message;

    //Update active rooms on index page
    updateActiveRooms();


    //When user joins a room
    socket.on('join', (params, callback) => {
        const usersInRoom = users.getUserList(params.room);

        //If invalid data
        if (!isRealString(params.name) || typeof params.room !== 'string') {
            callback('Name and room are required.');
        } //If username is taken
        else if (usersInRoom.includes(params.name)) {
            callback('That name is already taken.');
        } else {
            let roomExists = rooms.getRoomsList().filter(room => room.name === params.room);

            // -- If room doesn't already exist, create it and join user
            if (roomExists.length === 0)
                rooms.addRoom(params.room).userJoin(params.name);
            // -- Otherwise, if it exists, we simply join the userr
            else {
                rooms.getRoom(params.room).userJoin(params.name);
            }

            console.log('Rooms: ', rooms.getRoomsList());

            //Update active rooms on index page
            updateActiveRooms();

            socket.join(params.room);

            //Persisting data of the user who joined
            users.removeUser(socket.id);
            users.addUser(socket.id, params.name, params.room);
            io.to(params.room).emit('updateUserList', users.getUserList(params.room));

            //What other users see When new user joins
            socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} just joined.`));

            //What a user who just joined sees
            socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));

            callback();
        };
    });

    //Create location message
    socket.on('createLocationMessage', coords => {
        const user = users.getUser(socket.id);

        if (user) {
            const message = generateLocationMessage(user.name, coords.latitude, coords.longitude);
            io.to(user.room).emit('newLocationMessage', message);
        }

    });

    //Recieving event on the back end
    socket.on('createMessage', function (msg) {

        const user = users.getUser(socket.id);

        if (user && isRealString(msg.text)) {
            const message = generateMessage(user.name, msg.text);
            io.to(user.room).emit('newMessage', message);
        }
    });

    socket.on('disconnect', () => {

        //Remove user from Users master class
        const removedUser = users.removeUser(socket.id);

        if (removedUser) {
            //Remove user from room
            rooms.getRoom(removedUser.room).userLeave(removedUser.name);

            if (rooms.getRoom(removedUser.room).users.length === 0) {
                rooms.removeRoom(removedUser.room);
            }

            console.log('Rooms on disconnect: ', rooms.getRoomsList());

            //Update active rooms on index page
            updateActiveRooms();

            io.to(removedUser.room).emit('updateUserList', users.getUserList(removedUser.room));
            io.to(removedUser.room).emit('newMessage', generateMessage('Admin', `${removedUser.name} just left the room.`));
        }
    });

});

server.listen(port, () => {
    console.log('App running on port 3000');
});

//Make rooms case Unsensitive
//Make usernames unique
//Make room list at index home page