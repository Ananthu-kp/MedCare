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
};

const localizer = momentLocalizer(moment);

function DoctorSlots({ email }: { email: string }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/slots/${email}`);
        setSlots(response.data);

        // Map the slots to calendar events
        const formattedEvents = response.data.map((slot: Slot) => ({
          start: new Date(`${slot.date}T${slot.startTime}`),
          end: new Date(`${slot.date}T${slot.endTime}`),
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

  const createSlot = async () => {
    if (selectedDay) {
      try {
        const newSlotDate = moment(selectedDay).format('YYYY-MM-DD');
        const newSlotStartTime = moment(startTime, 'HH:mm').format('HH:mm');
        const newSlotEndTime = moment(endTime, 'HH:mm').format('HH:mm');

        await axios.post(`${BASE_URL}/slots`, { email, date: newSlotDate, startTime: newSlotStartTime, endTime: newSlotEndTime });
        const newEvent = {
          start: new Date(`${newSlotDate}T${newSlotStartTime}`),
          end: new Date(`${newSlotDate}T${newSlotEndTime}`),
          title: 'Available Slot',
          backgroundColor: 'green',
        };

        setSlots((prevSlots) => [...prevSlots, { _id: '', date: newSlotDate, startTime: newSlotStartTime, endTime: newSlotEndTime, available: true }]);

        setEvents((prevEvents) => {
          // Remove previous selection if any
          const filteredEvents = prevEvents.filter(event => event.start.toDateString() !== selectedDay!.toDateString());
          return [...filteredEvents, newEvent];
        });

        setSelectedDay(null); 
      } catch (error) {
        console.error('Error creating slot:', error);
      }
    }
  };

  const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    const today = moment().startOf('day').toDate();
    if (slotInfo.start < today) {
      return; 
    }

    const newSelectedDate = slotInfo.start;

    // Remove the highlight from the previously selected date
    const updatedEvents = events.map((event) => ({
      ...event,
      backgroundColor: event.start.toDateString() === (selectedDay ? selectedDay : newSelectedDate).toDateString() ? 'green' : event.backgroundColor,
    }));

    if (selectedDay) {
      const previouslySelectedDate = selectedDay;
      setEvents((prevEvents) => 
        prevEvents.map(event => 
          event.start.toDateString() === previouslySelectedDate.toDateString() ? 
          { ...event, backgroundColor: 'green' } : event
        )
      );
    }

    setSelectedDay(newSelectedDate);
    setDate(moment(newSelectedDate).format('YYYY-MM-DD'));
    setStartTime(moment(slotInfo.start).format('HH:mm'));
    setEndTime(moment(slotInfo.end).format('HH:mm'));

    setEvents([
      ...updatedEvents.filter(event => event.start.toDateString() !== newSelectedDate.toDateString()),
      {
        start: slotInfo.start,
        end: slotInfo.end,
        title: 'Selected Slot',
        backgroundColor: 'lightgreen',
      },
    ]);
  };

  // Custom event style
  const eventPropGetter = (event: CustomEvent) => ({
    style: {
      backgroundColor: event.backgroundColor || 'blue', 
    },
  });

  // CSS for disabled days
  const dayStyle = (date: Date) => {
    const today = moment().startOf('day').toDate();
    return date < today ? { backgroundColor: '#e0e0e0', cursor: 'not-allowed' } : {};
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Doctor Slots</h1>
      
      {/* Input for creating slots */}
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

      {/* Calendar to display slots */}
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
