import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("userToken"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out from Medcare!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#14b8a6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("userToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("userDetails");
        setIsAuthenticated(false);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          confirmButtonColor: '#14b8a6',
          timer: 2000
        });
        navigate('/login');
      }
    });
  };

  return (
    <header className="w-full py-3 sm:py-4 text-gray-900 bg-white shadow-md z-50 sticky top-0">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-500 cursor-pointer hover:text-teal-600 transition-colors">
            MEDCARE
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button
                  className="px-4 lg:px-5 py-2 font-semibold text-gray-700 uppercase border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm lg:text-base"
                  type="button"
                >
                  Log In
                </button>
              </Link>
              <Link to="/signup">
                <button
                  className="px-4 lg:px-5 py-2 font-semibold text-white uppercase bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors text-sm lg:text-base"
                  type="button"
                >
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                className="w-10 h-10 lg:w-12 lg:h-12 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors shadow-md"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="User menu"
              >
                <FiUser className="text-lg lg:text-xl" />
              </button>
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <button
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors rounded-t-lg font-medium"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/profile');
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-b-lg font-medium"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FiX className="text-2xl text-gray-700" />
          ) : (
            <FiMenu className="text-2xl text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-14 right-0 w-64 bg-white shadow-lg z-50 rounded-l-lg animate-slide-in">
            <div className="p-4">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button
                      className="w-full px-4 py-3 font-semibold text-gray-700 uppercase border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                      type="button"
                    >
                      Log In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button
                      className="w-full px-4 py-3 font-semibold text-white uppercase bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors text-sm"
                      type="button"
                    >
                      Sign Up
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/profile');
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Navbar;