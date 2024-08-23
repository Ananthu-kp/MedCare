import React from 'react'
import DoctorsRequest from '../../Components/Admin/DoctorsRequest'
import Navbar from '../../Components/Admin/Navbar'
import Sidebar from '../../Components/Admin/Sidebar'

function DoctorsRequestPage() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow">
                <Sidebar/>
                <main className="flex-grow ml-16 pt-16 p-4 bg-gray-100">
                    <DoctorsRequest />
                </main>
            </div>
        </div>
    )
}

export default DoctorsRequestPage
