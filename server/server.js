const http  = require('http');
const path = require("path");
const express = require("express");
const socketio = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})
const PORT = process.env.PORT || 3001;

io.on('connection', socket =>{

    socket.on("create_game", (game)=>{
        socket.join(game);
    });

    socket.on("request_game", ({ user, game })=>{
        socket.emit("request_game", {user,game})
    });

    socket.on("message", ({ message,player, game }) =>{
        socket
            .to(game)
            .emit("message", { player, message })
    });

    socket.on("player_move", ({ player, board, game }) => {
        socket
            .to(game)
            .emit("player_move", { board, player, turn: 1 })
    });

    socket.on("gameover", ({ winner, game })=> {
        socket
            .to(game)
            .emit("player_move", { winner })
    })
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));