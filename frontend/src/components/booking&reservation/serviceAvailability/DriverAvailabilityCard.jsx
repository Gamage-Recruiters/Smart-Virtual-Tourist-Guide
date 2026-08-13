import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DriverAvailabilityCard = ({ driver, serviceData }) => {
  const navigate = useNavigate();

  const [driverData, setDriverData] = useState({
    travelDate: "",
    pickupTime: "",
    pickupLocation: "",
    destination: "",
    passengers: "",
    duration: "",
  });

  const handleAvailabilityCheck = () => {
    navigate("/booking-page", {
      state: {
        service: {
          type: "driver",
          image: serviceData?.image || driver?.image,
          name: serviceData?.name || driver?.driverName,
          location: "Sri Lanka",
          rating: serviceData?.rating || 4.9,
          reviews: serviceData?.reviews || 187,
          description: serviceData?.description || driver?.title,
        },

        serviceType: "driver",
        bookingDetails: [
          {
            label: "Travel Date",
            value: driverData.travelDate,
          },
          {
            label: "Pickup Time",
            value: driverData.pickupTime,
          },
          {
            label: "Pickup Location",
            value: driverData.pickupLocation,
          },
          {
            label: "Destination",
            value: driverData.destination,
          },
          {
            label: "Passengers",
            value: `${driverData.passengers} Person(s)`,
          },
          
        ],

        pricing: {
          currency: "USD",
          items: [
            {
              label: "Driver Service Fee",
              amount: parseInt(driver?.price) || 80,
            },
            {
              label: "Travel Charge",
              amount: 40,
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

        {/* Travel Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Travel Date
          </label>

          <input
            type="date"
            value={driverData.travelDate}
            onChange={(e) =>
              setDriverData({
                ...driverData,
                travelDate: e.target.value,
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
            value={driverData.pickupTime}
            onChange={(e) =>
              setDriverData({
                ...driverData,
                pickupTime: e.target.value,
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
            value={driverData.pickupLocation}
            onChange={(e) =>
              setDriverData({
                ...driverData,
                pickupLocation: e.target.value,
              })
            }
            placeholder="Enter pickup location"
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>

          <input
            type="text"
            value={driverData.destination}
            onChange={(e) =>
              setDriverData({
                ...driverData,
                destination: e.target.value,
              })
            }
            placeholder="Enter destination"
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Passengers
          </label>

          <input
            type="number"
            min="1"
            value={driverData.passengers}
            onChange={(e) =>
              setDriverData({
                ...driverData,
                passengers: e.target.value,
              })
            }
            placeholder="Enter passenger count"
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

export default DriverAvailabilityCard;