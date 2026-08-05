import React from 'react';

/**
 * Reusable Dashboard StatCard Component
 * @param {React.ReactNode} icon - Icon element or emoji
 * @param {string} label - Card label
 * @param {string|number} value - Metric value string/number
 * @param {string} badge - Percentage change badge text (e.g. "+12%")
 * @param {string} iconBg - CSS classes for icon background and text color
 */
export const StatCard = ({
  icon,
  label,
  value,
  badge,
  iconBg = 'bg-blue-50 text-blue-600',
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        {badge && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
            {badge}
            <span className="text-[10px]">↗</span>
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 mb-1">{label}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
