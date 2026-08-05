import React from 'react';

/**
 * Reusable Badge Component
 * @param {'purple'|'green'|'orange'|'blue'|'gray'|'emerald'|'amber'} color - Color theme
 * @param {React.ReactNode} children - Badge text/content
 */
export const Badge = ({ color = 'blue', children }) => {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    blue: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${colorClasses[color] || colorClasses.blue}`}>
      {children}
    </span>
  );
};

export default Badge;
