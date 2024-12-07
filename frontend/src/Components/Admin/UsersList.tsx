import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../Utils/swalUtils';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async (query: string = '') => {
      try {
        const response = await adminAxiosInstance.get<User[]>('/admin/users', {
          params: { name: query },
        });
        setUsersArray(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching users:', error.response?.data);
          setError('Failed to load users');
        } else {
          console.error('Unexpected error:', error);
          setError('Unexpected error occurred');
        }
      }
    };

    fetchUsers(searchQuery);
  }, [searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const unblockUser = async (email: string) => {
    try {
      const isConfirmed = await showConfirmationAlert('unblock');
      if (!isConfirmed) return;

      await adminAxiosInstance.patch(`/admin/unblockUser?email=${email}`);
      setUsersArray((prev) =>
        prev.map((user) => (user.email === email ? { ...user, isBlocked: false } : user))
      );

      showSuccessAlert('User unblocked successfully');
    } catch (error) {
      console.error(error);
      showErrorAlert('Something went wrong, please try again later');
    }
  };

  const blockUser = async (email: string) => {
    try {
      const isConfirmed = await showConfirmationAlert('block');
      if (!isConfirmed) return;

      await adminAxiosInstance.patch(`/admin/blockUser?email=${email}`);
      setUsersArray((prev) =>
        prev.map((user) => (user.email === email ? { ...user, isBlocked: true } : user))
      );

      showSuccessAlert('User blocked successfully');
    } catch (error) {
      console.error(error);
      showErrorAlert('Something went wrong, please try again later');
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersArray.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(usersArray.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Users List</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Users"
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
              <th className="py-3 px-4 text-left w-32">Phone</th>
              <th className="py-3 px-4 text-left w-24">Status</th>
              <th className="py-3 px-4 text-left w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-gray-500 text-center">
                  No users available
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <tr key={user._id} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="py-3 px-4 text-center">{indexOfFirstUser + index + 1}</td>
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

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <FaArrowLeft />
        </button>

        {/* Render page numbers */}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-4 py-2 rounded-full ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        <button
          className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default UsersList;
