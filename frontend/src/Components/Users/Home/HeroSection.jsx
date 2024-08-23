import React from 'react';
import BannerDoctor from "../../../../src/assets/images/doctor1.png";
import { Link } from 'react-router-dom';

function HeroSection() {
    const isLoggedIn = sessionStorage.getItem('userToken')
    return (
        <section className="relative text-white py-20">
            <div
                className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300 z-[-1]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
            />
            <div className="container mx-auto flex flex-col-reverse lg:flex-row justify-between items-center px-4">
                <div className="w-full lg:w-1/2 flex-shrink-0">
                    <h2 className="text-4xl font-bold">Expert Advice Is Now Just A Call Away !!</h2>
                    <p className="mt-4 text-lg">MedCare connects you with expert doctors through easy consultations,chat etc.. <br /> Get reliable medical advice from the comfort of your home.</p>
                    <div className="mt-8 space-x-4">
                        <button className="bg-white text-gray-600 font-semibold py-2 px-6 rounded">Get Appointments</button>
                        {!isLoggedIn && (
                            <Link to="/doctor/login">  
                                <button className="border border-white py-2 px-6 rounded">Doctor Login</button>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="relative w-full lg:w-1/2 flex-shrink-0">
                    <img src={BannerDoctor} alt="Doctor" className="w-full h-auto" style={{ marginLeft: '-40%', marginTop: '50px' }} />
                    <div className="absolute top-1/4 right-0 transform -translate-x-1/2 space-y-4" style={{ marginTop: '-110px' }}>
                        <div className="bg-white bg-opacity-70 p-4 rounded-lg shadow-lg max-w-xs text-center">
                            <span className="text-2xl font-bold">15+</span>
                            <br />
                            years of experience
                        </div>
                        <div className="bg-white bg-opacity-70 p-4 rounded-lg shadow-lg max-w-xs text-center">
                            <span className="text-2xl font-bold">20k</span>
                            <br />
                            Doctor Specialists
                        </div>
                        <div className="bg-white bg-opacity-70 p-4 rounded-lg shadow-lg max-w-xs text-center">
                            <span className="text-2xl font-bold">100%</span>
                            <br />
                            Patient Satisfaction
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;