import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CancelPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        toast.error('Payment was canceled. Please try again.');
        
        const timer = setTimeout(() => {
            navigate('/selectDoctor'); 
        }, 5000);

        return () => clearTimeout(timer); 
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
            <div className="bg-white p-8 shadow-lg rounded-lg text-center">
                <h1 className="text-3xl font-bold text-red-600">Payment Canceled</h1>
                <p className="text-gray-700 mt-4">Your payment was not completed. If this was a mistake, you can try again.</p>
                
                <p className="mt-6 text-gray-500 text-sm">
                    Redirecting you back to the doctor details page in <span className="font-semibold">5 seconds</span>...
                </p>

                <button 
                    onClick={() => navigate('/selectDoctor')} 
                    className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    Go Back Now
                </button>
            </div>
        </div>
    );
};

export default CancelPage;
