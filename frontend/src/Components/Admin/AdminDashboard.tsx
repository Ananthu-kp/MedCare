import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem('adminToken');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      Welcome To Admin Dashboard!!
    </div>
  )
}

export default AdminDashboard
