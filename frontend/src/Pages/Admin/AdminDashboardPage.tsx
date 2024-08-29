import React from 'react';
import AdminDashboard from '../../Components/Admin/AdminDashboard';
import Sidebar from '../../Components/Admin/Sidebar';
import Navbar from '../../Components/Admin/Navbar';

function AdminDashboardPage() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow">
                <Sidebar />
                <main className="flex-grow ml-16 pt-16 p-4 bg-gray-100">
                    <AdminDashboard />
                </main>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
