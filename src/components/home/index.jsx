import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { currentUser } = useAuth();

    return (
        <div className='text-2xl font-bold pt-14'>
            Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
            <div className="flex justify-center mt-8">
                <Link to="/tictactoe" className="mr-4">
                    <button className="border border-gray-400 rounded-lg p-4">
                        <img src="https://media.istockphoto.com/id/937025192/pl/wektor/tic-tac-toe-gry.jpg?s=1024x1024&w=is&k=20&c=fUQjX3QEDzIClVUBq1mXdVkyfleZ9sB8hJ_r9ge-AR8=" alt="Tic Tac Toe" className="game-image" />
                        <div className="text-center">Tic Tac Toe</div>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
