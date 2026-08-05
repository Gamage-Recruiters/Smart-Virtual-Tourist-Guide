import React from 'react';
import { Plus } from 'lucide-react';
import PayoutMethodCard from './PayoutMethodCard';

/**
 * PayoutMethodsList Component
 * @param {Array<{ bankName: string, maskedNumber: string, isPrimary: boolean }>} methods
 * @param {Function} onAddMethod
 */
const PayoutMethodsList = ({ methods = [], onAddMethod }) => {
  return (
    <div className="space-y-3">
      {methods.length === 0 ? (
        <p className="text-xs text-slate-400 py-2">No payout methods added yet.</p>
      ) : (
        methods.map((method, idx) => (
          <PayoutMethodCard
            key={idx}
            bankName={method.bankName}
            maskedNumber={method.maskedNumber}
            isPrimary={method.isPrimary}
          />
        ))
      )}

      <button
        type="button"
        onClick={onAddMethod}
        className="w-full py-2.5 px-3 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        Add New Method
      </button>
    </div>
  );
};

export default PayoutMethodsList;
