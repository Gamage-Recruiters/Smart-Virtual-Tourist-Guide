import { FiShare2, FiX } from 'react-icons/fi';
import VehicleModeSelector from './VehicleModeSelector';
import { formatDuration, formatDistance } from '../../utils/formatDuration';

/**
 * Bottom panel showing route info, vehicle mode tabs, and Start button.
 *
 * @param {string} activeMode      — 'car' | 'bike' | 'foot'
 * @param {Object} routeData       — { distance, duration, geometry } for the active mode
 * @param {Object} allEstimates    — { car: {...}, bike: {...}, foot: {...} }
 * @param {Function} onModeChange  — switch vehicle mode
 * @param {Function} onStart       — Start navigation callback
 * @param {Function} onShare       — Share route callback
 * @param {Function} onClose       — Close/go back callback
 * @param {boolean} loading        — loading state
 */
export default function RouteInfoPanel({
  activeMode,
  routeData,
  allEstimates = {},
  onModeChange,
  onStart,
  onShare,
  onClose,
  loading = false,
}) {
  const modeLabels = { car: 'Drive', bike: 'Ride', foot: 'Walk' };
  const modeLabel = modeLabels[activeMode] || 'Drive';

  const duration = routeData?.duration;
  const distance = routeData?.distance;

  return (
    <div className="bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-2xl overflow-hidden">
      {/* Top bar: mode label + share/close */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <h3 className="text-sm font-bold text-slate-800">{modeLabel}</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShare}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
            aria-label="Share route"
          >
            <FiShare2 size={18} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
            aria-label="Close directions"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Vehicle mode tabs */}
      <VehicleModeSelector
        activeMode={activeMode}
        onModeChange={onModeChange}
        estimates={allEstimates}
        loading={loading}
      />

      {/* Route summary */}
      <div className="px-5 py-4">
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-500">Calculating route...</span>
          </div>
        ) : routeData ? (
          <>
            <p className="text-base font-bold text-[#2563EB]">
              {formatDuration(duration)}{' '}
              <span className="text-slate-500 font-normal text-sm">
                ({formatDistance(distance)})
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Fastest route · Usual traffic</p>
          </>
        ) : (
          <p className="text-sm text-slate-400">No route available for this mode</p>
        )}
      </div>

      {/* Start button */}
      <div className="px-5 pb-5 text-left">
        <button
          type="button"
          onClick={onStart}
          disabled={loading || !routeData}
          className="px-8 py-2.5 rounded-lg font-bold text-white text-sm tracking-wide transition-all transform hover:scale-[1.02] active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            background: loading || !routeData
              ? '#94a3b8'
              : '#007bff',
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
}
