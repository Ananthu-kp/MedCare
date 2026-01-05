import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';
import { FiSearch } from 'react-icons/fi';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../../Utils/swalUtils';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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
  const usersPerPage = 10;

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
    setCurrentPage(1);
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

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">Users Management</h1>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
          <input
            type="text"
            placeholder="Search users by name..."
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
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left w-24">Status</th>
                  <th className="py-3 px-4 text-left w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 px-4 text-gray-500 text-center">
                      No users available
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-700">{indexOfFirstUser + index + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600">{user.phone}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.isBlocked ? (
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                            onClick={() => unblockUser(user.email)}
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
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

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No users available
            </div>
          ) : (
            currentUsers.map((user, index) => (
              <div key={user._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">User #{indexOfFirstUser + index + 1}</p>
                    <h3 className="font-semibold text-gray-800 text-lg">{user.name}</h3>
                  </div>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Email:</span> {user.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-700">Phone:</span> {user.phone}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  {user.isBlocked ? (
                    <button
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      onClick={() => unblockUser(user.email)}
                    >
                      Unblock User
                    </button>
                  ) : (
                    <button
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      onClick={() => blockUser(user.email)}
                    >
                      Block User
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
            <button
              className="p-2 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <FaArrowLeft className="sm:mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex gap-1 sm:gap-2">
              {getPageNumbers().map((pageNumber, index) => (
                pageNumber === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={pageNumber}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${currentPage === pageNumber
                        ? 'bg-teal-500 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    onClick={() => handlePageClick(pageNumber as number)}
                  >
                    {pageNumber}
                  </button>
                )
              ))}
            </div>

            <button
              className="p-2 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <FaArrowRight className="sm:ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;