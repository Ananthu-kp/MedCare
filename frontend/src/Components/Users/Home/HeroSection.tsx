import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../../../../src/assets/images/doctor1.png";
import { Link } from 'react-router-dom';

function HeroSection() {
    const isLoggedIn = sessionStorage.getItem('userToken');
    const navigate = useNavigate();

    const handleAppointmentClick = () => {
        if (isLoggedIn) {
            navigate('/selectDoctor');
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'You need to log in',
                text: 'Please log in to book an appointment.',
                confirmButtonText: 'Login',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
        }
    };

    return (
        <section className="relative text-white py-10 md:py-16 lg:py-20 overflow-hidden">
            {/* Background gradient */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300 z-[-1]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}
            />
            
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                {/* Mobile Layout */}
                <div className="lg:hidden">
                    {/* Text Content - Mobile */}
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
                            Expert Advice Is Now Just A Call Away !!
                        </h2>
                        <p className="text-sm sm:text-base leading-relaxed mb-6">
                            MedCare connects you with expert doctors through easy consultations, chat etc.. 
                            Get reliable medical advice from the comfort of your home.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleAppointmentClick}
                                className="bg-white text-gray-600 font-semibold py-3 px-6 rounded hover:bg-gray-50 transition-colors w-full"
                            >
                                Get Appointments
                            </button>
                            {!isLoggedIn && (
                                <Link to="/doctor/login" className="w-full">
                                    <button className="border-2 border-white py-3 px-6 rounded hover:bg-white hover:text-teal-600 transition-colors w-full">
                                        Doctor Login
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Image and Stats - Mobile */}
                    <div className="relative flex justify-center items-center">
                        {/* Doctor Image */}
                        <div className="relative w-[240px] sm:w-[280px]" style={{ 
                            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                        }}>
                            <img
                                src="/src/assets/images/doctor1.png"
                                alt="Doctor"
                                className="w-full h-auto select-none"
                            />
                        </div>

                        {/* Stat boxes - Mobile (positioned to the right) */}
                        <div className="absolute right-0 top-[10%] space-y-2 sm:space-y-3">
                            <div className="bg-white/95 backdrop-blur-sm p-2.5 sm:p-3 rounded-lg shadow-lg text-center min-w-[100px] sm:min-w-[120px]">
                                <span className="text-xl sm:text-2xl font-bold text-teal-600 block">15+</span>
                                <span className="text-gray-700 text-[10px] sm:text-xs font-medium">years of experience</span>
                            </div>
                            <div className="bg-white/95 backdrop-blur-sm p-2.5 sm:p-3 rounded-lg shadow-lg text-center min-w-[100px] sm:min-w-[120px]">
                                <span className="text-xl sm:text-2xl font-bold text-teal-600 block">20k</span>
                                <span className="text-gray-700 text-[10px] sm:text-xs font-medium">Doctor Specialists</span>
                            </div>
                            <div className="bg-white/95 backdrop-blur-sm p-2.5 sm:p-3 rounded-lg shadow-lg text-center min-w-[100px] sm:min-w-[120px]">
                                <span className="text-xl sm:text-2xl font-bold text-teal-600 block">100%</span>
                                <span className="text-gray-700 text-[10px] sm:text-xs font-medium">Patient Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex flex-row justify-between items-center relative">
                    {/* Text Content - Desktop */}
                    <div className="w-1/2 flex-shrink-0 z-10 pr-8">
                        <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
                            Expert Advice Is Now Just A Call Away !!
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed">
                            MedCare connects you with expert doctors through easy consultations, chat etc.. <br />
                            Get reliable medical advice from the comfort of your home.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleAppointmentClick}
                                className="bg-white text-gray-600 font-semibold py-3 px-6 rounded hover:bg-gray-50 transition-colors"
                            >
                                Get Appointments
                            </button>
                            {!isLoggedIn && (
                                <Link to="/doctor/login">
                                    <button className="border-2 border-white py-3 px-6 rounded hover:bg-white hover:text-teal-600 transition-colors">
                                        Doctor Login
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Image and Stats - Desktop */}
                    <div className="relative w-1/2 flex-shrink-0 flex justify-start">
                        {/* Doctor Image */}
                        <div className="relative w-[500px] xl:w-[550px] ml-[-60px] xl:ml-[-80px]">
                            <div className="relative" style={{ 
                                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
                            }}>
                                <img
                                    src="/src/assets/images/doctor1.png"
                                    alt="Doctor"
                                    className="w-full h-auto animate-doctorFloat select-none"
                                />
                            </div>
                        </div>

                        {/* Stat boxes - Desktop */}
                        <div className="absolute top-[20%] right-[40px] xl:right-[60px] space-y-4 z-20">
                            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg min-w-[160px] text-center transform hover:scale-105 transition-transform">
                                <span className="text-3xl font-bold text-teal-600 block">15+</span>
                                <span className="text-gray-700 text-sm font-medium">years of experience</span>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg min-w-[160px] text-center transform hover:scale-105 transition-transform">
                                <span className="text-3xl font-bold text-teal-600 block">20k</span>
                                <span className="text-gray-700 text-sm font-medium">Doctor Specialists</span>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg min-w-[160px] text-center transform hover:scale-105 transition-transform">
                                <span className="text-3xl font-bold text-teal-600 block">100%</span>
                                <span className="text-gray-700 text-sm font-medium">Patient Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;