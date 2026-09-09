import React from 'react';
import { describeRoute, buildRouteDescription } from '../../utils/routeHelpers';
import coins from '../../assets/coins.png';

export default function RouteCard({
  selectedRoute,
  selectedIdx,
  routes,
  loadingRoutes,
  handleStart,
  handleAddStop,
  handleShare,
  handleSave
}) {
  if (!routes.length || !selectedRoute) return null;

  const fullDesc = describeRoute(selectedRoute, selectedIdx, routes);
  const viaIdx = fullDesc.indexOf(' · via ');
  const firstLine = viaIdx !== -1 ? fullDesc.slice(0, viaIdx) : fullDesc;
  const secondLine = viaIdx !== -1 ? fullDesc.slice(viaIdx + 3) : '';
  const { petrol } = buildRouteDescription(selectedRoute, selectedIdx, routes);

  return (
    <div className="pt-1">
      <div className="mt-4 text-medium text-slate-600">
        <p>{firstLine}</p>
        {secondLine && <p className="text-slate-500">{secondLine}</p>}
        {loadingRoutes && <span className="text-slate-400 text-xs">Updating...</span>}
      </div>

      <p className="mt-4 text-sm text-slate-500 flex items-center gap-24">
        <span className="flex items-center gap-2">
          <img src={coins} alt="Tolls icon" className="w-6 h-6 opacity-70" />
          <span>Tolls</span>
        </span>
        {petrol > 0 && <span>Saves ~{petrol}% petrol</span>}
      </p>

      <div className="mt-12 flex items-center justify-between gap-4 w-full overflow-x-auto">
        <button type="button" onClick={handleStart} className="flex-1 rounded-xl bg-[#1A73E8] py-4 px-2 text-medium font-semibold text-white hover:bg-[#165fbe] whitespace-nowrap">Start</button>
        <button type="button" onClick={handleAddStop} className="flex-1 rounded-xl bg-[#1A73E8] py-4 px-2 text-medium font-semibold text-white hover:bg-[#165fbe] whitespace-nowrap">Add Stop</button>
        <button type="button" onClick={handleShare} className="flex-1 rounded-xl bg-[#1A73E8] py-4 px-2 text-medium font-semibold text-white hover:bg-[#165fbe] whitespace-nowrap">Share</button>
        <button type="button" onClick={handleSave} className="flex-1 rounded-xl bg-[#1A73E8] py-4 px-2 text-medium font-semibold text-white hover:bg-[#165fbe] whitespace-nowrap">Save</button>
      </div>
    </div>
  );
}
