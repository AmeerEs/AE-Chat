const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const PORT = 3000 || process.env.PORT;
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
server.listen(PORT, () => console.log(`server running on port ${PORT}`));

io.on('connection', socket => {
  console.log(socket.id);
  console.log('connected!!!');
  socket.emit('message', 'welcome to AE Chat');
  socket.broadcast.emit('message', 'A user has joined the chat');
  socket.on('disconnect', () => { 
    io.emit('message', 'A user has left the chat') 
  });

  socket.on('chatMessage', msg => {
    io.emit('message', msg);
  });
});
