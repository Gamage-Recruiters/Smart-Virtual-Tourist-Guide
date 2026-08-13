import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VehicleRentalAvailabilityCard = ({ vehicle }) => {
  const navigate = useNavigate();

  const [vehicleData, setVehicleData] = useState({
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
    pickupLocation: "",
    returnLocation: "",
  });

  // Parse price which might be a string with commas e.g. "2,500"
  const rawPrice = vehicle?.price ? String(vehicle.price).replace(/,/g, '') : "15000";
  const basePricePerDay = Number(rawPrice) || 15000;

  const calculateDays = () => {
    if (vehicleData.pickupDate && vehicleData.returnDate) {
      const start = new Date(vehicleData.pickupDate);
      const end = new Date(vehicleData.returnDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    }
    return 1;
  };

  const days = calculateDays();
  const rentalFee = days * basePricePerDay;
  const insuranceFee = 2500; // Mock fixed insurance fee
  const serviceCharge = 1000; // Mock fixed service charge

  const handleAvailabilityCheck = () => {
    if (!vehicleData.pickupDate || !vehicleData.returnDate) {
      toast.error("Please select pickup and return dates.");
      return;
    }

    navigate("/booking-page", {
      state: {
        service: {
          image: vehicle?.image || "https://images.unsplash.com/photo-1550355291-bbee04a92027",
          name: vehicle?.name || "Toyota Prius Hybrid",
          location: vehicle?.location || "Island-wide",
          rating: vehicle?.rating || 4.7,
          reviews: vehicle?.reviews || 96,
          description: vehicle?.description || `${vehicle?.type || 'Vehicle'} with ${vehicle?.seats || 'Standard Seats'}.`,
        },

        bookingDetails: [
          {
            label: "Pickup Date & Time",
            value: `${vehicleData.pickupDate} ${vehicleData.pickupTime}`,
          },
          {
            label: "Return Date & Time",
            value: `${vehicleData.returnDate} ${vehicleData.returnTime}`,
          },
          {
            label: "Pickup Location",
            value: vehicleData.pickupLocation || "TBD",
          },
          {
            label: "Return Location",
            value: vehicleData.returnLocation || "TBD",
          },
        ],

        pricing: {
          currency: "LKR",
          items: [
            {
              label: `Rental Fee (${days} Day(s) x ${basePricePerDay.toLocaleString()} LKR)`,
              amount: rentalFee,
            },
            {
              label: "Insurance Fee",
              amount: insuranceFee,
            },
            {
              label: "Service Charge",
              amount: serviceCharge,
            },
          ],
        },

        serviceType: "vehicle",
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 className="font-bold text-lg mb-6 text-gray-800">
        Check Availability
      </h2>

      <div className="space-y-4">

        {/* Pickup Date */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Pickup Date
          </label>
          <input
            type="date"
            value={vehicleData.pickupDate}
            onChange={(e) =>
              setVehicleData({ ...vehicleData, pickupDate: e.target.value })
            }
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Return Date */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Return Date
          </label>
          <input
            type="date"
            value={vehicleData.returnDate}
            onChange={(e) =>
              setVehicleData({ ...vehicleData, returnDate: e.target.value })
            }
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Pickup Time */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">
              Pickup Time
            </label>
            <input
              type="time"
              value={vehicleData.pickupTime}
              onChange={(e) =>
                setVehicleData({ ...vehicleData, pickupTime: e.target.value })
              }
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Return Time */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">
              Return Time
            </label>
            <input
              type="time"
              value={vehicleData.returnTime}
              onChange={(e) =>
                setVehicleData({ ...vehicleData, returnTime: e.target.value })
              }
              className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Pickup Location */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Pickup Location
          </label>
          <input
            type="text"
            value={vehicleData.pickupLocation}
            onChange={(e) =>
              setVehicleData({ ...vehicleData, pickupLocation: e.target.value })
            }
            placeholder="Enter pickup location"
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Return Location */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Return Location
          </label>
          <input
            type="text"
            value={vehicleData.returnLocation}
            onChange={(e) =>
              setVehicleData({ ...vehicleData, returnLocation: e.target.value })
            }
            placeholder="Enter return location"
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Total Price Display */}
        <div className="pt-4 border-t border-gray-100 mt-4 mb-2">
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-500">Rental Fee ({days} Day(s))</span>
                <span className="font-semibold text-gray-700">LKR {rentalFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-500">Taxes & Fees</span>
                <span className="font-semibold text-gray-700">LKR {(insuranceFee + serviceCharge).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-800 font-bold">Total Price</span>
                <span className="text-xl font-black text-blue-600">
                    LKR {(rentalFee + insuranceFee + serviceCharge).toLocaleString()}
                </span>
            </div>
        </div>

        {/* Button */}
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

export default VehicleRentalAvailabilityCard;