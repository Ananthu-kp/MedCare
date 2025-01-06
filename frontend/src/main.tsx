import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './Components/Users/Context/userContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QW02NRvWiqginOXqDF0F09y9zB9XeMHGMQDLoFKYAnEByLMxCt6x2VomOTmd7IABhWsfSqkMAAfbn6K87dBOPTr00Vq8s2PZc');

createRoot(document.getElementById('root') as HTMLElement).render(
  <UserProvider>
    <Elements stripe={stripePromise}>
      <GoogleOAuthProvider clientId='7293411526-csfnnd7djcege04au5e645qsorujh4n8.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </Elements>
  </UserProvider>
);
