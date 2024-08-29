import React from 'react';
import Section1Img from '../../../assets/images/Section1.jpg';
import Section2Img from '../../../assets/images/section2.jpg';


function HomeSection2() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-left mb-16">
                    <h2 className="text-3xl font-bold">
                        Why should we use <span className="text-teal-500">MEDCARE?</span>
                    </h2>
                    <p className="mt-4 text-gray-600">
                        MedCare offers a seamless way to connect with top doctors for consultations.<br />
                        With user-friendly features like appointment scheduling, secure video calls, chat.<br />
                        Be more active in your own health.
                    </p>
                </div>

                {/* Content Wrapper */}
                <div className="flex flex-col lg:flex-row items-center space-y-12 lg:space-y-0 lg:space-x-12 mb-16">
                    {/* Image and Overlay */}
                    <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative">
                            <img
                                src={Section1Img}
                                alt="Medical Team"
                                className="rounded-full"
                            />
                            <div className="absolute inset-0 rounded-full border-8 border-white"></div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 text-left">
                        <h3 className="text-2xl font-bold mb-4 text-teal-600">
                            We Are Always Ensure Best Medical Treatment For Your Health.
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Connecting you with top medical professionals for expert care and personalized consultations. MedCare allows you to easily get started with seamless online sessions, secure video appointments, and individual health solutions.
                        </p>
                        <a
                            href="#about"
                            className="inline-block bg-teal-500 text-white font-semibold py-2 px-6 rounded hover:bg-teal-600 transition"
                        >
                            More About Us
                        </a>
                    </div>
                </div>

                {/* Medcare Supplement Advocate Section */}
                <div className="flex flex-col lg:flex-row items-center space-y-12 lg:space-y-0 lg:space-x-12">
                    {/* Text Content */}
                    <div className="w-full lg:w-1/2 text-left order-2 lg:order-1">
                        <h3 className="text-2xl font-bold text-teal-600 mb-4">
                            Medcare Supplement Advocate
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Empowering you with access to premium medical consultations and continuous care. Our platform ensures you receive expert advice and tailored health solutions when you need them most.
                        </p>
                    </div>

                    {/* Image */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <img
                            src={Section2Img}
                            alt="Medical Supplement Advocate"
                            className="w-3/4 h-auto"
                        />
                    </div>
                </div>

                {/* Quote Section */}
                <div className="mt-16 text-center">
                    <p className="italic text-gray-600">
                        "The good physician treats the disease; the great physician treats the patient who has the disease." - Sir William Osler
                    </p>
                </div>
            </div>
        </section>
    );
}

export default HomeSection2;