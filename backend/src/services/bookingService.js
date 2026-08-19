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
    paymentStatus: payload.paymentStatus || payload.payment?.paymentStatus || 'pending',
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
    const checkInVal = payload.checkIn || payload.checkInDate || extractBookingField(details, 'Check-in Date');
    const checkOutVal = payload.checkOut || payload.checkOutDate || extractBookingField(details, 'Check-out Date');
    const adultCnt = payload.adultCount !== undefined
      ? Number(payload.adultCount)
      : (Number(parseInt(extractBookingField(details, 'Adults') || '1')) || 1);
    const childCnt = payload.childCount !== undefined
      ? Number(payload.childCount)
      : (Number(parseInt(extractBookingField(details, 'Children') || '0')) || 0);

    baseData.hotelId = payload.hotelId || service?.hotelId || (service?.serviceId && service.serviceId.length === 24 ? service.serviceId : undefined);
    baseData.roomNo = payload.roomNo || extractBookingField(details, 'Room No');
    baseData.roomName = payload.roomName || extractBookingField(details, 'Room Name') || payload.roomType || extractBookingField(details, 'Room Type');
    baseData.checkIn = checkInVal;
    baseData.checkOut = checkOutVal;
    baseData.checkInDate = checkInVal;
    baseData.checkOutDate = checkOutVal;
    baseData.bookedDate = payload.bookedDate || new Date().toISOString().split('T')[0];
    baseData.bookingNo = payload.bookingNo || `HB-${Date.now().toString().slice(-6)}`;
    baseData.bookingPrice = payload.bookingPrice !== undefined ? Number(payload.bookingPrice) : (normalizedPricing.total || 0);
    baseData.adultCount = adultCnt;
    baseData.childCount = childCnt;
    baseData.guestCountry = payload.guestCountry || extractBookingField(details, 'Country');
    baseData.roomType = payload.roomType || extractBookingField(details, 'Room Type');
    baseData.guests = payload.guests || (adultCnt + childCnt);
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
