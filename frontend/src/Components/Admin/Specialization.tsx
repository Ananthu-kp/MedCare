import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';

// Define the types for the category data
interface Category {
  _id: string;
  name: string;
}

const Specialization: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminAxiosInstance.get('/admin/categories')
      .then(response => setCategories(response.data))
      .catch((error: AxiosError) => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      });
  }, []);

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      await adminAxiosInstance.post('/admin/addCategory', { name: newCategoryName });
      setCategories([...categories, { _id: Date.now().toString(), name: newCategoryName }]);
      setNewCategoryName('');
      toast.success('Category added successfully');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        toast.error('Authorization failed, please login again');
      } else {
        console.error(error);
        toast.error('Something went wrong, please try again later');
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this category?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await adminAxiosInstance.delete(`/admin/deleteCategory/${id}`);
        setCategories(categories.filter(category => category._id !== id));
        toast.success('Category deleted successfully');
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
      <h1 className="text-3xl font-bold mb-6 text-center">Categories Management</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="flex gap-6">
        <div className="w-2/3">
          <h2 className="text-xl font-bold mb-4">Category List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg table-fixed">
              <thead>
                <tr className="bg-gray-200 text-gray-800 border-b border-gray-300">
                  <th className="py-3 px-4 text-left w-12">No</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 px-4 text-gray-500 text-center">
                      No categories available
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category._id} className="border-b border-gray-300 hover:bg-gray-50">
                      <td className="py-3 px-4 text-center">{index + 1}</td>
                      <td className="py-3 px-4">{category.name}</td>
                      <td className="py-3 px-4">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-400 transition duration-300"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Add Category</h2>
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Category Name"
            />
            <button
              onClick={handleAddCategory}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400 transition duration-300"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specialization;
