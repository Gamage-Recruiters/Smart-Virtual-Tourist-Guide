import React from 'react';
import Badge from '../../common/Badge';

/**
 * TransactionHistoryTable Component
 * @param {Array<{ date: string, tourPackage: string, travelerName: string, amount: string|number, status: string }>} transactions
 */
const TransactionHistoryTable = ({ transactions = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-y border-slate-100">
            <th className="py-2.5 px-4">DATE</th>
            <th className="py-2.5 px-4">TOUR PACKAGE</th>
            <th className="py-2.5 px-4">TRAVELER NAME</th>
            <th className="py-2.5 px-4 text-left">AMOUNT</th>
            <th className="py-2.5 px-4 text-center">STATUS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-slate-400">
                No transactions recorded for this period.
              </td>
            </tr>
          ) : (
            transactions.map((tx, idx) => {
              const isPaid = tx.status === 'Paid' || tx.status === 'Completed';
              return (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  {/* Date (Stacked like Oct 28, 2023) */}
                  <td className="py-3.5 px-4 font-semibold text-slate-400 text-[11px] leading-tight whitespace-nowrap">
                    {tx.date}
                  </td>

                  {/* Tour Package */}
                  <td className="py-3.5 px-4 font-bold text-slate-800 max-w-[160px] leading-snug">
                    {tx.tourPackage}
                  </td>

                  {/* Traveler Name */}
                  <td className="py-3.5 px-4 font-medium text-slate-600 leading-tight">
                    {tx.travelerName}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                    {typeof tx.amount === 'number'
                      ? `Rs. ${tx.amount.toLocaleString('en-US')}`
                      : tx.amount}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                        isPaid
                          ? 'bg-emerald-100/70 text-emerald-600'
                          : 'bg-amber-100/70 text-amber-600'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistoryTable;
