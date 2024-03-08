const express = require('express');
const app = express();
const http = require('http').Server(app);
const { Server } = require('socket.io');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./gameproject-df49d-firebase-adminsdk-ahfut-0335ed6cbd.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(cors());

const io = new Server(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

let players = []; // Tablica graczy
let games = {}; // Obiekt gier

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Obsługa zdarzenia startGame
  socket.on('startGame', () => {
    // Sprawdzamy, czy istnieje inny gracz oczekujący na rozpoczęcie gry
    if (players.length === 1) {
      // Znaleziono drugiego gracza, tworzymy nową grę
      const gameId = socket.id + '_' + players[0];
      games[gameId] = {
        players: [socket.id, players[0]],
        currentPlayer: socket.id,
        board: Array(9).fill(null),
        gameStatus: 'ongoing'
      };

      // Wyemituj zdarzenie do obu graczy, że gra się rozpoczyna
      io.to(socket.id).emit('foundPlayer', { gameId, currentPlayer: socket.id });
      io.to(players[0]).emit('foundPlayer', { gameId, currentPlayer: socket.id });

      console.log("Znaleziono grę!");
    } else {
      // Dodaj gracza do tablicy graczy
      players.push(socket.id);
      // Wyślij informację do pierwszego gracza, że czekamy na drugiego gracza
      socket.emit('playerNotFound');
      console.log("Szukanie gry...");
    }
  });

  // Obsługa zdarzenia move
  socket.on('move', (data) => {
    // Pobierz informacje o grze
    const game = games[data.gameId];
    if (!game) return;

    // Sprawdź, czy aktualny gracz ma prawo wykonać ruch
    if (game.currentPlayer === socket.id && game.gameStatus === 'ongoing') {
      const { index, player } = data;

      // Sprawdź, czy wybrana pozycja jest wolna
      if (game.board[index] === null) {
        // Zapisz ruch w tablicy
        game.board[index] = player;

        // Sprawdź, czy jest zwycięzca
        const winner = calculateWinner(game.board);
        if (winner) {
          game.gameStatus = `${winner} wins`;
        } else if (!game.board.includes(null)) {
          // Jeśli plansza jest pełna, jest remis
          game.gameStatus = 'Draw';
        } else {
          // Zmień gracza, który ma teraz kolej na ruch
          game.currentPlayer = game.players.find(p => p !== socket.id);
        }

        // Wyślij zaktualizowaną planszę do obu graczy
        io.to(game.players[0]).to(game.players[1]).emit('move', { index, player });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
    // Usuń gracza z tablicy graczy, jeśli się rozłączy
    players = players.filter((player) => player !== socket.id);

    // Sprawdź, czy użytkownik opuścił jakąś grę
    for (const gameId in games) {
      if (games[gameId].players.includes(socket.id)) {
        delete games[gameId]; // Usuń grę
        console.log(`Game ${gameId} has been removed.`);
      }
    }
  });
});

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

const PORT = process.env.PORT || 3001;

http.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
