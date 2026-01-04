import React from 'react';
import { Link } from 'react-router-dom';

function UserNav() {
    return (
        <nav className="bg-white p-3 sm:p-4 shadow-md border-b border-gray-200 fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-500 cursor-pointer hover:text-teal-600 transition-colors">
                        MEDCARE
                    </h1>
                </Link>
            </div>
        </nav>
    );
}

export default UserNav;