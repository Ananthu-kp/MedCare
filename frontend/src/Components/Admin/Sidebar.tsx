import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaRegListAlt, FaUserMd, FaBars, FaPlus } from 'react-icons/fa';

function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleClickOutside = (event: { target: any; }) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setIsExpanded(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={sidebarRef}
            className={`fixed top-14 left-0 h-full bg-gray-100 text-gray-800 transition-transform ${isExpanded ? 'w-64' : 'w-16'} overflow-hidden shadow-md`}
        >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button 
                    className="text-2xl text-gray-800 hover:text-teal-400"
                    onClick={handleToggle}
                >
                    <FaBars />
                </button>
                <div className={`text-lg font-semibold hover:text-teal-400 ${isExpanded ? 'block' : 'hidden'}`}>
                    MedCare
                </div>
            </div>
            <div className="mt-6">
                <ul>
                    <li>
                        <button 
                            className="flex items-center p-4 hover:text-teal-400 w-full text-left" 
                            onClick={() => navigate('/admin')}
                        >
                            <FaTachometerAlt className="text-xl mr-3" />
                            {isExpanded && <span>Dashboard</span>}
                        </button>
                    </li>
                    <li>
                        <button 
                            className="flex items-center p-4 hover:text-teal-400 w-full text-left" 
                            onClick={() => navigate('/admin/users')}
                        >
                            <FaUser className="text-xl mr-3" />
                            {isExpanded && <span>Users List</span>}
                        </button>
                    </li>
                    <li>
                        <button 
                            className="flex items-center p-4 hover:text-teal-400 w-full text-left" 
                            onClick={() => navigate('/admin/doctor-requests')}
                        >
                            <FaRegListAlt className="text-xl mr-3" />
                            {isExpanded && <span>Doctor Requests</span>}
                        </button>
                    </li>
                    <li>
                        <button 
                            className="flex items-center p-4 hover:text-teal-400 w-full text-left" 
                            onClick={() => navigate('/admin/doctors')}
                        >
                            <FaUserMd className="text-xl mr-3" />
                            {isExpanded && <span>Doctors List</span>}
                        </button>
                    </li>
                    <li>
                        <button 
                            className="flex items-center p-4 hover:text-teal-400 w-full text-left" 
                            onClick={() => navigate('/admin/categories')}
                        >
                            <FaPlus className="text-xl mr-3" />
                            {isExpanded && <span>Add Category</span>}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
