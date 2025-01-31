import React, { useRef, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../../Config/baseURL';

interface LocationState {
    email?: string;
}

function Otp() {
    const [timer, setTimer] = useState<number>(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otp, setOtp] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const location = useLocation();
    const email = (location.state as LocationState)?.email;

    useEffect(() => {
        const storedTimer = localStorage.getItem('otpTimer');
        setTimer(storedTimer ? parseInt(storedTimer, 10) : 60);

        const intervalId = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer > 0) {
                    const updatedTimer = prevTimer - 1;
                    localStorage.setItem('otpTimer', updatedTimer.toString());
                    return updatedTimer
                } else {
                    clearInterval(intervalId);
                    localStorage.removeItem('otpTimer');
                    return 0;
                }
            })
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const updatedOtp = otp.split('');
        updatedOtp[index] = value;
        setOtp(updatedOtp.join(''));

        if (value.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !inputRefs.current[index]?.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/otp`, { email, otp });

            if (response.data.success) {
                toast.success('Successfully registered!');
                sessionStorage.setItem('otpVerified', 'true');
                setTimeout(() => navigate('/login'), 1000);
            } else {
                toast.error(response.data.message || 'Invalid OTP');
            }
        } catch (error: any) {
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResentOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/resend-otp`, { email });
            if (response.data.success) {
                toast.success('Resent OTP sent to mail');
                setOtp('');
                setTimer(60);
                inputRefs.current[0]?.focus();
            } else {
                toast.error(response.data.message || 'Failed to resend OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error', error);
            toast.error('Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }} />

            {/* Form Container */}
            <div className="relative bg-white p-12 rounded-lg shadow-lg w-full max-w-md z-10">
                <h2 className="text-3xl font-bold text-center mb-8">OTP Verification</h2>
                <p className="text-center text-gray-600 mb-6">Enter the 4-digit OTP you have received in your email</p>

                <div className="flex justify-center space-x-4 mb-6">
                    {[...Array(4)].map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            onChange={(e) => handleInputChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(el) => inputRefs.current[index] = el}
                        />
                    ))}
                </div>

                <div className="text-center text-gray-600 mb-6">
                    {timer > 0 ? (
                        <p>00:{timer < 10 ? `0${timer}` : timer}</p>
                    ) : (
                        <p className="text-teal-500 hover:underline" onClick={handleResentOtp}><u>Resend OTP?</u></p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className={`w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500${loading ? 'bg-teal-400 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Verify'}
                </button>

            </div>

            <ToastContainer />
        </div>
    );
}

export default Otp;
