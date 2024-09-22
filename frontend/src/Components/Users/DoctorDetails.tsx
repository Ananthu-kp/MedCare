import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BASE_URL } from '../../Config/baseURL';

const localizer = momentLocalizer(moment);

type Slot = {
  start: Date;
  end: Date;
  available: boolean;
};

function DoctorDetails() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/doctor/${doctorId}`);
            console.log(response.data)
            if (!response.data) {
                console.error(`No doctor found with ID: ${doctorId}`);
                return;
            }
            setDoctor(response.data);
        } catch (error) {
            console.error('Error fetching doctor details:', error);
        }
    };
    

    const fetchDoctorSlots = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/slots/${doctorId}`);
        setSlots(response.data);

        const formattedEvents = response.data.map((slot: Slot) => ({
          start: new Date(slot.start),
          end: new Date(slot.end),
          title: slot.available ? 'Available Slot' : 'Booked Slot',
          backgroundColor: slot.available ? 'green' : 'red',
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchDoctorDetails();
    fetchDoctorSlots();
  }, [doctorId]);

  const eventPropGetter = (event: any) => ({
    style: {
      backgroundColor: event.backgroundColor || 'blue',
      color: 'white',
    },
  });

  const dayPropGetter = (date: Date) => {
    const hasSlots = slots.some(slot => {
      const slotDate = new Date(slot.start).toDateString();
      return slotDate === date.toDateString();
    });
    
    return {
      style: {
        backgroundColor: hasSlots ? 'white' : 'lightgrey',
        opacity: hasSlots ? 1 : 0.5,
        cursor: hasSlots ? 'pointer' : 'not-allowed',
      },
    };
  };

  return (
    <div className="container mx-auto py-10">
      {doctor && (
        <div className="doctor-details mb-6 text-center">
          <img 
            src={`${BASE_URL}/Public/${doctor.profileImg}`} 
            alt={doctor.name} 
            className="rounded-full w-32 h-32 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold">{doctor.name}</h2>
          <p>Category: {doctor.category}</p>
          <p>Experience: {doctor.yearsOfExperience} years</p>
          <p>Consultation Fee: ₹{doctor.consultationfee}</p>
          <p>Hospital: {doctor.workingHospital}</p>
        </div>
      )}

      <div className="calendar-container p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          selectable={false} 
        />
      </div>
    </div>
  );
}

export default DoctorDetails;
