import React from 'react';
import { Navigate } from 'react-router-dom';

interface OtpProtectProps {
    element: React.ComponentType<any>; 
}

const OtpProtect: React.FC<OtpProtectProps> = ({ element: Component }) => {
    const otpVerified = sessionStorage.getItem('otpVerified') === 'true';

    if (otpVerified) {
        return <Navigate to="/" />;
    }

    return <Component />;
};

export default OtpProtect;
