import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// @ts-ignore
import GoogleIcon from '../../../public/svgs/GoogleIcon';
import "../../../src/assets/images/nurse.png";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { googleLogout, useGoogleLogin } from '@react-oauth/google'


interface LoginFormValues {
    email: string;
    password: string;
}

function UserLogin() {
    const navigate = useNavigate();
    const isAuthenticated = !!sessionStorage.getItem('userToken');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format!')
            .required('Email is required!'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters long!')
            .required('Password is required!')
    });

    const handleSubmit = async (
        values: LoginFormValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, values);

            if (response.data.success) {
                toast.success("Login successful!");

                sessionStorage.setItem("userToken", response.data.accessToken);
                sessionStorage.setItem("refreshToken", response.data.refreshToken);
                sessionStorage.setItem("userDetails", JSON.stringify(response.data.userData));

                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            if (error.response?.status === 401) {
                toast.error("Invalid credentials");
            } else if (error.response?.status === 403) {
                toast.error("Your account has been blocked");
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Google Authentication
    const [user, setUser] = useState<any>(null);

    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => {
            console.error('Google login failed:', error);
            toast.error("Google login failed");
        }
    });

    useEffect(() => {
        if (user) {
            const fetchProfileAndLogin = async () => {
                try {
                    const profileResponse = await axios.get(
                        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json',
                        },
                    }
                    );

                    const profile = profileResponse.data;

                    const loginResponse = await axios.post(`${BASE_URL}/google-login`, { profile });

                    if (loginResponse.data.success) {
                        sessionStorage.setItem("userToken", loginResponse.data.accessToken);
                        sessionStorage.setItem("userDetails", JSON.stringify(loginResponse.data.userDetails));
                        toast.success("Google login successful!");
                        navigate("/");
                    } else {
                        toast.error(loginResponse.data.message);
                    }
                } catch (error: any) {
                    if (error.response?.status === 401) {
                        toast.error("Invalid credentials");
                    } else if (error.response?.status === 403) {
                        toast.error("Your account has been blocked");
                    } else {
                        toast.error("Something went wrong!");
                    }
                }
            };

            fetchProfileAndLogin();
        }
    }, [user]);

    return (
        <div className="min-h-screen flex">
            <ToastContainer />
            <div className="relative w-full flex">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
                />

                <div className="w-1/2 p-12 flex flex-col justify-between items-start text-white relative z-10">
                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold">Welcome Back</h1>
                        <p className="text-lg">
                            Enter your Email address and Password to Enter <strong>MEDCARE</strong>
                        </p>
                    </div>

                    <div className="relative flex-grow flex items-end">
                        <img src={"../../../src/assets/images/nurse.png"} alt="Doctor" className="w-96 h-auto" />
                    </div>
                </div>

                <div className="w-1/2 flex justify-center items-center z-10">
                    <div className="bg-white p-12 rounded-lg shadow-lg w-3/4">
                        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
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

                                    <div className="text-right mb-4">
                                        <a href="#" className="text-sm text-teal-500 hover:underline">Forgot password?</a>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        {isSubmitting ? 'Logging in...' : 'Login'}
                                    </button>

                                    <div className="text-center my-4 text-gray-500">OR</div>

                                    <button
                                        type="button"
                                        onClick={() => googleLogin()}
                                        className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-center"
                                    >
                                        <GoogleIcon />
                                        Sign in with Google
                                    </button>

                                    <div className="text-center mt-6">
                                        <Link to={"/signup"}>
                                            <p className="text-gray-700">Don't have an account? <span className="text-teal-500 hover:underline">Register</span></p>
                                        </Link>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLogin;
