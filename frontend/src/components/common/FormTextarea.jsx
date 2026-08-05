import React from 'react';

/**
 * Reusable FormTextarea Component
 * @param {string} label - Input label
 * @param {boolean} required - Displays required red asterisk
 * @param {number} rows - Number of text rows
 */
export const FormTextarea = ({ label, required, rows = 3, ...props }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    )}
    <textarea
      rows={rows}
      className="w-full px-4 py-3 text-xs bg-white border border-slate-200/80 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-slate-800 resize-none"
      {...props}
    />
  </div>
);

export default FormTextarea;
