import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { confirmDeletion } from '../../Utils/swalUtils';
import { FaSave, FaTimes } from 'react-icons/fa';

interface Category {
  _id: string;
  name: string;
}

const categorySchema = Yup.object().shape({
  name: Yup.string()
    .required('Category name is required')
    .max(50, 'Category name cannot exceed 50 characters')
});

const Specialization: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>('');
  const [originalCategoryName, setOriginalCategoryName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async (query: string = '') => {
      try {
        const response = await adminAxiosInstance.get<Category[]>('/admin/categories', {
          params: { name: query },
        });
        setCategories(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching category:', error.response?.data);
          setError('Failed to load category');
        } else {
          console.error('Unexpected error:', error);
          setError('Unexpected error occurred');
        }
      }
    };
    fetchCategory(searchQuery);
  }, [searchQuery]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAddCategory = async (values: { name: string }, { resetForm }: any) => {
    try {
      const newCategoryName = values.name.trim().toLowerCase();
      const existingCategory = categories.find(category =>
        category.name.trim().toLowerCase() === newCategoryName
      );

      if (existingCategory) {
        toast.error('Category already exists');
        return;
      }

      const { data } = await adminAxiosInstance.post('/admin/addCategory', { name: values.name });
      setCategories([...categories, data]);
      resetForm();
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

  const handleEditCategory = async (id: string, name: string) => {
    if (name.trim() === '') {
      toast.error('Category name cannot be empty');
      return;
    }
    if (name.length > 50) {
      toast.error('Category name cannot exceed 50 characters');
      return;
    }

    try {
      const newCategoryName = name.trim().toLowerCase();
      const existingCategory = categories.find(category =>
        category.name.trim().toLowerCase() === newCategoryName && category._id !== id
      );

      if (existingCategory) {
        toast.error('Category name already exists');
        return;
      }

      await adminAxiosInstance.patch(`/admin/editCategory/${id}`, { name });
      const updatedCategories = categories.map(category =>
        category._id === id ? { ...category, name } : category
      );
      setCategories(updatedCategories);
      setEditCategoryId(null);
      toast.success('Category updated successfully');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        toast.error('Authorization failed, please login again');
      } else {
        console.error(error);
        toast.error('Something went wrong, please try again later');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditCategoryId(null);
    setEditCategoryName(originalCategoryName);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const isConfirmed = await confirmDeletion('Do you want to delete this category?');
      if (isConfirmed) {
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">
          Categories Management
        </h1>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm sm:text-base"
          />
        </div>

        {error && <p className="text-red-500 mb-4 text-center text-sm sm:text-base">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Category List</h2>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-200 text-gray-800 border-b border-gray-300">
                    <th className="py-3 px-4 text-left w-16">No</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left w-40">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 px-4 text-gray-500 text-center">
                        No categories available
                      </td>
                    </tr>
                  ) : (
                    categories.map((category, index) => (
                      <tr key={category._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                        <td className="py-3 px-4">
                          {editCategoryId === category._id ? (
                            <input
                              type="text"
                              value={editCategoryName}
                              onChange={(e) => setEditCategoryName(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                              placeholder="Category Name"
                            />
                          ) : (
                            <span className="font-medium text-gray-800">{category.name}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editCategoryId === category._id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCategory(category._id, editCategoryName)}
                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                                title="Save"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditCategoryId(category._id);
                                  setOriginalCategoryName(category.name);
                                  setEditCategoryName(category.name);
                                }}
                                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                                title="Edit"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category._id)}
                                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {categories.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                  No categories available
                </div>
              ) : (
                categories.map((category, index) => (
                  <div key={category._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Category #{index + 1}</p>
                        {editCategoryId === category._id ? (
                          <input
                            type="text"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            placeholder="Category Name"
                          />
                        ) : (
                          <h3 className="font-semibold text-gray-800 text-lg">{category.name}</h3>
                        )}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      {editCategoryId === category._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCategory(category._id, editCategoryName)}
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <FaSave /> Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <FaTimes /> Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditCategoryId(category._id);
                              setOriginalCategoryName(category.name);
                              setEditCategoryName(category.name);
                            }}
                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <FiEdit2 /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Category Form */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Add Category</h2>
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-20">
              <Formik
                initialValues={{ name: '' }}
                validationSchema={categorySchema}
                onSubmit={(values, { resetForm }) => handleAddCategory(values, { resetForm })}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="Enter category name"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-medium bg-gradient-to-br from-teal-400 via-teal-500 to-green-300 hover:opacity-90"
                    >
                      Add Category
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specialization;