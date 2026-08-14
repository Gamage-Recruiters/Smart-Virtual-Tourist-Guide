import Notification from '../../models/Notification.js';
import AppError from '../../utils/AppError.js';
import {parseObjectId, parsePagination, paginationMeta} from '../../utils/guideValidation.js';

export const list = async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { userId: req.user._id };
  if (req.query.unread === 'true') filter.readAt = null;
  const [notifications, totalItems] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Notification.countDocuments(filter),
  ]);
  res.json({ success: true, data: { notifications, pagination: paginationMeta({ page, limit, totalItems }) } });
};

export const markRead = async (req, res) => {
  parseObjectId(req.params.notificationId, 'notification ID');
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.notificationId, userId: req.user._id },
    { $set: { readAt: new Date() } },
    { new: true },
  );
  if (!notification) throw new AppError('Notification not found.', 404, 'NOTIFICATION_NOT_FOUND');
  res.json({ success: true, data: { notification } });
};
