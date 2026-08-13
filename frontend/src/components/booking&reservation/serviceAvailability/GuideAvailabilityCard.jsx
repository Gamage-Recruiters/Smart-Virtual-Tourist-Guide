import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GuideAvailabilityCard = ({ guide, serviceData }) => {
  const navigate = useNavigate();

  const [guideData, setGuideData] = useState({
    tourDate: "",
    language: "",
    participants: "",
    meetingLocation: "",
    duration: "",
  });

  const handleAvailabilityCheck = () => {
    navigate("/booking-page", {
      state: {
        service: {
          image: serviceData?.image || guide?.image,
          name: serviceData?.name || guide?.name,
          location: "Sri Lanka",
          rating: serviceData?.rating || 4.8,
          reviews: serviceData?.reviews || 142,
          description: serviceData?.description || guide?.title,
        },

        bookingDetails: [
          {
            label: "Tour Date",
            value: guideData.tourDate,
          },
          {
            label: "Language",
            value: guideData.language,
          },
          {
            label: "Participants",
            value: `${guideData.participants} Person(s)`,
          },
          {
            label: "Meeting Location",
            value: guideData.meetingLocation,
          },
          {
            label: "Tour Duration",
            value: guideData.duration,
          },
        ],

        pricing: {
          currency: "USD",
          items: [
            {
              label: "Guide Fee",
              amount: parseInt(guide?.price) || 120,
            },
            {
              label: "Service Charge",
              amount: 15,
            },
          ],
        },

        serviceType: "guide",
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-bold text-lg mb-6">
        Check Availability
      </h2>

      <div className="space-y-4">

        {/* Tour Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tour Date
          </label>

          <input
            type="date"
            value={guideData.tourDate}
            onChange={(e) =>
              setGuideData({
                ...guideData,
                tourDate: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Preferred Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Language
          </label>

          <select
            value={guideData.language}
            onChange={(e) =>
              setGuideData({
                ...guideData,
                language: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Sinhala">Sinhala</option>
            <option value="Tamil">Tamil</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Japanese">Japanese</option>
            <option value="Chinese">Chinese</option>
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
            value={guideData.participants}
            onChange={(e) =>
              setGuideData({
                ...guideData,
                participants: e.target.value,
              })
            }
            placeholder="Enter participant count"
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Meeting Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Location
          </label>

          <input
            type="text"
            value={guideData.meetingLocation}
            onChange={(e) =>
              setGuideData({
                ...guideData,
                meetingLocation: e.target.value,
              })
            }
            placeholder="Enter meeting location"
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Tour Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tour Duration
          </label>

          <select
            value={guideData.duration}
            onChange={(e) =>
              setGuideData({
                ...guideData,
                duration: e.target.value,
              })
            }
            className="w-full border border-gray-300 p-3 rounded-lg"
          >
            <option value="">Select Duration</option>
            <option value="Half Day (4 Hours)">
              Half Day (4 Hours)
            </option>
            <option value="Full Day (8 Hours)">
              Full Day (8 Hours)
            </option>
            <option value="Multiple Days">
              Multiple Days
            </option>
          </select>
        </div>

        {/* Check Availability */}
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

export default GuideAvailabilityCard;