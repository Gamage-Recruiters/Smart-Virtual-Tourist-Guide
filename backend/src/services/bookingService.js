const calculatePricingTotal = (pricing) => {
  const items = Array.isArray(pricing?.items) ? pricing.items : [];
  return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
};

const extractBookingField = (details, labelName) => {
  if (!Array.isArray(details)) return null;
  const match = details.find(
    (item) => item.label && item.label.toLowerCase() === labelName.toLowerCase()
  );
  return match ? match.value : null;
};

const buildBookingData = (payload) => {
  const {
    service,
    bookingDetails,
    pricing,
    customer,
    paymentMethod,
    paymentDetails,
  } = payload;

  const details = Array.isArray(bookingDetails) ? bookingDetails : [];

  const normalizedPricing = {
    currency: pricing?.currency || 'USD',
    items: Array.isArray(pricing?.items) ? pricing.items : [],
    total: pricing?.total ?? calculatePricingTotal(pricing || {}),
  };

  const payment = {
    method: paymentMethod || 'card',
    cardBrand: paymentDetails?.cardBrand || null,
    last4: paymentDetails?.cardNumber
      ? String(paymentDetails.cardNumber).slice(-4)
      : null,
    expiryDate: paymentDetails?.expiryDate || null,
    paidAt: new Date(),
    payhereOrderId: paymentDetails?.payhereOrderId || null,
    payherePaymentId: paymentDetails?.payherePaymentId || null,
  };

  const baseData = {
    service,
    bookingDetails: details,
    pricing: normalizedPricing,
    customer,
    payment,
  };

  const serviceType = (payload.serviceType || service?.type || '').toLowerCase();

  if (serviceType === 'activity') {
    baseData.activityDate = payload.activityDate || extractBookingField(details, 'Activity Date');
    baseData.timeSlot = payload.timeSlot || extractBookingField(details, 'Time Slot');
    baseData.participants = payload.participants || Number(parseInt(extractBookingField(details, 'Participants') || '1')) || 1;
  } else if (serviceType === 'driver') {
    baseData.travelDate = payload.travelDate || extractBookingField(details, 'Travel Date');
    baseData.pickupTime = payload.pickupTime || extractBookingField(details, 'Pickup Time');
    baseData.pickupLocation = payload.pickupLocation || extractBookingField(details, 'Pickup Location');
    baseData.destination = payload.destination || extractBookingField(details, 'Destination');
    baseData.passengers = payload.passengers || Number(parseInt(extractBookingField(details, 'Passengers') || '1')) || 1;
  } else if (serviceType === 'guide') {
    baseData.tourDate = payload.tourDate || extractBookingField(details, 'Tour Date');
    baseData.language = payload.language || extractBookingField(details, 'Language');
    baseData.participants = payload.participants || Number(parseInt(extractBookingField(details, 'Participants') || '1')) || 1;
    baseData.meetingLocation = payload.meetingLocation || extractBookingField(details, 'Meeting Location');
    baseData.duration = payload.duration || extractBookingField(details, 'Tour Duration');
  } else if (serviceType === 'hotel') {
    baseData.checkInDate = payload.checkInDate || extractBookingField(details, 'Check-in Date');
    baseData.checkOutDate = payload.checkOutDate || extractBookingField(details, 'Check-out Date');
    baseData.roomType = payload.roomType || extractBookingField(details, 'Room Type');
    baseData.guests = payload.guests || Number(parseInt(extractBookingField(details, 'Guests') || '1')) || 1;
    baseData.roomsCount = payload.roomsCount || Number(parseInt(extractBookingField(details, 'Rooms') || '1')) || 1;
  } else if (serviceType === 'restaurant') {
    baseData.reservationDate = payload.reservationDate || extractBookingField(details, 'Reservation Date');
    baseData.reservationTime = payload.reservationTime || extractBookingField(details, 'Reservation Time');
    baseData.guests = payload.guests || Number(parseInt(extractBookingField(details, 'Guests') || '1')) || 1;
    baseData.specialRequests = payload.specialRequests || extractBookingField(details, 'Special Requests');
  } else if (serviceType === 'vehicle' || serviceType === 'vehiclerental') {
    baseData.pickupDate = payload.pickupDate || extractBookingField(details, 'Pickup Date');
    baseData.dropoffDate = payload.dropoffDate || extractBookingField(details, 'Drop-off Date');
    baseData.pickupLocation = payload.pickupLocation || extractBookingField(details, 'Pickup Location');
    baseData.dropoffLocation = payload.dropoffLocation || extractBookingField(details, 'Drop-off Location');
    baseData.driverRequired = payload.driverRequired ?? (extractBookingField(details, 'Driver Required') === 'Yes');
  }

  return baseData;
};

export {
  calculatePricingTotal,
  buildBookingData,
  extractBookingField,
};
