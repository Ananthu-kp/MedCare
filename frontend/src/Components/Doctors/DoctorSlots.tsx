import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'; 
import { RRule } from 'rrule';
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import { BASE_URL } from '../../Config/baseURL';

type Slot = {
  _id?: string;
  email: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  recurrenceRule?: string; // To store the recurrence rule if present
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
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/slots/${email}`);
        setSlots(response.data);

        const formattedEvents: CustomEvent[] = [];

        response.data.forEach((slot: Slot) => {
          const startDate = new Date(`${slot.date}T${slot.startTime}`);
          const endDate = new Date(`${slot.date}T${slot.endTime}`);

          if (slot.recurrenceRule) {
            // If there's a recurrence rule, use rrule to generate recurring events
            const rule = RRule.fromString(slot.recurrenceRule);
            const recurringDates = rule.all();

            recurringDates.forEach((recurrenceDate) => {
              const recurringStart = new Date(
                `${moment(recurrenceDate).format('YYYY-MM-DD')}T${slot.startTime}`
              );
              const recurringEnd = new Date(
                `${moment(recurrenceDate).format('YYYY-MM-DD')}T${slot.endTime}`
              );
              formattedEvents.push({
                start: recurringStart,
                end: recurringEnd,
                title: slot.available ? 'Available Slot' : 'Booked Slot',
                backgroundColor: slot.available ? 'green' : 'red',
                available: slot.available,
              });
            });
          } else {
            // For non-recurring events
            formattedEvents.push({
              start: startDate,
              end: endDate,
              title: slot.available ? 'Available Slot' : 'Booked Slot',
              backgroundColor: slot.available ? 'green' : 'red',
              available: slot.available,
            });
          }
        });

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

    setSelectedDay(slotInfo.start);
  };

  const eventPropGetter = (event: CustomEvent) => ({
    style: {
      backgroundColor: event.backgroundColor || 'blue',
      color: 'white',
      border: event.available ? '1px solid lightblue' : 'none',
    },
  });

  const dayPropGetter = (date: Date) => {
    const today = moment().startOf('day').toDate();
    const isSelected = selectedDay && date.toDateString() === selectedDay.toDateString();
    const isPast = date < today;
    return {
      style: {
        backgroundColor: isSelected ? 'lightgreen' : '',
        opacity: isPast ? 0.5 : 1,
        cursor: isPast ? 'not-allowed' : 'pointer',
        pointerEvents: isPast ? 'none' : 'auto' as 'auto' | 'none',
      },
    };
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Doctor Slots</h1>
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
          dayPropGetter={dayPropGetter}
        />
      </div>
    </div>
  );
}

export default DoctorSlots;
