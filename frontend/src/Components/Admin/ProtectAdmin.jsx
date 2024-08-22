import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProtectAdmin = ({ element: Component }) => {
    const navigate = useNavigate()
    const isAuthenticated = sessionStorage.getItem('adminToken');

    useEffect(() => {
        if (!isAuthenticated) {
          navigate('/admin/login', { replace: true });
        }
      }, [isAuthenticated, navigate]);
    
      return isAuthenticated ? <Component /> : null;
}

export default ProtectAdmin
