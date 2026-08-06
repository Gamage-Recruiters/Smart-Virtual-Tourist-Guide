import React from 'react';

/**
 * Reusable FormSelect Component
 * @param {string} label - Input label
 * @param {boolean} required - Displays required red asterisk
 * @param {Array<{value: string, label: string}|string>} options - Dropdown option items
 */
export const FormSelect = ({ label, required, options = [], ...props }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    )}
    <select
      className="w-full px-4 py-2.5 text-xs bg-white border border-slate-200/80 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-slate-800 font-medium cursor-pointer"
      {...props}
    >
      {options.map((opt, idx) => {
        const value = typeof opt === 'object' ? opt.value : opt;
        const optLabel = typeof opt === 'object' ? opt.label : opt;
        return (
          <option key={idx} value={value}>
            {optLabel}
          </option>
        );
      })}
    </select>
  </div>
);

export default FormSelect;
