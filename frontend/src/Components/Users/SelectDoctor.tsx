import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { useNavigate } from 'react-router-dom';

type Doctor = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    category: string;
    yearsOfExperience: number;
    workingHospital: string;
    consultationfee?: number;
    profileImg?: string;
};

function SelectDoctor() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null); 
    const [categories, setCategories] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleBookAppointment = (doctorId: string) => {
        navigate(`/doctorDetails/${doctorId}`);
    };

    useEffect(() => {
        const fetchDoctors = async (query: string = '') => {
            try {
                const response = await axios.get(`${BASE_URL}/selectDoctor`, {
                    params: { name: query }
                });
                setDoctors(response.data);

                const uniqueCategories = Array.from(new Set(response.data.map((doc: Doctor) => doc.category))) as string[];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        };
        fetchDoctors(searchQuery);
    }, [searchQuery]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Handle sorting
    const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(event.target.value as 'asc' | 'desc');
    };

    // Handle category filter
    const handleFilterByCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value || null);
    };

    // Apply sorting and filtering
    const filteredAndSortedDoctors = doctors
        .filter(doctor => selectedCategory ? doctor.category === selectedCategory : true)
        .sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

    return (
        <div className="container mx-auto py-10 pl-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Select your Expert</h1>

            <div className="flex justify-between items-center mb-6">
                {/* Search Input */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search Doctors"
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
                />

                <div className="flex items-center space-x-4">
                    {/* Sort Dropdown */}
                    <div>
                        <label className="mr-2 font-medium">Sort:</label>
                        <select
                            value={sortOrder}
                            onChange={handleSort}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
                        </select>
                    </div>

                    {/* Filter by Category */}
                    <div>
                        <label className="mr-2 font-medium">Filter:</label>
                        <select
                            value={selectedCategory || ''}
                            onChange={handleFilterByCategory}
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">All</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {filteredAndSortedDoctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-5">
                    {filteredAndSortedDoctors.map((doctor) => {
                        const imageUrl = doctor.profileImg
                            ? `${BASE_URL}/Public/${doctor.profileImg}`
                            : 'https://via.placeholder.com/150';

                        return (
                            <div
                                key={doctor._id}
                                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 flex flex-col"
                                style={{ maxWidth: '250px' }}
                            >
                                <div className="relative w-full h-0" style={{ paddingTop: '75%' }}>
                                    <img
                                        src={imageUrl}
                                        alt={doctor.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h2 className="text-lg font-bold mb-2">{doctor.name}</h2>
                                    <p className="text-gray-600 mb-1 text-sm">{doctor.category}</p>
                                    <p className="text-gray-600 mb-1 text-sm">Hospital: {doctor.workingHospital}</p>
                                    <button
                                        onClick={() => handleBookAppointment(doctor._id)}
                                        className="text-white px-3 py-1 rounded-lg transition-colors mt-auto text-sm bg-gradient-to-br from-teal-400 via-teal-500 to-green-300 hover:opacity-90"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-10">
                    No such Doctor found
                </div>
            )}
        </div>
    );
}

export default SelectDoctor;
