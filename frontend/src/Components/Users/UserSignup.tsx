import React, { useEffect, useState } from 'react';
import {  toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import  DoctorSignupImage from '../../assets/images/girl-doctor.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BASE_URL } from '../../Config/baseURL';

// Define the type for the form values
interface FormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

function UserSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const isAuthenticated = !!sessionStorage.getItem('userToken');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Phone number is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm Password is required')
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/signup`, values);
      console.log('Response:', response.data);
  
      if (!response.data || !response.data.success) {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format');
      }
  
      if (response.data.success) {
        sessionStorage.removeItem('userToken');
  
        console.log("Navigating to OTP page...");  
        setTimeout(() => {
          toast.success("OTP sent to your email!");
        }, 100);
  
        navigate('/otp', { state: { email: values.email } });  
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error('User already exists');
      } else {
        toast.error("Something went wrong!");
      }
      console.error("Error:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className='min-h-screen flex overflow-hidden'>
      {/* Desktop Layout */}
      <div className='hidden lg:flex relative w-full'>
        <div className='absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300' style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }} />

        {/* Left Side - Welcome Section */}
        <div className="w-1/2 p-12 xl:p-16 flex flex-col justify-between items-start text-white relative z-10">
          <div className="space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold">Welcome To MEDCARE</h1>
            <p className="text-base xl:text-lg">
              We're excited to help you connect with top medical personalized care.
            </p>
          </div>

          <div className="relative flex-grow flex items-end">
            <img 
              src={DoctorSignupImage} 
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
        <div className="w-1/2 flex justify-center items-center z-10 p-8 overflow-y-auto">
          <div className="bg-white p-8 xl:p-12 rounded-lg shadow-lg w-full max-w-md my-8">
            <h2 className="text-2xl xl:text-3xl font-bold text-center mb-6 xl:mb-8">Register</h2>

            <Formik
              initialValues={{
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Field type="text" id="name" name="name" placeholder="Enter your name"
                      className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                    <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Field type="email" id="email" name="email" placeholder="Enter your email"
                      className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                    <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <Field type="text" id="phone" name="phone" placeholder="Enter your phone number"
                      className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                    <ErrorMessage name="phone" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Field type="password" id="password" name="password" placeholder="Enter your password"
                      className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                    <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <Field type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password"
                      className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <button type="submit" className={`w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors${loading ? ' bg-teal-400 cursor-not-allowed' : ''}`}
                    disabled={loading || isSubmitting}>
                    {loading ? 'Loading...' : 'Continue'}
                  </button>

                  <div className="text-center mt-6">
                    <Link to={'/login'}><p className="text-gray-700">Already have an account? <span className="text-teal-500 hover:underline">Login</span></p></Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Layout */}
      <div className='lg:hidden w-full flex flex-col min-h-screen bg-gradient-to-br from-teal-400 via-teal-500 to-green-300 overflow-y-auto'>
        {/* Header Section */}
        <div className="p-6 sm:p-8 md:p-10 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Welcome To MEDCARE</h1>
          <p className="text-sm sm:text-base md:text-lg">
            We're excited to help you connect with top medical personalized care.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex-grow flex items-start justify-center p-4 sm:p-6 md:p-8 pb-8">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Register</h2>

            <Formik
              initialValues={{
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Field type="text" id="name" name="name" placeholder="Enter your name"
                      className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-base" />
                    <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Field type="email" id="email" name="email" placeholder="Enter your email"
                      className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-base" />
                    <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <Field type="text" id="phone" name="phone" placeholder="Enter your phone number"
                      className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-base" />
                    <ErrorMessage name="phone" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Field type="password" id="password" name="password" placeholder="Enter your password"
                      className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-base" />
                    <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <Field type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password"
                      className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-base" />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <button type="submit" className={`w-full bg-teal-500 text-white py-3 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium${loading ? ' bg-teal-400 cursor-not-allowed' : ''}`}
                    disabled={loading || isSubmitting}>
                    {loading ? 'Loading...' : 'Continue'}
                  </button>

                  <div className="text-center mt-6">
                    <Link to={'/login'}>
                      <p className="text-gray-700 text-sm sm:text-base">
                        Already have an account? <span className="text-teal-500 hover:underline font-medium">Login</span>
                      </p>
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Optional decorative image for tablet */}
        <div className="hidden md:flex justify-center pb-8">
          <img 
            src={DoctorSignupImage} 
            alt="Doctor" 
            className="w-48 h-auto opacity-30"
            style={{ 
              maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default UserSignup;