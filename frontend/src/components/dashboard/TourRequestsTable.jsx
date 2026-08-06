import React from 'react';
import Badge from '../common/Badge';

/**
 * Reusable Dashboard TourRequestsTable Component
 * @param {Array} requests - Array of tour request items
 * @param {Function} onViewAll - Handler for "View All" link
 */
export const TourRequestsTable = ({ requests = [], onViewAll }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slate-800 tracking-tight">LATEST TOUR REQUESTS</h2>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-y border-slate-100">
              <th className="py-2.5 px-3">TOURIST</th>
              <th className="py-2.5 px-3">TYPE</th>
              <th className="py-2.5 px-3">ROUTE / DURATION</th>
              <th className="py-2.5 px-3 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {requests.map((req) => {
              const isAccept = req.action === 'Accept Request';
              return (
                <tr key={req.id || req._id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Tourist */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {req.avatarInitials || 'T'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs">{req.tourist}</div>
                        <div className="text-[11px] text-slate-400">{req.country}</div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-4 px-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                        req.type === 'Cultural'
                          ? 'bg-blue-100/70 text-blue-600'
                          : req.type === 'Adventure'
                          ? 'bg-emerald-100/70 text-emerald-600'
                          : 'bg-purple-100/70 text-purple-600'
                      }`}
                    >
                      {req.type}
                    </span>
                  </td>

                  {/* Route / Duration */}
                  <td className="py-4 px-3">
                    <div className="font-bold text-slate-800 text-xs">{req.route}</div>
                    <div className="text-[11px] text-slate-400">{req.duration}</div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-3 text-center">
                    <button
                      type="button"
                      className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-150 ${
                        isAccept
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {req.action}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TourRequestsTable;

