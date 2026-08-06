import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * RequestPayoutCard Component
 * @param {number} balance - Current withdrawable balance
 * @param {Function} onTransfer - Callback function for transfer trigger
 */
const RequestPayoutCard = ({ balance = 0, onTransfer }) => {
  const formattedBalance = balance.toLocaleString('en-US');

  return (
    <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white rounded-3xl p-6 shadow-md shadow-blue-500/10 space-y-5">
      <div>
        <h3 className="text-base font-black tracking-tight">Request Payout</h3>
        <p className="text-xs text-blue-100/90 mt-1 font-medium leading-relaxed">
          Your funds are ready to be transferred to your primary bank account.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
        <span className="text-[9px] font-black uppercase tracking-wider text-blue-200 block mb-0.5">
          WITHDRAWABLE BALANCE
        </span>
        <div className="text-2xl font-black text-white tracking-tight">
          Rs. {formattedBalance}
        </div>
      </div>

      <button
        type="button"
        onClick={onTransfer}
        className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-blue-600 text-xs font-bold rounded-2xl shadow-sm transition-all text-center active:scale-95"
      >
        Transfer to Bank Account
      </button>
    </div>
  );
};

export default RequestPayoutCard;
