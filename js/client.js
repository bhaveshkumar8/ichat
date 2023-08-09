// const socket = io('http://localhost:8000');
const socket = io("http://localhost:8000", { transports: ["websocket"] });

//Get DOM elements in respective JS variables
const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

// Function which will append event info to the container
const append = (message, position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

// Ask new user for his/her name and let the server know
const n = prompt("Enter your name to join");
socket.emit('new-user-joined', n);

// If a new user joins, receive his name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')
})

// If server sends a message, receive it
socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('leave', name=>{
    append(`${name} left the chat`, 'right')
})

// If server sends previous messages, receive them
socket.on('previous-messages', messages => {
    for (const data of messages) {
      append(`${data.name}: ${data.message}`, 'left');
    }
});

// IF the form gets submitted, send the message to the server:
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})