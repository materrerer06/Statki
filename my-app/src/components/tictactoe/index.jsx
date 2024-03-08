import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

function TicTacToe() {
 const [board, setBoard] = useState(Array(9).fill(null)); // Game board
 const [currentPlayer, setCurrentPlayer] = useState(null); // Current player
 const [gameId, setGameId] = useState(null); // Game ID
 const [gameOver, setGameOver] = useState(false); // Game over state
 const [winner, setWinner] = useState(null); // Winner of the game
 const [reset, setReset] = useState(false); // Reset game state

 const playerTurn = currentPlayer === 'X' ? 'O' : 'X';
 // Check for a win or a draw
 const checkGameStatus = () => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(currentPlayer);
        return true;
      }
    }

    if (!board.includes(null)) {
      setWinner('draw');
      return true;
    }

    return false;
 };

 // Listen for 'move' event
 useEffect(() => {
    socket.on('move', ({ index, player }) => {
      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);
      // Switch player after receiving move confirmation from the server
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    });
  
    return () => {
      socket.off('move');
    };
  }, [board, currentPlayer]);

 // Listen for 'foundPlayer' event
 useEffect(() => {
    socket.on('foundPlayer', ({ gameId, currentPlayer }) => {
      setGameId(gameId);
      setCurrentPlayer(currentPlayer);
    });

    return () => {
      socket.off('foundPlayer');
    };
 }, []);

 // Start the game
 const startGame = () => {
    socket.emit('startGame');
 };

// Handle a move

const handleMove = (index) => {
    if (gameOver) {
      return;
    }
  
    if (board[index] !== null) {
      // The position is already occupied, so ignore the move
      alert('This position is already occupied. Please choose another one.');
      return;
    }
  
    const newBoard = [...board];
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    newBoard[index] = currentPlayer;
  
    setBoard(newBoard);
  
    const isGameOver = checkGameStatus();
    if (isGameOver) {
      setGameOver(true);
      setWinner(currentPlayer);
    }
  
    // Emit the move to the server with the current player
    socket.emit('move', { index, player: currentPlayer });
  };


// Reset the game
const handleReset = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(null);
    setWinner(null);
    setGameOver(false);
    setReset(false);
    setGameOver(false);};

 // Effect for checking game status
 useEffect(() => {
    const isGameOver = checkGameStatus();
    if (isGameOver) {
      setGameOver(true);
    }
 }, [board]);

 // Render the game board
 const renderBoard = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {board.map((cell, index) => (
          <div key={index} className="border border-gray-400 p-4 text-4xl flex items-center justify-center cursor-pointer" onClick={() => handleMove(index)}>
            {cell}
          </div>
        ))}
      </div>
    );
 };

 return (
    <div className="container mx-auto mt-8 text-center">
      {gameId && currentPlayer ? (
        <>
          <h1 className="text-4xl mb-4">Game in progress</h1>
          <p className="text-xl mb-4">Current Player: {currentPlayer}</p>
          {gameId && renderBoard()}
          {gameOver && (
            <div>
              <p>{winner === 'draw' ? "It's a draw!" : `${winner} wins!`}</p>
              <button onClick={handleReset}>Play Again</button>
            </div>
          )}
        </>
      ) : (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={startGame}>Start Game</button>
      )}
    </div>
 );
}

export default TicTacToe;
