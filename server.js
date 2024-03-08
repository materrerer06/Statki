const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const players = [];

// Nasłuchiwanie na połączenie klienta
io.on('connection', (socket) => {
    console.log('New client connected');

    // Emitowanie aktualnej listy graczy do nowo połączonego klienta
    socket.emit('players-update', players);

    // Obsługa dołączania gracza do gry
    socket.on('join-game', () => {
        console.log('Player joined the game');
        const playerName = `Player ${players.length + 1}`;
        players.push(playerName);
        // Emitowanie aktualnej listy graczy do wszystkich klientów
        io.emit('players-update', players);
    });

    // Obsługa opuszczania gry przez gracza
    socket.on('leave-game', () => {
        console.log('Player left the game');
        const index = players.indexOf(socket.playerName);
        if (index !== -1) {
            players.splice(index, 1);
            // Emitowanie aktualnej listy graczy do wszystkich klientów
            io.emit('players-update', players);
        }
    });

    // Obsługa rozłączenia klienta
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        const index = players.indexOf(socket.playerName);
        if (index !== -1) {
            players.splice(index, 1);
            // Emitowanie aktualnej listy graczy do wszystkich klientów
            io.emit('players-update', players);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
