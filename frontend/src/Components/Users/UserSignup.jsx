import { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import DoctorImageSignup from '../../../src/assets/images/girl-doctor.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function UserSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!sessionStorage.getItem('userToken');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Phone number is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required')
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3002/signup', values);
      console.log('Response:', response.data);

      if (!response.data || !response.data.success) {
        console.error('Unexpected response format:', response.data);
        throw new Error('Unexpected response format');
      }

      if (response.data.success) {
        setTimeout(() => {
          toast.success("OTP sent to your email!", { autoClose: 3000 });
        }, 100)
        navigate('/otp', { state: { email: values.email } });
      } else {
        toast.error(response.data.message, { autoClose: 3000 });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error('User already exists', { autoClose: 3000 });
      } else {
        toast.error("Something went wrong!", { autoClose: 3000 });
      }
      console.error("Error:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex'>
      <ToastContainer />
      <div className='relative w-full flex'>
        <div className='absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300' style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }} />

        <div className="w-1/2 p-12 flex flex-col justify-between items-start text-white relative z-10">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold">Welcome To MEDCARE</h1>
            <p className="text-lg">
              We’re excited to help you connect with top medical personalized care.
            </p>
          </div>

          <div className="relative flex-grow flex items-end">
            <img src={DoctorImageSignup} alt="Doctor" className="w-96 h-auto" />
          </div>
        </div>

        <div className="w-1/2 flex justify-center items-center z-10">
          <div className="bg-white p-12 rounded-lg shadow-lg w-3/4">
            <h2 className="text-3xl font-bold text-center mb-8">Register</h2>

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

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <Field type="password" id="confirmPassword" name="confirmPassword" placeholder="Enter your password"
                      className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <button type="submit" className={`w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500${loading ? ' bg-teal-400 cursor-not-allowed' : ''}`}
                    disabled={loading || isSubmitting}>
                    {loading ? 'Loading...' : 'Continue'}
                  </button>

                  <div className="text-center mt-6">
                    <Link to={'/login'}><p className="text-gray-700">Already have an account?<span className="text-teal-500 hover:underline">Login</span></p></Link>
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

export default UserSignup;