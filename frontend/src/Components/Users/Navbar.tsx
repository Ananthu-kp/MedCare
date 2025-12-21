import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
      confirmButtonColor: '#2f855a',
      cancelButtonColor: '#e53e3e',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel',
      background: '#f7fafc',
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("userToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("userDetails");
        setIsAuthenticated(false);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/login');
      }
    });
  };

  return (
    <header className="w-full py-3 md:py-4 text-gray-900 bg-white shadow-md z-50 sticky top-0">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6 lg:px-8 relative">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-500 cursor-pointer">
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
                  Sign In
                </button>
              </Link>
            </>
          ) : (
            <div className="relative z-30">
              <button
                className="w-10 h-10 lg:w-12 lg:h-12 bg-teal-500 text-white rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-lg lg:text-xl font-semibold">U</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/profile');
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
              isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4 bg-white border-t border-gray-200">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button
                  className="w-full px-4 py-3 font-semibold text-gray-700 uppercase border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  Log In
                </button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <button
                  className="w-full px-4 py-3 font-semibold text-white uppercase bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors"
                  type="button"
                >
                  Sign In
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
    </header>
  );
}

export default Navbar;