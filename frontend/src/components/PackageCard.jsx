import React from 'react';
// Import matching icons from react-icons
import { FaUsers, FaRulerCombined, FaDollarSign, FaTree, FaWifi, FaWind } from 'react-icons/fa';
import { MdBalcony } from 'react-icons/md';

function PackageCard({ room }) {
  // Graceful fallback if amenities aren't provided
  const amenities = room.amenities || {};

  return (
    <div className="flex flex-col sm:flex-row border border-gray-100 rounded-2xl p-4 shadow-md bg-white hover:shadow-lg transition-shadow duration-200">
      
      {/* Left Side: Room Image */}
      <div className="w-full sm:w-44 h-40 sm:h-auto shrink-0 mb-4 sm:mb-0">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Right Side: Information Content */}
      <div className="grow flex flex-col justify-between pl-0 sm:pl-5">
        <div>
          {/* Room Name */}
          <p className="text-slate-900 font-bold text-base mb-3 leading-tight">
            {room.name}
          </p>

          {/* Metadata Specs */}
          <div className="space-y-2 text-xs font-semibold text-gray-700 mb-4">
            
            <div className="flex items-center gap-2">
              <span>{room.name}</span>
              <span className="text-gray-500 font-medium">{room.price}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="border border-gray-800 rounded-full p-px flex items-center justify-center w-4 h-4">
                <FaDollarSign className="text-gray-800 text-[10px]" />
              </div>
              <span>Price:</span>
              <span className="text-gray-500 font-medium">{room.price}</span>
            </div>
          </div>

          {/* Amenities Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-medium text-gray-600 border-t border-gray-100 pt-3 mb-4">
            {amenities.terrace && (
              <span className="flex items-center gap-1">
                <MdBalcony className="text-xs text-gray-700" /> Terrace
              </span>
            )}
            {amenities.gardenView && (
              <span className="flex items-center gap-1">
                <FaTree className="text-xs text-gray-700" /> Garden View
              </span>
            )}
            {amenities.wifi && (
              <span className="flex items-center gap-1">
                <FaWifi className="text-xs text-gray-700" /> Free WiFi
              </span>
            )}
            {amenities.ac && (
              <span className="flex items-center gap-1">
                <FaWind className="text-xs text-gray-700" /> Air Conditions
              </span>
            )}
          </div>
        </div>

        {/* Edit / Delete Buttons */}
        <div className="flex items-center gap-3 mt-auto">
          <button className="flex-1 bg-[#28a745] hover:bg-green-600 text-white font-bold text-xs py-1.5 rounded-md transition-colors text-center">
            Edit
          </button>
          <button className="flex-1 bg-[#dc3545] hover:bg-red-600 text-white font-bold text-xs py-1.5 rounded-md transition-colors text-center">
            Delete
          </button>
        </div>
      </div>

    </div>
  );
}

export default PackageCard;