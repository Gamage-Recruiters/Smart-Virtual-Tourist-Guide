import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ActivityAvailabilityCard = () => {
  const navigate = useNavigate();

  const [activityData, setActivityData] = useState({
    activityDate: "",
    timeSlot: "",
    participants: "",
  });

  const handleAvailabilityCheck = () => {
    // Call availability API here

    navigate("/booking-page", {
      state: {
        service: {
          image:
            "https://images.unsplash.com/photo-1549366021-9f761d040a94",
          name: "Yala Safari Adventure",
          location: "Yala National Park",
          rating: 4.9,
          reviews: 315,
          description:
            "Full-day safari experience with experienced guides and luxury jeep transport.",
        },

        bookingDetails: [
          {
            label: "Activity Date",
            value: activityData.activityDate,
          },
          {
            label: "Time Slot",
            value: activityData.timeSlot,
          },
          {
            label: "Participants",
            value: `${activityData.participants} Person(s)`,
          },
        ],

        pricing: {
          currency: "USD",
          items: [
            {
              label: "Safari Ticket",
              amount: 50,
            },
            {
              label: "Participants",
              amount: Number(activityData.participants) * 50,
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

        {/* Activity Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Activity Date
          </label>

          <input
            type="date"
            value={activityData.activityDate}
            onChange={(e) =>
              setActivityData({
                ...activityData,
                activityDate: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Slot
          </label>

          <select
            value={activityData.timeSlot}
            onChange={(e) =>
              setActivityData({
                ...activityData,
                timeSlot: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          >
            <option value="">Select a time slot</option>
            <option value="7:00 AM">7:00 AM</option>
            <option value="9:00 AM">9:00 AM</option>
            <option value="10:30 AM">10:30 AM</option>
          </select>
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Participants
          </label>

          <input
            type="number"
            min="1"
            value={activityData.participants}
            onChange={(e) =>
              setActivityData({
                ...activityData,
                participants: e.target.value,
              })
            }
            placeholder="Enter number of participants"
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

export default ActivityAvailabilityCard;