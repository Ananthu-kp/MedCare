import { ErrorMessage, Field, Formik, Form } from 'formik';
import React, { useRef, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { useNavigate } from 'react-router-dom';
import forgotPassImage from '../../assets/images/forgotpass.png';

function UserForgotPass() {
    const [timer, setTimer] = useState<number>(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otp, setOtp] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedOtpTime = localStorage.getItem('otpTimestamp');
        const storedTimer = localStorage.getItem('otpTimer');
        const storedEmail = localStorage.getItem('email');

        if (storedOtpTime && storedTimer && storedEmail) {
            const elapsedTime = Math.floor((Date.now() - parseInt(storedOtpTime, 10)) / 1000);
            const remainingTime = parseInt(storedTimer, 10) - elapsedTime;

            if (remainingTime > 0) {
                setTimer(remainingTime);
                setIsOtpSent(true);
                setEmail(storedEmail);
            } else {
                localStorage.removeItem('otpTimer');
                localStorage.removeItem('otpTimestamp');
            }
        }
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prev) => prev - 1);
                localStorage.setItem('otpTimer', String(timer - 1));
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [timer]);

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/[^0-9]/g, '');
        const updatedOtp = otp.split('');
        updatedOtp[index] = value;
        setOtp(updatedOtp.join(''));

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !inputRefs.current[index]?.value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmitOtpVerification = async () => {
        if (otp.length < 4) {
            toast.warn('Please enter the OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${BASE_URL}/verifyForget-otp`, { email, otp });
            if (response.data.success) {
                toast.success('OTP Verified!');
                setTimeout(() => navigate('/recover-password'), 1000);
            } else {
                toast.error(response.data.message || 'Invalid OTP');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/verifyResend-otp`, { email });
            if (response.data.success) {
                toast.success('OTP resent');
                setOtp('');
                setTimer(60);
                localStorage.setItem('otpTimer', '60');
                localStorage.setItem('otpTimestamp', String(Date.now()));
                inputRefs.current.forEach(input => input && (input.value = ''));
                inputRefs.current[0]?.focus();
            } else {
                toast.error(response.data.message || 'Failed to resend OTP');
            }
        } catch {
            toast.error('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col lg:flex-row">
            {/* Background */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
            />

            {/* Left Section */}
            <div className="w-full lg:w-1/2 px-6 py-10 lg:p-12 text-white relative z-10 flex flex-col justify-between">
                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                        Recover Your <br />
                        <span className="text-teal-700">Account</span>
                    </h1>
                    <p className="text-base sm:text-lg">
                        We will send an OTP to your registered email to recover your account.
                    </p>
                </div>

                <img
                    src={forgotPassImage}
                    alt="Forgot Password"
                    className="hidden lg:block w-80 xl:w-96 mt-10"
                />
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 flex justify-center items-center px-4 py-10 relative z-10">
                <div className="bg-white w-full sm:w-4/5 lg:w-3/4 p-6 sm:p-8 lg:p-12 rounded-lg shadow-lg">
                    <Formik
                        initialValues={{ email: '' }}
                        validate={values => {
                            const errors: { email?: string } = {};
                            if (!values.email) errors.email = 'Email is required';
                            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
                                errors.email = 'Invalid email address';
                            return errors;
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            setLoading(true);
                            try {
                                const response = await axios.post(`${BASE_URL}/forgot-password`, { email: values.email });
                                if (response.data.success) {
                                    toast.success('OTP sent to email');
                                    setEmail(values.email);
                                    setIsOtpSent(true);
                                    setTimer(60);
                                    localStorage.setItem('email', values.email);
                                    localStorage.setItem('otpTimer', '60');
                                    localStorage.setItem('otpTimestamp', String(Date.now()));
                                } else {
                                    toast.error(response.data.message || 'Email not found');
                                }
                            } catch (error: any) {
                                toast.error(error.response?.data?.message || 'Something went wrong');
                            } finally {
                                setSubmitting(false);
                                setLoading(false);
                            }
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                {/* Email */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="flex gap-2 mt-2">
                                        <Field
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || loading || isOtpSent}
                                            className="px-4 py-2 bg-teal-500 text-white rounded-lg disabled:opacity-50"
                                        >
                                            Send OTP
                                        </button>
                                    </div>
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                {/* OTP */}
                                <p className="text-center text-sm mb-3">Enter 4 digit OTP</p>

                                <div className="flex justify-center gap-3 mb-4">
                                    {[...Array(4)].map((_, i) => (
                                        <input
                                            key={i}
                                            maxLength={1}
                                            ref={el => (inputRefs.current[i] = el)}
                                            onChange={e => handleInputChange(i, e)}
                                            onKeyDown={e => handleKeyDown(i, e)}
                                            className="w-10 h-10 sm:w-12 sm:h-12 text-center border rounded-lg focus:ring-2 focus:ring-teal-500"
                                        />
                                    ))}
                                </div>

                                {/* Timer */}
                                <div className="text-center text-sm mb-4">
                                    {isOtpSent && timer > 0 ? (
                                        <span>00:{timer < 10 ? `0${timer}` : timer}</span>
                                    ) : (
                                        isOtpSent && (
                                            <span
                                                className="text-teal-500 cursor-pointer"
                                                onClick={handleResendOtp}
                                            >
                                                Resend OTP?
                                            </span>
                                        )
                                    )}
                                </div>

                                {/* Verify */}
                                <button
                                    type="button"
                                    onClick={handleSubmitOtpVerification}
                                    disabled={loading}
                                    className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Verify'}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <ToastContainer position="top-right" />
                </div>
            </div>
        </div>
    );
}

export default UserForgotPass;
