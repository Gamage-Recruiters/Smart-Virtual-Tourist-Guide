import React from 'react';

const HealthSafetyLogPDF = () => {

  const medicalInfo = [
    "Pre-trip health checkup completed",
    "Blood Type: O+",
    "All vaccinations up to date",
    "No medical incidents reported during the trip"
  ];

  const safetyAlerts = [
    {
      title: "Weather Advisory",
      desc: "Heavy rainfall expected in Kandy region",
      time: "March 16, 2026 - 8:00 AM"
    },
    {
      title: "Safety Update",
      desc: "All routes clear and safe for travel",
      time: "March 17, 2026 - 6:30 AM"
    }
  ];

  return (

    <section className="bg-white w-full max-w-[794px] mx-auto p-10 md:p-14 border-x border-gray-100 rounded-none break-after-page">
      
      {/* ────────────────────────────────────────────────────────
            1. TOP HEADER (Final Trip Report | Page 5 of 6)
         ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">
        <span>Final Trip Report</span>
        <span>Page 5 of 6</span>
      </div>

      {/* ────────────────────────────────────────────────────────
            2. HEALTH & SAFETY DOCUMENTATION HEADER BAR
         ──────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl px-6 py-4 mb-10 shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-[#A2D5FF]/10">
        <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-[#111111] leading-none">
          Health & Safety Documentation
        </h2>
      </div>

      {/* ────────────────────────────────────────────────────────
            3. MEDICAL INFORMATION SUB-SECTION (Gradient Bars)
         ──────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <h3 className="text-base sm:text-lg font-extrabold text-gray-800 mb-5 pl-4">
          Medical Information
        </h3>
        
        <div className="space-y-3">
          {medicalInfo.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center px-12 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
            >
              <span className="text-xs sm:text-sm font-bold text-gray-700">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
            4. SAFETY ALERTS TIMELINE SUB-SECTION (Warning List)
         ──────────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-base sm:text-lg font-extrabold text-gray-800 mb-6 pl-4">
          Safety Alerts Timeline
        </h3>
        
        <div className="space-y-8 pl-4">
          {safetyAlerts.map((alert, idx) => (
            <div key={idx} className="flex items-start gap-4">
              
              {/* Red Warning Icon (No entry/minus circular symbol) */}
              <span className="text-xl flex-shrink-0 mt-0.5 select-none">
                ⛔
              </span>
              
              {/* Alert Details */}
              <div className="flex flex-col gap-1.5">
                {/* Title */}
                <p className="font-extrabold text-gray-900 text-sm sm:text-base leading-none">
                  {alert.title}
                </p>
                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                  {alert.desc}
                </p>
                {/* Date/Time */}
                <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide">
                  {alert.time}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default HealthSafetyLogPDF;