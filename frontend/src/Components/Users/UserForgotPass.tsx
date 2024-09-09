import { ErrorMessage, Field, Formik, Form } from 'formik';
import React, { useRef, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { useNavigate } from 'react-router-dom';

function UserForgotPass() {
    const [timer, setTimer] = useState<number>(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otp, setOtp] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const navigate = useNavigate()


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

    const handleSubmitOtpVerification = async () => {
        setLoading(true);

        if (otp.length < 4) {
            toast.warn('Please enter the OTP');
            setLoading(false);
            return;
        }

        const storedOtp = sessionStorage.getItem('otp')
        const storedresendOtp = sessionStorage.getItem('resendotp')

        if (otp !== storedOtp && otp !== storedresendOtp) {
            toast.error('Invalid OTP');
            setLoading(false);
            return
        }
        try {
            const response = await axios.post(`${BASE_URL}/verifyForget-otp`, { email, otp });
            if (response.data.success) {
                toast.success('OTP Verified!');
                setTimeout(() => {
                    navigate('/recover-password')
                }, 1000)
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
            const response = await axios.post(`${BASE_URL}/verifyResend-otp`, { email });
            if (response.data.success) {
                toast.success('Resent OTP sent to email');
                setOtp('');
                setTimer(60);
                inputRefs.current[0]?.focus();
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
        <div className='min-h-screen flex'>
            <div className='relative w-full flex'>
                <div className='absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300'
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
                />

                <div className='w-1/2 p-12 flex flex-col justify-between items-start text-white relative z-10'>
                    <div className="space-y-6">
                        <h1 className='text-5xl font-bold'>Recover Your <br /> <strong className='text-teal-700'>Account</strong></h1>
                        <p className="text-lg">
                            We will send an OTP to your registered email <br />
                            to recover your account.
                        </p>
                    </div>

                    <div className="relative flex-grow">
                        <img src={"../../../src/assets/images/forgotpass.png"} alt="Doctor" className="w-96 h-auto" />
                    </div>
                </div>

                <div className="w-1/2 flex justify-center items-center z-10">
                    <div className="bg-white p-12 rounded-lg shadow-lg w-3/4">
                        <Formik
                            initialValues={{ email: '' }}
                            validate={values => {
                                const errors: { email?: string } = {};
                                if (!values.email) {
                                    errors.email = 'Email is Required';
                                } else if (
                                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                ) {
                                    errors.email = 'Invalid email address';
                                }
                                return errors;
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    setLoading(true);
                                    const response = await axios.post(`${BASE_URL}/forgot-password`, { email: values.email });
                                    if (response.data.success) {
                                        toast.success('OTP sent to your email');
                                        setEmail(values.email);
                                        setOtp('');
                                        setTimer(60);
                                        setIsOtpSent(true);

                                        sessionStorage.setItem('email', values.email);

                                        sessionStorage.setItem('otp', response.data.otp); // store the otp

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
                                    <div className='mb-4 relative'>
                                        <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                                            Email
                                        </label>
                                        <div className="flex items-center">
                                            <Field
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || loading || isOtpSent}
                                                className={`ml-2 mt-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 ${isOtpSent ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                Send OTP
                                            </button>
                                        </div>
                                        <ErrorMessage name='email' component="div" className='text-red-600 text-sm mt-1' />
                                    </div>

                                    {/* OTP input fields */}
                                    <div className="mb-4 text-center">
                                        <p className="text-sm">Enter 4 digit OTP to verify your email</p>
                                    </div>
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

                                    {/* OTP Timer */}
                                    <div className="text-center text-gray-600 mb-6">
                                        {isOtpSent && timer > 0 ? (
                                            <p>00:{timer < 10 ? `0${timer}` : timer}</p>
                                        ) : (isOtpSent && (
                                            <p className="text-teal-500 hover:underline cursor-pointer" onClick={handleResendOtp}>
                                                <u>Resend OTP?</u>
                                            </p>
                                        )
                                        )}
                                    </div>

                                    {/* Verify Button */}
                                    <button
                                        type="button"
                                        onClick={handleSubmitOtpVerification}
                                        className={`w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 ${loading ? 'bg-teal-400 cursor-not-allowed' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Verify'}
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        {/* Ensure the ToastContainer is in the correct place */}
                        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserForgotPass;
