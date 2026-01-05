import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';
import { FiSearch } from 'react-icons/fi';

interface Doctor {
    _id: string;
    name: string;
    email: string;
    category: string;
    workingHospital: string;
    yearsOfExperience: number;
    isVerified: boolean;
}

const DoctorsRequest: React.FC = () => {
    const [doctorsArray, setDoctorsArray] = useState<Doctor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await adminAxiosInstance.get<Doctor[]>(`/admin/doctors`);
                setDoctorsArray(response.data);
            } catch (error) {
                console.error('Error fetching doctor requests:', error);
                setError('Failed to load doctor requests');
            }
        };
        fetchDoctors();
    }, []);

    const verifyDoctor = async (email: string) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to verify this doctor?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#14b8a6',
                cancelButtonColor: '#ef4444',
                confirmButtonText: 'Yes, verify!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                await adminAxiosInstance.patch(`/admin/verify-doctor`, {}, { params: { email } });
                const updatedDoctors = doctorsArray.map(doctor =>
                    doctor.email === email ? { ...doctor, isVerified: true } : doctor
                );
                setDoctorsArray(updatedDoctors);
                toast.success('Doctor verified successfully');
            }
        } catch (error) {
            handleError(error as AxiosError);
        }
    };

    const rejectDoctor = async (email: string) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to reject this doctor? This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, reject!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                await adminAxiosInstance.delete(`/admin/reject-doctor`, { params: { email } });
                const updatedDoctors = doctorsArray.filter(doctor => doctor.email !== email);
                setDoctorsArray(updatedDoctors);
                toast.success('Doctor rejected and removed successfully');
            }
        } catch (error) {
            handleError(error as AxiosError);
        }
    };

    const handleError = (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            toast.error('Authorization failed, please login again');
        } else {
            console.error(error);
            toast.error('Something went wrong, please try again later');
        }
    };

    const filteredDoctors = doctorsArray.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const hasPendingDoctors = filteredDoctors.some(doctor => !doctor.isVerified);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 pb-20 lg:pb-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">
                    Doctor Verification Requests
                </h1>

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm sm:text-base"
                    />
                </div>

                {error && <p className="text-red-500 mb-4 text-center text-sm sm:text-base">{error}</p>}

                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-200 text-gray-800 border-b border-gray-300">
                                    <th className="py-3 px-4 text-left w-16">No</th>
                                    <th className="py-3 px-4 text-left">Name</th>
                                    <th className="py-3 px-4 text-left">Email</th>
                                    <th className="py-3 px-4 text-left">Category</th>
                                    <th className="py-3 px-4 text-left">Hospital</th>
                                    <th className="py-3 px-4 text-left w-24">Experience</th>
                                    <th className="py-3 px-4 text-left w-24">Status</th>
                                    {hasPendingDoctors && (
                                        <th className="py-3 px-4 text-left w-48">Action</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDoctors.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-8 px-4 text-gray-500 text-center">
                                            No doctor requests available
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDoctors.map((doctor, index) => (
                                        <tr key={doctor._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                                            <td className="py-3 px-4 font-medium text-gray-800">{doctor.name}</td>
                                            <td className="py-3 px-4 text-gray-600">{doctor.email}</td>
                                            <td className="py-3 px-4 text-gray-600">{doctor.category}</td>
                                            <td className="py-3 px-4 text-gray-600">{doctor.workingHospital}</td>
                                            <td className="py-3 px-4 text-gray-600">{doctor.yearsOfExperience} yrs</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${doctor.isVerified
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {doctor.isVerified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            {hasPendingDoctors && (
                                                <td className="py-3 px-4">
                                                    {!doctor.isVerified && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                                                onClick={() => verifyDoctor(doctor.email)}
                                                            >
                                                                Verify
                                                            </button>
                                                            <button
                                                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                                                onClick={() => rejectDoctor(doctor.email)}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {filteredDoctors.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                            No doctor requests available
                        </div>
                    ) : (
                        filteredDoctors.map((doctor, index) => (
                            <div key={doctor._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Request #{index + 1}</p>
                                        <h3 className="font-semibold text-gray-800 text-lg">{doctor.name}</h3>
                                        <p className="text-sm text-teal-600 font-medium">{doctor.category}</p>
                                    </div>
                                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${doctor.isVerified
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {doctor.isVerified ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-medium text-gray-700">Email:</span> {doctor.email}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium text-gray-700">Hospital:</span> {doctor.workingHospital}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium text-gray-700">Experience:</span> {doctor.yearsOfExperience} years
                                    </p>
                                </div>
                                {!doctor.isVerified && (
                                    <div className="pt-3 border-t border-gray-200 flex gap-2">
                                        <button
                                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                                            onClick={() => verifyDoctor(doctor.email)}
                                        >
                                            Verify
                                        </button>
                                        <button
                                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                            onClick={() => rejectDoctor(doctor.email)}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default DoctorsRequest;