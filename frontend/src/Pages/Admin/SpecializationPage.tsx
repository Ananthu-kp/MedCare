import React from 'react'
import Navbar from '../../Components/Admin/Navbar'
import Sidebar from '../../Components/Admin/Sidebar'
import Specialization from '../../Components/Admin/Specialization'

function SpecializationPage() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow">
                <Sidebar />
                <main className="flex-grow ml-16 pt-16 p-4 bg-gray-100">
                    <Specialization />
                </main>
            </div>
        </div>
    )
}

export default SpecializationPage
