const socket = io();


const messages = document.getElementById('chat-messages');
socket.on('message', message => {
  messages.innerHTML += `<br> ${message}`;
});

const chatForm = document.getElementById('chat-form');
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  
  socket.emit('chatMessage', msg);
});