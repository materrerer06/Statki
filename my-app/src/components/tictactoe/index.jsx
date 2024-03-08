import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import io from 'socket.io-client';

// Inicjalizacja Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCd2zfm-laB4KOgkfbD9LmakPRM3OQRGDk",
  authDomain: "gameproject-df49d.firebaseapp.com",
  projectId: "gameproject-df49d",
  storageBucket: "gameproject-df49d.appspot.com",
  messagingSenderId: "82731476035",
  appId: "1:82731476035:web:73fcd70ed9f1bcd83ce0f6",
  measurementId: "G-RDG1Y8GBSH"
};
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

const socket = io.connect('http://localhost:3001');

function App() {
  const [gameData, setGameData] = useState({ gameId: null, board: Array(9).fill(null), turn: 'X', availableGames: [] });
  const [error, setError] = useState(null);
  const [isPlayer1, setIsPlayer1] = useState(false); // Dodajemy stan, aby śledzić, czy gracz jest graczem 1

  useEffect(() => {
    // Nasłuchuj zmian w kolekcji Firestore
    const unsubscribe = onSnapshot(collection(firestore, 'games'), snapshot => {
      const games = [];
      snapshot.forEach(doc => {
        games.push({ gameId: doc.id, ...doc.data() });
      });
      setGameData(prevGameData => ({
        ...prevGameData,
        availableGames: games
      }));
    }, error => {
      console.log(error.message);
    });

    return () => {
      unsubscribe(); // Wyłącz nasłuchiwanie, gdy komponent jest odmontowywany
    };
  }, []);

  const createNewGame = async () => {
    try {
      const newGameRef = doc(collection(firestore, 'games')); // Utwórz nowy dokument w kolekcji 'games'
      const newGameId = newGameRef.id;

      // Dodaj informacje o nowej grze do dokumentu w kolekcji 'games'
      // Tutaj możesz dodać więcej informacji o grze
      await setDoc(newGameRef, {
        // Dodaj informacje o nowej grze, np. nazwa gry, stany itp.
      });

      // Ustaw gracz 1 jako true
      setIsPlayer1(true);

      // Emituj informacje o nowej grze do wszystkich klientów
      socket.emit('newGameCreated', { gameId: newGameId });
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleJoinGame = gameId => {
    socket.emit('joinGame', { gameId, games: gameData.availableGames }); // Przekazujemy informacje o dostępnych grach do serwera
  };
  

  const handleClick = index => {
    if (!gameData.board[index] && gameData.turn === 'X') {
      socket.emit('move', { index });
    }
  };

  // Jeśli gracz jest graczem 1, przenieś go do poczekalni
  if (isPlayer1) {
    return <WaitingRoom />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Tic Tac Toe</h1>
        {error && <p>Error: {error}</p>}
        {gameData.gameId ? (
          <>
            <div className="board grid grid-cols-3 gap-4">
              {gameData.board.map((cell, index) => (
                <div
                  key={index}
                  className="cell bg-gray-200 h-16 w-16 flex justify-center items-center text-4xl cursor-pointer"
                  onClick={() => handleClick(index)} // Dodajemy obsługę kliknięcia
                >
                  {cell}
                </div>
              ))}
            </div>
            <p className="mt-4">Turn: {gameData.turn}</p>
          </>
        ) : (
          <>
            <button onClick={createNewGame}>Create Game</button>
            <h2>or</h2>
            <h2>Join a Game:</h2>
            <ul>
              {gameData.availableGames && Object.keys(gameData.availableGames).length > 0 ? (
                <ul>
                  {Object.keys(gameData.availableGames).map(gameId => (
                    <li key={gameId}>
                      <button onClick={() => handleJoinGame(gameId)}>Join Game {gameId}</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No available games</p>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

// Komponent poczekalni dla gracza 1
function WaitingRoom() {
  return (
    <div className="flex justify-center items-center h-screen">
      <h2>Waiting for player 2 to join... </h2>
    </div>
  );
}


export default App;
