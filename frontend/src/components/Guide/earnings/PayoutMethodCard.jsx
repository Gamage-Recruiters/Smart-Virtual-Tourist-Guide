import React from 'react';
import { CheckCircle2, Landmark } from 'lucide-react';

/**
 * PayoutMethodCard Component
 * @param {string} bankName - Bank name (e.g. Commercial Bank)
 * @param {string} maskedNumber - Masked account number (e.g. •••• 4829)
 * @param {boolean} isPrimary - Whether this payout method is primary
 * @param {React.ReactNode} icon - Optional custom icon
 */
const PayoutMethodCard = ({ bankName, maskedNumber, isPrimary, icon }) => {
  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
        isPrimary
          ? 'bg-blue-50/20 border-blue-500/80 shadow-sm'
          : 'bg-white border-slate-100 hover:bg-slate-50/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold flex-shrink-0">
          {icon || <Landmark className="w-4 h-4" />}
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800">{bankName}</h4>
          <p className="text-[11px] text-slate-400 font-mono tracking-tight">
            {maskedNumber} {isPrimary && <span className="text-slate-400 font-sans">(Primary)</span>}
          </p>
        </div>
      </div>
      {isPrimary && (
        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};

export default PayoutMethodCard;
