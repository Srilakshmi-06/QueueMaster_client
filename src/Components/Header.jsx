import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import BasicMenu from './BasicMenu/BasicMenu';
import { IoIosNotifications } from "react-icons/io";
import { Link } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    const isAdmin = user && user.role === 'admin'

    return (
        <header className="bg-linear-to-br from-purple-800 to-blue-900 text-white font-serif fixed w-full top-0 z-10 shadow-md rounded-b-2xl">
            <div className="max-w-7xl mx-auto flex items-center p-4 justify-around">
                <div className="flex items-center space-x-3">
                    <img src={logo} alt="QueueMaster Logo" className="h-15 w-15" />
                    <h1 className="text-1xl font-serif italic font-bold tracking-wide">QueueMaster</h1>
                </div>

                <ul className="flex space-x-6 text-lg font-medium">
                    <Link to="/dashboard">
                        <li className="hover:text-indigo-600 cursor-pointer transition-colors duration-200">Home</li>
                    </Link>
                    {!isAdmin && (
                        <>
                            <Link to="/tickets">
                                <li className="hover:text-indigo-600 cursor-pointer transition-colors duration-200">Tickets</li>
                            </Link>
                            <Link to="/queuestatus">
                                <li className="hover:text-indigo-600 cursor-pointer transition-colors duration-200">Queue Status</li>
                            </Link>
                        </>
                    )}
                    <Link to="/services">
                        <li className="hover:text-indigo-600 cursor-pointer transition-colors duration-200">Services</li>
                    </Link>
                    <Link to="/announcements">
                        <li className="hover:text-indigo-600 cursor-pointer transition-colors duration-200">Announcements</li>
                    </Link>
                    <Link to='/notification'>
                        <li className="hover:text-indigo-600 cursor-pointer transition-colors duration-200"><IoIosNotifications className='h-8 w-5' /></li>
                    </Link>
                    <li className="cursor-pointer transition-colors duration-200"><BasicMenu /></li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
