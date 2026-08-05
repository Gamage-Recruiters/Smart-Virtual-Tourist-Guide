import React from 'react';
import { MoreVertical } from 'lucide-react';
import Button from '../../common/Button';

/**
 * BookingActionButtons Component
 * @param {string} status - 'Pending' | 'Confirmed' | 'Cancelled'
 * @param {Function} onApprove
 * @param {Function} onReject
 * @param {Function} onViewDetails
 */
const BookingActionButtons = ({ status, onApprove, onReject, onViewDetails }) => {
  const isPending = status === 'Pending';

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="outline" className="px-2 py-1 text-[11px]" onClick={onViewDetails}>
        View Details
      </Button>

      {isPending ? (
        <>
          <Button variant="solid" className="px-2.5 py-1 text-[11px]" onClick={onApprove}>
            Approve
          </Button>
          <button
            type="button"
            onClick={onReject}
            className="px-2 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            Reject
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onViewDetails}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="More Options"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default BookingActionButtons;
