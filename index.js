// Node server which will handle socket io connections

const io = require('socket.io')(8000)

const users = {};
const chatHistory = []; // Array to store chat messages

io.on('connection', socket =>{ //socket.io instance and listen different socket connection

    // if any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ //listen particular user
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);

        // Send previous chat messages to the new user
        socket.emit('previous-messages', chatHistory);
    });

    // If someone sends a message, broadcast it to other pepole
    socket.on('send', message =>{
        const data = { message: message, name: users[socket.id] };
        chatHistory.push(data); // Store the message in chatHistory
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})

    });

    // If someone leaves the chat, let others know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });

    // 'disconnect' is built in
})