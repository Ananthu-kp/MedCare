import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiMenu, FiX } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';

function NavbarDoctor() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [doctorName, setDoctorName] = useState('Doctor');
    const [profileImage, setProfileImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = sessionStorage.getItem('doctorToken');
        if (storedToken) {
            axios.get(`${BASE_URL}/doctor/doctor`, {
                headers: { Authorization: `Bearer ${storedToken}` },
            })
            .then((response) => {
                setDoctorName(response.data.name || 'Doctor');
                setProfileImage(response.data.profileImg || '');
            })
            .catch((error) => {
                console.error('Error fetching doctor details:', error);
            });
        }
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of the doctor panel.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#14b8a6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem('doctorToken');
                sessionStorage.removeItem('doctorRefreshToken');
                navigate('/doctor/login');
            }
        });
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav className="bg-white p-3 sm:p-4 shadow-md border-b border-gray-200 fixed top-0 left-0 w-full z-50">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo/Brand */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden text-gray-800 hover:text-teal-400 text-2xl"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                        </button>
                        <div 
                            onClick={() => navigate('/doctor')}
                            className="text-gray-800 hover:text-teal-400 text-lg sm:text-xl font-semibold cursor-pointer"
                        >
                            MedCare
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <span className="text-gray-700 text-sm">Welcome, <span className="font-semibold">{doctorName}</span></span>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button 
                            className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500" 
                            onClick={toggleDropdown}
                            aria-haspopup="true" 
                            aria-expanded={isDropdownOpen}
                        >
                            {profileImage ? (
                                <img
                                    alt="Doctor Avatar"
                                    src={`${BASE_URL}/${profileImage}`}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200"
                                />
                            ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold">
                                    {doctorName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="hidden sm:inline-block text-gray-700 text-sm font-medium">{doctorName}</span>
                        </button>
                        {isDropdownOpen && (
                            <ul
                                className="absolute right-0 mt-2 w-40 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                                aria-labelledby="profileDropdownButton"
                            >
                                <li>
                                    <button 
                                        className="w-full text-left px-4 py-2 sm:py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => {
                                            navigate('/doctor');
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="w-full text-left px-4 py-2 sm:py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
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

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileMenu}
                />
            )}
        </>
    );
}

export default NavbarDoctor;