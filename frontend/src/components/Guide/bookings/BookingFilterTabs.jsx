import React from 'react';

/**
 * BookingFilterTabs Component
 * @param {'All' | 'Pending' | 'Confirmed' | 'Cancelled'} activeFilter
 * @param {Function} onSelectFilter
 */
const BookingFilterTabs = ({ activeFilter = 'All', onSelectFilter }) => {
  const tabs = ['All', 'Pending', 'Confirmed', 'Cancelled'];

  return (
    <div className="inline-flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 overflow-x-auto max-w-full">
      {tabs.map((tab) => {
        const isActive = activeFilter.toLowerCase() === tab.toLowerCase();
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelectFilter && onSelectFilter(tab)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default BookingFilterTabs;
