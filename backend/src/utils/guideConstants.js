const USER_ROLES = [
  'tourist_user', 'guide_user', 'hotelowner_user', 'restaurant_user', 'government_user',
  'renter_user', 'driver_user', 'activityprovider_user', 'admin',
];
const CURRENCIES = ['LKR', 'USD', 'EUR', 'GBP'];
const REQUEST_STATUSES = ['Draft', 'Open', 'Bidding Closed', 'Guide Selected', 'Booked', 'Completed', 'Cancelled', 'Expired'];
const BID_STATUSES = ['Pending', 'Active', 'Accepted', 'Rejected', 'Withdrawn', 'Expired'];
const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Pending Payment', 'Paid', 'Cancelled', 'Completed', 'Failed'];
const PAYMENT_STATUSES = ['Not Required', 'Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'];
const ACTIVE_BOOKING_STATUSES = ['Pending', 'Confirmed', 'Pending Payment', 'Paid'];
const PROFILE_AVAILABILITY = ['Available', 'Unavailable'];
const REVIEW_STATUSES = ['Pending', 'Published', 'Rejected'];

export {
  USER_ROLES,
  CURRENCIES,
  REQUEST_STATUSES,
  BID_STATUSES,
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
  ACTIVE_BOOKING_STATUSES,
  PROFILE_AVAILABILITY,
  REVIEW_STATUSES,
};
