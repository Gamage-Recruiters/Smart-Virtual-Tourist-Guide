import React from 'react';

/**
 * Interactive / Static MapPreview Placeholder Component
 * @param {string} destination - Selected destination string
 */
export const MapPreview = ({ destination = 'Sigiriya' }) => {
  return (
    <div className="space-y-1.5">
      <div className="relative w-full h-36 rounded-2xl border border-slate-200/80 bg-slate-100 overflow-hidden flex items-center justify-center text-center shadow-inner">
        {/* Subtly styled static map image pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px] opacity-40 bg-slate-200/70" />

        {/* Map Pin Box */}
        <div className="relative z-10 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
          <span className="text-xs">📍</span>
        </div>
      </div>
    </div>
  );
};


export default MapPreview;
