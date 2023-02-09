const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users.js')


const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);
const io = socketio(server);

//Chat bot name
const botName = 'AE Bot'

//set static path in express
app.use(express.static(path.join(__dirname, 'public')));

//server start listening
server.listen(PORT, () => console.log(`server running on port ${PORT}`));

//when socket connection is established
io.on('connection', socket => {

  //when a user joins a room
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);  //returns a user object
    socket.join(user.room); //joins a user to a room
    socket.emit('message', formatMessage(botName, 'Welcome to AE Chat!'));
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
    
    // send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
    
    socket.on('chatMessage', msg => {
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))
      };

    // send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
    

  });
});
