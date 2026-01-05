import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of the admin panel.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#14b8a6',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem('adminToken');
                sessionStorage.removeItem('adminRefreshToken');
                navigate('/admin/login');
            }
        });
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-white p-3 sm:p-4 shadow-md border-b border-gray-200 fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto flex items-center justify-between px-2 sm:px-4">
                {/* Logo */}
                <div
                    onClick={() => navigate('/admin')}
                    className="text-gray-800 hover:text-teal-500 text-lg sm:text-xl font-semibold cursor-pointer transition-colors"
                >
                    MedCare Admin
                </div>

                {/* Desktop Profile Dropdown */}
                <div className="hidden sm:block relative" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onClick={toggleDropdown}
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                            A
                        </div>
                        <span className="hidden md:inline-block text-gray-700 text-sm font-medium">Admin</span>
                    </button>
                    {isDropdownOpen && (
                        <ul
                            className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
                            aria-labelledby="profileDropdownButton"
                        >
                            <li>
                                <button
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="sm:hidden text-gray-800 hover:text-teal-500 text-2xl focus:outline-none"
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed top-14 right-0 w-64 bg-white shadow-lg z-50 rounded-l-lg">
                        <div className="p-4">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    A
                                </div>
                                <span className="text-gray-700 font-medium">Admin</span>
                            </div>
                            <button
                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}

export default Navbar;