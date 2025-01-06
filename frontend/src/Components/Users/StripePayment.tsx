import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { toast } from 'sonner';

interface StripePaymentProps {
  amount: number;
  bookingTime: string; 
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({ amount, bookingTime, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const token = sessionStorage.getItem('userToken'); 
      console.log('Token:', token);
      const { data: { clientSecret } } = await axios.post(`${BASE_URL}/create-payment-intent`, {
        amount,
        currency: 'usd', 
        postalCode: '42424',
        bookingTime
        
      }, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      toast.success('Payment successful!');
      onSuccess();
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md mt-2"
      >
        Cancel
      </button>
    </form>
  );
};

export default StripePayment;