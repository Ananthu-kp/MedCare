import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { FiCalendar, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi';

interface Slot {
    _id?: string;
    date: string;
    startTime: string;
    endTime: string;
    available: boolean;
}

function DoctorSlots() {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [doctorEmail, setDoctorEmail] = useState('');
    const [newSlot, setNewSlot] = useState<Slot>({
        date: '',
        startTime: '',
        endTime: '',
        available: true
    });

    useEffect(() => {
        fetchDoctorProfile();
    }, []);

    const fetchDoctorProfile = async () => {
        const storedToken = sessionStorage.getItem('doctorToken');
        if (storedToken) {
            try {
                const response = await axios.get(`${BASE_URL}/doctor/doctor`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                setDoctorEmail(response.data.email);
                fetchSlots(response.data.email);
            } catch (error) {
                console.error('Error fetching doctor profile:', error);
                toast.error('Failed to fetch doctor details');
            }
        }
    };

    const fetchSlots = async (email: string) => {
        const storedToken = sessionStorage.getItem('doctorToken');
        if (storedToken) {
            try {
                const response = await axios.get(`${BASE_URL}/doctor/slots/${email}`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                setSlots(response.data);
            } catch (error) {
                console.error('Error fetching slots:', error);
                toast.error('Failed to fetch slots');
            }
        }
    };

    const handleAddSlot = async () => {
        if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
            toast.error('Please fill all fields');
            return;
        }

        setLoading(true);
        const storedToken = sessionStorage.getItem('doctorToken');
        
        try {
            await axios.post(
                `${BASE_URL}/doctor/slots`,
                {
                    email: doctorEmail,
                    ...newSlot
                },
                {
                    headers: { Authorization: `Bearer ${storedToken}` },
                }
            );
            
            toast.success('Slot added successfully');
            setIsModalOpen(false);
            setNewSlot({ date: '', startTime: '', endTime: '', available: true });
            fetchSlots(doctorEmail);
        } catch (error) {
            console.error('Error adding slot:', error);
            toast.error('Failed to add slot');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 pb-20 lg:pb-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Manage Slots</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">Add and manage your available time slots</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-teal-600 transition-colors shadow-md font-medium"
                    >
                        <FiPlus className="text-lg" />
                        <span>Add New Slot</span>
                    </button>
                </div>

                {/* Slots Grid */}
                {slots.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                        <FiCalendar className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No slots available</h3>
                        <p className="text-sm sm:text-base text-gray-500">Click "Add New Slot" to create your first time slot</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {slots.map((slot, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <FiCalendar className="text-teal-500 text-lg" />
                                        <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                            {new Date(slot.date).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        slot.available 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {slot.available ? 'Available' : 'Booked'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                                    <FiClock className="text-gray-400" />
                                    <span>{slot.startTime} - {slot.endTime}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Slot Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="p-6 sm:p-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Add New Slot</h2>
                                
                                <div className="space-y-4 sm:space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={newSlot.date}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                                            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                        <input
                                            type="time"
                                            value={newSlot.startTime}
                                            onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                        <input
                                            type="time"
                                            value={newSlot.endTime}
                                            onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="available"
                                            checked={newSlot.available}
                                            onChange={(e) => setNewSlot({ ...newSlot, available: e.target.checked })}
                                            className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                                        />
                                        <label htmlFor="available" className="text-sm text-gray-700">Mark as available</label>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full sm:flex-1 px-4 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddSlot}
                                        disabled={loading}
                                        className="w-full sm:flex-1 px-4 py-2 sm:py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Adding...' : 'Add Slot'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorSlots;