import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HotelAvailabilityCard = () => {
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "",
    rooms: "",
  });

  const handleAvailabilityCheck = () => {
    // API call can be added here

    navigate("/booking-page", {
      state: {
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
            value: `${hotelData.guests} Adult(s)`,
          },
          {
            label: "Rooms",
            value: `${hotelData.rooms} Room(s)`,
          },
        ],

        service: {
          image:
            "https://images.unsplash.com/photo-1566073771259-6a8506099945",
          name: "Cinnamon Grand Colombo",
          location: "Colombo, Sri Lanka",
          rating: 4.8,
          reviews: 230,
          description:
            "Luxury 5-star hotel with ocean view.",
        },

        pricing: {
          currency: "USD",
          items: [
            {
              label: "Room Price (3 Nights)",
              amount: 360,
            },
            {
              label: "Taxes & Fees",
              amount: 54,
            },
          ],
        },
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-bold text-lg mb-6">
        Check Availability
      </h2>

      <div className="space-y-4">
        <div>
          <label>Check-in Date</label>

          <input
            type="date"
            value={hotelData.checkIn}
            onChange={(e) =>
              setHotelData({
                ...hotelData,
                checkIn: e.target.value,
              })
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label>Check-out Date</label>

          <input
            type="date"
            value={hotelData.checkOut}
            onChange={(e) =>
              setHotelData({
                ...hotelData,
                checkOut: e.target.value,
              })
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label>Guests</label>

          <input
            type="number"
            value={hotelData.guests}
            onChange={(e) =>
              setHotelData({
                ...hotelData,
                guests: e.target.value,
              })
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div>
          <label>Rooms</label>

          <input
            type="number"
            value={hotelData.rooms}
            onChange={(e) =>
              setHotelData({
                ...hotelData,
                rooms: e.target.value,
              })
            }
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <button
          onClick={handleAvailabilityCheck}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Check Availability
        </button>
      </div>
    </div>
  );
};

export default HotelAvailabilityCard;