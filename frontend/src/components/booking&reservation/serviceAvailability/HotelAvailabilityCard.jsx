import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const HotelAvailabilityCard = ({ hotel }) => {
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "",
    rooms: "",
  });

  // Parse price which might be a string with commas e.g. "28,500"
  const rawPrice = hotel?.price ? String(hotel.price).replace(/,/g, '') : "15000";
  const basePricePerNight = Number(rawPrice) || 15000;

  const calculateNights = () => {
    if (hotelData.checkIn && hotelData.checkOut) {
      const start = new Date(hotelData.checkIn);
      const end = new Date(hotelData.checkOut);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return 1;
  };

  const nights = calculateNights();
  const roomsCount = Number(hotelData.rooms) || 1;
  
  const roomPrice = nights * basePricePerNight * roomsCount;
  const taxesAndFees = Math.round(roomPrice * 0.15); // 15% tax

  const handleAvailabilityCheck = () => {
    if (!hotelData.checkIn || !hotelData.checkOut || !hotelData.guests || !hotelData.rooms) {
      toast.error("Please fill in all booking details.");
      return;
    }

    navigate("/booking-page", {
      state: {
        service: {
          image: hotel?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          name: hotel?.name || "Cinnamon Grand Colombo",
          location: hotel?.location || "Colombo, Sri Lanka",
          rating: hotel?.rating || hotel?.userRating || 4.8,
          reviews: hotel?.reviews || 230,
          description: hotel?.description || "Luxury hotel with ocean view.",
        },

        bookingDetails: [
          {
            label: "Check-in",
            value: hotelData.checkIn,
          },
          {
            label: "Check-out",
            value: hotelData.checkOut,
          },
          {
            label: "Guests",
            value: `${hotelData.guests} Guest(s)`,
          },
          {
            label: "Rooms",
            value: `${hotelData.rooms} Room(s)`,
          },
        ],

        pricing: {
          currency: "LKR",
          items: [
            {
              label: `Room Price (${roomsCount} Room(s) x ${nights} Night(s) x ${basePricePerNight.toLocaleString()} LKR)`,
              amount: roomPrice,
            },
            {
              label: "Taxes & Fees (15%)",
              amount: taxesAndFees,
            },
          ],
        },

        serviceType: "hotel",
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 className="font-bold text-lg mb-6 text-gray-800">
        Check Availability
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Check-in Date</label>
          <input
            type="date"
            value={hotelData.checkIn}
            onChange={(e) =>
              setHotelData({ ...hotelData, checkIn: e.target.value })
            }
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Check-out Date</label>
          <input
            type="date"
            value={hotelData.checkOut}
            onChange={(e) =>
              setHotelData({ ...hotelData, checkOut: e.target.value })
            }
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Guests</label>
            <input
              type="number"
              min="1"
              value={hotelData.guests}
              onChange={(e) =>
                setHotelData({ ...hotelData, guests: e.target.value })
              }
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Rooms</label>
            <input
              type="number"
              min="1"
              value={hotelData.rooms}
              onChange={(e) =>
                setHotelData({ ...hotelData, rooms: e.target.value })
              }
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Total Price Display */}
        <div className="pt-4 border-t border-gray-100 mt-4 mb-2">
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-500">Room Price ({nights} Night(s))</span>
                <span className="font-semibold text-gray-700">LKR {roomPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-500">Taxes & Fees</span>
                <span className="font-semibold text-gray-700">LKR {taxesAndFees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-800 font-bold">Total Price</span>
                <span className="text-xl font-black text-blue-600">
                    LKR {(roomPrice + taxesAndFees).toLocaleString()}
                </span>
            </div>
        </div>

        <button
          onClick={handleAvailabilityCheck}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md mt-4"
        >
          Proceed to Booking
        </button>
      </div>
    </div>
  );
};

export default HotelAvailabilityCard;