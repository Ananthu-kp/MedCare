import React, { useEffect, useState } from 'react';
import NavbarDoctor from '../../Components/Doctors/NavbarDoctor';
import SidebarDoctor from '../../Components/Doctors/SidebarDoctor';
import DoctorSlots from '../../Components/Doctors/DoctorSlots';
import doctorAxiosInstance from '../../Config/AxiosInstance/doctorInstance';

function DoctorSlotPage() {
    const [doctorEmail, setDoctorEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await doctorAxiosInstance.get('/doctor'); 
                setDoctorEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching doctor details:', error);
            }
        };

        fetchDoctorDetails();
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <NavbarDoctor />
            <div className="flex flex-grow">
                <SidebarDoctor />
                <main className="flex-grow ml-16 pt-16 p-4 bg-gray-100">
                    {doctorEmail ? <DoctorSlots email={doctorEmail} /> : <p>Loading...</p>}
                </main>
            </div>
        </div>
    );
}

export default DoctorSlotPage;
