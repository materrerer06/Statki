import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Adres URL serwera Socket.io

const TicTacToeWaitingRoom = () => {
    const [players, setPlayers] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(() => {
        // Nasłuchiwanie na zdarzenie 'players-update' od serwera
        socket.on('players-update', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        // Czyszczenie efektu po odmontowaniu komponentu
        return () => {
            socket.off('players-update');
        };
    }, []);

    const handleJoinGame = () => {
        socket.emit('join-game');
        setIsWaiting(true);
    };

    const handleLeaveGame = () => {
        socket.emit('leave-game');
        setIsWaiting(false);
    };

    return (
        <div className='text-2xl font-bold pt-14'>
            <h2>Tic Tac Toe Waiting Room</h2>
            <div>
                {players.length > 0 ? (
                    <div>
                        <p>Players in the room:</p>
                        <ul>
                            {players.map((player, index) => (
                                <li key={index}>{player}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No players in the room.</p>
                )}
                {isWaiting ? (
                    <button onClick={handleLeaveGame}>Leave Game</button>
                ) : (
                    <button onClick={handleJoinGame}>Join Game</button>
                )}
            </div>
        </div>
    );
};

export default TicTacToeWaitingRoom;
