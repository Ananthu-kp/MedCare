import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

const SuccessPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const sessionId = new URLSearchParams(location.search).get('session_id');

    useEffect(() => {
        if (sessionId) {
            
            toast("🎊 Congratulations! Your transaction is completed successfully.", {
                duration: 5000,
            });
        }

        // Auto-redirect to home page after 10 seconds
        const timer = setTimeout(() => {
            navigate('/');
        }, 10000); 

        return () => clearTimeout(timer);
    }, [sessionId, navigate]);

    return (
        <div className="container mx-auto py-10 px-4 text-center">
            <Confetti />
            <h1 className="text-3xl font-bold text-green-600">🎉 Payment Successful! 🎉</h1>
            <p className="text-gray-700 mt-4 text-lg">
                Thank you for your payment. Your transaction was completed successfully!
            </p>
            <p className="text-gray-500 mt-2">
                Redirecting you to the home page in 10 seconds...
            </p>
        </div>
    );
};

export default SuccessPage;
