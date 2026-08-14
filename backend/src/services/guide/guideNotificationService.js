import Notification from '../../models/Notification.js';

const createNotification = async ({ userId, type, title, message, data = {}, dedupeKey, session }) => {
  if (!userId) return null;
  const operation = {
    updateOne: {
      filter: dedupeKey ? { dedupeKey } : { _id: null },
      update: { $setOnInsert: { userId, type, title, message, data, dedupeKey } },
      upsert: true,
    },
  };
  const result = await Notification.bulkWrite([operation], session ? { session } : undefined);
  return result;
};

export { createNotification };
