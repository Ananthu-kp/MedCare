import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaCalendarAlt, FaTimes } from 'react-icons/fa';

function SidebarDoctor() {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const menuItems = [
        {
            icon: <FaUser className="text-xl" />,
            label: 'Doctor Profile',
            path: '/doctor'
        },
        {
            icon: <FaCalendarAlt className="text-xl" />,
            label: 'Allocate Slots',
            path: '/doctor/slots'
        }
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className={`hidden lg:block fixed top-14 left-0 h-[calc(100vh-3.5rem)] z-10 bg-white text-gray-800 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'} overflow-hidden shadow-lg border-r border-gray-200`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button
                        className="text-2xl text-gray-800 hover:text-teal-500 transition-colors"
                        onClick={handleToggle}
                        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                    >
                        <FaBars />
                    </button>
                    <div className={`text-lg font-semibold text-teal-500 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                        Menu
                    </div>
                </div>
                <div className="mt-6">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    className={`flex items-center p-4 w-full text-left transition-colors ${
                                        isActive(item.path)
                                            ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-500'
                                            : 'hover:bg-gray-100 hover:text-teal-500'
                                    }`}
                                    onClick={() => navigate(item.path)}
                                >
                                    <span className="min-w-[24px]">{item.icon}</span>
                                    {isExpanded && <span className="ml-3 font-medium">{item.label}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Mobile Sidebar (Drawer) */}
            <div className={`lg:hidden fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white text-gray-800 transition-transform duration-300 z-40 shadow-lg border-r border-gray-200 ${
                isExpanded ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="text-lg font-semibold text-teal-500">
                        Menu
                    </div>
                    <button
                        className="text-2xl text-gray-800 hover:text-teal-500 transition-colors"
                        onClick={handleToggle}
                        aria-label="Close sidebar"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="mt-6">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    className={`flex items-center p-4 w-full text-left transition-colors ${
                                        isActive(item.path)
                                            ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-500'
                                            : 'hover:bg-gray-100 hover:text-teal-500'
                                    }`}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsExpanded(false);
                                    }}
                                >
                                    {item.icon}
                                    <span className="ml-3 font-medium">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Mobile Overlay */}
            {isExpanded && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-14"
                    onClick={handleToggle}
                />
            )}

            {/* Mobile Bottom Navigation (Alternative) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
                <div className="flex justify-around items-center h-16">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                                isActive(item.path)
                                    ? 'text-teal-600 bg-teal-50'
                                    : 'text-gray-600 hover:text-teal-500 hover:bg-gray-50'
                            }`}
                            onClick={() => navigate(item.path)}
                        >
                            {item.icon}
                            <span className="text-xs mt-1 font-medium">{item.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

export default SidebarDoctor;