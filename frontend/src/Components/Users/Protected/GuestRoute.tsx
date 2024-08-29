import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

const GuestRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!sessionStorage.getItem('userToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return !isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" replace />
  );
};

export default GuestRoute;
