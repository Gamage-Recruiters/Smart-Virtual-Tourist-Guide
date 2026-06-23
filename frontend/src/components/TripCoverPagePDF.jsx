import React, { useState, useEffect } from 'react';
import { fetchItinerary } from '../services/itineraryService'; 
const TripCoverPagePDF = () => {

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

  const formatDateRange = (start, end) => {
    if (!start || !end) return "";
    const s = new Date(start).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const e = new Date(end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `${s} - ${e}`;
  };

  const getCompletedActivitiesCount = () => {
    let count = 0;
    if (itinerary.daily_plan) {
      itinerary.daily_plan.forEach(day => {
        if (day.activities) {
          count += day.activities.filter(a => a.completed).length;
        }
      });
    }
    return count;
  };

  const formatCurrency = (amount, currencyCode) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const summaryItems = itinerary.final_report?.highlights?.length > 0
    ? itinerary.final_report.highlights
    : [
      "Explored the cultural heritage of Colombo and Kandy",
      "Climbed the historic Sigiriya Rock Fortress",
      "Stayed under budget with comprehensive travel planning"
    ];

  return (
    <section className="bg-white w-full max-w-[794px] mx-auto p-10 md:p-14 border-x border-gray-100 rounded-none break-after-page">

      {/* TOP HEADER */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-16">
        <span>Final Trip Report</span>
        <span>Page 1 of 6</span>
      </div>

      {/* CENTERED COVER TITLE & PIN */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.2"
            stroke="currentColor"
            className="w-16 h-16 text-gray-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </div>

        {/* Dynamic Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {itinerary.title || "Final Trip Report"}
        </h1>
        {/* Dynamic Date */}
        <p className="text-sm sm:text-base font-semibold text-gray-400 mt-2">
          {formatDateRange(itinerary.start_date, itinerary.end_date)}
        </p>
      </div>

      {/* TRIP AT A GLANCE */}
      <div className="mb-14">
        <h3 className="text-base sm:text-lg font-extrabold text-[#111111] mb-5">
          Trip at a Glance
        </h3>

        <div className="space-y-3">
          {/* Duration */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <span className="text-xs sm:text-sm font-semibold text-gray-500">Duration</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#1C2C3F]">
              {itinerary.num_days} Days / {itinerary.num_days > 1 ? itinerary.num_days - 1 : 0} Nights
            </span>
          </div>

          {/* Cities Visited */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <span className="text-xs sm:text-sm font-semibold text-gray-500">Cities Visited</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#1C2C3F]">
              {itinerary.final_report?.places_visited || 0} Cities
            </span>
          </div>

          {/* Activities Completed */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <span className="text-xs sm:text-sm font-semibold text-gray-500">Activities Completed</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#1C2C3F]">
              {getCompletedActivitiesCount()} Activities
            </span>
          </div>

          {/* Total Spent */}
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <span className="text-xs sm:text-sm font-bold text-gray-800">Total Spent</span>
            <span className="text-xs sm:text-sm font-black text-gray-900">
              {formatCurrency(itinerary.total_spent_lkr, itinerary.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* TRIP SUMMARY */}
      <div>
        <h3 className="text-base sm:text-lg font-extrabold text-[#111111] mb-5">
          Trip Summary
        </h3>
        <ul className="space-y-3.5">
          {summaryItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
              <span className="flex-shrink-0 mt-0.5">✅</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
};

export default TripCoverPagePDF;