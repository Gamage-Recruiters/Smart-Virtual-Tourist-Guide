import React, { useState, useEffect } from 'react';
import { fetchTripFeedback } from '../services/feedbackService';
import { fetchItinerary } from '../services/itineraryService';

const RateExperiencePDF = ({ touristId, tripId }) => {
  const [feedback, setFeedback] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      if (!touristId || !tripId) return;
      try {
        const result = await fetchTripFeedback(touristId, tripId);

        if (result.success) {
          setFeedback(result.data);
        }
      } catch (error) {
        console.error("Error loading feedback in PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [touristId, tripId]);

  useEffect(() => {
    const loadHighlights = async () => {
      if (!touristId || !tripId) return;
      try {
        const result = await fetchItinerary(touristId, tripId);

        if (result.success) {
          setHighlights(result.data.trip_summary);
        }
      } catch (error) {
        console.error("Error loading highlights in PDF:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHighlights();
  }, [touristId, tripId]);


  const rating = feedback ? feedback.overallRating : 5;
  const notes = feedback ? feedback.feedbackText : "No personal notes provided for this journey.";

  const getRatingLabel = (val) => {
    const labels = {
      5: "Excellent trip experience",
      4: "Very Good trip experience",
      3: "Good trip experience",
      2: "Fair trip experience",
      1: "Poor trip experience"
    };
    return labels[val] || "Trip experience";
  };

  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading feedback section...</div>;
  }

  return (
    <section className="bg-white w-full max-w-[794px] mx-auto p-10 md:p-14 border-x border-b border-gray-100 rounded-t-none rounded-b-[32px] sm:rounded-b-[48px] shadow-none">

      {/* ────────────────────────────────────────────────────────
            1. TOP HEADER (Final Trip Report | Page 6 of 6)
         ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">
        <span>Final Trip Report</span>
        <span>Page 6 of 6</span>
      </div>

      {/* ────────────────────────────────────────────────────────
            2. TRIP HIGHLIGHTS & PERSONAL NOTES HEADER BAR
         ──────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl px-6 py-4 mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-[#A2D5FF]/10">
        <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-[#111111] leading-none">
          Trip Highlights & Personal Notes
        </h2>
      </div>

      {/* ────────────────────────────────────────────────────────
            3. HIGHLIGHTS DESCRIPTION PARAGRAPHS
         ──────────────────────────────────────────────────────── */}
      <div className="space-y-4 mb-8 px-2 text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed text-justify">
        <p>
          {highlights}
        </p>
      </div>

      {/* ────────────────────────────────────────────────────────
            4. PERSONAL NOTES CONTAINER 
         ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF]/50 rounded-[20px] p-6 sm:p-8 border border-[#A2D5FF]/15 mb-10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <h4 className="font-extrabold text-gray-900 text-sm sm:text-base md:text-lg mb-3">
          Personal Notes
        </h4>
        <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
          {notes}
        </p>
      </div>

      {/* ────────────────────────────────────────────────────────
            5. RATE YOUR EXPERIENCE 
         ──────────────────────────────────────────────────────── */}
      <div className="px-2 mb-12">
        <h4 className="font-extrabold text-gray-900 text-sm sm:text-base md:text-lg mb-3">
          Rate Your Experience
        </h4>

        <div className="flex text-amber-400 text-lg sm:text-xl leading-none gap-0.5 mb-2 select-none">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? "text-amber-400" : "text-gray-200"}>
              ★
            </span>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-gray-500 font-bold">
          {rating.toFixed(1)} out of 5 stars - {getRatingLabel(rating)}
        </p>
      </div>

      {/* ────────────────────────────
            6. DOCUMENT CLOSING FOOTER 
          ──────────────────────────── */}
      <div className="text-[10px] sm:text-xs text-gray-400 font-bold leading-relaxed pt-6 border-t border-gray-100 mt-14 flex flex-col gap-0.5 px-2 select-none">
        <p>Report generated on {reportDate}</p>
        <p>Powered by Smart Virtual Tourist Guide</p>
      </div>

    </section>
  );
};

export default RateExperiencePDF;