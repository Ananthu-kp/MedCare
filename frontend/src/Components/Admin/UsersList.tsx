import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';

// Define the types for the user data
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
}

const UsersList: React.FC = () => {
  const [usersArray, setUsersArray] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminAxiosInstance.get(`/admin/users`)
      .then(response => setUsersArray(response.data))
      .catch((error: AxiosError) => {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
      });
  }, []);

  const unblockUser = async (email: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to unblock this user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, unblock it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await adminAxiosInstance.patch(`/admin/unblockUser?email=${email}`);
        const updatedUsers = usersArray.map(user =>
          user.email === email ? { ...user, isBlocked: false } : user
        );
        setUsersArray(updatedUsers);
        toast.success('User unblocked successfully');
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

  const blockUser = async (email: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to block this user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, block it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await adminAxiosInstance.patch(`/admin/blockUser?email=${email}`);
        const updatedUsers = usersArray.map(user =>
          user.email === email ? { ...user, isBlocked: true } : user
        );
        setUsersArray(updatedUsers);
        toast.success('User blocked successfully');
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
      <h1 className="text-3xl font-bold mb-6 text-center">Users List</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg table-fixed">
          <thead>
            <tr className="bg-gray-200 text-gray-800 border-b border-gray-300">
              <th className="py-3 px-4 text-left w-12">No</th>
              <th className="py-3 px-4 text-left w-32">Name</th>
              <th className="py-3 px-4 text-left w-64">Email</th>
              <th className="py-3 px-4 text-left w-32">Phone</th>
              <th className="py-3 px-4 text-left w-24">Status</th>
              <th className="py-3 px-4 text-left w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {usersArray.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-gray-500 text-center">
                  No users available
                </td>
              </tr>
            ) : (
              usersArray.map((user, index) => (
                <tr key={user._id} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{index + 1}</td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {user.isBlocked ? (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-400 transition duration-300"
                        onClick={() => unblockUser(user.email)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-400 transition duration-300"
                        onClick={() => blockUser(user.email)}
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

export default UsersList;
