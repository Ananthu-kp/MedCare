import React, { useRef, useState } from 'react';

function Otp() {
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef([]);

    const handleInputChange = (index, event) => {
        const value = event.target.value;
        if (value.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !inputRefs.current[index].value && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }} />

            {/* Form Container */}
            <div className="relative bg-white p-12 rounded-lg shadow-lg w-full max-w-md z-10">
                <h2 className="text-3xl font-bold text-center mb-8">OTP Verification</h2>
                <p className="text-center text-gray-600 mb-6">Enter the 4-digit OTP you have received in your email</p>

                <div className="flex justify-center space-x-4 mb-6">
                    {[...Array(4)].map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            onChange={(e) => handleInputChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            ref={(el) => inputRefs.current[index] = el}
                        />
                    ))}
                </div>

                <div className="text-center text-gray-600 mb-6">
                    {timer > 0 ? (
                        <p> 00:{timer < 10 ? `0${timer}` : timer}</p>
                    ) : (
                        <a href="#" className="text-teal-500 hover:underline">Resend OTP</a>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg shadow hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    Verify
                </button>

                <div className="text-center mt-6">
                    <a href="#" className="text-sm text-teal-500 hover:underline">Don't receive the OTP? Resend OTP</a>
                </div>
            </div>
        </div>
    );
}

export default Otp;