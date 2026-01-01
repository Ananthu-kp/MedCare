import React, { useState, useEffect } from 'react';
import { FiCamera, FiEdit2, FiX } from 'react-icons/fi';
import { toast } from 'sonner';
import axios from 'axios';
import { BASE_URL } from '../../Config/baseURL';
import { useUser } from '../Users/Context/userContext';

interface FormData {
  [key: string]: string | number | boolean;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Edit Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                name={key}
                placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                value={formData[key] as string}
                onChange={handleChange}
                disabled={key === 'email' || key === 'profileIMG'}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none ${key === 'email' || key === 'profileIMG' ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="w-full sm:w-auto px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function UserProfile() {
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { user, setUser, updateUserData, fetchUserData } = useUser();
  const [personalDetails, setPersonalDetails] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setPersonalDetails({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    } else {
      fetchUserData();
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const token = sessionStorage.getItem('userToken');

      const response = await axios.put(`${BASE_URL}/upload-profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const { profileImageUrl } = response.data;
        setUser((prevUser: any) => ({
          ...prevUser!,
          profileImg: profileImageUrl,
        }));
        toast.success('Profile image updated successfully!');
      }
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload profile image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePersonalEditClick = () => {
    setIsPersonalModalOpen(true);
  };

  const handleModalClose = () => {
    setIsPersonalModalOpen(false);
  };

  const handleSavePersonalDetails = () => {
    updateUserData(personalDetails);
    handleModalClose();
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

  const profileImageUrl = user?.profileImg
    ? `${BASE_URL}/${user.profileImg}`
    : 'https://via.placeholder.com/150';

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header Section */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-teal-400 via-teal-500 to-green-300">
        {/* Profile Picture - Responsive positioning */}
        <div className="absolute -bottom-12 sm:-bottom-14 md:-bottom-16 left-1/2 transform -translate-x-1/2 sm:left-6 md:left-10 sm:transform-none">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40">
            <div className="w-full h-full bg-white border-4 border-white rounded-full shadow-lg overflow-hidden">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Camera Icon Overlay */}
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-teal-500 p-2 rounded-full cursor-pointer hover:bg-teal-600 transition-colors shadow-lg"
            >
              {isUploading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <FiCamera className="text-white text-lg sm:text-xl" />
              )}
              <input
                id="profile-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 md:mt-24">
        {/* Name - Centered on mobile, left-aligned on desktop */}
        <div className="text-center sm:text-left sm:ml-36 md:ml-44 lg:ml-52 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {personalDetails.name || 'User Name'}
          </h2>
          <p className="text-gray-600 mt-1">{personalDetails.email}</p>
        </div>

        {/* Personal Details Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Personal Details
              </h3>
              <button
                onClick={handlePersonalEditClick}
                className="text-teal-500 hover:text-teal-600 transition-colors p-2"
              >
                <FiEdit2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="mt-1 text-gray-800 text-lg">{personalDetails.name || 'Not provided'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-gray-800 text-lg break-all">{personalDetails.email || 'Not provided'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="mt-1 text-gray-800 text-lg">{personalDetails.phone || 'Not provided'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="mt-1 text-gray-800 text-lg">{personalDetails.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isPersonalModalOpen}
        onClose={handleModalClose}
        onSave={handleSavePersonalDetails}
        formData={personalDetails}
        handleChange={(e) => handleInputChange(e, setPersonalDetails)}
      />
    </div>
  );
}

export default UserProfile;