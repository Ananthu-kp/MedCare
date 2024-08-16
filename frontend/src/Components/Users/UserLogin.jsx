import React from 'react';
import GoogleIcon from '../../../public/svgs/GoogleIcon';
import NurseLogin from "../../../src/assets/images/nurse.png";
import { Link } from 'react-router-dom';

function UserLogin() {
    return (
        <div className="min-h-screen flex">
            {/* Gradient Background */}
            <div className="relative w-full flex">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
                />

                {/* Left Section with Welcome Text */}
                <div className="w-1/2 p-12 flex flex-col justify-between items-start text-white relative z-10">
                    <div className="space-y-6">
                        <h1 className="text-5xl font-bold">Welcome Back</h1>
                        <p className="text-lg">
                            Enter your Email address and Password to Enter <strong>MEDCARE</strong>
                        </p>
                    </div>

                    <div className="relative flex-grow flex items-end">
                        <img src={NurseLogin} alt="Doctor" className="w-96 h-auto" />
                    </div>
                </div>

                {/* Right Section with Form */}
                <div className="w-1/2 flex justify-center items-center z-10">
                    <div className="bg-white p-12 rounded-lg shadow-lg w-3/4">
                        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    required
                                />
                            </div>

                            <div className="text-right mb-4">
                                <a href="#" className="text-sm text-teal-500 hover:underline">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                Login
                            </button>

                            <div className="text-center my-4 text-gray-500">OR</div>

                            <button
                                type="button"
                                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-center"
                            >
                                <GoogleIcon className="mr-2" />
                                Sign in with Google
                            </button>

                            <div className="text-center mt-6">
                                <Link to={"/signup"} ><p className="text-gray-700">You don't have an account? <span className="text-teal-500 hover:underline">Register</span></p></Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLogin;
