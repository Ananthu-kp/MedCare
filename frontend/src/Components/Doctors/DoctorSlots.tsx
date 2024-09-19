import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { RRule, RRuleSet } from 'rrule'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'sonner';
import doctorAxiosInstance from '../../Config/AxiosInstance/doctorInstance';

type Slot = {
  _id?: string;
  email: string;
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
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [showTimeForm, setShowTimeForm] = useState<boolean>(false);
  const [recurrence, setRecurrence] = useState<string>('none'); 
  const [repeatDates, setRepeatDates] = useState<Date[]>([]); 

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await doctorAxiosInstance.get(`/slots/${email}` );
        console.log(response)
        setSlots(response.data);

        const formattedEvents: CustomEvent[] = [];

        response.data.forEach((slot: Slot) => {
          const startDate = new Date(`${slot.date}T${slot.startTime}`);
          const endDate = new Date(`${slot.date}T${slot.endTime}`);

          formattedEvents.push({
            start: startDate,
            end: endDate,
            title: slot.available ? 'Available Slot' : 'Booked Slot',
            backgroundColor: slot.available ? 'green' : 'red',
            available: slot.available,
          });
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
    setShowTimeForm(true); 
  };

  const handleTimeSubmit = async () => {
    if (!selectedDay || !startTime || !endTime) {
      toast.warning('Please set the Timing');
      return;
    }
    

    const formattedDate = moment(selectedDay).format('YYYY-MM-DD');

    const response = await doctorAxiosInstance.get(`/slots/${email}?date=${formattedDate}`);
    const existingSlots = response.data;

    // Check for conflicts
    const isConflict = existingSlots.some((slot: Slot) => {
      const slotStart = new Date(`${slot.date}T${slot.startTime}`);
      const slotEnd = new Date(`${slot.date}T${slot.endTime}`);
      const newSlotStart = new Date(`${formattedDate}T${startTime}`);
      const newSlotEnd = new Date(`${formattedDate}T${endTime}`);

      return newSlotStart < slotEnd && newSlotEnd > slotStart;
    });

    if (isConflict) {
      toast.error('Time slot conflicts with an existing slot.');
      return;
    }
    
    const timeSlot = {
      email,
      date: formattedDate,
      startTime,
      endTime,
      available: true,
    };

    console.log("Time slot:", timeSlot)

    try {
      const response =  await doctorAxiosInstance.post(`/slots`, timeSlot);
      console.log(response)

      let recurrenceDates: Date[] = [];
      if (recurrence === 'daily') {
        const rule = new RRule({
          freq: RRule.DAILY,
          dtstart: selectedDay,
          count: 7,
        });
        recurrenceDates = rule.all().filter(date => date.toDateString() !== selectedDay.toDateString())
      } else if (recurrence === 'weekly') {
        const rule = new RRule({
          freq: RRule.WEEKLY,
          dtstart: selectedDay,
          count: 4, 
        });
        recurrenceDates = rule.all().filter(date => date.toDateString() !== selectedDay.toDateString())
      } else if (recurrence === 'specific-dates' && repeatDates.length > 0) {
        recurrenceDates = repeatDates.filter(date => date.toDateString() !== selectedDay.toDateString())
      }

      if (recurrenceDates.length > 0) {
        for (const date of recurrenceDates) {
          const recDate = moment(date).format('YYYY-MM-DD');
          await doctorAxiosInstance.post(`/slots`, {
            email,
            date: recDate,
            startTime,
            endTime,
            available: true,
          });
        }
      }

      setShowTimeForm(false);
      setStartTime('');
      setEndTime('');
      setSelectedDay(null);
      setRepeatDates([]);
    } catch (error) {
      console.error('Error saving slot:', error);
    }
  };

  const handleRecurrenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecurrence(e.target.value);
    setRepeatDates([]);
  };

  const handleSpecificDateSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    setRepeatDates((prevDates) => [...prevDates, selectedDate]);
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
        PointerEvents: isPast ? 'none' : 'auto',
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

      {/* Time Input Form */}
      {showTimeForm && selectedDay && (
        <div className="time-input-form mt-6">
          <h2 className="text-xl mb-4">Set Slot Timing for {moment(selectedDay).format('MMMM Do YYYY')}</h2>
          <div className="flex flex-col gap-4">
            <label>
              Start Time:
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border p-2"
              />
            </label>
            <label>
              End Time:
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border p-2"
              />
            </label>

            <label>
              Recurrence:
              <select value={recurrence} onChange={handleRecurrenceChange} className="border p-2">
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="specific-dates">Specific Dates</option>
              </select>
            </label>

            {recurrence === 'specific-dates' && (
              <div>
                <h3>Select Specific Dates</h3>
                <input
                  type="date"
                  onChange={handleSpecificDateSelection}
                  className="border p-2"
                />
                {repeatDates.length > 0 && (
                  <ul>
                    {repeatDates.map((date, index) => (
                      <li key={index}>{moment(date).format('MMMM Do YYYY')}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <button onClick={handleTimeSubmit} className="bg-blue-500 text-white p-2 mt-4">
              Save Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorSlots;
