import React, { useState, useEffect } from 'react';
import { fetchMyBookings } from '../services/bookingService';

const ServiceProvidersPDF = ({ touristId, tripId }) => {
  const [mainPartners, setMainPartners] = useState([]);
  const [additionalProviders, setAdditionalProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPdfData = async () => {
      const userEmail = "it22300096@my.sliit.lk"; 
      const result = await fetchMyBookings(userEmail);

      if (result.success) {
   
        const partners = [
          ...result.data.activities.map(a => ({
            name: a.service.name,
            role: a.service.type || "Activity",
            rating: `${a.service.rating || 4.9}/5.0`,
            desc: a.service.description || "Fine services provided",
            img: a.service.image 
          })),
          ...result.data.hotels.map(h => ({
            name: h.service.name,
            role: "Accommodation",
            rating: `${h.service.rating || 4.9}/5.0`,
            desc: h.service.description || "Comfortable stay",
            img: h.service.image 
          }))
        ].slice(0, 3); 

        setMainPartners(partners);

        const additional = result.data.vehicles.map(v => ({
          name: v.service.name,
          role: "Transportation",
          date: v.pickupDate ? new Date(v.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Mar 15, 2025",
          img: v.service.image
        }));

        setAdditionalProviders(additional);
      }
      setLoading(false);
    };

    loadPdfData();
  }, [touristId, tripId]);

  return (
    <section className="bg-white w-full max-w-[794px] mx-auto p-10 md:p-14 border-x border-gray-100 rounded-none break-after-page">
      
      {/* ────────────────────────────────────────────────────────
            1. TOP HEADER (Final Trip Report | Page 4 of 6)
         ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">
        <span>Final Trip Report</span>
        <span>Page 4 of 6</span>
      </div>

      {/* ────────────────────────────────────────────────────────
            2. TRAVEL PARTNERS & CONTACTS HEADER BAR
         ──────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl px-6 py-4 mb-10 shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-[#A2D5FF]/10">
        <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-[#111111] leading-none">
          Travel Partners & Contacts
        </h2>
      </div>

      {/* ────────────────────────────────────────────────────────
            3. TRAVEL PARTNERS GRID (3 Cards in one row)
         ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
        {mainPartners.map((p, idx) => (
          <div 
            key={idx} 
            className="bg-gradient-to-b from-white to-[#BCE2FF] rounded-[24px] p-5 flex flex-col items-center text-center gap-3 border border-[#A2D5FF]/15"
          >
       
            <img 
              src={p.img} 
              alt={p.name} 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-sm" 
            />
            
            {/* Name */}
            <p className="font-extrabold text-[#1C2C3F] text-xs sm:text-sm leading-tight max-w-[140px]">
              {p.name}
            </p>
            
            {/* Role Badge */}
            <span className="bg-[#B9DDFB] text-[#1E50FF] text-[10px] sm:text-xs font-extrabold px-4 py-1 rounded-full">
              {p.role}
            </span>
            
            {/* Star Ratings */}
            <div className="flex items-center gap-1 mt-0.5 justify-center">
              <div className="flex text-amber-400 text-xs sm:text-sm leading-none">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-gray-500 ml-1">
                {p.rating}
              </span>
            </div>
            
            {/* Description */}
            <p className="text-[10px] sm:text-xs text-gray-500 font-semibold leading-relaxed max-w-[160px] min-h-[32px] flex items-center justify-center">
              {p.desc}
            </p>
            
            {/* Contact Button */}
            <button className="w-full max-w-[120px] py-1.5 bg-[#1E50FF] hover:bg-blue-600 text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-sm transition-colors mt-auto">
              Contact
            </button>
          </div>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────
            4. ADDITIONAL SERVICE PROVIDERS
         ──────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-[#F2F9FD] to-[#BCE2FF] rounded-xl px-6 py-4 mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.01)] border border-[#A2D5FF]/10">
        <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-[#111111] leading-none">
          Additional Service Providers
        </h2>
      </div>

      <div className="space-y-4 px-4">
        {additionalProviders.length > 0 ? (
          additionalProviders.map((ap, i) => (
            <div 
              key={i} 
              className="flex justify-between items-center text-xs sm:text-sm text-gray-700 font-semibold py-1 border-b border-gray-50/50 pb-2"
            >
              <span className="text-gray-800">
                {ap.name} <span className="text-gray-400 font-medium text-xs">({ap.role})</span>
              </span>
              <span className="text-gray-500 font-semibold whitespace-nowrap">
                {ap.date}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 italic px-2">No additional providers found.</p>
        )}
      </div>

    </section>
  );
};

export default ServiceProvidersPDF;