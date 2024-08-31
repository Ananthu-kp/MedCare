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
                    sessionStorage.setItem('doctorToken', response.data.token);
                   
                        navigate('/doctor', {state: {message: "Login successfully"}});
                   
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
        <div className="min-h-screen flex">
            <div className="relative w-full flex">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
                />

                <div className="w-1/2 p-12 flex flex-col justify-between items-start text-white relative z-10">
                    <div className="space-y-6 flex flex-col items-start">
                        <h1 className="text-5xl font-bold">Welcome Back <br />Doctor</h1>
                        <p className="text-lg">
                            Enter your Email address and Password to Enter <strong>MEDCARE</strong>
                        </p>
                        <img src="../../../src/assets/images/doclogin.png" alt="Doctor" className="w-[450px] h-auto mt-6" />
                    </div>
                </div>

                <div className="w-1/2 flex justify-center items-center z-10">
                    <div className="bg-white p-12 rounded-lg shadow-lg w-3/4">
                        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder='Enter your email'
                                    {...formik.getFieldProps('email')}
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-sm">{formik.errors.email}</div>
                                ) : null}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder='Enter your password'
                                    {...formik.getFieldProps('password')}
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                                ) : null}
                            </div>

                            <div className="text-right mb-4">
                                <a href="#" className="text-sm text-teal-500 hover:underline">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                {formik.isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <Link to={"/doctor/register"}>
                                <p className="text-gray-700">Don't have an account? <span className="text-teal-500 hover:underline">Register</span></p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default DoctorLoginPage;
