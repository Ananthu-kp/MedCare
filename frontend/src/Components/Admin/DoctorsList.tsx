import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';
import { showConfirmationDialog } from '../../Utils/swalUtils';

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
        })
        setDoctorsArray(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching Doctors:', error.response?.data);
          setError('Failed to load Doctors');
        } else {
          console.error('Unexpected error:', error);
          setError('Unexpected error occurred');
        }
      }
    }
    fetchDoctors(searchQuery)
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Doctors List</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Doctors"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg table-fixed">
          <thead>
            <tr className="bg-gray-200 text-gray-800 border-b border-gray-300">
              <th className="py-3 px-4 text-left w-12">No</th>
              <th className="py-3 px-4 text-left w-32">Name</th>
              <th className="py-3 px-4 text-left w-64">Email</th>
              <th className="py-3 px-4 text-left w-32">Category</th>
              <th className="py-3 px-4 text-left w-32">Phone</th>
              {/* <th className="py-3 px-4 text-left w-24">Status</th> */}
              <th className="py-3 px-4 text-left w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctorsArray.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-gray-500 text-center">
                  No doctors available
                </td>
              </tr>
            ) : (
              doctorsArray.map((doctor, index) => (
                <tr key={doctor._id} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4">{doctor.name}</td>
                  <td className="py-3 px-4">{doctor.email}</td>
                  <td className="py-3 px-4">{doctor.category}</td>
                  <td className="py-3 px-4">{doctor.phone}</td>
                  {/* <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${doctor.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {doctor.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td> */}
                  <td className="py-3 px-4">
                    {doctor.isBlocked ? (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-400 transition duration-300"
                        onClick={() => unblockDoctor(doctor.email)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-400 transition duration-300"
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
  );
};

export default DoctorsList;
