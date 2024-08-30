import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BASE_URL } from '../../Config/baseURL';

function LoginAdmin() {
    const navigate = useNavigate();
    const isAuthenticated = !!sessionStorage.getItem('adminToken');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required!'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters long!')
            .required('Password is required!')
    });

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        console.log('Login form submitted:', values);
        try {
            const response = await axios.post(`${BASE_URL}/admin/login`, values);

            console.log('Response data:', response.data);

            if (response.data.token) {
                console.log('Login successful:', response.data);
                toast.success("Login successful!");
                sessionStorage.setItem("adminToken", response.data.token);
                setTimeout(() => {
                    navigate('/admin');
                }, 1000);
            } else {
                console.log('Login failed:', response); 
                toast.error("Invalid credentials");
            }
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                toast.error("Invalid credentials");
            } else {
                toast.error("Something went wrong!");
            }
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-8">Admin Login</h2>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <Field
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default LoginAdmin;
