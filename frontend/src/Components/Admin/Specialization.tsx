import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaSave, FaTimes } from 'react-icons/fa';
import { confirmDeletion } from '../../Utils/swalUtils';

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
        })
        setCategories(response.data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching category:', error.response?.data);
          setError('Failed to load category');
        } else {
          console.error('Unexpected error:', error);
          setError('Unexpected error occurred');
        }
      }
    }
    fetchCategory(searchQuery)
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Categories Management</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Category"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
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
                      <td className="py-3 px-4">
                        {editCategoryId === category._id ? (
                          <input
                            type="text"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Category Name"
                          />
                        ) : (
                          category.name
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editCategoryId === category._id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCategory(category._id, editCategoryName)}
                              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400 transition duration-300 mr-2 flex items-center"
                            >
                              <FaSave className="mr-2" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-400 transition duration-300 flex items-center"
                            >
                              <FaTimes className="mr-2" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditCategoryId(category._id);
                                setOriginalCategoryName(category.name);
                                setEditCategoryName(category.name);
                              }}
                              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-400 transition duration-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-400 transition duration-300"
                            >
                              Delete
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
        </div>

        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Add Category</h2>
          <Formik
            initialValues={{ name: '' }}
            validationSchema={categorySchema}
            onSubmit={(values, { resetForm }) => handleAddCategory(values, { resetForm })}
          >
            {({ errors, touched }) => (
              <Form className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                <Field
                  type="text"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  placeholder="Category Name"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 mb-2" />
                <button
                  type="submit"
                  className="text-white px-3 py-1 rounded-lg transition-colors mt-auto text-sm bg-gradient-to-br from-teal-400 via-teal-500 to-green-300 hover:opacity-90"
                >
                  Add Category
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Specialization;
