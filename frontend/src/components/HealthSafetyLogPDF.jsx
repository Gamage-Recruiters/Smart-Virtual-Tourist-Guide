import React from 'react';
import { useState, useEffect } from 'react';
import { fetchMedicalInfo, fetchIncidents } from '../services/healthService';

const HealthSafetyLogPDF = ({ touristId, tripId }) => {

  const [healthData, setHealthData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadMedical = async () => {
      const result = await fetchMedicalInfo(touristId);
      if (result.success) setHealthData(result.data);
    };

    const loadAlerts = async () => {
      const result = await fetchIncidents(touristId);
      if (result.success) {

        const formatted = result.data.map(inc => ({
          title: inc.incidentCategory,
          desc: `District: ${inc.district}`,
          time: `${inc.incidentDate} - ${inc.incidentTime}`
        }));
        setAlerts(formatted);
      }
    };


    if (touristId) {
      loadMedical();
      loadAlerts();
    }
  }, [touristId]);



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
          {healthData ? (
            <>
              <div className="flex items-center px-12 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10">
                <span className="text-sm font-bold text-gray-700">Blood Type: {healthData.bloodType}</span>
              </div>

              <div className="flex items-center px-12 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10">
                <span className="text-sm font-bold text-gray-700">
                  {healthData.allVaccinationsUpToDate ? "All vaccinations up to date" : "Vaccinations pending"}
                </span>
              </div>

              <div className="flex items-center px-12 py-4 bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl border border-[#A2D5FF]/10">
                <span className="text-sm font-bold text-gray-700">
                  {healthData.incidentCount > 0 ? `${healthData.incidentCount} medical incidents reported` : "No medical incidents reported during the trip"}
                </span>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500 italic px-12">Loading medical info...</div>
          )}
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
          {alerts.length > 0 ? (
            alerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <span className="text-xl flex-shrink-0 mt-0.5 select-none">⚠️</span>
                <div className="flex flex-col gap-1.5">
                  <p className="font-extrabold text-gray-900 text-sm sm:text-base leading-none">
                    {alert.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                    {alert.desc}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wide">
                    {alert.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic pl-4">No safety alerts reported.</p>
          )}
        </div>
      </div>

    </section>
  );
};

export default HealthSafetyLogPDF;