import React from 'react';
import { FiCamera } from 'react-icons/fi'; 

function DoctorProfile() {
  return (
    <div className="relative w-full h-[200px] bg-gradient-to-br from-teal-400 via-teal-500 to-green-300">
      <div className="absolute bottom-[-60px] left-10 w-[150px] h-[150px] bg-white border-4 rounded-full flex items-center justify-center">
        <input
          type="file"
          className="opacity-0 absolute w-full h-full cursor-pointer"
          accept="image/*"
        />
        <FiCamera className="text-gray-500 text-4xl" /> 
      </div>
      <div className="absolute bottom-[-100px] left-20">
        <h2 className="text-xl font-semibold text-black">Hello</h2>
      </div>
    </div>
  );
}

export default DoctorProfile;
