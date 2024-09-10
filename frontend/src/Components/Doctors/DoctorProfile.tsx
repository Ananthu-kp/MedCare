import React, { useState, useEffect } from 'react';
import { FiCamera, FiEdit2 } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { toast } from 'sonner';
import doctorAxiosInstance from '../../Config/AxiosInstance/doctorInstance';

interface FormData {
  [key: string]: string | number;
}

function EditModal({
  isOpen,
  onClose,
  onSave,
  formData,
  handleChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Edit Details</h3>
        <div className="space-y-4">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
              value={formData[key]}
              onChange={handleChange}
              disabled={key === 'email' || key === 'profileIMG'}
              className="w-full p-2 border rounded"
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
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
  const [doctorDetails, setDoctorDetails] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    workingHospital: '',
    yearsOfExperience: 0,
    consultationfee: '',
    address: '',
    profileImageUrl: '',
  });

  const [officialDetails, setOfficialDetails] = useState<FormData>({
    category: '',
    workingHospital: '',
    yearsOfExperience: 0,
    consultationfee: '',
  });

  const [personalDetails, setPersonalDetails] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      setProfileImage(file);
      handleImageUpload(file)
    }
  };

  const handleImageUpload = (file: File) => {
    console.log(file)
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
        }));
        toast.success('Profile image updated successfully!');
      })
      .catch((error) => {
        console.error('Error uploading profile image:', error);
        toast.error('Failed to upload profile image.');
      });
  };

  useEffect(() => {
    console.log('Fetching doctor details...');
    const storedToken = sessionStorage.getItem('doctorToken');
    console.log('Token:', storedToken);

    if (storedToken) {
      axios.get(`${BASE_URL}/doctor/doctor`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((response) => {
          console.log('Doctor Data:', response.data);
          const doctorData = response.data;
          setDoctorDetails(doctorData);
          setOfficialDetails({
            category: doctorData.category,
            workingHospital: doctorData.workingHospital,
            yearsOfExperience: doctorData.yearsOfExperience,
            consultationfee: doctorData.consultationfee,
          });
          setPersonalDetails({
            name: doctorData.name,
            email: doctorData.email,
            phone: doctorData.phone,
            address: doctorData.address,
            profileIMG: doctorData.profileImg
          });
        })
        .catch((error) => {
          if (error.response) {
            console.error('Error response:', error.response.data);
          } else if (error.request) {
            console.error('Error request:', error.request);
          } else {
            console.error('Error message:', error.message);
          }
          console.log(error)
          toast.error("Failed to fetch doctor details.");
        });
    } else {
      console.log('No token found.');
    }
  }, []);

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
    console.log(officialDetails.consultationfee);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setDetails: React.Dispatch<React.SetStateAction<FormData>>
  ) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'profileIMG') return;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="relative w-full h-[200px] bg-gradient-to-br from-teal-400 via-teal-500 to-green-300">
      <div className="absolute bottom-[-60px] left-10 w-[150px] h-[150px] bg-white border-4 rounded-full flex items-center justify-center">
        <img src={`${BASE_URL}/${personalDetails.profileIMG}`} alt=""
          className='rounded-full object-cover h-[150px]' />
        <form encType="multipart/form-data">
          <input
            type="file"
            className="opacity-0 absolute w-full h-full cursor-pointer"
            accept="image/*"
            onChange={handleImageChange}
          />
        </form>
        <FiCamera className="text-gray-500 text-4xl" />
      </div>
      <div className="absolute bottom-[-100px] left-20">
        <h2 className="text-xl font-semibold text-black">
          {personalDetails.name}
        </h2>
      </div>
      <div className="absolute bottom-[-130px] left-20">
        <h2 className="text-xl font-semibold text-black">
          {officialDetails.category}
        </h2>
      </div>

      {/* Official Details and Personal Details Sections */}
      <div>
        <div className="absolute bottom-[-350px] left-0 w-1/2 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-black">Official Details</h3>
            <FiEdit2
              onClick={handleOfficialEditClick}
              className="cursor-pointer text-blue-500"
            />
          </div>
          <div className="mt-4">
            <p><strong>Hospital:</strong> {officialDetails.workingHospital}</p>
            <p><strong>Experience:</strong> {officialDetails.yearsOfExperience}</p>
            <p><strong>Fee:</strong> {officialDetails.consultationfee}</p>
          </div>
        </div>

        <div className="absolute bottom-[-350px] right-0 w-1/2 p-4 bg-gray-100 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-black">Personal Details</h3>
            <FiEdit2
              onClick={handlePersonalEditClick}
              className="cursor-pointer text-blue-500"
            />
          </div>
          <div className="mt-4">
            <p><strong>Email:</strong> {personalDetails.email}</p>
            <p><strong>Phone:</strong> {personalDetails.phone}</p>
            <p><strong>Address:</strong> {personalDetails.address}</p>
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      <EditModal
        isOpen={isOfficialModalOpen}
        onClose={() => setIsOfficialModalOpen(false)}
        onSave={handleSaveOfficialDetails}
        formData={officialDetails}
        handleChange={(e) =>
          handleInputChange(e, setOfficialDetails)
        }
      />
      <EditModal
        isOpen={isPersonalModalOpen}
        onClose={() => setIsPersonalModalOpen(false)}
        onSave={handleSavePersonalDetails}
        formData={personalDetails}
        handleChange={(e) =>
          handleInputChange(e, setPersonalDetails)
        }
      />
    </div>
  );
}

export default DoctorProfile;
