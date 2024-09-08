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
            const email = sessionStorage.getItem('email'); // get the email from session storage or state
            const response = await axios.post(`${BASE_URL}/recover-password`, {
                email,
                password: values.newPassword,
            });

            if (response.data.success) {
                toast.success('Password changed successfully!');
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
            <div className="relative w-full flex">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
                />

                <div className="w-1/2 p-12 flex flex-col justify-between items-start text-white relative z-10">
                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold">
                            Set New <br /> <strong className="text-teal-700">Password</strong>
                        </h1>
                        <p className="text-lg">
                            Create a new password for your account.
                        </p>
                    </div>

                    <div className="relative flex-grow">
                        <img
                            src={"../../../src/assets/images/forgotpass.png"}
                            alt="Reset Password"
                            className="w-96 h-auto"
                        />
                    </div>
                </div>

                <div className="w-1/2 flex justify-center items-center z-10">
                    <div className="bg-white p-12 rounded-lg shadow-lg w-3/4">
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
                                    <div className="mb-4 relative">
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <Field
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            placeholder="Enter new password"
                                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        />
                                        <ErrorMessage name="newPassword" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="mb-6 relative">
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                            Confirm Password
                                        </label>
                                        <Field
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Confirm your new password"
                                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        />
                                        <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    {/* Proceed Button */}
                                    <button
                                        type="submit"
                                        className={`w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                            loading ? 'bg-teal-400 cursor-not-allowed' : ''
                                        }`}
                                        disabled={isSubmitting || loading}
                                    >
                                        {loading ? 'Processing...' : 'Proceed'}
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
