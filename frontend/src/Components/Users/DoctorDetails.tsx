import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BASE_URL } from '../../Config/baseURL';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'sonner';
import StripePayment from './StripePayment';

const localizer = momentLocalizer(moment);

type Slot = {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  _id: string;
};

function DoctorDetails() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeError, setTimeError] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [bookingAmount, setBookingAmount] = useState<number>(0);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/doctors/${doctorId}`);
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    const fetchDoctorSlots = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/slot/${doctorId}`);
        const slotsData = response.data;

        const now = new Date();

        // Filter out past slots
        const upcomingSlots = slotsData.filter((slot: Slot) => {
          const slotEndTime = new Date(`${slot.date}T${slot.endTime}`);
          return slotEndTime > now;
        });

        setSlots(upcomingSlots);

        const formattedEvents = upcomingSlots.map((slot: Slot) => ({
          start: new Date(`${slot.date}T${slot.startTime}`),
          end: new Date(`${slot.date}T${slot.endTime}`),
          title: 'Available Slot',
          backgroundColor: slot.available ? 'white' : 'grey',
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
      backgroundColor: event.backgroundColor,
      color: event.backgroundColor === 'white' ? 'black' : 'white',
      borderRadius: '5px',
      padding: '2px 5px',
      cursor: event.backgroundColor === 'white' ? 'pointer' : 'not-allowed',
    },
  });

  const dayPropGetter = (date: Date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const isAvailableDate = slots.some((slot) => slot.date === formattedDate);

    return {
      style: {
        backgroundColor: isAvailableDate ? 'white' : '#f4f4f4',
        color: isAvailableDate ? 'black' : '#a0a0a0',
        cursor: isAvailableDate ? 'pointer' : 'not-allowed',
      },
    };
  };

  const handleSlotClick = (event: any) => {
    const clickedSlot = slots.find(
      (slot) =>
        new Date(`${slot.date}T${slot.startTime}`).getTime() ===
        event.start.getTime()
    );

    if (clickedSlot && clickedSlot.available) {
      setSelectedSlot(clickedSlot);
      const start = moment(clickedSlot.startTime, 'HH:mm');
      const end = moment(clickedSlot.endTime, 'HH:mm');
      const times: string[] = [];

      while (start.isBefore(end)) {
        times.push(start.format('hh:mm A'));
        start.add(30, 'minutes');
      }

      setAvailableTimes(times);
      setShowModal(true);
    }
  };

  const handleBookingSubmit = () => {
    if (!selectedTime) {
      toast.warning('Please select a time before confirming your booking!');
      return;
    }
    setBookingAmount(doctor.consultationfee);
    setShowModal(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    toast.success('Booking confirmed!');
    setShowPayment(false);
    setSelectedSlot(null);
    setSelectedTime('');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handleTimeSelection = (time: string) => {
    const selectedMoment = moment(time, 'hh:mm A');
    const isValid = selectedMoment.minute() % 30 === 0;

    if (!isValid) {
      setTimeError('Please select a time in 30-minute intervals.');
    } else {
      setSelectedTime(time);
      setTimeError('');
    }
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
              <span className="font-semibold">Experience:</span>{' '}
              {doctor.yearsOfExperience} years
            </p>
            <p className="text-gray-700 text-center mt-2">
              <span className="font-semibold">Consultation Fee:</span> ₹
              {doctor.consultationfee}
            </p>
            <p className="text-gray-700 text-center mt-2">
              <span className="font-semibold">Hospital:</span>{' '}
              {doctor.workingHospital}
            </p>
          </div>
        </div>
      )}

      <div className="calendar-container bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Available Slots
        </h3>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          selectable={true}
          onSelectEvent={handleSlotClick}
          views={['month']}
          defaultView="month"
          className="rounded-lg overflow-hidden"
        />
      </div>
      <Modal className="custom-modal bg-white shadow-lg rounded-lg p-6"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-lg font-bold text-center w-full">
            Select Consultation Time
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center">
            <div
              className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg h-[300px] overflow-y-auto border border-black"
            >
              <h5 className="text-lg font-semibold mb-4 text-center">
                Choose an Available Time Slot
              </h5>
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                  justifyContent: 'center',
                }}
              >
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelection(time)}
                    className={`py-2 px-4 rounded-lg shadow-md text-sm transition duration-300 ${selectedTime === time
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-800'
                      }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {timeError && (
                <p className="mt-4 text-sm text-red-600 text-center">{timeError}</p>
              )}
              {selectedTime && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                  You have selected: <span className="font-medium">{selectedTime}</span>
                </p>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex w-full justify-center gap-4 mb-4">
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-md hover:bg-gray-400 transition duration-300"
            >
              Close
            </button>
            <button
              onClick={handleBookingSubmit}
              className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
            >
              Confirm Booking
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal className="custom-modal bg-white shadow-lg rounded-lg p-6"
        show={showPayment}
        onHide={handlePaymentCancel}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-lg font-bold text-center w-full">
            Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StripePayment
            amount={bookingAmount}
            bookingTime={selectedTime}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DoctorDetails;