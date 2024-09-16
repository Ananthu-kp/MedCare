import React from 'react'
import NavbarDoctor from '../../Components/Doctors/NavbarDoctor'
import SidebarDoctor from '../../Components/Doctors/SidebarDoctor'
import DoctorSlots from '../../Components/Doctors/DoctorSlots'

function DoctorSlotPage() {
    return (
        <div className="flex flex-col h-screen">
            <NavbarDoctor />
            <div className="flex flex-grow">
                <SidebarDoctor />
                <main className="flex-grow ml-16 pt-16 p-4 bg-gray-100">
                    <DoctorSlots email={''} />
                </main>
            </div>
        </div>
    )
}

export default DoctorSlotPage
