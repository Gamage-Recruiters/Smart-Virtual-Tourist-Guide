import GuideBooking from '../../models/GuideBooking.js';
import GuideProfile from '../../models/GuideProfile.js';
import GuideReview from '../../models/GuideReview.js';
import AppError from '../../utils/AppError.js';
import {cleanString, parseOptionalNumber} from '../../utils/guideValidation.js';

const createReview = async (user, bookingId, input = {}) => {
  const booking = await GuideBooking.findById(bookingId);
  if (!booking) throw new AppError('Guide booking not found.', 404, 'BOOKING_NOT_FOUND');
  if (String(booking.touristId) !== String(user._id)) throw new AppError('You can review only your own booking.', 403, 'FORBIDDEN');
  if (booking.bookingStatus !== 'Completed') throw new AppError('A guide can be reviewed only after the booking is completed.', 409, 'BOOKING_NOT_COMPLETED');
  const rating = parseOptionalNumber(input.rating, 'Rating', { min: 1, max: 5, integer: true });
  if (rating === undefined) throw new AppError('Rating is required.', 400, 'VALIDATION_ERROR');
  const comment = cleanString(input.comment, 1500, 'Review comment', { required: true });
  let review;
  try {
    review = await GuideReview.create({ touristId: user._id, guideId: booking.guideId, bookingId: booking._id, rating, comment, status: 'Published' });
  } catch (error) {
    if (error.code === 11000) throw new AppError('This booking has already been reviewed.', 409, 'REVIEW_EXISTS');
    throw error;
  }
  await refreshRating(booking.guideId);
  return review;
};

const refreshRating = async (guideId) => {
  const [summary] = await GuideReview.aggregate([
    { $match: { guideId, status: 'Published' } },
    { $group: { _id: '$guideId', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } },
  ]);
  await GuideProfile.updateOne({ _id: guideId }, { $set: { averageRating: summary ? Math.round(summary.averageRating * 100) / 100 : 0, reviewCount: summary?.reviewCount || 0 } });
};

export { createReview, refreshRating };
