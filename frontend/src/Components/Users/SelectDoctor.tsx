import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';

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

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/selectDoctor`);
                console.log(response.data);
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="container mx-auto py-10 pl-10">
            <h1 className="text-2xl font-bold mb-6 text-center">Select your Expert</h1>
            <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-5">
                {doctors.map((doctor) => {
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
                                <p className="text-gray-600 mb-1 text-sm">Experience: {doctor.yearsOfExperience} years</p>
                                <p className="text-gray-600 mb-2 text-sm">Consultation Fee: ₹{doctor.consultationfee || 'N/A'}</p>
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors mt-auto text-sm"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SelectDoctor;
