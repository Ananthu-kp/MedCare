import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';

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
    const [showFilters, setShowFilters] = useState(false);
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

    const handleSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(event.target.value as 'asc' | 'desc');
    };

    const handleFilterByCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value || null);
    };

    const filteredAndSortedDoctors = doctors
        .filter(doctor => selectedCategory ? doctor.category === selectedCategory : true)
        .sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
                    Select Your Expert
                </h1>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                    {/* Search Bar */}
                    <div className="relative mb-4 sm:mb-0">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search doctors by name..."
                            className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm sm:text-base"
                        />
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden w-full flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                        <FiFilter />
                        <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                    </button>

                    {/* Filters - Desktop Always Visible, Mobile Toggleable */}
                    <div className={`${showFilters ? 'block' : 'hidden'} md:flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-4`}>
                        {/* Sort Dropdown */}
                        <div className="w-full sm:w-auto">
                            <label className="block sm:inline-block mb-1 sm:mb-0 sm:mr-2 font-medium text-sm sm:text-base text-gray-700">
                                Sort:
                            </label>
                            <select
                                value={sortOrder}
                                onChange={handleSort}
                                className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm sm:text-base"
                            >
                                <option value="asc">A-Z</option>
                                <option value="desc">Z-A</option>
                            </select>
                        </div>

                        {/* Filter by Category */}
                        <div className="w-full sm:w-auto">
                            <label className="block sm:inline-block mb-1 sm:mb-0 sm:mr-2 font-medium text-sm sm:text-base text-gray-700">
                                Category:
                            </label>
                            <select
                                value={selectedCategory || ''}
                                onChange={handleFilterByCategory}
                                className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm sm:text-base"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Doctors Grid */}
                {filteredAndSortedDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
                        {filteredAndSortedDoctors.map((doctor) => {
                            const imageUrl = doctor.profileImg
                                ? `${BASE_URL}/Public/${doctor.profileImg}`
                                : 'https://via.placeholder.com/150';

                            return (
                                <div
                                    key={doctor._id}
                                    className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all transform hover:scale-105 flex flex-col"
                                >
                                    {/* Image Container */}
                                    <div className="relative w-full pt-[75%] bg-gray-100">
                                        <img
                                            src={imageUrl}
                                            alt={doctor.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h2 className="text-base sm:text-lg font-bold mb-2 text-gray-800 line-clamp-1">
                                            {doctor.name}
                                        </h2>
                                        <p className="text-teal-600 font-semibold mb-1 text-xs sm:text-sm line-clamp-1">
                                            {doctor.category}
                                        </p>
                                        <p className="text-gray-600 mb-1 text-xs sm:text-sm line-clamp-1">
                                            {doctor.workingHospital}
                                        </p>
                                        <p className="text-gray-700 font-semibold mb-3 text-xs sm:text-sm">
                                            ₹{doctor.consultationfee || 'N/A'}
                                        </p>
                                        <button
                                            onClick={() => handleBookAppointment(doctor._id)}
                                            className="w-full text-white px-3 py-2 rounded-lg transition-colors mt-auto text-xs sm:text-sm font-medium bg-gradient-to-br from-teal-400 via-teal-500 to-green-300 hover:opacity-90"
                                        >
                                            Book Appointment
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 sm:py-16">
                        <p className="text-gray-500 text-base sm:text-lg">
                            No doctors found matching your criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelectDoctor;