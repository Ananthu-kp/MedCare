import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BASE_URL } from '../../Config/baseURL';
import { toast } from 'sonner';
import StripePayment from './StripePayment';
import { FiClock, FiDollarSign, FiMapPin, FiBriefcase, FiX } from 'react-icons/fi';

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal || showPayment) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal, showPayment]);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/doctors/${doctorId}`);
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        toast.error('Failed to fetch doctor details');
      }
    };

    const fetchDoctorSlots = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/slot/${doctorId}`);
        const slotsData = response.data;

        const now = new Date();

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
        toast.error('Failed to fetch available slots');
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

  const handleBookingSubmit = async () => {
    if (!selectedTime) {
      toast.warning('Please select a time before confirming your booking!');
      return;
    }

    try {
      const token = sessionStorage.getItem('userToken');
      const response = await axios.post(`${BASE_URL}/create-payment-intent`, {
        amount: doctor.consultationfee,
        currency: 'inr',
        bookingTime: selectedTime,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { url } = response.data;
      window.location.href = url;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to initiate payment. Please try again.');
    }
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
    setSelectedTime(time);
    setTimeError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTime('');
    setTimeError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {doctor && (
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={`${BASE_URL}/Public/${doctor.profileImg}`}
                  alt={doctor.name}
                  className="rounded-full w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover border-4 border-teal-100 shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>

              {/* Doctor Info */}
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {doctor.name}
                </h2>
                <p className="text-teal-600 text-lg sm:text-xl font-semibold mb-4">
                  {doctor.category}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700">
                    <FiBriefcase className="text-teal-500 text-lg sm:text-xl flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      <span className="font-semibold">Experience:</span> {doctor.yearsOfExperience} years
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700">
                    <FiDollarSign className="text-teal-500 text-lg sm:text-xl flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      <span className="font-semibold">Fee:</span> ₹{doctor.consultationfee}
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700 sm:col-span-2">
                    <FiMapPin className="text-teal-500 text-lg sm:text-xl flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      <span className="font-semibold">Hospital:</span> {doctor.workingHospital}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Section */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
            Available Slots
          </h3>
          {slots.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <FiClock className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-red-600 font-semibold text-base sm:text-lg">
                No allocated slots available for booking
              </p>
            </div>
          ) : (
            <div className="calendar-wrapper overflow-x-auto">
              <div style={{ minWidth: '600px' }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ minHeight: 500, height: 'auto' }}
                  eventPropGetter={eventPropGetter}
                  dayPropGetter={dayPropGetter}
                  selectable={true}
                  onSelectEvent={handleSlotClick}
                  views={['month']}
                  defaultView="month"
                  className="rounded-lg overflow-hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Custom Time Selection Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={closeModal}
            />
            
            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Select Consultation Time
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="text-2xl" />
                  </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                  <div className="mb-4">
                    <p className="text-center text-gray-600 text-sm sm:text-base mb-2">
                      Selected Date: <span className="font-semibold text-gray-800">
                        {selectedSlot && moment(selectedSlot.date).format('MMMM DD, YYYY')}
                      </span>
                    </p>
                    <p className="text-center text-gray-600 text-sm sm:text-base">
                      Available Time: <span className="font-semibold text-gray-800">
                        {selectedSlot && `${selectedSlot.startTime} - ${selectedSlot.endTime}`}
                      </span>
                    </p>
                  </div>

                  <h5 className="text-base sm:text-lg font-semibold mb-4 text-center text-gray-800">
                    Choose a Time Slot
                  </h5>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelection(time)}
                        className={`py-2 sm:py-3 px-2 sm:px-4 rounded-lg shadow-sm text-xs sm:text-sm font-medium transition duration-200 ${
                          selectedTime === time
                            ? 'bg-teal-600 text-white shadow-md'
                            : 'bg-gray-100 hover:bg-teal-100 hover:text-teal-700 text-gray-800'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  {timeError && (
                    <p className="mt-4 text-xs sm:text-sm text-red-600 text-center font-medium">
                      {timeError}
                    </p>
                  )}
                  
                  {selectedTime && (
                    <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-center text-teal-800">
                        <span className="font-semibold">Selected Time:</span> {selectedTime}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={closeModal}
                      className="w-full sm:flex-1 bg-gray-200 text-gray-800 py-2 sm:py-3 px-4 rounded-lg shadow-sm hover:bg-gray-300 transition duration-300 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBookingSubmit}
                      disabled={!selectedTime}
                      className={`w-full sm:flex-1 py-2 sm:py-3 px-4 rounded-lg shadow-sm transition duration-300 font-medium ${
                        selectedTime
                          ? 'bg-teal-600 text-white hover:bg-teal-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Confirm & Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handlePaymentCancel}
            />
            
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Payment</h3>
                  <button
                    onClick={handlePaymentCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="text-2xl" />
                  </button>
                </div>
                
                <div className="p-4 sm:p-6">
                  <StripePayment
                    amount={bookingAmount}
                    currency="inr"
                    bookingTime={selectedTime}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDetails;