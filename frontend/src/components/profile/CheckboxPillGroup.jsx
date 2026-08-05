import React from 'react';

/**
 * Reusable CheckboxPillGroup Component
 * @param {string} label - Group label
 * @param {Array<string>} options - Available option strings
 * @param {Array<string>} selected - Currently selected option strings
 * @param {Function} onChange - Handler receiving updated selected array
 */
export const CheckboxPillGroup = ({ label, options = [], selected = [], onChange }) => {
  const toggleOption = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((item) => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((opt) => {
          const isChecked = selected.includes(opt);
          return (
            <button
              type="button"
              key={opt}
              onClick={() => toggleOption(opt)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all duration-150 cursor-pointer ${
                isChecked
                  ? 'bg-white text-slate-800 border-blue-500 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                  isChecked
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isChecked && '✓'}
              </div>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxPillGroup;
