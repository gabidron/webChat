const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
let room = '';
app.get('/chat/:id', (req, res) => {
    res.sendFile(__dirname + "/index.html");
    room = req.params.id;
    console.log("room " + room);
});

io.on('connection', (socket) => {
    
    socket.on('join-room', (id) => {
        socket.join(room);
        socket.to(room).emit("user-connected", id);

        socket.on('disconnect', () => {
            socket.emit('user-disconnected', id);
            console.log(`${id} disconected`);
        });
        
    });

    socket.on('join', (name) => {
        console.log(name);
        socket.to(room).emit('join', name);
    });

    socket.on('chat message', (data) => {
        socket.to(room).emit('chat message', data);
    });

   
});