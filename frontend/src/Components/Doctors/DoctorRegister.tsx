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
            console.error("Error response:", error.response);
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
            phone: Yup.string().required('Phone number is required'),
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
            formik.setFieldValue('certificate', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCertificatePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-teal-500 to-green-300">
            <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 lg:w-1/2">
                <h2 className="text-3xl font-bold text-center mb-8">Register</h2>
                {generalError && <p className="text-red-500 text-center mb-4">{generalError}</p>}
                <form encType="multipart/form-data" onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder='Enter your Name'
                                {...formik.getFieldProps('name')}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.name && formik.errors.name ? <p className="text-red-500">{formik.errors.name}</p> : null}
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                placeholder='Enter phone number'
                                {...formik.getFieldProps('phone')}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.phone && formik.errors.phone ? <p className="text-red-500">{formik.errors.phone}</p> : null}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder='Enter Email'
                                {...formik.getFieldProps('email')}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.email && formik.errors.email ? <p className="text-red-500">{formik.errors.email}</p> : null}
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Select Category</label>
                            <select
                                id="category"
                                {...formik.getFieldProps('category')}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.category && formik.errors.category ? <p className="text-red-500">{formik.errors.category}</p> : null}
                        </div>
                        <div>
                            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                            <input
                                type="number"
                                id="experience"
                                placeholder='1'
                                {...formik.getFieldProps('experience')}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.experience && formik.errors.experience ? <p className="text-red-500">{formik.errors.experience}</p> : null}
                        </div>
                        <div>
                            <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">Working Hospital</label>
                            <input
                                type="text"
                                id="hospital"
                                placeholder='Hospital Name'
                                {...formik.getFieldProps('hospital')}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.hospital && formik.errors.hospital ? <p className="text-red-500">{formik.errors.hospital}</p> : null}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder='Enter Password'
                                {...formik.getFieldProps('password')}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.password && formik.errors.password ? <p className="text-red-500">{formik.errors.password}</p> : null}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder='Confirm Password'
                                {...formik.getFieldProps('confirmPassword')}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? <p className="text-red-500">{formik.errors.confirmPassword}</p> : null}
                        </div>
                        <div>
                            <label htmlFor="certificate" className="block text-sm font-medium text-gray-700">Certificate</label>
                            <input
                                type="file"
                                id="certificate"
                                onChange={handleFileChange}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                            {certificatePreview && <img src={certificatePreview} alt="Certificate Preview" className="mt-2 w-32 h-32 object-cover" />}
                            {formik.touched.certificate && formik.errors.certificate ? <p className="text-red-500">{formik.errors.certificate}</p> : null}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <Link to="/doctor/login" className="text-teal-600 hover:underline">Already have an account? Login</Link>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
