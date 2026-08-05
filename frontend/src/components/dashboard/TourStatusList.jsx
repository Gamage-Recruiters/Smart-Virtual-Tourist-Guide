import React from 'react';

/**
 * Reusable Dashboard TourStatusList Component
 * @param {Array} tours - List of guide's current tour statuses
 * @param {Function} onViewAllTours - Handler for "View All Tours" button
 */
export const TourStatusList = ({ tours = [], onViewAllTours }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">MY TOURS STATUS</h2>
        </div>

        <div className="space-y-4 mb-6">
          {tours.map((tour) => {
            const isDraft = tour.status === 'Draft';
            const isUpcoming = tour.status === 'Upcoming';

            return (
              <div key={tour.id || tour._id} className="flex items-center gap-3.5 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden shadow-sm">
                  {tour.image ? (
                    <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
                  ) : (
                    tour.emoji || '🏝️'
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider block mb-0.5 ${
                      isDraft
                        ? 'text-amber-500'
                        : isUpcoming
                        ? 'text-blue-500'
                        : 'text-blue-600'
                    }`}
                  >
                    {tour.status}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">
                    {tour.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <span>{isDraft ? '✏️' : '📅'}</span>
                    <span>{tour.dates || tour.lastEdited}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onViewAllTours}
        className="w-full py-2.5 px-4 text-xs font-bold text-blue-600 border border-slate-200 rounded-xl hover:bg-blue-50/50 hover:border-blue-200 transition-all text-center"
      >
        View All Tours
      </button>
    </div>
  );
};

export default TourStatusList;

