import React, { useRef, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';

function DoctorForgotPass() {
    const [timer, setTimer] = useState<number>(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const navigate = useNavigate();

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

    const handleSubmitOtpVerification = async () => {
        const otpString = otp.join('');

        if (otpString.length < 4) {
            toast.warn('Please enter the complete OTP');
            return;
        }

        setLoading(true);

        const storedOtp = sessionStorage.getItem('otp');
        const storedResendOtp = sessionStorage.getItem('resendotp');

        if (otpString !== storedOtp && otpString !== storedResendOtp) {
            toast.error('Invalid OTP');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/doctor/verifyDoctor-otp`, { email, otp: otpString });
            if (response.data.success) {
                toast.success('OTP Verified!');
                setTimeout(() => {
                    navigate('/doctor/recover-password');
                }, 1000);
            } else {
                toast.error(response.data.message || 'Invalid OTP');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/doctor/resendDoctor-otp`, { email });
            if (response.data.success) {
                toast.success('Resent OTP sent to email');
                setOtp(['', '', '', '']);
                setTimer(60);
                setTimeout(() => {
                    inputRefs.current[0]?.focus();
                }, 0);
                sessionStorage.setItem('resendotp', response.data.otp);
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
        <div className='min-h-screen flex overflow-hidden'>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

            {/* Desktop Layout */}
            <div className='hidden lg:flex relative w-full'>
                <div className='absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300'
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
                />

                {/* Left Side */}
                <div className='w-1/2 p-12 xl:p-16 flex flex-col justify-between items-start text-white relative z-10'>
                    <div className="space-y-6">
                        <h1 className='text-4xl xl:text-5xl font-bold'>
                            Recover Your <br /> <strong className='text-teal-700'>Account</strong>
                        </h1>
                        <p className="text-base xl:text-lg">
                            We will send an OTP to your registered email to recover your account.
                        </p>
                    </div>

                    <div className="relative flex-grow flex items-end">
                        <img
                            src={"../../../src/assets/images/forgotpass.png"}
                            alt="Forgot Password"
                            className="w-72 xl:w-96 h-auto"
                            style={{
                                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
                            }}
                        />
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-1/2 flex justify-center items-center z-10 p-8">
                    <div className="bg-white p-8 xl:p-12 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl xl:text-3xl font-bold text-center mb-6 xl:mb-8">Forgot Password</h2>
                        <Formik
                            initialValues={{ email: '' }}
                            validate={values => {
                                const errors: { email?: string } = {};
                                if (!values.email) {
                                    errors.email = 'Email is Required';
                                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                    errors.email = 'Invalid email address';
                                }
                                return errors;
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    setLoading(true);
                                    const response = await axios.post(`${BASE_URL}/doctor/forgot-password`, { email: values.email });
                                    if (response.data.success) {
                                        toast.success('OTP sent to your email');
                                        setEmail(values.email);
                                        setOtp(['', '', '', '']);
                                        setTimer(60);
                                        setIsOtpSent(true);
                                        sessionStorage.setItem('email', values.email);
                                        sessionStorage.setItem('otp', response.data.otp);
                                        setTimeout(() => {
                                            inputRefs.current[0]?.focus();
                                        }, 100);
                                    } else {
                                        toast.error(response.data.message || 'Email not found.');
                                    }
                                } catch (error: any) {
                                    toast.error(error.response?.data?.message || 'Something went wrong.');
                                } finally {
                                    setSubmitting(false);
                                    setLoading(false);
                                }
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                                        <div className="flex gap-2">
                                            <Field
                                                type="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || loading || isOtpSent}
                                                className={`px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors whitespace-nowrap ${isOtpSent ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                Send OTP
                                            </button>
                                        </div>
                                        <ErrorMessage name='email' component="div" className='text-red-600 text-sm mt-1' />
                                    </div>

                                    <div className="mb-4 text-center">
                                        <p className="text-sm text-gray-600">Enter 4 digit OTP to verify your email</p>
                                    </div>

                                    <div className="flex justify-center gap-3 mb-6">
                                        {[...Array(4)].map((_, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={otp[index]}
                                                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                                onChange={(e) => handleInputChange(index, e)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                ref={(el) => inputRefs.current[index] = el}
                                                autoComplete="off"
                                            />
                                        ))}
                                    </div>

                                    <div className="text-center text-gray-600 mb-6">
                                        {isOtpSent && timer > 0 ? (
                                            <p className="font-medium">00:{timer < 10 ? `0${timer}` : timer}</p>
                                        ) : (isOtpSent && (
                                            <p className="text-teal-500 hover:underline cursor-pointer font-medium" onClick={handleResendOtp}>
                                                Resend OTP?
                                            </p>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSubmitOtpVerification}
                                        className={`w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${loading ? 'bg-teal-400 cursor-not-allowed' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Verify'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

            {/* Mobile & Tablet Layout */}
            <div className='lg:hidden w-full flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-green-300'>
                {/* Header */}
                <div className="p-6 sm:p-8 md:p-10 text-white">
                    <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4'>
                        Recover Your <br /> <strong className='text-teal-700'>Account</strong>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg">
                        We will send an OTP to your registered email to recover your account.
                    </p>
                </div>

                {/* Form */}
                <div className="flex-grow flex items-start justify-center p-4 sm:p-6 md:p-8">
                    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Forgot Password</h2>
                        <Formik
                            initialValues={{ email: '' }}
                            validate={values => {
                                const errors: { email?: string } = {};
                                if (!values.email) {
                                    errors.email = 'Email is Required';
                                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                    errors.email = 'Invalid email address';
                                }
                                return errors;
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    setLoading(true);
                                    const response = await axios.post(`${BASE_URL}/doctor/forgot-password`, { email: values.email });
                                    if (response.data.success) {
                                        toast.success('OTP sent to your email');
                                        setEmail(values.email);
                                        setOtp(['', '', '', '']);
                                        setTimer(60);
                                        setIsOtpSent(true);
                                        sessionStorage.setItem('email', values.email);
                                        sessionStorage.setItem('otp', response.data.otp);
                                        setTimeout(() => {
                                            inputRefs.current[0]?.focus();
                                        }, 100);
                                    } else {
                                        toast.error(response.data.message || 'Email not found.');
                                    }
                                } catch (error: any) {
                                    toast.error(error.response?.data?.message || 'Something went wrong.');
                                } finally {
                                    setSubmitting(false);
                                    setLoading(false);
                                }
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                                        <Field
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-base mb-2"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || loading || isOtpSent}
                                            className={`w-full px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium ${isOtpSent ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            Send OTP
                                        </button>
                                        <ErrorMessage name='email' component="div" className='text-red-600 text-sm mt-1' />
                                    </div>

                                    <div className="mb-4 text-center">
                                        <p className="text-sm text-gray-600">Enter 4 digit OTP to verify your email</p>
                                    </div>

                                    <div className="flex justify-center gap-3 mb-6">
                                        {[...Array(4)].map((_, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={otp[index]}
                                                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                                onChange={(e) => handleInputChange(index, e)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                ref={(el) => inputRefs.current[index] = el}
                                                autoComplete="off"
                                            />
                                        ))}
                                    </div>

                                    <div className="text-center text-gray-600 mb-6">
                                        {isOtpSent && timer > 0 ? (
                                            <p className="font-medium">00:{timer < 10 ? `0${timer}` : timer}</p>
                                        ) : (isOtpSent && (
                                            <p className="text-teal-500 hover:underline cursor-pointer font-medium" onClick={handleResendOtp}>
                                                Resend OTP?
                                            </p>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSubmitOtpVerification}
                                        className={`w-full bg-teal-500 text-white py-3 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium ${loading ? 'bg-teal-400 cursor-not-allowed' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Verify'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorForgotPass;