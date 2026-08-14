import * as service from '../../services/guide/guideBookingService.js';
import AppError from '../../utils/AppError.js';
import {parseObjectId} from '../../utils/guideValidation.js';

export const preview = async (req, res) => {
  parseObjectId(req.params.requestId, 'request ID');
  parseObjectId(req.params.bidId, 'bid ID');
  const preview = await service.getConfirmationPreview(req.user, req.params.requestId, req.params.bidId);
  res.json({ success: true, data: preview });
};

export const confirm = async (req, res) => {
  parseObjectId(req.body?.requestId, 'request ID');
  parseObjectId(req.body?.bidId, 'bid ID');
  const result = await service.confirmBooking(req.user, req.body);
  res.status(result.alreadyConfirmed ? 200 : 201).json({
    success: true,
    data: { ...result, message: result.alreadyConfirmed ? 'Guide booking was already confirmed.' : 'Guide booking confirmed successfully.' },
  });
};

export const getById = async (req, res) => {
  parseObjectId(req.params.bookingId, 'booking ID');
  const booking = await service.getBooking(req.user, { _id: req.params.bookingId });
  res.json({ success: true, data: { booking } });
};

export const getByReference = async (req, res) => {
  if (!/^GUIDE-\d{4}-[0-9A-F]{10}$/.test(req.params.bookingReference)) {
    throw new AppError('Invalid booking reference format.', 400, 'INVALID_BOOKING_REFERENCE');
  }
  const booking = await service.getBooking(req.user, { bookingReference: req.params.bookingReference });
  res.json({ success: true, data: { booking } });
};

export const cancel = async (req, res) => {
  parseObjectId(req.params.bookingId, 'booking ID');
  const booking = await service.cancelBooking(req.user, req.params.bookingId);
  res.json({ success: true, data: { booking } });
};

export const complete = async (req, res) => {
  parseObjectId(req.params.bookingId, 'booking ID');
  const booking = await service.completeBooking(req.user, req.params.bookingId);
  res.json({ success: true, data: { booking } });
};
