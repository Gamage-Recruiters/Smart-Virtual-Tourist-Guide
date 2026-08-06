import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

/**
 * DateRangePicker Component
 * @param {string} startDate - Start date ISO/Formatted string
 * @param {string} endDate - End date ISO/Formatted string
 * @param {Function} onChange - Callback function when date range changes ({ startDate, endDate })
 */
const DateRangePicker = ({ startDate = '2026-07-01', endDate = '2026-08-01', onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  const handleApply = () => {
    if (onChange) {
      onChange({ startDate: start, endDate: end });
    }
    setIsOpen(false);
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:bg-slate-50 transition-all"
      >
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        <span>
          {formatDateLabel(start)} - {formatDateLabel(end)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-100 p-4 space-y-4">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Select Date Range</div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Start Date</label>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-600 mb-1">End Date</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
