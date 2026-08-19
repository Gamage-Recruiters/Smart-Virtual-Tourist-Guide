import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
  const [hours, minutes] = timeStr.split(":");
  if (hours === undefined || minutes === undefined) return timeStr;
  const h = parseInt(hours, 10);
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

const formatSlotDisplay = (slot) => {
  if (typeof slot === "string") return slot;
  
  const startFormatted = formatTime(slot.startTime);
  const endFormatted = formatTime(slot.endTime);
  const timeRange = startFormatted && endFormatted 
    ? `${startFormatted} - ${endFormatted}` 
    : (startFormatted || slot.time || "");

  if (slot.label && timeRange) {
    return `${slot.label} (${timeRange})`;
  }
  return slot.label || timeRange || "Time Slot";
};

const ActivityAvailabilityCard = ({ activity }) => {
  const navigate = useNavigate();

  const [activityData, setActivityData] = useState({
    activityDate: "",
    timeSlot: "",
    participants: "1",
  });

  const basePrice = activity?.price || 0;

  // Extract time slots from activity model (timeSlotTemplates or timeSlots) or fallback
  const getTimeSlots = () => {
    const rawSlots =
      activity?.timeSlotTemplates && activity.timeSlotTemplates.length > 0
        ? activity.timeSlotTemplates
        : activity?.timeSlots && activity.timeSlots.length > 0
        ? activity.timeSlots
        : null;

    if (rawSlots) {
      return rawSlots.map((slot) => formatSlotDisplay(slot));
    }

    // Fallback default time slots if activity model has no specified slots
    return ["7:00 AM", "9:00 AM", "10:30 AM", "2:00 PM"];
  };

  const availableTimeSlots = getTimeSlots();

  const handleAvailabilityCheck = () => {
    // Basic validation
    if (!activityData.activityDate || !activityData.timeSlot) {
      toast.error("Please select a date and time slot.");
      return;
    }

    const participantsCount = Number(activityData.participants) || 1;

    navigate("/booking-page", {
      state: {
        service: {
          type: "activity",
          image: activity?.image ,
          title: activity?.title ,
          location: activity?.location ,
          category: activity?.category,
          rating: activity?.rating ,
          reviews: activity?.reviews ,
          duration: activity?.duration
        },

        serviceType: "activity",
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
            value: `${participantsCount} Person(s)`,
          },
        ],

        pricing: {
          currency: "LKR",
          items: [
            {
              label: `${participantsCount} Participant(s) x ${basePrice} LKR`,
              amount: participantsCount * basePrice,
            },
          ],
        },
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 className="font-bold text-lg mb-6 text-gray-800">
        Check Availability
      </h2>

      <div className="space-y-4">

        {/* Activity Date */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
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
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
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
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a time slot</option>
            {availableTimeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
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
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Total Price Display */}
        <div className="pt-4 border-t border-gray-100 mt-4 mb-2 flex justify-between items-center">
            <span className="text-gray-500 font-bold text-sm">Total Price</span>
            <span className="text-xl font-black text-blue-600">
                LKR {(basePrice * (Number(activityData.participants) || 1)).toLocaleString()}
            </span>
        </div>

        {/* Button */}
        <button
          onClick={handleAvailabilityCheck}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md"
        >
          Proceed to Booking
        </button>

      </div>
    </div>
  );
};

export default ActivityAvailabilityCard;