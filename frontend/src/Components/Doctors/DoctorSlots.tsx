import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { RRule } from 'rrule';
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
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date()); // Track active month

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await doctorAxiosInstance.get(`/slots/${email}`);
        console.log(response);
        const today = moment().startOf('day').toDate();

        // Filter out past slots
        const validSlots = response.data.filter((slot: Slot) => {
          const slotEnd = new Date(`${slot.date}T${slot.endTime}`);
          return slotEnd >= today;
        });

        setSlots(validSlots);

        const formattedEvents: CustomEvent[] = validSlots.map((slot: Slot) => {
          const startDate = new Date(`${slot.date}T${slot.startTime}`);
          const endDate = new Date(`${slot.date}T${slot.endTime}`);

          return {
            start: startDate,
            end: endDate,
            title: slot.available ? 'Allocated Slot' : 'Booked Slot',
            backgroundColor: slot.available ? 'green' : 'red',
            available: slot.available,
          };
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
    const selectedMonth = moment(slotInfo.start).month();
    const activeMonth = moment(currentMonth).month();

    // Check if the selected day is within the active month and not in the past
    if (slotInfo.start < today || selectedMonth !== activeMonth) {
      return;
    }

    setSelectedDay(slotInfo.start);
    setShowTimeForm(true);
  };


  const isValidTimeInterval = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return minutes === 0 || minutes === 30;
  };  

  const handleTimeSubmit = async () => {
    if (!selectedDay || !startTime || !endTime) {
      toast.warning('Please set the Timing');
      return;
    }

    if (!isValidTimeInterval(startTime) || !isValidTimeInterval(endTime)) {
      toast.warning('Timing must be in 30-minute intervals.');
      return;
    }

    const now = new Date();
    const selectedDateStart = moment(selectedDay).startOf('day').toDate();

    // Check if the start or end time is already passed for today's date
    if (selectedDateStart <= now && new Date(`${moment(selectedDay).format('YYYY-MM-DD')}T${startTime}`) <= now) {
      toast.warning('Cannot allocate a time that already passed.');
      return;
    }

    const formattedDate = moment(selectedDay).format('YYYY-MM-DD');

    // Check for conflicts using adjusted logic to handle overlaps
    const existingSlots = slots.filter((slot) => {
      const slotStart = new Date(`${slot.date}T${slot.startTime}`);
      const slotEnd = new Date(`${slot.date}T${slot.endTime}`);
      const newSlotStart = new Date(`${formattedDate}T${startTime}`);
      const newSlotEnd = new Date(`${formattedDate}T${endTime}`);

      // Check for overlap or if the slot spills into the next day
      return (
        (slotStart <= newSlotEnd && newSlotStart < slotEnd) ||
        (newSlotEnd <= newSlotStart && newSlotEnd < slotEnd)
      );
    });

    if (existingSlots.length > 0) {
      toast.warning('Slot already allocated or overlaps with an existing slot.');
      return;
    }

    // Handle multi-day slots
    const startDateTime = new Date(`${formattedDate}T${startTime}`);
    const endDateTime = new Date(`${formattedDate}T${endTime}`);
    let multiDaySlot = false;

    if (endDateTime <= startDateTime) {
      multiDaySlot = true;
    }

    try {
      const timeSlot = {
        email,
        date: formattedDate,
        startTime,
        endTime: multiDaySlot ? '23:59' : endTime,
        available: true,
      };

      console.log('Time slot:', timeSlot);

      const response = await doctorAxiosInstance.post(`/slots`, timeSlot);
      console.log(response);

      //doing this for allocate slot without reload
      const newSlot: Slot = {
        email,
        date: formattedDate,
        startTime,
        endTime: multiDaySlot ? '23:59' : endTime,
        available: true,
      }

      setSlots((prevSlots) => [...prevSlots, newSlot]);


      const newEvent: CustomEvent = {
        start: startDateTime,
        end: endDateTime,
        title: 'Allocated Slot',
        backgroundColor: 'green',
        available: true
      };

      setEvents((prevEvents) => [...prevEvents, newEvent])

      // Save the slot for the next day if multi-day
      if (multiDaySlot) {
        const nextDay = moment(selectedDay).add(1, 'days').format('YYYY-MM-DD');
        const nextDaySlot = {
          email,
          date: nextDay,
          startTime: '00:00',
          endTime,
          available: true,
        };
        await doctorAxiosInstance.post(`/slots`, nextDaySlot);

        //add the next day slot to the state
        const nextSlot: Slot = {
          email,
          date: nextDay,
          startTime: '00:00',
          endTime,
          available: true,
        };

        setSlots((prevSlots) => [...prevSlots, nextSlot]);

        const nextDayEvent: CustomEvent = {
          start: new Date(`${nextDay}T00:00`),
          end: new Date(`${nextDay}T${endTime}`),
          title: 'Allocated Slot',
          backgroundColor: 'green',
          available: true,
        };

        setEvents((prevEvents) => [...prevEvents, nextDayEvent])
      };
      

      let recurrenceDates: Date[] = [];
      if (recurrence === 'daily') {
        const rule = new RRule({
          freq: RRule.DAILY,
          dtstart: selectedDay,
          count: 7,
        });
        recurrenceDates = rule.all().filter((date) => date.toDateString() !== selectedDay.toDateString());
      } else if (recurrence === 'weekly') {
        const rule = new RRule({
          freq: RRule.WEEKLY,
          dtstart: selectedDay,
          count: 4,
        });
        recurrenceDates = rule.all().filter((date) => date.toDateString() !== selectedDay.toDateString());
      } else if (recurrence === 'specific-dates' && repeatDates.length > 0) {
        recurrenceDates = repeatDates.filter((date) => date.toDateString() !== selectedDay.toDateString());
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

      toast.success('Successfully allocated slot!')

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
        backgroundColor: isSelected ? 'lightgreen' : isPast ? 'lightgrey' : '',
        opacity: isPast ? 0.5 : 1,
        cursor: isPast ? 'not-allowed' : 'pointer',
        PointerEvents: isPast ? 'none' : 'auto',
      },
    };
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Doctor Slots</h1>
      <div className="flex justify-center">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, width: '100%' }}
          selectable
          onSelectSlot={handleSlotSelect}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          views={['month']}
          defaultView='month'
          onNavigate={(date) => setCurrentMonth(date)}
        />
      </div>
      {/* Time Input Form */}
      {showTimeForm && selectedDay && (
        <div className="time-input-form mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Set Slot Timing for {moment(selectedDay).format('MMMM Do YYYY')}
          </h2>
          <div className="flex flex-col gap-4">
            {/* Start Time */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">Start Time:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Time */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">End Time:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Recurrence */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">Recurrence:</label>
              <select
                value={recurrence}
                onChange={handleRecurrenceChange}
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="specific-dates">Specific Dates</option>
              </select>
            </div>

            {/* Specific Dates */}
            {recurrence === 'specific-dates' && (
              <div className="flex flex-col gap-2">
                <label className="text-lg font-medium">Select Specific Dates:</label>
                <input
                  type="date"
                  onChange={handleSpecificDateSelection}
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {repeatDates.length > 0 && (
                  <ul className="mt-2 list-disc pl-6">
                    {repeatDates.map((date, index) => (
                      <li key={index} className="text-lg">
                        {moment(date).format('MMMM Do YYYY')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleTimeSubmit}
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Save Slot
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DoctorSlots;
