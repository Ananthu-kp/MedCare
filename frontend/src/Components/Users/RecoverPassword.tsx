import { ErrorMessage, Field, Formik, Form } from 'formik';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

function RecoverPassword() {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .required('New password is required')
            .min(6, 'Password must be at least 6 characters long'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
            .required('Please confirm your password'),
    });

    const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
        setLoading(true);
        try {
            const email = localStorage.getItem('email');

            if (!email) {
                toast.error('Email is not found. Please retry the process.');
                navigate('/forgot-password');
                setLoading(false);
                return;
            }

            const response = await axios.post(`${BASE_URL}/recover-password`, {
                email,
                newPassword: values.newPassword,
            });

            if (response.data.success) {
                toast.success('Password changed successfully!');

                localStorage.removeItem('email');
                localStorage.removeItem('otpTimer');
                localStorage.removeItem('otpTimestamp');

                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                toast.error(response.data.message || 'Something went wrong.');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error while changing password. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="relative w-full flex flex-col lg:flex-row">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
                />

                {/* Left Section */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-between items-start text-white relative z-10">
                    <div className="space-y-4 sm:space-y-6">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                            Set New <br /> <strong className="text-teal-700">Password</strong>
                        </h1>
                        <p className="text-base sm:text-lg">
                            Create a new password for your account.
                        </p>
                    </div>

                    <div className="hidden lg:block relative flex-grow">
                        <img
                            src={"../../../src/assets/images/forgotpass.png"}
                            alt="Reset Password"
                            className="w-72 xl:w-96 h-auto"
                            style={{
                                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
                            }}
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full lg:w-1/2 flex justify-center items-center z-10 p-4 sm:p-6 lg:p-8">
                    <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 lg:mb-8">
                            Reset Password
                        </h2>

                        <Formik
                            initialValues={{ newPassword: '', confirmPassword: '' }}
                            validationSchema={validationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                handleSubmit(values);
                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    {/* New Password */}
                                    <div className="mb-4">
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <Field
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            placeholder="Enter new password"
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        />
                                        <ErrorMessage name="newPassword" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="mb-6">
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <Field
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Confirm your new password"
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        />
                                        <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    {/* Proceed Button */}
                                    <button
                                        type="submit"
                                        className={`w-full bg-teal-500 text-white py-3 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium ${loading ? 'bg-teal-400 cursor-not-allowed' : ''
                                            }`}
                                        disabled={isSubmitting || loading}
                                    >
                                        {loading ? 'Processing...' : 'Reset Password'}
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecoverPassword;