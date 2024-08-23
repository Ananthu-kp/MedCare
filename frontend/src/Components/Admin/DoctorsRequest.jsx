import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DoctorsRequest() {
    const [doctorsArray, setDoctorsArray] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3002/admin/doctors')
            .then(response => setDoctorsArray(response.data))
            .catch(error => {
                console.error('Error fetching doctor requests:', error);
                setError('Failed to load doctor requests');
            });
    }, []);

    const verifyDoctor = async (email) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to verify this doctor?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, verify!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                await axios.patch(`http://localhost:3002/admin/verify-doctor`, null, { params: { email } });
                const updatedDoctors = doctorsArray.map(doctor =>
                    doctor.email === email ? { ...doctor, isVerified: true } : doctor
                );
                setDoctorsArray(updatedDoctors);
                toast.success('Doctor verified successfully', { autoClose: 1000 });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const rejectDoctor = async (email) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to reject this doctor?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, reject!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:3002/admin/reject-doctor`, { params: { email } });
                const updatedDoctors = doctorsArray.filter(doctor => doctor.email !== email);
                setDoctorsArray(updatedDoctors);
                toast.success('Doctor rejected and removed successfully', { autoClose: 1000 });
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error) => {
        if (error.response && error.response.status === 401) {
            toast.error('Authorization failed, please login again', { autoClose: 1000 });
        } else {
            console.error(error);
            toast.error('Something went wrong, please try again later', { autoClose: 1000 });
        }
    };

    const hasPendingDoctors = doctorsArray.some(doctor => !doctor.isVerified);

    return (
        <div className="container mx-auto p-6">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6 text-center">Doctors Request</h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg table-fixed">
                    <thead>
                        <tr className="bg-gray-200 text-gray-800 border-b border-gray-300">
                            <th className="py-3 px-4 text-left w-12">No</th>
                            <th className="py-3 px-4 text-left w-32">Name</th>
                            <th className="py-3 px-4 text-left w-64">Email</th>
                            <th className="py-3 px-4 text-left w-32">Category</th>
                            <th className="py-3 px-4 text-left w-32">Hospital</th>
                            <th className="py-3 px-4 text-left w-20">Experience</th>
                            <th className="py-3 px-4 text-left w-24">Status</th>
                            {hasPendingDoctors && (
                                <th className="py-3 px-4 text-left w-48">Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {doctorsArray.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="py-4 px-4 text-gray-500 text-center">
                                    No doctor requests available
                                </td>
                            </tr>
                        ) : (
                            doctorsArray.map((doctor, index) => (
                                <tr key={doctor._id} className="border-b border-gray-300 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-center">{index + 1}</td>
                                    <td className="py-3 px-4">{doctor.name}</td>
                                    <td className="py-3 px-4">{doctor.email}</td>
                                    <td className="py-3 px-4">{doctor.category}</td>
                                    <td className="py-3 px-4">{doctor.workingHospital}</td>
                                    <td className="py-3 px-4">{doctor.yearsOfExperience}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${doctor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {doctor.isVerified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    {hasPendingDoctors && (
                                        <td className="py-3 px-4 flex space-x-2">
                                            {!doctor.isVerified && (
                                                <>
                                                    <button
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-400 transition duration-300"
                                                        onClick={() => verifyDoctor(doctor.email)}
                                                    >
                                                        Verify
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-400 transition duration-300"
                                                        onClick={() => rejectDoctor(doctor.email)}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
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
    );
}

export default DoctorsRequest;
