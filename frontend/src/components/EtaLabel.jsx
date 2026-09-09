import React from 'react';

export default function EtaLabel({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-block px-[18px] py-2 bg-[#1A73E8] hover:bg-[#165fbe] text-white rounded-[16px] font-semibold text-[16px] cursor-pointer shadow-[0_2px_8px_rgba(26,115,232,0.18)] my-3 transition-colors border-0"
      aria-label="Show ETA details"
    >
      {label}
    </button>
  );
}
