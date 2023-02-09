const socket = io();

const chatMessages = document.querySelector('.chat-messages');

//get username & room
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

//join chat room
socket.emit('joinRoom', { username, room});

socket.on('message', message => {
  outputMessage(message);

  //scroll down on message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

const chatForm = document.getElementById('chat-form');
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  
  socket.emit('chatMessage', msg);
  console.log("msg emitted")

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(`.chat-messages`).appendChild(div);
}