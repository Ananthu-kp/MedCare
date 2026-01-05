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
        email: Yup.string().email('Invalid email address').required('Email is required!'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters long!')
            .required('Password is required!')
    });

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const response = await axios.post(`${BASE_URL}/admin/login`, values);

            if (response.data.success && response.data.accessToken) {
                toast.success("Login successful!");
                sessionStorage.setItem("adminToken", response.data.accessToken);
                sessionStorage.setItem("adminRefreshToken", response.data.refreshToken);

                setTimeout(() => {
                    navigate('/admin');
                }, 1000);
            } else {
                toast.error("Invalid credentials");
            }
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                toast.error("Invalid credentials");
            } else if (error.response?.status === 403) {
                toast.error("Access denied");
            } else {
                toast.error("Something went wrong!");
            }
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-teal-500 to-green-300 p-4">
            <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
                    Admin Login
                </h2>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-teal-500 text-white py-2 sm:py-3 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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