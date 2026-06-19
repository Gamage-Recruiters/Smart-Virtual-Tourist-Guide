import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VehicleRentalAvailabilityCard = () => {
  const navigate = useNavigate();

  const [vehicleData, setVehicleData] = useState({
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    pickupLocation: "",
    returnLocation: "",
  });

  const handleAvailabilityCheck = () => {
    navigate("/booking-page", {
      state: {
        service: {
          image:
            "https://images.unsplash.com/photo-1550355291-bbee04a92027",
          name: "Toyota Prius Hybrid",
          location: "Negombo, Sri Lanka",
          rating: 4.7,
          reviews: 96,
          description:
            "Fuel-efficient hybrid vehicle with automatic transmission and air conditioning.",
        },

        bookingDetails: [
          {
            label: "Pickup Date",
            value: vehicleData.pickupDate,
          },
          {
            label: "Return Date",
            value: vehicleData.returnDate,
          },
          {
            label: "Pickup Time",
            value: vehicleData.pickupTime,
          },
          {
            label: "Return Time",
            value: vehicleData.returnTime,
          },
          {
            label: "Pickup Location",
            value: vehicleData.pickupLocation,
          },
          {
            label: "Return Location",
            value: vehicleData.returnLocation,
          },
        ],

        pricing: {
          currency: "USD",
          items: [
            {
              label: "Vehicle Rental Fee",
              amount: 150,
            },
            {
              label: "Insurance Fee",
              amount: 25,
            },
            {
              label: "Service Charge",
              amount: 10,
            },
          ],
        },

        serviceType: "vehicle",
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-bold text-lg mb-6">
        Check Availability
      </h2>

      <div className="space-y-4">

        {/* Pickup Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Date
          </label>

          <input
            type="date"
            value={vehicleData.pickupDate}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                pickupDate: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Date
          </label>

          <input
            type="date"
            value={vehicleData.returnDate}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                returnDate: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Pickup Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Time
          </label>

          <input
            type="time"
            value={vehicleData.pickupTime}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                pickupTime: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Return Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Time
          </label>

          <input
            type="time"
            value={vehicleData.returnTime}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                returnTime: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Location
          </label>

          <input
            type="text"
            value={vehicleData.pickupLocation}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                pickupLocation: e.target.value,
              })
            }
            placeholder="Enter pickup location"
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Return Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Location
          </label>

          <input
            type="text"
            value={vehicleData.returnLocation}
            onChange={(e) =>
              setVehicleData({
                ...vehicleData,
                returnLocation: e.target.value,
              })
            }
            placeholder="Enter return location"
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

export default VehicleRentalAvailabilityCard;