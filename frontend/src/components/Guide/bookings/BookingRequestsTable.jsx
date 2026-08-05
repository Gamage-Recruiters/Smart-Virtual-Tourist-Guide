import React from 'react';
import Avatar from '../../common/Avatar';
import Badge from '../../common/Badge';
import BookingActionButtons from './BookingActionButtons';

/**
 * BookingRequestsTable Component
 * @param {Array<Object>} bookings
 * @param {Function} onApprove
 * @param {Function} onReject
 * @param {Function} onViewDetails
 */
const BookingRequestsTable = ({ bookings = [], onApprove, onReject, onViewDetails }) => {
  const getBadgeColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'green';
      case 'Cancelled':
        return 'orange'; // Amber / Orange / Red look
      case 'Pending':
      default:
        return 'amber';
    }
  };

  return (
    <div className="w-full overflow-x-auto lg:overflow-x-visible">
      <table className="w-full text-left border-collapse table-auto">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th className="py-3 px-3">Tourist Name</th>
            <th className="py-3 px-2">Tour Package</th>
            <th className="py-3 px-2">Date Range</th>
            <th className="py-3 px-2">Travelers</th>
            <th className="py-3 px-2 text-right">Total Price</th>
            <th className="py-3 px-2 text-center">Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-400">
                No booking requests found for this filter.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Tourist Name */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={booking.touristAvatar}
                      name={booking.touristName}
                      initials={booking.initials || booking.touristName.substring(0, 2).toUpperCase()}
                      size="sm"
                    />
                    <span className="font-bold text-slate-800 whitespace-nowrap">{booking.touristName}</span>
                  </div>
                </td>

                {/* Tour Package */}
                <td className="py-3 px-2 font-medium text-slate-800 max-w-[150px] leading-snug">
                  {booking.tourPackage}
                </td>

                {/* Date Range */}
                <td className="py-3 px-2 text-slate-500 whitespace-nowrap">{booking.dateRange}</td>

                {/* Travelers */}
                <td className="py-3 px-2 text-slate-600 whitespace-nowrap">{booking.travelers}</td>

                {/* Total Price */}
                <td className="py-3 px-2 font-bold text-slate-900 text-right whitespace-nowrap">
                  {typeof booking.totalPrice === 'number'
                    ? `LKR ${booking.totalPrice.toLocaleString('en-US')}`
                    : booking.totalPrice}
                </td>

                {/* Status */}
                <td className="py-3 px-2 text-center whitespace-nowrap">
                  <Badge color={getBadgeColor(booking.status)}>{booking.status}</Badge>
                </td>

                {/* Actions */}
                <td className="py-3 px-3 text-right">
                  <BookingActionButtons
                    status={booking.status}
                    onApprove={() => onApprove && onApprove(booking.id)}
                    onReject={() => onReject && onReject(booking.id)}
                    onViewDetails={() => onViewDetails && onViewDetails(booking)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingRequestsTable;
