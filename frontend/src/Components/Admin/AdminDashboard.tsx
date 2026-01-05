import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaUserMd, FaClipboardList, FaPlus } from 'react-icons/fa';
import adminAxiosInstance from '../../Config/AxiosInstance/adminInstance';

interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  pendingRequests: number;
  totalCategories: number;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem('adminToken');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDoctors: 0,
    pendingRequests: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, doctorsRes, categoriesRes] = await Promise.all([
          adminAxiosInstance.get('/admin/users'),
          adminAxiosInstance.get('/admin/doctors'),
          adminAxiosInstance.get('/admin/categories')
        ]);

        const pendingDoctors = doctorsRes.data.filter((doc: any) => !doc.isVerified).length;

        setStats({
          totalUsers: usersRes.data.length,
          totalDoctors: doctorsRes.data.filter((doc: any) => doc.isVerified).length,
          pendingRequests: pendingDoctors,
          totalCategories: categoriesRes.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers className="text-4xl sm:text-5xl" />,
      color: 'from-blue-400 to-blue-600',
      path: '/admin/users'
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: <FaUserMd className="text-4xl sm:text-5xl" />,
      color: 'from-green-400 to-green-600',
      path: '/admin/doctors'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: <FaClipboardList className="text-4xl sm:text-5xl" />,
      color: 'from-yellow-400 to-yellow-600',
      path: '/admin/doctor-requests'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: <FaPlus className="text-4xl sm:text-5xl" />,
      color: 'from-purple-400 to-purple-600',
      path: '/admin/categories'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className={`bg-gradient-to-br ${card.color} rounded-lg shadow-lg p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base opacity-90 mb-2">{card.title}</p>
                  <p className="text-3xl sm:text-4xl font-bold">{card.value}</p>
                </div>
                <div className="opacity-80">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <FaUsers className="text-blue-600 text-xl" />
              <span className="text-gray-800 font-medium">Manage Users</span>
            </button>
            <button
              onClick={() => navigate('/admin/doctor-requests')}
              className="flex items-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <FaClipboardList className="text-yellow-600 text-xl" />
              <span className="text-gray-800 font-medium">View Requests</span>
            </button>
            <button
              onClick={() => navigate('/admin/doctors')}
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <FaUserMd className="text-green-600 text-xl" />
              <span className="text-gray-800 font-medium">Manage Doctors</span>
            </button>
            <button
              onClick={() => navigate('/admin/categories')}
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <FaPlus className="text-purple-600 text-xl" />
              <span className="text-gray-800 font-medium">Add Category</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;