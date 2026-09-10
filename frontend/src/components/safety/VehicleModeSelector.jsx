import { FaCar, FaMotorcycle, FaWalking } from 'react-icons/fa';
import { formatDuration } from '../../utils/safety/dateUtils';

const MODES = [
  { key: 'car', icon: FaCar, label: 'Car' },
  { key: 'bike', icon: FaMotorcycle, label: 'Bike' },
  { key: 'foot', icon: FaWalking, label: 'Walk' },
];

/**
 * Horizontal tab bar for selecting a vehicle/travel mode.
 *
 * @param {string} activeMode   — 'car' | 'bike' | 'foot'
 * @param {Function} onModeChange — called with the new mode key
 * @param {Object} estimates     — { car: { duration, distance }, bike: {...}, foot: {...} }
 * @param {boolean} loading      — whether route data is still loading
 */
export default function VehicleModeSelector({ activeMode, onModeChange, estimates = {}, loading = false }) {
  return (
    <div className="flex items-stretch border-b border-slate-200 bg-white">
      {MODES.map(({ key, icon: Icon, label }) => {
        const isActive = activeMode === key;
        const est = estimates[key];
        const timeStr = est?.duration != null ? formatDuration(est.duration) : '--';

        return (
          <button
            key={key}
            type="button"
            onClick={() => onModeChange(key)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-2 transition-all duration-200 relative group"
            style={{
              color: isActive ? '#2563EB' : '#64748b',
              fontWeight: isActive ? 700 : 500,
              background: isActive ? 'rgba(37,99,235,0.04)' : 'transparent',
            }}
            aria-label={`${label} mode`}
            aria-pressed={isActive}
          >
            <Icon className="text-base shrink-0" />
            <span className="text-sm whitespace-nowrap">
              {loading ? '...' : timeStr}
            </span>

            {/* Active indicator line */}
            <span
              className="absolute bottom-0 left-2 right-2 rounded-full transition-all duration-200"
              style={{
                height: isActive ? '3px' : '0px',
                background: '#2563EB',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
