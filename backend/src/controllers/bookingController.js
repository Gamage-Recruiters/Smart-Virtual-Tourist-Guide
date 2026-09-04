import ActivityBooking from '../models/ActivityBooking.js';
import DriverBooking from '../models/DriverBooking.js';
import GuideBooking from '../models/GuideBooking.js';
import HotelBooking from '../models/HotelBooking.js';
import RestaurantBooking from '../models/RestaurantBooking.js';
import VehicleBooking from '../models/VehicleBooking.js';
import { buildBookingData } from '../services/bookingService.js';
import { getOrInitCalendar, findSlotInCalendar } from './activityController.js';

const normalizeServiceType = (serviceType) =>
  typeof serviceType === 'string' ? serviceType.trim().toLowerCase() : '';

const modelsMap = {
  activity: ActivityBooking,
  driver: DriverBooking,
  guide: GuideBooking,
  hotel: HotelBooking,
  restaurant: RestaurantBooking,
  vehicle: VehicleBooking,
  vehiclerental: VehicleBooking,
};

export const getBookingModel = (serviceType) => {
  const normalizedType = normalizeServiceType(serviceType);
  return modelsMap[normalizedType] || null;
};

const validateBookingPayload = (payload) => {
  const errors = [];
  const serviceType = payload.serviceType || payload.service?.type;

  if (!serviceType) {
    errors.push('Service type is required.');
  }

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
  // PayHere payment — card details handled by PayHere, not us
  // No card field validation needed for 'payhere' payment method

  return errors;
};

export const createBooking = async (req, res, next) => {
  try {
    const serviceType = normalizeServiceType(
      req.params.serviceType || req.body.serviceType || req.body.service?.type
    );

    const {
      service,
      bookingDetails,
      pricing,
      customer,
      paymentMethod = 'card',
      paymentDetails,
    } = req.body;

    const validationErrors = validateBookingPayload({
      serviceType,
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

    const Model = getBookingModel(serviceType);
    if (!Model) {
      return res.status(400).json({ success: false, errors: ['Invalid service type.'] });
    }

    const bookingData = buildBookingData({
      serviceType,
      service,
      bookingDetails,
      pricing,
      customer,
      paymentMethod,
      paymentDetails,
      ...req.body,
    });

    const booking = await Model.create(bookingData);

    // Update Activity Calendar booked count if serviceType is activity
    if (serviceType === 'activity') {
      const actId = service?.serviceId || service?._id || req.body.activityId || service?.id;
      const actDate = bookingData.activityDate || req.body.activityDate;
      const actSlot = bookingData.timeSlot || req.body.timeSlot;
      const participantsCount = Number(bookingData.participants || req.body.participants) || 1;

      if (actId && actDate && actSlot) {
        try {
          const calendar = await getOrInitCalendar(actId, actDate);
          if (calendar && Array.isArray(calendar.timeSlots)) {
            const slot = findSlotInCalendar(calendar.timeSlots, actSlot);
            if (slot) {
              slot.booked = (slot.booked || 0) + participantsCount;
              await calendar.save();
            }
          }
        } catch (calError) {
          console.error('Error updating activity calendar on booking:', calError);
        }
      }
    }

    res.status(201).json({ success: true, booking, serviceType });
  } catch (error) {
    next(error);
  }
};


export const getBookings = async (req, res, next) => {
  try {
    const serviceType = normalizeServiceType(req.params.serviceType || req.query.serviceType);

    if (serviceType) {
      const Model = getBookingModel(serviceType);
      if (!Model) {
        return res.status(400).json({ success: false, errors: ['Invalid service type.'] });
      }
      const bookings = await Model.find().populate({ path: 'userId', select: 'fullName email contactNumber role' }).sort({ createdAt: -1 });
      return res.json({ success: true, bookings, serviceType });
    }

    const [activities, drivers, guides, hotels, restaurants, vehicles] = await Promise.all([
      ActivityBooking.find().populate({ path: 'userId', select: 'fullName email contactNumber role' }).sort({ createdAt: -1 }),
      DriverBooking.find().populate({ path: 'userId', select: 'fullName email contactNumber role' }).sort({ createdAt: -1 }),
      GuideBooking.find().populate({ path: 'userId', select: 'fullName email contactNumber role' }).sort({ createdAt: -1 }),
      HotelBooking.find().populate({ path: 'userId', select: 'fullName email contactNumber role' }).sort({ createdAt: -1 }),
      RestaurantBooking.find().populate({ path: 'userId', select: 'fullName email contactNumber role' }).sort({ createdAt: -1 }),
      VehicleBooking.find().populate({ path: 'userId', select: 'fullName email contactNumber role' }).sort({ createdAt: -1 }),
    ]);

    const allBookings = [
      ...activities,
      ...drivers,
      ...guides,
      ...hotels,
      ...restaurants,
      ...vehicles,
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, bookings: allBookings, serviceType: 'all' });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const serviceType = normalizeServiceType(req.query.serviceType || req.params.serviceType);

    if (serviceType) {
      const Model = getBookingModel(serviceType);
      if (!Model) {
        return res.status(400).json({ success: false, errors: ['Invalid service type.'] });
      }
      const booking = await Model.findById(req.params.id).populate({ path: 'userId', select: 'fullName email contactNumber role' });
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
      }
      return res.json({ success: true, booking });
    }

    const models = [
      ActivityBooking,
      DriverBooking,
      GuideBooking,
      HotelBooking,
      RestaurantBooking,
      VehicleBooking,
    ];

    for (const Model of models) {
      const booking = await Model.findById(req.params.id).populate({ path: 'userId', select: 'fullName email contactNumber role' });
      if (booking) {
        return res.json({ success: true, booking });
      }
    }

    res.status(404).json({ success: false, message: 'Booking not found.' });
  } catch (error) {
    next(error);
  }
};
