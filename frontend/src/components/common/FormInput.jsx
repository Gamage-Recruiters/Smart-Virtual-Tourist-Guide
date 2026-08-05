import React from 'react';

/**
 * Reusable FormInput Component
 * @param {string} label - Input label
 * @param {boolean} required - Displays required red asterisk
 */
export const FormInput = ({ label, required, ...props }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    )}
    <input
      className="w-full px-4 py-2.5 text-xs bg-white border border-slate-200/80 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-slate-800 disabled:opacity-60 disabled:bg-slate-50"
      {...props}
    />
  </div>
);

export default FormInput;
