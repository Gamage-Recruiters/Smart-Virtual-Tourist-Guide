import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const severityStyles = {
  critical: {
    border: 'border-[#B91C1C]',
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#B91C1C]',
    iconBg: 'bg-[#E53935]',
  },
  high: {
    border: 'border-[#EA580C]',
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#EA580C]',
    iconBg: 'bg-[#F97316]',
  },
  medium: {
    border: 'border-[#CA8A04]',
    bg: 'bg-[#FEFCE8]',
    text: 'text-[#CA8A04]',
    iconBg: 'bg-[#EAB308]',
  },
  low: {
    border: 'border-[#16A34A]',
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#16A34A]',
    iconBg: 'bg-[#22C55E]',
  },
};

const AlertCard = ({ alert, onSelect, isSelected }) => {
  const cardRef = React.useRef(null);
  const style = severityStyles[alert.severity] || severityStyles.low;
  const timeStr = formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true });

  React.useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  return (
    <button
      ref={cardRef}
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 transform ${
        isSelected ? 'scale-[1.02] shadow-md ring-2 ring-sky-300' : 'hover:border-slate-300 shadow-sm'
      } ${style.border} ${style.bg}`}
    >
      <div className="flex items-start gap-3">
        {/* Severity Icon */}
        <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-black text-xs shadow-sm ${style.iconBg}`}>
          !
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-extrabold text-xs text-black leading-tight pr-2 uppercase">
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
            <span className={`text-[10px] font-black uppercase tracking-tighter ${style.text}`}>
              {alert.severity} Priority
            </span>
            {/* Source Badge */}
            {alert.source === 'openweather' && (
              <span className="bg-sky-100 text-sky-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                ⛅ Weather
              </span>
            )}
            {alert.source === 'manual' && (
              <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                🛡️ Authority
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default AlertCard;