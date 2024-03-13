const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);
app.use(express.static(path.resolve("")));

let arr = [];
let playingArray = [];

io.on("connection", (socket) => {
    socket.on("find", (e) => {
        if (e.name != null) {
            arr.push({ username: e.name, socketId: socket.id });

            if (arr.length >= 2) {
                let p1obj = {
                    p1name: arr[0].username,
                    p1value: "X",
                    p1move: "",
                };
                let p2obj = {
                    p2name: arr[1].username,
                    p2value: "O",
                    p2move: "",
                };

                let obj = {
                    p1: p1obj,
                    p2: p2obj,
                    sum: 1,
                };
                playingArray.push(obj);

                arr.splice(0, 2);

                io.emit("find", { allPlayers: playingArray });
                io.to(playingArray[0].p1.p1name).emit("yourTurn");
            }
        }
    });

    socket.on("playing", (e) => {
        const currentPlayerIndex = playingArray.findIndex(
            (obj) => obj.p1.p1name === e.name || obj.p2.p2name === e.name
        );

        if (currentPlayerIndex === -1) return; // Gracz nie jest w grze

        const currentPlayer = playingArray[currentPlayerIndex];
        const currentPlayerSymbol =
            currentPlayer.p1.p1name === e.name ? "X" : "O";

        if (
            currentPlayerSymbol === "X" &&
            currentPlayer.sum % 2 === 1 &&
            e.value === "X"
        ) {
            currentPlayer.p1.p1move = e.id;
            currentPlayer.sum++;
            io.emit("playing", { allPlayers: playingArray });
            io.to(currentPlayer.p2.p2name).emit("yourTurn");
        } else if (
            currentPlayerSymbol === "O" &&
            currentPlayer.sum % 2 === 0 &&
            e.value === "O"
        ) {
            currentPlayer.p2.p2move = e.id;
            currentPlayer.sum++;
            io.emit("playing", { allPlayers: playingArray });
            io.to(currentPlayer.p1.p1name).emit("yourTurn");
        }
    });

    socket.on("gameOver", (e) => {
        playingArray = playingArray.filter(
            (obj) => obj.p1.p1name !== e.name && obj.p2.p2name !== e.name
        );
        console.log(playingArray);
        console.log("lol");
    });

    socket.on("disconnect", () => {
        const disconnectedUserIndex = arr.findIndex(
            (user) => user.socketId === socket.id
        );
        if (disconnectedUserIndex !== -1) {
            arr.splice(disconnectedUserIndex, 1);
        }
    });
});

app.get("/", (req, res) => {
    return res.sendFile("index.html");
});

server.listen(3000, () => {
    console.log("Port connected to 3000");
});
