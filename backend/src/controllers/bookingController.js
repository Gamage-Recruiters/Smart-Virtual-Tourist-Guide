const Booking = require('../models/Booking');
const { buildBookingData } = require('../services/bookingService');

const validateBookingPayload = (payload) => {
  const errors = [];

  if (!payload.service || !payload.service.name) {
    errors.push('Service information is required.');
  }

  if (!payload.customer) {
    errors.push('Customer details are required.');
  } else {
    if (!payload.customer.firstName) errors.push('Customer first name is required.');
    if (!payload.customer.lastName) errors.push('Customer last name is required.');
    if (!payload.customer.email) errors.push('Customer email is required.');
    if (!payload.customer.phone) errors.push('Customer phone number is required.');
  }

  if (!payload.pricing || !Array.isArray(payload.pricing.items) || payload.pricing.items.length === 0) {
    errors.push('Pricing items are required.');
  }

  if (payload.paymentMethod === 'card') {
    if (!payload.paymentDetails) {
      errors.push('Payment details are required for card payments.');
    } else {
      if (!payload.paymentDetails.cardHolder) errors.push('Card holder name is required.');
      if (!payload.paymentDetails.cardNumber) errors.push('Card number is required.');
      if (!payload.paymentDetails.expiryDate) errors.push('Expiry date is required.');
      if (!payload.paymentDetails.cvv) errors.push('CVV is required.');
    }
  }

  return errors;
};

exports.createBooking = async (req, res, next) => {
  try {
    const {
      service,
      bookingDetails,
      pricing,
      customer,
      paymentMethod = 'card',
      paymentDetails,
    } = req.body;

    const validationErrors = validateBookingPayload({
      service,
      bookingDetails,
      pricing,
      customer,
      paymentMethod,
      paymentDetails,
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }

    const bookingData = buildBookingData({
      service,
      bookingDetails,
      pricing,
      customer,
      paymentMethod,
      paymentDetails,
    });

    const booking = await Booking.create(bookingData);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};
