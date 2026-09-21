import React from 'react';
import { FaCheck } from 'react-icons/fa';

const SuccessPopup = ({ isOpen, title = "Success", icon = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Popup Box */}
      <div
        className="
          relative
          z-10
          bg-white
          w-fit
          max-w-[90%]
          px-10
          py-8
          rounded-[28px]
          shadow-2xl
          text-center
        "
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-black break-words">
          {title}
        </h2>

        {/* Icon */}
        {icon && (
          <div className="flex justify-center mt-6">
            <div
              className="
                w-16
                h-16
                rounded-full
                border-4
                border-green-500
                flex
                items-center
                justify-center
              "
            >
              <FaCheck className="text-green-500 text-3xl" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPopup;