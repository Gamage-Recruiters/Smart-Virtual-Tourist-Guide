import { useState, useEffect } from "react";
import BudgetPanel from "../../../components/Tourist/tripPlanning/BudgetPanel.jsx";
import BudgetOverview from "../../../components/Tourist/tripPlanning/BudgetOverview.jsx";
import DailyItinerary from "../../../components/Tourist/tripPlanning/DailyItinerary.jsx";
import DestinationForm from "../../../components/Tourist/tripPlanning/DestinationForm.jsx";
import DestinationHighlights from "../../../components/Tourist/tripPlanning/DestinationHighlights.jsx";
import image from "../../../assets/tripPlanning/image 12.png";

export default function TripPlanningPage() {
  const [activeNav, setActiveNav] = useState("Plan Trip");
  const [activeDay, setActiveDay] = useState(0);
  const [preferences, setPreferences] = useState(["Culture", "Nature"]);
  const [tripDates, setTripDates] = useState({ startDate: "", endDate: "", numDays: 0 });

  // Load trip dates from localStorage (set during sign-in)
  useEffect(() => {
    const loadDates = () => {
      const tripInfo = JSON.parse(localStorage.getItem("tripInfo") || "{}");
      const start = tripInfo.startDate || "";
      const end   = tripInfo.endDate   || "";
      let numDays = 0;
      if (start && end) {
        numDays = Math.max(1, Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)));
      }
      setTripDates({ startDate: start, endDate: end, numDays });
    };
    loadDates();
    window.addEventListener("tripInfoUpdated", loadDates);
    return () => window.removeEventListener("tripInfoUpdated", loadDates);
  }, []);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const togglePref = (p) =>
    setPreferences(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const prefOptions = ["Culture", "Nature", "Adventure", "Food", "Beach", "History", "Wildlife", "Relaxation"];

  return (
    <div className="p-4 2xl:p-8 flex flex-col xl:flex-row gap-4 2xl:gap-8 overflow-y-auto">

      {/* Main layout: sidebar offset + content */}
      <div className="md:flex-[2.5] 2xl:flex-4 space-y-8">
        {/* Hero banner */}
        <div className="relative w-full h-screen overflow-hidden rounded-2xl">
          {/* Background Image */}
          <img
            src={image}
            alt="Sri Lanka Resort"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/35"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-10 md:px-24 text-white">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Trip Planning
              </h1>

              <p className="mt-4 text-lg md:text-2xl font-semibold leading-snug">
                Generate an AI itinerary for Sri Lanka, customize each day,
                and keep your budget on track.
              </p>

              {/* Buttons */}
              <div className="flex gap-4 mt-8">
                <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl text-white font-semibold shadow-lg">
                  Generate AI Itinerary
                </button>

                <button className="bg-white text-gray-800 hover:bg-gray-100 transition px-6 py-3 rounded-xl font-semibold shadow-lg">
                  Save Draft
                </button>
              </div>

              {/* Bottom Text */}
              <p className="mt-10 text-xl font-bold">
                Drag and drop activities to rearrange your day
              </p>
            </div>
          </div>
        </div>

        {/* Date strip — populated from sign-in data */}
        <div className="bg-white border-b border-gray-100 px-8 py-2 flex items-center gap-2 text-xs text-gray-500">
          <span>📅</span>
          {tripDates.startDate && tripDates.endDate ? (
            <>
              <span className="font-medium text-gray-700">
                {formatDate(tripDates.startDate)} – {formatDate(tripDates.endDate)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                {tripDates.numDays} Day{tripDates.numDays !== 1 ? "s" : ""}
              </span>
            </>
          ) : (
            <span className="text-gray-400 italic">Set your travel dates in Destination Details below</span>
          )}
        </div>


        {/* Content area */}
        <div className="px-6 py-5 flex gap-5">
          {/* LEFT: main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Destination Card */}
            <DestinationForm />

            {/* Daily Itinerary */}
            <DailyItinerary />


            {/* Budget Overview */}
            <BudgetOverview />


            {/* Destination Highlights */}
            <DestinationHighlights />

          </div>

          {/* RIGHT: Budget Panel */}
          <BudgetPanel />
        </div>


      </div>
    </div>
  );
}
