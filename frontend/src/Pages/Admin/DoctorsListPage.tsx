import React from 'react'
import Navbar from '../../Components/Admin/Navbar'
import Sidebar from '../../Components/Admin/Sidebar'
import DoctorsList from '../../Components/Admin/DoctorsList'

function DoctorsListPage() {
    return (
        <div>
            <div className="flex flex-col h-screen">
                <Navbar />
                <div className="flex flex-grow">
                    <Sidebar />
                    <main className="flex-grow ml-16 pt-16 p-4 bg-gray-100">
                        <DoctorsList />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default DoctorsListPage
