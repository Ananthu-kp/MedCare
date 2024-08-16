import React from 'react';

function Navbar() {
  return (
    <header className="w-full py-4 text-white shadow-md bg-gradient-to-br from-teal-400 via-teal-500 to-green-200 z-20">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">MEDCARE</h1>
        <nav className="flex-1 flex justify-center space-x-8">
          <a href="/" className="hover:text-gray-200">Home</a>
          <a href="#services" className="hover:text-gray-200">Services</a>
          <a href="#about" className="hover:text-gray-200">About</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
