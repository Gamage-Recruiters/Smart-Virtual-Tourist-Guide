import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantAvailabilityCard = () => {
  const navigate = useNavigate();

  const [restaurantData, setRestaurantData] = useState({
    reservationDate: "",
    reservationTime: "",
    guests: "",
    seating: "",
    specialRequest: "",
  });

  const handleAvailabilityCheck = () => {
    navigate("/booking-page", {
      state: {
        service: {
          image:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
          name: "Ministry of Crab",
          location: "Dutch Hospital, Colombo",
          rating: 4.9,
          reviews: 1250,
          description:
            "Award-winning seafood restaurant famous for Sri Lankan crab dishes.",
        },

        bookingDetails: [
          {
            label: "Reservation Date",
            value: restaurantData.reservationDate,
          },
          {
            label: "Reservation Time",
            value: restaurantData.reservationTime,
          },
          {
            label: "Guests",
            value: `${restaurantData.guests} Person(s)`,
          },
          {
            label: "Seating Preference",
            value: restaurantData.seating,
          },
          {
            label: "Special Request",
            value:
              restaurantData.specialRequest || "None",
          },
        ],

        pricing: {
          currency: "USD",
          items: [
            {
              label: "Table Reservation Fee",
              amount: 10,
            },
            {
              label: "Service Charge",
              amount: 5,
            },
          ],
        },

        serviceType: "restaurant",
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-bold text-lg mb-6">
        Check Availability
      </h2>

      <div className="space-y-4">

        {/* Reservation Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reservation Date
          </label>

          <input
            type="date"
            value={restaurantData.reservationDate}
            onChange={(e) =>
              setRestaurantData({
                ...restaurantData,
                reservationDate: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Reservation Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reservation Time
          </label>

          <input
            type="time"
            value={restaurantData.reservationTime}
            onChange={(e) =>
              setRestaurantData({
                ...restaurantData,
                reservationTime: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests
          </label>

          <input
            type="number"
            min="1"
            value={restaurantData.guests}
            onChange={(e) =>
              setRestaurantData({
                ...restaurantData,
                guests: e.target.value,
              })
            }
            placeholder="Enter number of guests"
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Seating Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seating Preference
          </label>

          <select
            value={restaurantData.seating}
            onChange={(e) =>
              setRestaurantData({
                ...restaurantData,
                seating: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          >
            <option value="">
              Select Seating Preference
            </option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Private Dining">
              Private Dining
            </option>
            <option value="No Preference">
              No Preference
            </option>
          </select>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>

          <textarea
            rows="3"
            value={restaurantData.specialRequest}
            onChange={(e) =>
              setRestaurantData({
                ...restaurantData,
                specialRequest: e.target.value,
              })
            }
            placeholder="Birthday celebration, dietary requirements, etc."
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleAvailabilityCheck}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Check Availability
        </button>

      </div>
    </div>
  );
};

export default RestaurantAvailabilityCard;