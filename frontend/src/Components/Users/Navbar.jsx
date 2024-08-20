import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'


function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("userToken"));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        navigate('/login');
      }
    });
  };
  

  return (
    <header className="w-full py-3 text-gray-900 bg-white shadow-md z-20">
      <div className="container mx-auto flex justify-between items-center px-4 relative">
        <h1 className="text-2xl font-bold text-teal-500">MEDCARE</h1>
        <nav className="flex-1 flex justify-center space-x-8">
          <a href="/" className="text-gray-700 hover:text-teal-500">Home</a>
          <a href="#services" className="text-gray-700 hover:text-teal-500">Services</a>
          <a href="#about" className="text-gray-700 hover:text-teal-500">About</a>
        </nav>
        <div className="flex items-center gap-4 relative">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <button
                  className="px-3 py-1.5 font-bold text-gray-700 uppercase border border-gray-300 rounded-lg hover:bg-gray-200"
                  type="button">
                  Log In
                </button>
              </Link>
              <Link to="/signup">
                <button
                  className="px-3 py-1.5 font-bold text-white uppercase bg-teal-500 rounded-lg hover:bg-teal-600"
                  type="button">
                  Sign In
                </button>
              </Link>
            </>
          ) : (
            <div className="relative z-30">
              <button
                className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="text-xl">U</span> {/* Placeholder for user photo */}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
