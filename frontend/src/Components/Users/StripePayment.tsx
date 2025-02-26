import React from 'react';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { toast } from 'sonner';

interface StripePaymentProps {
    amount: number;
    bookingTime: string;
    onSuccess: () => void;
    onCancel: () => void;
    currency: string
}

const StripePayment: React.FC<StripePaymentProps> = ({ amount, bookingTime, onSuccess, onCancel, currency }) => {
    const handleBookingSubmit = async () => {
        try {
            const token = sessionStorage.getItem('userToken');
            const response = await axios.post(`${BASE_URL}/create-payment-intent`, {
                amount,
                currency: 'usd',
                bookingTime,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { url } = response.data;

            // Redirect to Stripe Checkout page
            window.location.href = url;
        } catch (error) {
            console.error('Error creating payment:', error);
            toast.error('Failed to initiate payment. Please try again.');
        }
    };

    return (
        <div>
            <button
                onClick={handleBookingSubmit}
                className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
            >
                Confirm Booking
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md mt-2"
            >
                Cancel
            </button>
        </div>
    );
};

export default StripePayment;