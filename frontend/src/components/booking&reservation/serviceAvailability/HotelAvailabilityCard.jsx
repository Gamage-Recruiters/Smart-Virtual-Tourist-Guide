import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaStar, FaCalendarAlt } from 'react-icons/fa';

const HotelAvailabilityCard = ({ hotel, selectedRoom }) => {
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1 Guest",
  });

  // Default fallback values based on the mockup
  const basePricePerNight = selectedRoom ? selectedRoom.price : 150;
  const rating = hotel?.rating || 4.8;
  const reviews = hotel?.reviews || 234;

  const calculateNights = () => {
    if (hotelData.checkIn && hotelData.checkOut) {
      const start = new Date(hotelData.checkIn);
      const end = new Date(hotelData.checkOut);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 2; // Defaulting to 2 to match mockup calculation
    }
    return 2;
  };

  const nights = calculateNights();
  
  const roomPrice = nights * basePricePerNight;
  const serviceFee = 25;
  const taxes = 15;
  const total = roomPrice + serviceFee + taxes;

  const handleAvailabilityCheck = () => {
    if (!hotelData.checkIn || !hotelData.checkOut) {
      toast.error("Please fill in booking dates.");
      return;
    }

    navigate("/booking-page", {
      state: {
        service: {
          image: hotel?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          name: hotel?.name || "Ocean Breeze Resort",
          location: hotel?.location || "Bentota, Sri Lanka",
          rating: rating,
          reviews: reviews,
          description: hotel?.description || "Experience luxury at Ocean Breeze Resort.",
        },
        bookingDetails: [
          { label: "Room", value: selectedRoom ? selectedRoom.name : "Standard Room" },
          { label: "Check-in", value: hotelData.checkIn },
          { label: "Check-out", value: hotelData.checkOut },
          { label: "Guests", value: hotelData.guests },
        ],
        pricing: {
          currency: "USD",
          items: [
            { label: `$${basePricePerNight} x ${nights} nights`, amount: roomPrice },
            { label: "Service fee", amount: serviceFee },
            { label: "Taxes", amount: taxes },
          ],
        },
        serviceType: "hotel",
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      
      {/* Header (Price & Rating) */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-3xl font-extrabold text-gray-900">${basePricePerNight}</span>
          <span className="text-xs text-gray-500 font-medium ml-1">per night</span>
        </div>
        <div className="flex items-center mt-2 text-xs font-semibold text-gray-700">
          <FaStar className="text-yellow-400 mr-1 w-3 h-3" />
          {rating} <span className="text-gray-400 ml-1 font-normal underline cursor-pointer">({reviews} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Date Pickers */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-in</label>
          <div className="relative">
            <input
              type="date"
              value={hotelData.checkIn}
              onChange={(e) => setHotelData({ ...hotelData, checkIn: e.target.value })}
              className="w-full border border-gray-200 p-3 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Check-out</label>
          <div className="relative">
            <input
              type="date"
              value={hotelData.checkOut}
              onChange={(e) => setHotelData({ ...hotelData, checkOut: e.target.value })}
              className="w-full border border-gray-200 p-3 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>

        {/* Guests Dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Guests</label>
          <select
            value={hotelData.guests}
            onChange={(e) => setHotelData({ ...hotelData, guests: e.target.value })}
            className="w-full border border-gray-200 p-3 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="1 Guest">1 Guest</option>
            <option value="2 Guests">2 Guests</option>
            <option value="3 Guests">3 Guests</option>
            <option value="4 Guests">4 Guests</option>
          </select>
        </div>

        <button
          onClick={handleAvailabilityCheck}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm mt-2"
        >
          Check availability
        </button>

        {/* Total Price Display */}
        <div className="pt-4 mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">${basePricePerNight} x {nights} nights</span>
                <span className="font-semibold text-gray-700">${roomPrice}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 underline cursor-pointer decoration-gray-300">Service fee</span>
                <span className="font-semibold text-gray-700">${serviceFee}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 underline cursor-pointer decoration-gray-300">Taxes</span>
                <span className="font-semibold text-gray-700">${taxes}</span>
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-gray-900 font-extrabold text-base">Total</span>
                <span className="text-base font-extrabold text-gray-900">
                    ${total}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HotelAvailabilityCard;