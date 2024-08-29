import React from 'react';

function Footer() {
    return (
        <footer className="py-10 bg-[#159e8e] text-white" >
            <div className="container mx-auto px-4 text-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-4" id='about'>About Us</h2>
                        <p className="text-gray-200 text-sm">
                            MedCare is dedicated to providing the best medical advice and consultation. We connect you with the top doctors for reliable and trustworthy healthcare services.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
                        <ul>
                            <li><a href="#" className="hover:text-gray-200 text-sm">Home</a></li>
                            <li><a href="#" className="hover:text-gray-200 text-sm">Services</a></li>
                            <li><a href="#" className="hover:text-gray-200 text-sm">About Us</a></li>
                            <li><a href="#" className="hover:text-gray-200 text-sm">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Legal</h2>
                        <ul>
                            <li><a href="#" className="hover:text-gray-200 text-sm">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-gray-200 text-sm">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-gray-200 text-sm">Disclaimer</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
                        <p className="text-gray-200 text-sm">1234 MedCare Street, Health City, Country</p>
                        <p className="text-gray-200 text-sm mt-2">Email: support@medcare.com</p>
                        <p className="text-gray-200 text-sm mt-2">Phone: +123 456 7890</p>
                    </div>
                </div>
                <div className="mt-10 border-t border-gray-400 pt-6">
                    <p>&copy; 2024 MedCare. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
