import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const severityStyles = {
  critical: 'border-[#B91C1C] bg-[#FEF2F2] text-[#B91C1C] icon-bg-[#E53935]',
  high: 'border-[#EA580C] bg-[#FFF7ED] text-[#EA580C] icon-bg-[#F97316]',
  medium: 'border-[#CA8A04] bg-[#FEFCE8] text-[#CA8A04] icon-bg-[#EAB308]',
  low: 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A] icon-bg-[#22C55E]'
};

const AlertCard = ({ alert, onSelect, isSelected }) => {
  const style = severityStyles[alert.severity] || severityStyles.low;
  const timeStr = formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true });

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 transform ${
        isSelected ? 'scale-[1.02] shadow-md ring-2 ring-sky-300' : 'hover:border-slate-300 shadow-sm'
      } ${style.split(' ')[0]} ${style.split(' ')[1]}`}
    >
      <div className="flex items-start gap-3">
        {/* Severity Icon */}
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm ${style.split(' ')[3].replace('icon-bg-', 'bg-')}`}>
          !
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-extrabold text-sm text-black leading-tight pr-2 uppercase">
              {alert.title}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
              {timeStr}
            </span>
          </div>
          
          <p className="mt-2 text-xs text-slate-700 leading-relaxed line-clamp-2">
            {alert.description}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="bg-white/60 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 uppercase border border-white/80">
              {alert.region}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${style.split(' ')[2]}`}>
              {alert.severity} Priority
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default AlertCard;