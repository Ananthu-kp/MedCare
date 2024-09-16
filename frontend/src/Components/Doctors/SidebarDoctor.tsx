import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaCalendarAlt } from 'react-icons/fa';

function SidebarDoctor() {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`fixed top-14 left-0 h-full z-10 bg-gray-100 text-gray-800 transition-transform ${isExpanded ? 'w-64' : 'w-16'} overflow-hidden shadow-md`}>
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
                            onClick={() => navigate('/doctor')}
                        >
                            <FaUser className="text-xl mr-3" />
                            {isExpanded && <span>Doctor Profile</span>}
                        </button>
                    </li>
                    <li>
                        <button
                            className="flex items-center p-4 hover:text-teal-400 w-full text-left"
                            onClick={() => navigate('/doctor/slots')}
                        >
                            <FaCalendarAlt className="text-xl mr-3" />
                            {isExpanded && <span>Allocate Slots</span>}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default SidebarDoctor;
