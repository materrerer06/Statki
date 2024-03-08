const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let games = {}; // Obiekt przechowujący aktualne gry

// Serwer
io.on('connection', socket => {
  console.log('A client has connected ' + socket.id);

  // Przykładowe dane o dostępnych grach
  const availableGames = {
    game1: { name: 'Game 11' },
    game2: { name: 'Game 2' },
    // Tutaj możesz dodać więcej dostępnych gier
  };

  // Emitowanie informacji o dostępnych grach do klienta
  socket.emit('availableGames', availableGames);

  let gameId;

  socket.on('createGame', () => {
    gameId = socket.id;
    games[gameId] = { board: Array(9).fill(null), turn: 'X', players: [socket.id] };
    socket.join(gameId);
    socket.emit('gameCreated', { gameId });
    console.log(`Player ${socket.id} created game ${gameId}`);
  });
// Przekazanie games jako argument do funkcji obsługującej zdarzenie 'joinGame'
// Obsługa zdarzenia 'joinGame'
socket.on('joinGame', ({ gameId, games }) => {
  if (games && games.hasOwnProperty(gameId)) {
    console.log("dolaczono do "  + gameId)
    socket.join(gameId);
    io.to(gameId).emit('playerJoined', { playerId: socket.id });
  } else {
    console.log("blad")
    socket.emit('invalidGameId', { message: 'Invalid game ID' });
  }
});

// Obsługa zdarzenia 'playerJoined'
socket.on('playerJoined', ({ playerId }) => {
  console.log('joined')
  if (playerId === socket.id) {
    // Jeśli aktualny gracz to gracz 1, przenieś go do widoku gry
    history.push('/tictactoe'); // Przeniesienie do ścieżki widoku gry
  }
});






  
  

  socket.on('move', ({ index }) => {
    if (games[gameId] && !games[gameId].board[index] && games[gameId].turn === 'X') {
      games[gameId].board[index] = 'X';
      games[gameId].turn = 'O';
      io.to(gameId).emit('update', games[gameId]);
    } else if (games[gameId] && !games[gameId].board[index] && games[gameId].turn === 'O') {
      games[gameId].board[index] = 'O';
      games[gameId].turn = 'X';
      io.to(gameId).emit('update', games[gameId]);
    }
  });

  socket.on('disconnect', () => {
    if (games[gameId]) {
      games[gameId].players = games[gameId].players.filter(playerId => playerId !== socket.id);
      if (games[gameId].players.length === 0) {
        delete games[gameId];
      }
    }
    console.log('A client has disconnected');
  });
});


server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
