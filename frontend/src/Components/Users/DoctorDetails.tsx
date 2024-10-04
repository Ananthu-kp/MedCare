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
        const response = await axios.get(`${BASE_URL}/doctors/${doctorId}`);
        console.log(response.data);
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
        const response = await axios.get(`${BASE_URL}/slot/${doctorId}`);
        console.log(response.data)
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
      borderRadius: '5px',
      padding: '2px 5px',
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
    <div className="container mx-auto py-10 px-4">
      {doctor && (
        <div className="doctor-details bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="flex flex-col items-center">
            <img
              src={`${BASE_URL}/Public/${doctor.profileImg}`}
              alt={doctor.name}
              className="rounded-full w-32 h-32 object-cover mb-4"
            />
            <h2 className="text-3xl font-bold text-gray-800">{doctor.name}</h2>
            <p className="text-gray-500 text-lg mt-2">{doctor.category}</p>
          </div>

          <div className="doctor-info mt-6">
            <p className="text-gray-700 text-center">
              <span className="font-semibold">Experience:</span> {doctor.yearsOfExperience} years
            </p>
            <p className="text-gray-700 text-center mt-2">
              <span className="font-semibold">Consultation Fee:</span> ₹{doctor.consultationfee}
            </p>
            <p className="text-gray-700 text-center mt-2">
              <span className="font-semibold">Hospital:</span> {doctor.workingHospital}
            </p>
          </div>
        </div>
      )}

      <div className="calendar-container bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Available Slots</h3>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          selectable={false}
          className="rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
}

export default DoctorDetails;
