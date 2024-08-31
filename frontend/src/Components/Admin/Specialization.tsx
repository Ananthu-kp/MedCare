import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminAxiosInstance.get('/admin/categories')
      .then(response => setCategories(response.data))
      .catch((error: AxiosError) => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      });
  }, []);

  const handleAddCategory = async (values: { name: string }, { resetForm }: any) => {
    try {
      const existingCategory = categories.find(category => category.name === values.name);
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
      const existingCategory = categories.find(category => category.name === name && category._id !== id);
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
                          <button
                            onClick={() => handleEditCategory(category._id, editCategoryName)}
                            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400 transition duration-300 mr-2"
                          >
                            Save
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditCategoryId(category._id);
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
                  className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-400 transition duration-300"
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