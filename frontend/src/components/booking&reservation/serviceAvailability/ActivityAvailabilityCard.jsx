import React, { useState, useEffect } from "react";
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

  const todayStr = new Date().toISOString().split("T")[0];

  const [activityData, setActivityData] = useState({
    activityDate: todayStr,
    timeSlot: "",
    participants: "1",
  });

  const [calendarSlots, setCalendarSlots] = useState([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [calendarStatus, setCalendarStatus] = useState(null);

  const basePrice = activity?.price || 0;
  const activityId = activity?._id || activity?.id;

  // Fetch real-time availability from activityCalender model when date or activity changes
  useEffect(() => {
    if (!activityId || !activityData.activityDate) return;

    const fetchAvailability = async () => {
      setLoadingCalendar(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/activities/${activityId}/availability?date=${activityData.activityDate}`
        );
        const result = await response.json();

        if (result.success) {
          setCalendarSlots(result.timeSlots || []);
          setCalendarStatus(result.status || 'available');
          // If current selected slot is not set or invalid, select first active slot
          if (result.timeSlots && result.timeSlots.length > 0) {
            const firstAvailable = result.timeSlots.find((s) => s.isAvailable);
            if (firstAvailable) {
              setActivityData((prev) => ({
                ...prev,
                timeSlot: prev.timeSlot || firstAvailable.label,
              }));
            }
          }
        } else {
          setCalendarSlots([]);
        }
      } catch (err) {
        console.error("Error fetching calendar availability:", err);
      } finally {
        setLoadingCalendar(false);
      }
    };

    fetchAvailability();
  }, [activityId, activityData.activityDate]);

  const getTimeSlotsOptions = () => {
    if (calendarSlots.length > 0) {
      return calendarSlots.map((slot) => {
        const displayLabel = formatSlotDisplay(slot);
        const seatsText = slot.isAvailable
          ? `${slot.availableSeats} seat(s) left`
          : "Fully Booked";
        return {
          value: slot.label,
          label: `${displayLabel} - ${seatsText}`,
          disabled: !slot.isAvailable,
          availableSeats: slot.availableSeats,
        };
      });
    }

    // Fallback if no calendar slots fetched yet
    const rawSlots =
      activity?.timeSlotTemplates && activity.timeSlotTemplates.length > 0
        ? activity.timeSlotTemplates
        : activity?.timeSlots && activity.timeSlots.length > 0
        ? activity.timeSlots
        : null;

    if (rawSlots) {
      return rawSlots.map((slot) => {
        const displayLabel = formatSlotDisplay(slot);
        return {
          value: typeof slot === "string" ? slot : slot.label || displayLabel,
          label: displayLabel,
          disabled: false,
          availableSeats: slot.capacity || 15,
        };
      });
    }

    return ["7:00 AM", "9:00 AM", "10:30 AM", "2:00 PM"].map((s) => ({
      value: s,
      label: s,
      disabled: false,
      availableSeats: 15,
    }));
  };

  const slotOptions = getTimeSlotsOptions();

  const handleAvailabilityCheck = async () => {
    // Basic validation
    if (!activityData.activityDate) {
      toast.error("Please select an activity date.");
      return;
    }

    if (!activityData.timeSlot) {
      toast.error("Please select a time slot.");
      return;
    }

    const participantsCount = Number(activityData.participants) || 1;
    if (participantsCount < 1) {
      toast.error("Please enter a valid number of participants.");
      return;
    }

    // Call backend API to check availability using activityCalender.model.js
    if (activityId) {
      setCheckingAvailability(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/activities/${activityId}/check-availability`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              activityId,
              date: activityData.activityDate,
              timeSlot: activityData.timeSlot,
              participants: participantsCount,
            }),
          }
        );
        const result = await response.json();

        if (!result.success || !result.available) {
          toast.error(
            result.message || "Selected date or time slot is not available for booking."
          );
          setCheckingAvailability(false);
          return;
        }

        toast.success("Capacity confirmed! Proceeding to booking...");
      } catch (err) {
        console.error("Availability check failed:", err);
        toast.error("Failed to check availability. Please try again.");
        setCheckingAvailability(false);
        return;
      } finally {
        setCheckingAvailability(false);
      }
    }

    // Navigate to booking page with validated parameters
    navigate("/booking-page", {
      state: {
        service: {
          serviceId: activityId,
          type: "activity",
          image: activity?.image,
          title: activity?.title,
          location: activity?.location,
          category: activity?.category,
          rating: activity?.rating,
          reviews: activity?.reviews,
          duration: activity?.duration,
        },
        serviceType: "activity",
        activityId,
        activityDate: activityData.activityDate,
        timeSlot: activityData.timeSlot,
        participants: participantsCount,
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
              label: `${participantsCount} Participant(s) x ${basePrice.toLocaleString()} LKR`,
              amount: participantsCount * basePrice,
            },
          ],
        },
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 className="font-bold text-lg mb-6 text-gray-800 flex items-center justify-between">
        <span>Check Availability</span>
        {loadingCalendar && (
          <span className="text-xs text-blue-600 font-normal animate-pulse">
            Checking slots...
          </span>
        )}
      </h2>

      {calendarStatus === "unavailable" && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg">
          This activity is unavailable on the selected date.
        </div>
      )}

      <div className="space-y-4">
        {/* Activity Date */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">
            Activity Date
          </label>
          <input
            type="date"
            min={todayStr}
            value={activityData.activityDate}
            onChange={(e) =>
              setActivityData({
                ...activityData,
                activityDate: e.target.value,
              })
            }
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
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
            disabled={loadingCalendar || calendarStatus === "unavailable"}
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium disabled:bg-gray-100"
          >
            <option value="">Select a time slot</option>
            {slotOptions.map((option, index) => (
              <option
                key={index}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
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
            max="100"
            value={activityData.participants}
            onChange={(e) =>
              setActivityData({
                ...activityData,
                participants: e.target.value,
              })
            }
            placeholder="Enter number of participants"
            className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          />
        </div>

        {/* Total Price Display */}
        <div className="pt-4 border-t border-gray-100 mt-4 mb-2 flex justify-between items-center">
          <span className="text-gray-500 font-bold text-sm">Total Price</span>
          <span className="text-xl font-black text-blue-600">
            LKR{" "}
            {(
              basePrice * (Number(activityData.participants) || 1)
            ).toLocaleString()}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleAvailabilityCheck}
          disabled={checkingAvailability || calendarStatus === "unavailable"}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md flex justify-center items-center"
        >
          {checkingAvailability ? (
            <span className="inline-flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Checking Capacity...</span>
            </span>
          ) : (
            "Proceed to Booking"
          )}
        </button>
      </div>
    </div>
  );
};

export default ActivityAvailabilityCard;