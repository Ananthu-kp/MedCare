import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'sonner';
import { BASE_URL } from '../../Config/baseURL';

function DoctorLoginPage() {
    const navigate = useNavigate();
    const isAuthenticated = !!sessionStorage.getItem('doctorToken');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/doctor', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is Required'),
            password: Yup.string().required('Password is Required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await axios.post(`${BASE_URL}/doctor/login`, values);
                if (response.data.success) {
                    sessionStorage.setItem('doctorToken', response.data.accessToken);
                    sessionStorage.setItem('doctorRefreshToken', response.data.refreshToken);
                    navigate('/doctor', { state: { message: "Login successfully" } });
                } else {
                    toast.error('Invalid email or password');
                }
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    toast.error('Invalid credentials');
                } else if (error.response?.status === 403) {
                    toast.error("Your account has been blocked");
                } else {
                    toast.error("Something went wrong!");
                }
            }
            setSubmitting(false);
        },
    });

    return !isAuthenticated ? (
        <div className="min-h-screen flex overflow-hidden">
            {/* Desktop Layout */}
            <div className="hidden lg:flex relative w-full">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
                />

                {/* Left Side - Welcome Section */}
                <div className="w-1/2 p-12 xl:p-16 flex flex-col justify-between items-start text-white relative z-10">
                    <div className="space-y-6">
                        <h1 className="text-4xl xl:text-5xl font-bold">
                            Welcome Back <br />Doctor
                        </h1>
                        <p className="text-base xl:text-lg">
                            Enter your Email address and Password to Enter <strong>MEDCARE</strong>
                        </p>
                    </div>

                    <div className="relative flex-grow flex items-end">
                        <img
                            src="../../../src/assets/images/doclogin.png"
                            alt="Doctor"
                            className="w-72 xl:w-96 h-auto"
                            style={{
                                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
                            }}
                        />
                    </div>
                </div>

                {/* Right Side - Form Section */}
                <div className="w-1/2 flex justify-center items-center z-10 p-8">
                    <div className="bg-white p-8 xl:p-12 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl xl:text-3xl font-bold text-center mb-6 xl:mb-8">Login</h2>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder='Enter your email'
                                    {...formik.getFieldProps('email')}
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                ) : null}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    placeholder='Enter your password'
                                    {...formik.getFieldProps('password')}
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                ) : null}
                            </div>

                            <div className="text-right mb-4">
                                <Link to={'/doctor/forgot-password'}>
                                    <p className='text-sm text-teal-500 hover:underline'>Forgot Password</p>
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                            >
                                {formik.isSubmitting ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="text-center mt-6">
                                <Link to={"/doctor/register"}>
                                    <p className="text-gray-700">
                                        Don't have an account? <span className="text-teal-500 hover:underline">Register</span>
                                    </p>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Mobile & Tablet Layout */}
            <div className="lg:hidden w-full flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-green-300">
                {/* Header Section */}
                <div className="p-6 sm:p-8 md:p-10 text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        Welcome Back <br />Doctor
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg">
                        Enter your Email address and Password to Enter <strong>MEDCARE</strong>
                    </p>
                </div>

                {/* Form Section */}
                <div className="flex-grow flex items-start justify-center p-4 sm:p-6 md:p-8">
                    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Login</h2>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder='Enter your email'
                                    {...formik.getFieldProps('email')}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-base"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                ) : null}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    placeholder='Enter your password'
                                    {...formik.getFieldProps('password')}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-base"
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                ) : null}
                            </div>

                            <div className="text-right mb-4">
                                <Link to={'/doctor/forgot-password'}>
                                    <p className='text-sm text-teal-500 hover:underline'>Forgot Password</p>
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium"
                            >
                                {formik.isSubmitting ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="text-center mt-6">
                                <Link to={"/doctor/register"}>
                                    <p className="text-gray-700 text-sm sm:text-base">
                                        Don't have an account? <span className="text-teal-500 hover:underline font-medium">Register</span>
                                    </p>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default DoctorLoginPage;