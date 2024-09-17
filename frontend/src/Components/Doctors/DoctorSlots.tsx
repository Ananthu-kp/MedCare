import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';   

import 'react-big-calendar/lib/css/react-big-calendar.css';   

import { BASE_URL } from '../../Config/baseURL';

type Slot = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
};

type CustomEvent = {
  start: Date;
  end: Date;
  title: string;
  backgroundColor?: string;
  available: boolean; 
};

const localizer = momentLocalizer(moment);

function DoctorSlots({ email }: { email: string }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const   
 [events, setEvents] = useState<CustomEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`<span class="math-inline">\{BASE\_URL\}/slots/</span>{email}`);
        setSlots(response.data);

        const formattedEvents = response.data.map((slot: Slot) => ({
          start: new Date(`<span class="math-inline">\{slot\.date\}T</span>{slot.startTime}`),
          end: new Date(`<span class="math-inline">\{slot\.date\}T</span>{slot.endTime}`),
          title: slot.available ? 'Available Slot' : 'Booked Slot',
          backgroundColor: slot.available ? 'green' : 'red',
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };
    fetchSlots();
  }, [email]);

  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    const today = moment().startOf('day').toDate();
    if (slotInfo.start < today) {
      return;
    }

    const newSelectedDate = slotInfo.start;
    const newSelectedDateString = newSelectedDate.toDateString();

    // Update event focus and colors
    const updatedEvents = events.map((event) => {
      const eventDateString = event.start.toDateString();
      return {
        ...event,
        available: eventDateString === newSelectedDateString,
        backgroundColor: event.available
          ? event.available ? 'lightgreen' : 'green'
          : 'red',
      };
    });
    setEvents(updatedEvents);

    setSelectedDay(newSelectedDate);
    setDate(moment(newSelectedDate).format('YYYY-MM-DD'));
    setStartTime(moment(slotInfo.start).format('HH:mm'));
    setEndTime(moment(slotInfo.end).format('HH:mm'));
  };

  const createSlot = async () => {
    if (selectedDay) {
      try {
        // ... (rest of createSlot logic)
      } catch (error) {
        console.error('Error creating slot:', error);
      }
    }
  };

  const eventPropGetter = (event: CustomEvent) => ({
    style: {
      backgroundColor: event.backgroundColor || 'blue',
      color: 'white',
      border: event.available ? '1px solid lightblue' : 'none', // Add subtle border for focus
    },
  });

  const dayStyle = (date: Date) => {
    const today = moment().startOf('day').toDate();
    return date < today ? { backgroundColor: '#e0e0e0', cursor: 'not-allowed' } : {};
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Doctor Slots</h1>
      
      {selectedDay && (
        <div className="mb-4 flex flex-col items-center space-y-4">
          <p>Selected Date: {date}</p>
          <div className="flex space-x-4">
            <div>
              <label className="block mb-1">From:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">To:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
          </div>
          <button
            onClick={createSlot}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Confirm Slot
          </button>
        </div>
      )}

      <div className="calendar-container p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSlotSelect}
          style={{ height: 500 }}
          views={['month']} 
          eventPropGetter={eventPropGetter} 
          dayPropGetter={(date) => ({
            style: dayStyle(date),
          })}
        />
      </div>
    </div>
  );
}

export default DoctorSlots;
