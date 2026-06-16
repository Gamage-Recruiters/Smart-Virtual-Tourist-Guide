import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import { fetchItinerary } from '../services/itineraryService'; 

const TripItineraryPDF = () => {
 
  // const { touristId, tripId } = useParams();
  const touristId = "6a28dc49a14342989f1e4ee4";
  const tripId = "6a28dc49a14342989f1e4ee5";

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItinerary = async () => {
      try {
        const result = await fetchItinerary(touristId, tripId);
        if (result.success) {
          setItinerary(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("An error occurred while retrieving data.");
      } finally {
        setLoading(false);
      }
    };

    if (touristId && tripId) {
      loadItinerary();
    }
  }, [touristId, tripId]);

  if (loading) return <div className="text-center py-10 font-bold">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-bold">Error: {error}</div>;
  if (!itinerary) return null;

  // 3. Date Formatting Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsDay = { weekday: 'long' };

    const datePart = d.toLocaleDateString('en-US', optionsDate);
    const dayPart = d.toLocaleDateString('en-US', optionsDay);
    return `${datePart} - ${dayPart}`;
  };

  return (
    <section className="bg-white w-full max-w-[794px] mx-auto p-10 md:p-14 border-x border-gray-100 rounded-none break-after-page">

      {/* TOP HEADER */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">
        <span>Final Trip Report</span>
        <span>Page 2 of 6</span>
      </div>

      {/* COMPLETE ITINERARY HEADER BAR */}
      <div className="w-full bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl px-6 py-4 mb-10 shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-[#A2D5FF]/10">
        <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-[#111111] leading-none">
          Complete Itinerary
        </h2>
      </div>

      {/* TIMELINE LAYOUT */}
      <div className="relative pl-12 sm:pl-16 space-y-12 pb-2">

        {/* Continuous vertical gray line */}
        <div className="absolute left-[24px] sm:left-[32px] top-5 bottom-[-32px] w-[1.5px] bg-gray-300" />

        {/* 4. Itinerary daily_plan mapping */}
        {itinerary.daily_plan.map((dayData) => (
          <div key={dayData._id || dayData.day} className="relative">

            {/* Day Number Circle */}
            <div className="absolute -left-10 sm:-left-12 top-0.5 w-8 h-8 rounded-full bg-[#E5E5E5] text-gray-600 text-xs sm:text-sm font-bold flex items-center justify-center border-4 border-white z-10">
              {dayData.day}
            </div>

            {/* Day Heading Details */}
            <div className="mb-4">
              <p className="font-bold text-gray-900 text-sm sm:text-base leading-none">
                {formatDate(dayData.date)}
              </p>

              {/* Location with Pin Icon */}
              <div className="flex items-center gap-1 mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-3.5 h-3.5 text-gray-500"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span className="font-bold text-gray-500 text-xs sm:text-sm leading-none">
                  {dayData.location}
                </span>
              </div>
            </div>

            {/* Activities List (Split row layout) */}
            <div className="space-y-3 mt-4">
              {dayData.activities.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-start gap-4 text-xs sm:text-sm text-gray-700 leading-relaxed py-0.5 border-b border-gray-50/50 pb-1.5"
                >
                  {/* Left: Activity Details */}
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 mt-1.5 flex-shrink-0 text-[8px]">•</span>
                    <span className="font-semibold text-gray-600">
                      {item.name} {item.time ? `• ${item.time}` : ''}
                    </span>
                  </div>

                  {/* Right: Sub-location with Map Pin Icon */}
                  <div className="flex items-center gap-1.5 text-gray-500 font-bold flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="w-3.5 h-3.5 text-gray-400"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span className="text-xs sm:text-sm">
                      {item.location || dayData.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};


export default TripItineraryPDF;