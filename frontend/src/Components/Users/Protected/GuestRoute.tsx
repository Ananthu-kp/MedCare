import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

interface GuestRouteProps {
    element: React.ComponentType<any>; // Define the type for the component prop
    [key: string]: any; // Allow for additional props
}

const GuestRoute: React.FC<GuestRouteProps> = ({ element: Component, ...rest }) => {
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
