import React from 'react';

/**
 * Reusable SectionHeader Component
 * @param {React.ReactNode} icon - Icon element or emoji
 * @param {string} title - Main section title
 * @param {string} description - Optional descriptive subtitle
 */
export const SectionHeader = ({ icon, title, description }) => (
  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 mb-5">
    {icon && (
      <span className="text-sm text-blue-600 font-bold flex items-center justify-center">
        {icon}
      </span>
    )}
    <div>
      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{title}</h3>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
  </div>
);

export default SectionHeader;
