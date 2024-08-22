import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-white p-3 shadow-md border-b border-gray-200 fixed top-0 left-0 w-full z-10">
            <div className="container mx-auto flex items-center justify-between">
                <div className="text-gray-800 hover:text-teal-400 text-xl font-semibold cursor-pointer">
                    MedCare
                </div>
                <div className="relative">
                    <button 
                        className="flex items-center rounded-full focus:outline-none" 
                        onClick={toggleDropdown}
                        aria-haspopup="true" 
                        aria-expanded={isDropdownOpen}
                    >
                        <img
                            alt="Admin Avatar"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            className="w-8 h-8 rounded-full"
                        />
                    </button>
                    {isDropdownOpen && (
                        <ul
                            className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg"
                            aria-labelledby="profileDropdownButton"
                        >
                            <li>
                                <button 
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
