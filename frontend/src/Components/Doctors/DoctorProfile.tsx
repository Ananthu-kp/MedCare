import React, { useState, useEffect } from 'react';
import { FiCamera, FiEdit2 } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { toast } from 'sonner';
import doctorAxiosInstance from '../../Config/AxiosInstance/doctorInstance';

// Proper type definitions
interface OfficialDetails {
  category: string;
  workingHospital: string;
  yearsOfExperience: number;
  consultationfee: string;
}

interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileIMG?: string;
}

interface DoctorDetails {
  name: string;
  email: string;
  phone: string;
  category: string;
  workingHospital: string;
  yearsOfExperience: number;
  consultationfee: string;
  address: string;
  profileImageUrl: string;
  profileImg: string;
  availability: boolean;
}

function EditModal({
  isOpen,
  onClose,
  onSave,
  formData,
  handleChange,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: OfficialDetails | PersonalDetails;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4">{title}</h3>
        <div className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())}
              </label>
              <input
                type="text"
                name={key}
                placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                value={formData[key as keyof typeof formData] as string}
                onChange={handleChange}
                disabled={key === 'email' || key === 'profileIMG'}
                className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none ${
                  key === 'email' || key === 'profileIMG' ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="w-full sm:w-auto px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctorProfile() {
  const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false);
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDetails>({
    name: '',
    email: '',
    phone: '',
    category: '',
    workingHospital: '',
    yearsOfExperience: 0,
    consultationfee: '',
    address: '',
    profileImageUrl: '',
    profileImg: '',
    availability: true,
  });

  const [officialDetails, setOfficialDetails] = useState<OfficialDetails>({
    category: '',
    workingHospital: '',
    yearsOfExperience: 0,
    consultationfee: '',
  });

  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileIMG: '',
  });

  const [availability, setAvailability] = useState<boolean>(true);

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAvailability(e.target.value === 'Active');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);

    doctorAxiosInstance
      .put('/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        const { profileImageUrl } = response.data;
        setDoctorDetails((prevDetails) => ({
          ...prevDetails,
          profileImageUrl,
          profileImg: profileImageUrl,
        }));
        setPersonalDetails((prevDetails) => ({
          ...prevDetails,
          profileIMG: profileImageUrl,
        }));
        toast.success('Profile image updated successfully!');
      })
      .catch((error) => {
        console.error('Error uploading profile image:', error);
        toast.error('Failed to upload profile image.');
      });
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem('doctorToken');

    if (storedToken) {
      axios.get(`${BASE_URL}/doctor/doctor`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((response) => {
          const doctorData = response.data;
          setDoctorDetails(doctorData);
          setAvailability(doctorData.availability);
          setOfficialDetails({
            category: doctorData.category || '',
            workingHospital: doctorData.workingHospital || '',
            yearsOfExperience: doctorData.yearsOfExperience || 0,
            consultationfee: doctorData.consultationfee || '',
          });
          setPersonalDetails({
            name: doctorData.name || '',
            email: doctorData.email || '',
            phone: doctorData.phone || '',
            address: doctorData.address || '',
            profileIMG: doctorData.profileImg || ''
          });
        })
        .catch((error) => {
          console.error('Error fetching doctor details:', error);
          toast.error("Failed to fetch doctor details.");
        });
    }
  }, []);

  const handleSaveAvailability = () => {
    const storedToken = sessionStorage.getItem('doctorToken');
  
    if (storedToken) {
      axios.put(`${BASE_URL}/doctor/availability`, { availability, email: doctorDetails.email }, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => {
          toast.success('Availability status updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating availability:', error);
          toast.error('Failed to update availability.');
        });
    }
  };

  const handleOfficialEditClick = () => {
    setIsOfficialModalOpen(true);
  };

  const handlePersonalEditClick = () => {
    setIsPersonalModalOpen(true);
  };

  const handleModalClose = () => {
    setIsOfficialModalOpen(false);
    setIsPersonalModalOpen(false);
  };

  const handleSaveOfficialDetails = () => {
    const storedToken = sessionStorage.getItem('doctorToken');
    if (storedToken) {
      axios
        .put(
          `${BASE_URL}/doctor/doctor/official`,
          officialDetails,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        )
        .then(() => {
          handleModalClose();
          toast.success("Official details updated successfully!");
        })
        .catch((error) => {
          console.error('Error updating official details:', error);
          toast.error("Failed to update official details.");
        });
    }
  };

  const handleSavePersonalDetails = () => {
    const storedToken = sessionStorage.getItem('doctorToken');
    if (storedToken) {
      axios
        .put(
          `${BASE_URL}/doctor/doctor/personal`,
          personalDetails,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        )
        .then(() => {
          handleModalClose();
          toast.success("Personal details updated successfully!");
        })
        .catch((error) => {
          console.error('Error updating personal details:', error);
          toast.error("Failed to update personal details.");
        });
    }
  };

  const handleOfficialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOfficialDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name === 'yearsOfExperience' ? Number(value) : value,
    }));
  };

  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'profileIMG') return;
    setPersonalDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header Section with Gradient Background */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300">
        {/* Availability Dropdown */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
          <label htmlFor="availability" className="block text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-white">
            Availability
          </label>
          <select
            id="availability"
            value={availability ? 'Active' : 'Inactive'}
            onChange={handleAvailabilityChange}
            onBlur={handleSaveAvailability}
            className={`p-2 text-xs sm:text-sm border rounded-lg transition-colors duration-300 ease-in-out ${
              availability
                ? 'bg-green-100 border-green-400 text-green-600'
                : 'bg-red-100 border-red-400 text-red-600'
            }`}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Profile Image */}
        <div className="absolute -bottom-12 sm:-bottom-16 md:-bottom-20 left-4 sm:left-8 md:left-10">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white border-4 border-white rounded-full shadow-lg">
            {personalDetails.profileIMG ? (
              <img 
                src={`${BASE_URL}/${personalDetails.profileIMG}`} 
                alt="Profile"
                className='rounded-full object-cover w-full h-full' 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-2xl sm:text-3xl md:text-4xl font-semibold">
                  {personalDetails.name.charAt(0).toUpperCase() || 'D'}
                </span>
              </div>
            )}
            
            <form encType="multipart/form-data">
              <label className="absolute bottom-0 right-0 bg-teal-500 rounded-full p-2 sm:p-3 cursor-pointer hover:bg-teal-600 transition-colors shadow-lg">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <FiCamera className="text-white text-base sm:text-lg md:text-xl" />
              </label>
            </form>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 sm:mt-20 md:mt-24 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            {personalDetails.name || 'Doctor Name'}
          </h2>
        </div>
        <div className="mb-6">
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            {officialDetails.category || 'Specialty'}
          </p>
        </div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl">
          {/* Official Details Card */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Official Details</h3>
              <button
                onClick={handleOfficialEditClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Edit official details"
              >
                <FiEdit2 className="text-teal-500 text-lg sm:text-xl cursor-pointer" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-700 text-sm sm:text-base min-w-32">Hospital:</strong>
                <p className="text-gray-600 text-sm sm:text-base">{officialDetails.workingHospital || 'Not specified'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-700 text-sm sm:text-base min-w-32">Experience:</strong>
                <p className="text-gray-600 text-sm sm:text-base">{officialDetails.yearsOfExperience || 0} years</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-700 text-sm sm:text-base min-w-32">Consultation Fee:</strong>
                <p className="text-gray-600 text-sm sm:text-base">₹{officialDetails.consultationfee || 'Not specified'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-700 text-sm sm:text-base min-w-32">Category:</strong>
                <p className="text-gray-600 text-sm sm:text-base">{officialDetails.category || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Personal Details Card */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Personal Details</h3>
              <button
                onClick={handlePersonalEditClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Edit personal details"
              >
                <FiEdit2 className="text-teal-500 text-lg sm:text-xl cursor-pointer" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-700 text-sm sm:text-base min-w-32">Name:</strong>
                <p className="text-gray-600 text-sm sm:text-base">{personalDetails.name || 'Not specified'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-700 text-sm sm:text-base min-w-32">Email:</strong>
                <p className="text-gray-600 text-sm sm:text-base break-all">{personalDetails.email || 'Not specified'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <strong className="text-gray-700 text-sm sm:text-base min-w-32">Phone:</strong>
                <p className="text-gray-600 text-sm sm:text-base">{personalDetails.phone || 'Not specified'}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start">
                <strong className="text-gray-700 text-sm sm:text-base min-w-32">Address:</strong>
                <p className="text-gray-600 text-sm sm:text-base">{personalDetails.address || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      <EditModal
        isOpen={isOfficialModalOpen}
        onClose={() => setIsOfficialModalOpen(false)}
        onSave={handleSaveOfficialDetails}
        formData={officialDetails}
        handleChange={handleOfficialInputChange}
        title="Edit Official Details"
      />
      <EditModal
        isOpen={isPersonalModalOpen}
        onClose={() => setIsPersonalModalOpen(false)}
        onSave={handleSavePersonalDetails}
        formData={personalDetails}
        handleChange={handlePersonalInputChange}
        title="Edit Personal Details"
      />
    </div>
  );
}

export default DoctorProfile;