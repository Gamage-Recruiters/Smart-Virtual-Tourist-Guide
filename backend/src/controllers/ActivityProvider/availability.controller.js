import Availability from '../../models/ActivityProvider/checkavailability.model.js';

// GET /api/availability
export const getAvailability = async (req, res) => {
  try {
    const { activityId, date, status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (activityId) query.activityId = activityId;
    if (date) query.date = date;
    if (status) query.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [entries, total] = await Promise.all([
      Availability.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)),
      Availability.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: entries,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/availability/date/:date
export const getAvailabilityByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { activityId } = req.query;

    const query = { date, status: { $ne: 'cancelled' } };
    if (activityId) query.activityId = activityId;

    const entries = await Availability.find(query).populate('bookingId');

    res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAvailability,
  getAvailabilityByDate,
};
