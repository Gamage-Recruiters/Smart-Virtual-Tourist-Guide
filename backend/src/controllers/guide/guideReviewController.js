import * as service from '../../services/guide/guideReviewService.js';
import {parseObjectId} from '../../utils/guideValidation.js';

export const create = async (req, res) => {
  parseObjectId(req.params.bookingId, 'booking ID');
  const review = await service.createReview(req.user, req.params.bookingId, req.body);
  res.status(201).json({ success: true, data: { review } });
};
