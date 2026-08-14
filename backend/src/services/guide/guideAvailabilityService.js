import GuideBooking from '../../models/GuideBooking.js';
import {ACTIVE_BOOKING_STATUSES} from '../../utils/guideConstants.js';

const overlapFilter = (startDate, endDate) => ({
  'tripDetails.startDate': { $lte: endDate },
  'tripDetails.endDate': { $gte: startDate },
});

const bookingDates = (startDate, endDate) => {
  const dates = [];
  const cursor = new Date(startDate);
  cursor.setUTCHours(0, 0, 0, 0);
  const last = new Date(endDate);
  last.setUTCHours(0, 0, 0, 0);
  while (cursor <= last) {
    dates.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
};

const checkGuideAvailability = async ({ guide, startDate, endDate, excludeBookingId, session }) => {
  if (!guide?.active || guide.availability !== 'Available') {
    return { available: false, reason: 'The guide profile is not currently available.' };
  }
  const blocked = (guide.unavailableRanges || []).some((range) => range.startDate <= endDate && range.endDate >= startDate);
  if (blocked) return { available: false, reason: 'The guide has marked these dates as unavailable.' };
  const requestedDates = bookingDates(startDate, endDate);
  const reserved = (guide.reservedDates || []).some((date) => requestedDates.some((requested) => requested.getTime() === date.getTime()));
  if (reserved) return { available: false, reason: 'The guide already has an overlapping booking.' };

  const query = {
    guideId: guide._id,
    bookingStatus: { $in: ACTIVE_BOOKING_STATUSES },
    ...overlapFilter(startDate, endDate),
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };
  let finder = GuideBooking.exists(query);
  if (session) finder = finder.session(session);
  const conflict = await finder;
  return conflict
    ? { available: false, reason: 'The guide already has an overlapping booking.' }
    : { available: true, reason: null };
};

export { bookingDates, checkGuideAvailability, overlapFilter };
