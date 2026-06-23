import { useState, useEffect } from "react";
// import { useParams } from 'react-router-dom';
import { fetchItinerary } from '../services/itineraryService';

import FinalTripReportPDF from "./FinalTripReportPDF";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TripItinerary from "../components/TripItinerary";
import FinancialSummary from "../components/FinancialSummary";
import ServiceProviders from "../components/ServiceProviders";
import HealthSafetyLog from "../components/HealthSafetyLog";
import TripHighlights from "../components/TripHighlights";
import RateExperience from "../components/RateExperience";
import Footer from "../components/Footer";


const FinalTripReport = () => {

  // const { touristId, tripId } = useParams();

  const touristId = "6a28dc49a14342989f1e4ee4";
  const tripId = "6a28dc49a14342989f1e4ee5";

  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

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

  const formatDateRange = (start, end) => {
    if (!start || !end) return "";
    const s = new Date(start).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const e = new Date(end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return `${s} - ${e}`;
  };

  if (loading) return <div className="text-center py-10 font-bold">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500 font-bold">Error: {error}</div>;
  if (!itinerary) return <div className="text-center py-10">Data not found.</div>;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter',sans-serif" }}>

      <div className="print:hidden">

        {/* Google Fonts */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          * { box-sizing: border-box; }
          
          @media print {
            @page {
              margin: 0; 
            }
            body {
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}</style>

        {/* Header Section */}
        <Header />

        {/* Hero Section */}
        <HeroSection />

        {/* Trip Report Title Section */}
        <div className="bg-[#D3EEFD] px-6 md:px-12 lg:px-20 py-8 md:py-10 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold text-[#1A1A1A] leading-tight">
              Your Complete Trip Report
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base mt-2 font-medium">
              {formatDateRange(itinerary.start_date, itinerary.end_date)}
            </p>

            {/* 5. Dynamic Status (Capitalized) */}
            <div className="mt-4 px-10 py-2.5 bg-gradient-to-b from-white to-[#C8E7FD] text-[#1C2C3F] text-xs sm:text-sm font-bold rounded-2xl shadow-[0_4px_12px_rgba(180,215,245,0.4)] border border-[#B3DCFB] capitalize">
              {itinerary.status}
            </div>
          </div>

          <button
            onClick={() => setIsDownloadOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-b from-white to-[#C8E7FD] text-[#1C2C3F] text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-[0_4px_12px_rgba(180,215,245,0.4)] border border-[#B3DCFB] hover:brightness-95 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-5 h-5 text-[#1C2C3F]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>Download PDF</span>
          </button>
        </div>


        {/* Main Section */}
        <main className="w-full min-h-screen bg-gradient-to-b from-[#D3EEFD] to-[#F4F9FF] px-4 sm:px-6 md:px-10 lg:px-16 py-7 space-y-7 flex flex-col items-center">

          {/* ── SECTION 1 : TRIP ITINERARY*/}
          <TripItinerary />

          {/* ── SECTION 2 : FINANCIAL SUMMARY */}
          <FinancialSummary />

          {/* ── SECTION 3 : SERVICE PROVIDERS */}
          <ServiceProviders />

          {/* ── SECTION 4 : HEALTH & SAFETY */}
          <HealthSafetyLog />

          {/* ── SECTION 5 : TRIP HIGHLIGHTS & STATS */}
          <TripHighlights />

          {/* ── SECTION 6 : FEEDBACK & RATINGS */}
          <RateExperience />

        </main>

        {/* Bottom Action Section */}
        <div className="bg-[#f1f2f6] px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 flex flex-col items-center justify-center gap-6 w-full">
          <div className="w-full max-w-[720px] flex flex-col items-center gap-5">

            <button className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-b from-white to-[#BCE2FF] text-[#1C2C3F] font-bold text-xs sm:text-sm md:text-base px-10 py-3.5 rounded-2xl shadow-sm border border-[#A2D5FF]/30 hover:brightness-95 transition-all duration-300">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-5 h-5 text-[#1C2C3F]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Download Complete PDF Report</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">

              <button className="flex items-center justify-center gap-2 bg-gradient-to-b from-white to-[#BCE2FF] text-[#1C2C3F] font-bold text-xs sm:text-sm py-3 px-5 rounded-2xl shadow-sm border border-[#A2D5FF]/30 hover:brightness-95 transition-all duration-300">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4.5 h-4.5 text-[#1C2C3F]"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.47 5.35a3 3 0 0 1-3.06 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 6.137a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
                <span>Email Report</span>
              </button>

              <button className="flex items-center justify-center gap-2 bg-gradient-to-b from-white to-[#BCE2FF] text-[#1C2C3F] font-bold text-xs sm:text-sm py-3 px-5 rounded-2xl shadow-sm border border-[#A2D5FF]/30 hover:brightness-95 transition-all duration-300">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-4.5 h-4.5 text-[#1C2C3F]"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
                <span>Share Trip</span>
              </button>

              <button className="flex items-center justify-center gap-2 bg-gradient-to-b from-white to-[#BCE2FF] text-[#1C2C3F] font-bold text-xs sm:text-sm py-3 px-5 rounded-2xl shadow-sm border border-[#A2D5FF]/30 hover:brightness-95 transition-all duration-300">
                {/* Printer SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-4.5 h-4.5 text-[#1C2C3F]"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-14.326 0C3.768 7.44 3 8.375 3 9.456V15.75a2.25 2.25 0 0 0 2.25 2.25h1.091M9 9h6M9 12h6" />
                </svg>
                <span>Print Summary</span>
              </button>

            </div>

          </div>
        </div>

        {/* Footer Section */}
        <Footer />

        {/* POPUP MODAL */}
        {isDownloadOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300"
            onClick={() => setIsDownloadOpen(false)}
          >
            {/* Modal Card */}
            <div
              className="w-full max-w-md bg-gradient-to-b from-[#8bc4ec] to-[#007AFF] rounded-[32px] p-8 sm:p-10 flex flex-col items-center text-center text-white border border-white/20 shadow-2xl relative transition-transform transform scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <h2 className="text-3xl sm:text-4xl font-black mb-3 select-none">
                Done
              </h2>

              {/* File info */}
              <p className="text-sm sm:text-base font-bold text-white/90 leading-relaxed max-w-[290px] mb-8 select-none">
                2 - Version Controlling and Workflows with ... .pdf <br />
                <span className="opacity-80">2 MB - 6 pages</span>
              </p>

              {/* Split Download Button */}
              <button
                onClick={() => {
                  setIsDownloadOpen(false)

                  const originalTitle = document.title;
                  document.title = "Final_Trip_Report";

                  window.print();

                  document.title = originalTitle;
                }}
                className="flex w-full items-center bg-[#18A0FB] hover:bg-blue-600 text-white font-extrabold rounded-2xl border border-white/25 overflow-hidden shadow-md transition-colors duration-300 mb-6 max-w-[280px]">
                <span className="flex-1 py-3 text-center text-sm sm:text-base tracking-wide">
                  Download PDF
                </span>
                <span className="border-l border-white/20 h-12 flex items-center justify-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </span>
              </button>

              {/* "Export As" Pill */}
              <div className="bg-white text-[#1C2C3F] text-sm sm:text-base font-black px-8 py-2.5 rounded-2xl shadow-sm mb-6 select-none">
                Export As
              </div>

              {/* Circular Action Icons Row */}
              <div className="flex gap-4 mb-8">
                {/* Email Icon Button */}
                <button className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-[#1C2C3F] rounded-2xl flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1C2C3F]">
                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.47 5.35a3 3 0 0 1-3.06 0L1.5 8.67Z" />
                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 6.137a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                  </svg>
                </button>

                {/* Share Icon Button */}
                <button className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-[#1C2C3F] rounded-2xl flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-[#1C2C3F]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                  </svg>
                </button>

                {/* Print Icon Button */}
                <button className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-[#1C2C3F] rounded-2xl flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-[#1C2C3F]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-14.326 0C3.768 7.44 3 8.375 3 9.456V15.75a2.25 2.25 0 0 0 2.25 2.25h1.091M9 9h6M9 12h6" />
                  </svg>
                </button>
              </div>

              {/* "Start over" Outline Button */}
              <button
                onClick={() => setIsDownloadOpen(false)}
                className="px-6 py-2 border border-white/40 text-white font-semibold text-xs sm:text-sm rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                Start over
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="hidden print:block">
        <FinalTripReportPDF itinerary={itinerary} />
      </div>

    </div>
  );
}


export default FinalTripReport;
