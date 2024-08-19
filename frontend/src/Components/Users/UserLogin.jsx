import { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GoogleIcon from '../../../public/svgs/GoogleIcon';
import NurseLogin from "../../../src/assets/images/nurse.png";
import { Link } from 'react-router-dom';
import axios from "axios";

function UserLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const validateForm = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email) {
            toast.error("Email is required!", { autoClose: 3000 });
            return false;
        } else if (!emailRegex.test(email)) {
            toast.error("Invalid email format!", { autoClose: 3000 });
            return false;
        } else if (!password) {
            toast.error("Password is required!", { autoClose: 3000 });
            return false;
        } else if (password.length < 6) {
            toast.error("Password must be at least 6 characters long!", { autoClose: 3000 });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await axios.post('http://localhost:3002/login', { email, password });

                if (response.data.success) {
                    toast.success("Login successful!");
                    // Redirect to dashboard or home page
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error("Something went wrong!");
            }
        }
    };

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
                        <img src={NurseLogin} alt="Doctor" className="w-96 h-auto" />
                    </div>
                </div>

                <div className="w-1/2 flex justify-center items-center z-10">
                    <div className="bg-white p-12 rounded-lg shadow-lg w-3/4">
                        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                                <Link to={"/signup"}><p className="text-gray-700">Don't have an account? <span className="text-teal-500 hover:underline">Register</span></p></Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLogin;
