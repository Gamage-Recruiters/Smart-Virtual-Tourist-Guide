const calculatePricingTotal = (pricing) => {
  const items = Array.isArray(pricing?.items) ? pricing.items : [];
  return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
};

const extractBookingField = (details, ...labelNames) => {
  if (!Array.isArray(details)) return null;
  for (const name of labelNames) {
    if (!name) continue;
    const match = details.find(
      (item) => item.label && item.label.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (match && match.value !== undefined && match.value !== null && String(match.value).trim() !== '') {
      return match.value;
    }
  }
  return null;
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
    baseData.activityDate = payload.activityDate || extractBookingField(details, 'Activity Date', 'Date');
    baseData.timeSlot = payload.timeSlot || extractBookingField(details, 'Time Slot', 'Slot', 'Time');
    baseData.participants = payload.participants || Number(parseInt(extractBookingField(details, 'Participants', 'Guests', 'Person(s)') || '1')) || 1;
  } else if (serviceType === 'driver') {
    baseData.travelDate = payload.travelDate || extractBookingField(details, 'Travel Date', 'Date');
    baseData.pickupTime = payload.pickupTime || extractBookingField(details, 'Pickup Time', 'Time');
    baseData.pickupLocation = payload.pickupLocation || extractBookingField(details, 'Pickup Location', 'Pickup');
    baseData.destination = payload.destination || extractBookingField(details, 'Destination', 'Dropoff Location');
    baseData.passengers = payload.passengers || Number(parseInt(extractBookingField(details, 'Passengers', 'Participants', 'Guests') || '1')) || 1;
  } else if (serviceType === 'guide') {
    baseData.tourDate = payload.tourDate || extractBookingField(details, 'Tour Date', 'Date');
    baseData.language = payload.language || extractBookingField(details, 'Language');
    baseData.participants = payload.participants || Number(parseInt(extractBookingField(details, 'Participants', 'Guests') || '1')) || 1;
    baseData.meetingLocation = payload.meetingLocation || extractBookingField(details, 'Meeting Location', 'Location');
    baseData.duration = payload.duration || extractBookingField(details, 'Tour Duration', 'Duration');
  } else if (serviceType === 'hotel') {
    const checkInVal = payload.checkIn || payload.checkInDate || extractBookingField(details, 'Check-in', 'Check-in Date', 'Check In', 'CheckIn') || '';
    const checkOutVal = payload.checkOut || payload.checkOutDate || extractBookingField(details, 'Check-out', 'Check-out Date', 'Check Out', 'CheckOut') || '';
    const rawRoom = payload.roomName || extractBookingField(details, 'Room', 'Room Name', 'Room Type') || payload.roomType || 'Standard Room';
    const rawGuestsStr = extractBookingField(details, 'Guests', 'Guest') || '';
    const rawGuestsNum = Number(parseInt(rawGuestsStr || '1')) || 1;

    const adultCnt = payload.adultCount !== undefined
      ? Number(payload.adultCount)
      : (Number(parseInt(extractBookingField(details, 'Adults') || String(rawGuestsNum))) || 1);
    const childCnt = payload.childCount !== undefined
      ? Number(payload.childCount)
      : (Number(parseInt(extractBookingField(details, 'Children') || '0')) || 0);

    const extractedHotelId = payload.hotelId || service?.hotelId || service?.ownerId || (service?.serviceId && String(service.serviceId).length === 24 ? String(service.serviceId) : (service?._id && String(service._id).length === 24 ? String(service._id) : undefined));
    const extractedRoomId = payload.roomId || service?.roomId || extractBookingField(details, 'Room ID', 'RoomId', 'Room Id');
    baseData.hotelId = extractedHotelId && String(extractedHotelId).length === 24 ? extractedHotelId : undefined;
    baseData.roomId = (extractedRoomId && extractedRoomId !== 'N/A') ? String(extractedRoomId) : (service?.roomId || service?.serviceId || null);
    const extractedRoomNo = payload.roomNumber || payload.roomNo || service?.roomNumber || service?.roomNo || extractBookingField(details, 'Room Number', 'Room No', 'Room #') || 'R1';
    const extractedRoomName = payload.roomName || service?.roomName || extractBookingField(details, 'Room Name', 'Room') || payload.roomType || rawRoom;

    baseData.roomNo = extractedRoomNo;
    baseData.roomName = extractedRoomName;
    baseData.checkIn = checkInVal;
    baseData.checkOut = checkOutVal;
    baseData.checkInDate = checkInVal;
    baseData.checkOutDate = checkOutVal;
    baseData.bookedDate = payload.bookedDate || new Date().toISOString().split('T')[0];
    baseData.bookingNo = payload.bookingNo || `HB-${Date.now().toString().slice(-6)}`;
    baseData.bookingPrice = payload.bookingPrice !== undefined ? Number(payload.bookingPrice) : (normalizedPricing.total || 0);
    baseData.adultCount = adultCnt;
    baseData.childCount = childCnt;
    baseData.guestCountry = payload.guestCountry || extractBookingField(details, 'Country') || 'Sri Lanka';
    baseData.roomType = payload.roomType || service?.roomType || extractBookingField(details, 'Room Type') || 'Deluxe Double Room';
    baseData.guests = payload.guests || rawGuestsNum || (adultCnt + childCnt);
    baseData.roomsCount = payload.roomsCount || Number(parseInt(extractBookingField(details, 'Rooms', 'Rooms Count') || '1')) || 1;
  } else if (serviceType === 'restaurant') {
    baseData.reservationDate = payload.reservationDate || extractBookingField(details, 'Reservation Date', 'Date');
    baseData.reservationTime = payload.reservationTime || extractBookingField(details, 'Reservation Time', 'Time');
    baseData.guests = payload.guests || Number(parseInt(extractBookingField(details, 'Guests', 'Guest') || '1')) || 1;
    baseData.specialRequests = payload.specialRequests || extractBookingField(details, 'Special Request', 'Special Requests', 'Notes') || '';
  } else if (serviceType === 'vehicle' || serviceType === 'vehiclerental') {
    baseData.pickupDate = payload.pickupDate || extractBookingField(details, 'Pickup Date & Time', 'Pickup Date', 'Pickup');
    baseData.dropoffDate = payload.dropoffDate || extractBookingField(details, 'Return Date & Time', 'Drop-off Date', 'Dropoff Date', 'Return Date');
    baseData.pickupLocation = payload.pickupLocation || extractBookingField(details, 'Pickup Location', 'Pickup');
    baseData.dropoffLocation = payload.dropoffLocation || extractBookingField(details, 'Return Location', 'Drop-off Location', 'Dropoff Location', 'Return');
    baseData.driverRequired = payload.driverRequired ?? (extractBookingField(details, 'Driver Required') === 'Yes');
  }

  return baseData;
};

export {
  calculatePricingTotal,
  buildBookingData,
  extractBookingField,
};

