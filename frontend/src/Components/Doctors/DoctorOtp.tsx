import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../Config/baseURL';

interface LocationState {
    email: string;
}

const DoctorOtp: React.FC = () => {
    const [timer, setTimer] = useState<number>(60);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state as LocationState;

    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [timer]);

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (value && !/^\d$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 0);
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace') {
            event.preventDefault();
            const newOtp = [...otp];

            if (otp[index]) {
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                newOtp[index - 1] = '';
                setOtp(newOtp);
                setTimeout(() => {
                    inputRefs.current[index - 1]?.focus();
                }, 0);
            }
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData('text/plain').slice(0, 4);

        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            pastedData.split('').forEach((digit, idx) => {
                if (idx < 4) {
                    newOtp[idx] = digit;
                }
            });
            setOtp(newOtp);

            const nextIndex = Math.min(pastedData.length, 3);
            setTimeout(() => {
                inputRefs.current[nextIndex]?.focus();
            }, 0);
        }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.select();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const otpString = otp.join('');

        if (otpString.length < 4) {
            toast.warning('Please enter the complete OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/doctor/verify-otp`, { email: email, otp: otpString });

            if (response.data.success) {
                Swal.fire({
                    title: 'Verification Successful!',
                    text: 'If the admin panel accepts your request, then only you will be a doctor of MedCare.',
                    icon: 'info',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#14b8a6'
                }).then(() => {
                    navigate('/');
                });
            } else {
                Swal.fire({
                    title: 'Invalid OTP!',
                    text: 'Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#14b8a6'
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResentOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/doctor/resend-otp`, { email });
            if (response.data.success) {
                toast.success('Resent OTP sent to mail');
                setOtp(['', '', '', '']);
                setTimer(60);
                setTimeout(() => {
                    inputRefs.current[0]?.focus();
                }, 0);
            } else {
                toast.error(response.data.message || 'Failed to resend OTP. Please try again.');
            }
        } catch (error) {
            toast.error('Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Desktop Layout */}
            <div className="hidden lg:flex relative w-full">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
                />

                {/* Left Side - Info */}
                <div className="w-1/2 p-12 xl:p-16 flex flex-col justify-center items-start text-white relative z-10">
                    <div className="space-y-6">
                        <h1 className="text-4xl xl:text-5xl font-bold">
                            Verify Your <br />
                            <strong className="text-teal-700">Email</strong>
                        </h1>
                        <p className="text-base xl:text-lg">
                            Enter the 4-digit OTP you have received in your email to complete verification.
                        </p>
                    </div>
                </div>

                {/* Right Side - OTP Form */}
                <div className="w-1/2 flex justify-center items-center z-10 p-8">
                    <div className="bg-white p-8 xl:p-12 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl xl:text-3xl font-bold text-center mb-6 xl:mb-8">OTP Verification</h2>
                        <p className="text-center text-gray-600 mb-6">Enter the 4-digit OTP sent to your email</p>

                        <div className="flex justify-center gap-3 mb-6">
                            {[...Array(4)].map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={otp[index]}
                                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none focus:border-teal-500"
                                    onChange={(e) => handleInputChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    onFocus={handleFocus}
                                    ref={(el) => inputRefs.current[index] = el}
                                    autoComplete="off"
                                />
                            ))}
                        </div>

                        <div className="text-center text-gray-600 mb-6">
                            {timer > 0 ? (
                                <p className="font-medium">00:{timer < 10 ? `0${timer}` : timer}</p>
                            ) : (
                                <p className="text-teal-500 hover:underline cursor-pointer font-medium" onClick={handleResentOtp}>
                                    Resend OTP?
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${loading ? 'bg-teal-400 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Verify'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile & Tablet Layout */}
            <div className="lg:hidden w-full flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-green-300">
                {/* Header */}
                <div className="p-6 sm:p-8 md:p-10 text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        Verify Your <br />
                        <strong className="text-teal-700">Email</strong>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg">
                        Enter the 4-digit OTP you have received in your email to complete verification.
                    </p>
                </div>

                {/* OTP Form */}
                <div className="flex-grow flex items-start justify-center p-4 sm:p-6 md:p-8">
                    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">OTP Verification</h2>
                        <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
                            Enter the 4-digit OTP sent to your email
                        </p>

                        <div className="flex justify-center gap-3 mb-6">
                            {[...Array(4)].map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={otp[index]}
                                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none focus:border-teal-500"
                                    onChange={(e) => handleInputChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    onFocus={handleFocus}
                                    ref={(el) => inputRefs.current[index] = el}
                                    autoComplete="off"
                                />
                            ))}
                        </div>

                        <div className="text-center text-gray-600 mb-6">
                            {timer > 0 ? (
                                <p className="font-medium">00:{timer < 10 ? `0${timer}` : timer}</p>
                            ) : (
                                <p className="text-teal-500 hover:underline cursor-pointer font-medium" onClick={handleResentOtp}>
                                    Resend OTP?
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`w-full bg-teal-500 text-white py-3 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium ${loading ? 'bg-teal-400 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Verify'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorOtp;