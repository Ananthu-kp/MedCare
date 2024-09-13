import React from 'react';

function UserNav() {

    return (
        <nav className="bg-white p-3 shadow-md border-b border-gray-200 fixed top-0 left-0 w-full z-10">
            <div className="container mx-auto flex items-center justify-between">
                <div className="text-gray-800 hover:text-teal-400 text-xl font-semibold cursor-pointer">
                    MedCare
                </div>
            </div>
        </nav>
    );
}

export default UserNav
