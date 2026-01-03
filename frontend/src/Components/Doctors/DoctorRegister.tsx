import React, { useState, useEffect } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BASE_URL } from '../../Config/baseURL';

interface DoctorRegisterFormValues {
    name: string;
    email: string;
    phone: string;
    category: string;
    experience: number;
    hospital: string;
    password: string;
    confirmPassword: string;
    certificate: File | null;
}

function DoctorRegister() {
    const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/doctor/categories`);
                if (response.data.success) {
                    setCategories(response.data.categories);
                } else {
                    setGeneralError('Error fetching categories.');
                }
            } catch (error) {
                setGeneralError('Error fetching categories.');
            }
        };

        fetchCategories();
    }, []);

    const handleButton = async (values: DoctorRegisterFormValues, { setSubmitting }: FormikHelpers<DoctorRegisterFormValues>) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('category', values.category);
        formData.append('experience', values.experience.toString());
        formData.append('hospital', values.hospital);
        formData.append('password', values.password);
        formData.append('confirmPassword', values.confirmPassword);

        if (values.certificate) {
            formData.append('certificate', values.certificate);
        }

        try {
            const response = await axios.post(`${BASE_URL}/doctor/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success('OTP sent to your email.');
                setTimeout(() => {
                    navigate('/doctor/otp', { state: { email: values.email } });
                }, 1500);
            } else {
                setGeneralError(response.data.message || 'Error registering doctor.');
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setGeneralError(error.response.data.message);
            } else {
                setGeneralError('Error registering doctor. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const formik = useFormik<DoctorRegisterFormValues>({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            category: '',
            experience: 0,
            hospital: '',
            password: '',
            confirmPassword: '',
            certificate: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits').required('Phone number is required'),
            category: Yup.string().required('Category is required'),
            experience: Yup.number().required('Experience is required').min(0, 'Experience cannot be negative'),
            hospital: Yup.string().required('Hospital is required'),
            password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Confirm Password is required'),
            certificate: Yup.mixed().required('Certificate is required'),
        }),
        onSubmit: handleButton,
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            
            formik.setFieldValue('certificate', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCertificatePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-teal-500 to-green-300 p-4 sm:p-6 md:p-8">
            <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg shadow-lg w-full max-w-4xl">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">Doctor Registration</h2>
                
                {generalError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {generalError}
                    </div>
                )}

                <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                placeholder='Enter your Name'
                                {...formik.getFieldProps('name')}
                                className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                            ) : null}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                placeholder='Enter Email'
                                {...formik.getFieldProps('email')}
                                className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                            ) : null}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                                type="text"
                                placeholder='Enter phone number'
                                {...formik.getFieldProps('phone')}
                                className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.phone && formik.errors.phone ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
                            ) : null}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
                            <select
                                {...formik.getFieldProps('category')}
                                className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.category && formik.errors.category ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
                            ) : null}
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                            <input
                                type="number"
                                placeholder='Enter years of experience'
                                {...formik.getFieldProps('experience')}
                                className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.experience && formik.errors.experience ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.experience}</p>
                            ) : null}
                        </div>

                        {/* Hospital */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Working Hospital</label>
                            <input
                                type="text"
                                placeholder='Hospital Name'
                                {...formik.getFieldProps('hospital')}
                                className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.hospital && formik.errors.hospital ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.hospital}</p>
                            ) : null}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                placeholder='Enter Password'
                                {...formik.getFieldProps('password')}
                                className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                            ) : null}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                placeholder='Confirm Password'
                                {...formik.getFieldProps('confirmPassword')}
                                className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
                            ) : null}
                        </div>

                        {/* Certificate */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Certificate</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                                className="block w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            />
                            {certificatePreview && (
                                <div className="mt-4">
                                    <img 
                                        src={certificatePreview} 
                                        alt="Certificate Preview" 
                                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg border-2 border-teal-200" 
                                    />
                                </div>
                            )}
                            {formik.touched.certificate && formik.errors.certificate ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.certificate}</p>
                            ) : null}
                        </div>
                    </div>

                    {/* Submit Button and Login Link */}
                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <Link to="/doctor/login" className="text-teal-600 hover:underline text-sm sm:text-base order-2 sm:order-1">
                            Already have an account? Login
                        </Link>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="w-full sm:w-auto bg-teal-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                        >
                            {formik.isSubmitting ? 'Submitting...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DoctorRegister;