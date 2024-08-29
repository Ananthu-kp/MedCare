import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectDoctorProps {
    element: React.ComponentType;  // Define the type for the component prop
}

const ProtectDoctor: React.FC<ProtectDoctorProps> = ({ element: Component }) => {
    const navigate = useNavigate();
    const isAuthenticated = !!sessionStorage.getItem('doctorToken');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/doctor/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? <Component /> : null;
};

export default ProtectDoctor;
