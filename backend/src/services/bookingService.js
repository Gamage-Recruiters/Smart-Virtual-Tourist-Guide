const calculatePricingTotal = (pricing) => {
  const items = Array.isArray(pricing.items) ? pricing.items : [];
  return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
};

const buildBookingData = ({
  service,
  bookingDetails,
  pricing,
  customer,
  paymentMethod,
  paymentDetails,
}) => {
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
  };

  return {
    service,
    bookingDetails: Array.isArray(bookingDetails) ? bookingDetails : [],
    pricing: normalizedPricing,
    customer,
    payment,
  };
};

module.exports = {
  calculatePricingTotal,
  buildBookingData,
};
