import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './Components/Users/Context/userContext';

createRoot(document.getElementById('root') as HTMLElement).render(
    <UserProvider>
  <GoogleOAuthProvider clientId='7293411526-csfnnd7djcege04au5e645qsorujh4n8.apps.googleusercontent.com'>
    <App />
  </GoogleOAuthProvider>
    </UserProvider>
);
