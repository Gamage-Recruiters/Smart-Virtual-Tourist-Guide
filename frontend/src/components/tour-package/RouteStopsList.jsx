import React from 'react';

/**
 * RouteStopsList Component
 * Dynamic route stops list manager with add/remove/edit actions
 * @param {Array<string>} stops - Array of stop name strings
 * @param {Function} onAddStop - Callback to add a new stop row
 * @param {Function} onRemoveStop - Callback to remove a stop index
 * @param {Function} onChangeStop - Callback to update a stop string at index
 */
export const RouteStopsList = ({ stops = [], onAddStop, onRemoveStop, onChangeStop }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700">
        Route Details (Stops)
      </label>
      <div className="space-y-2.5">
        {stops.map((stop, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-3 w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center flex-shrink-0 border border-slate-200">
                {index + 1}
              </span>
              <input
                type="text"
                value={stop}
                onChange={(e) => onChangeStop(index, e.target.value)}
                placeholder={`Stop ${index + 1}`}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200/80 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-slate-800"
              />
            </div>

            {/* Remove Button */}
            {stops.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveStop(index)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                title="Remove stop"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Stop Button */}
      <button
        type="button"
        onClick={onAddStop}
        className="inline-flex items-center gap-1 pt-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
      >
        <span className="text-xs">⊕</span>
        <span>Add another stop</span>
      </button>
    </div>
  );
};

export default RouteStopsList;
