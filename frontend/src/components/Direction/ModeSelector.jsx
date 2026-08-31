import React from 'react';
import { MODE_CONFIGS, formatCompactDuration, estimateModeDuration } from '../../utils/routeHelpers';
import shareIcon from '../../assets/shareIcon.png';
import closeIcon from '../../assets/closeIcon.png';

export default function ModeSelector({
  selectedMode,
  setSelectedMode,
  fallbackMode,
  setRoutes,
  setFallbackMode,
  selectedRoute,
  modeMinutesCache,
  drivingMinutesRef,
  baseModeMinutes,
  handleShare,
  setPanelOpen
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-12 mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">
          {MODE_CONFIGS.find((m) => m.key === selectedMode)?.label || 'Drive'}
          {fallbackMode && (
            <span className="ml-2 text-xs font-normal text-slate-400">(driving route shown)</span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleShare} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200" aria-label="Share route">
            <img src={shareIcon} alt="Share" className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setPanelOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200" aria-label="Close">
            <img src={closeIcon} alt="Close" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between gap-4 w-full overflow-x-auto">
        {MODE_CONFIGS.map((mode) => {
          const active = mode.key === selectedMode;
          const timeLabel = active
            ? (selectedRoute?.duration || '--')
            : modeMinutesCache.current[mode.key]
              ? formatCompactDuration(modeMinutesCache.current[mode.key])
              : estimateModeDuration(drivingMinutesRef.current || baseModeMinutes, mode.multiplier);
          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => {
                setRoutes([]);
                setFallbackMode(false);
                setSelectedMode(mode.key);
              }}
              className="flex flex-col items-center gap-1 bg-transparent border-none outline-none cursor-pointer flex-1"
            >
              <div className="flex items-center gap-3">
                <img src={mode.icon} alt={mode.label} className="h-6 w-5 object-contain" />
                <span className="text-medium font-medium text-slate-700 whitespace-nowrap">{timeLabel}</span>
              </div>
              <div style={{ height: '3.4px', width: '100%', marginTop: '36px', borderRadius: '2px', background: active ? '#1A73E8' : 'transparent' }} />
            </button>
          );
        })}
      </div>

      <div style={{ height: '1.5px', background: '#000', marginTop: '1px', marginBottom: '32px', borderRadius: '1px' }} />
    </>
  );
}
