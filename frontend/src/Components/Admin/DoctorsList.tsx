import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';
import { showConfirmationDialog } from '../../Utils/swalUtils';
import { FiSearch } from 'react-icons/fi';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  category: string;
  phone: string;
  isBlocked: boolean;
}

const DoctorsList: React.FC = () => {
  const [doctorsArray, setDoctorsArray] = useState<Doctor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchDoctors = async (query: string = '') => {
      try {
        const response = await adminAxiosInstance.get<Doctor[]>(`/admin/doctors`, {
          params: { name: query },
        });
        setDoctorsArray(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching Doctors:', error.response?.data);
          setError('Failed to load Doctors');
        } else {
          console.error('Unexpected error:', error);
          setError('Unexpected error occurred');
        }
      }
    };
    fetchDoctors(searchQuery);
  }, [searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const unblockDoctor = async (email: string) => {
    try {
      const isConfirmed = await showConfirmationDialog(
        'Are you sure?',
        'Do you want to unblock this doctor?',
        'Yes, unblock it!'
      );

      if (isConfirmed) {
        await adminAxiosInstance.patch(`/admin/unblock-doctor?email=${email}`);
        const updatedDoctors = doctorsArray.map((doctor) =>
          doctor.email === email ? { ...doctor, isBlocked: false } : doctor
        );
        setDoctorsArray(updatedDoctors);
        toast.success('Doctor unblocked successfully');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        toast.error('Authorization failed, please login again');
      } else {
        console.error(error);
        toast.error('Something went wrong, please try again later');
      }
    }
  };

  const blockDoctor = async (email: string) => {
    try {
      const isConfirmed = await showConfirmationDialog(
        'Are you sure?',
        'Do you want to block this doctor?',
        'Yes, block it!'
      );

      if (isConfirmed) {
        await adminAxiosInstance.patch(`/admin/block-doctor?email=${email}`);
        const updatedDoctors = doctorsArray.map((doctor) =>
          doctor.email === email ? { ...doctor, isBlocked: true } : doctor
        );
        setDoctorsArray(updatedDoctors);
        toast.success('Doctor blocked successfully');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        toast.error('Authorization failed, please login again');
      } else {
        console.error(error);
        toast.error('Something went wrong, please try again later');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">Doctors Management</h1>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={searchQuery}
            onChange={handleSearch}
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
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {doctorsArray.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 px-4 text-gray-500 text-center">
                      No doctors available
                    </td>
                  </tr>
                ) : (
                  doctorsArray.map((doctor, index) => (
                    <tr key={doctor._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{doctor.name}</td>
                      <td className="py-3 px-4 text-gray-600">{doctor.email}</td>
                      <td className="py-3 px-4 text-gray-600">{doctor.category}</td>
                      <td className="py-3 px-4 text-gray-600">{doctor.phone}</td>
                      <td className="py-3 px-4">
                        {doctor.isBlocked ? (
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                            onClick={() => unblockDoctor(doctor.email)}
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                            onClick={() => blockDoctor(doctor.email)}
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {doctorsArray.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No doctors available
            </div>
          ) : (
            doctorsArray.map((doctor, index) => (
              <div key={doctor._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Doctor #{index + 1}</p>
                    <h3 className="font-semibold text-gray-800 text-lg">{doctor.name}</h3>
                    <p className="text-sm text-teal-600 font-medium">{doctor.category}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Email:</span> {doctor.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Phone:</span> {doctor.phone}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  {doctor.isBlocked ? (
                    <button
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      onClick={() => unblockDoctor(doctor.email)}
                    >
                      Unblock Doctor
                    </button>
                  ) : (
                    <button
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      onClick={() => blockDoctor(doctor.email)}
                    >
                      Block Doctor
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;