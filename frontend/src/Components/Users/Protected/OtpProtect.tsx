import React from 'react'
import { Navigate } from 'react-router-dom';

const OtpProtect = ({ element: Component }) => {
    const otpVerified = sessionStorage.getItem('otpVerified') === 'true';

    if (otpVerified) {
        return <Navigate to="/" />
    }

    return <Component />
}

export default OtpProtect
