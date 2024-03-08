import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';

const Header = () => {
    const navigate = useNavigate();
    const { userLoggedIn, userName } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        doSignOut().then(() => {
            navigate('/login');
        });
    };

    return (
        <nav className='flex flex-row justify-between items-center w-full z-20 fixed top-0 left-0 h-12 border-b bg-gray-200'>

            <div className='mr-4'>
                {userLoggedIn ? (
                    <div className='relative'>
                        <button onClick={handleDropdownToggle} className='text-sm text-blue-600 underline'>{userName}</button>
                        {isDropdownOpen && (
                            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10'>
                                <div className='py-1'>
                                    <button onClick={() => navigate('/profile')} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left'>Profile</button>
                                    <button onClick={handleLogout} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left'>Logout</button>
                                </div>
                            </div>
                        )}
                <Link className='text-sm text-blue-600 underline' to='/games'>Games</Link>
                    </div>
                ) : (
                    <>
                        <Link className='text-sm text-blue-600 underline' to='/login'>Login</Link>
                        <Link className='text-sm text-blue-600 underline' to='/register'>Register New Account</Link>
                    </>
                )}
            </div>
                <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-blue-600 underline'>Logout</button>
        </nav>
    );
};

export default Header;
