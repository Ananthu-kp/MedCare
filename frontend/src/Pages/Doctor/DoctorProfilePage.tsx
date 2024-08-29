import React, { useEffect } from 'react'
import DoctorProfile from '../../Components/Doctors/DoctorProfile'
import SidebarDoctor from '../../Components/Doctors/SidebarDoctor'
import NavbarDoctor from '../../Components/Doctors/NavbarDoctor'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'

function DoctorProfilePage() {
  const location = useLocation();
  useEffect(() => {
    if(location.state?.message){
      toast.success("Login successfully");
    }
  }, [])
  return (
    <div className="flex flex-col h-screen">
    <NavbarDoctor />
    <div className="flex flex-grow">
        <SidebarDoctor />
        <main className="flex-grow ml-16 pt-16 p-4 bg-gray-100">
            <DoctorProfile />
        </main>
    </div>
</div>
  )
}

export default DoctorProfilePage
