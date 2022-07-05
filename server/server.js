const http  = require('http');
const express = require("express");
const socketio = require("socket.io");
const userRoutes = require('./routes/user');
const cors = require('cors');
const bodyParser = require('body-parser');
const {GameService} = require("./services/GameService");
const {UserService} = require("./services/UserService");
const app = express();
const redis = require('redis');
const { createAdapter } = require("@socket.io/redis-adapter");

app.use(cors(
    {
        origin: 'http://localhost:3000',
    }
));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userRoutes);
const server = http.createServer(app);

// WEBSOCKETS SETUP
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
})
const PORT = process.env.PORT || 3002;


// REDIS CONFIG
// const redisClient = redis.createClient({
//     url: 'redis://cache:6379',           // for cache if needed
// });


const pubClient = redis.createClient({ url: "redis://cache:6379" });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    // io.listen(3002);
  }).catch(e=> console.log(e));


// WEBSOCKETS EVENTS
io.on('connection', socket =>{

    socket.on("create_game", async (game)=>{
        await GameService.createGame(game);
        await UserService.addGame(game.white, game.id);
        socket.join(game);
    });

    socket.on("add_to_game", async (data)=>{
        await UserService.addGame(data.user, data.game);
    })

    socket.on("cancel_game", async (game)=>{
        await GameService.deleteGame(game);
    })

    socket.on("start_game", async (data)=>{
        await GameService.startGame(data.game);
        socket.broadcast.emit("start_game", {user1:data.user1, user2:data.user2, game:data.game})
    })

    socket.on("request_game", ( data )=>{
        console.log(data)
        socket.broadcast.emit("request_game", {user:data.user, game:data.game})
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