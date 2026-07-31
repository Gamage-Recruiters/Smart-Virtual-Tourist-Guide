import ActivityBooking from '../models/ActivityBooking.js';

const normalizeBooking = (booking) => ({
  ...booking,
  _id: booking._id?.toString?.() || booking._id,
});

export const getBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { 'customer.firstName': { $regex: search, $options: 'i' } },
        { 'customer.lastName': { $regex: search, $options: 'i' } },
        { 'service.name': { $regex: search, $options: 'i' } },
        { activityDate: { $regex: search, $options: 'i' } },
      ];
    }

    const bookings = await ActivityBooking.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings.map(normalizeBooking),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const booking = await ActivityBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      data: normalizeBooking(booking),
      message: 'Booking status updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getBookings,
  updateBookingStatus,
};
