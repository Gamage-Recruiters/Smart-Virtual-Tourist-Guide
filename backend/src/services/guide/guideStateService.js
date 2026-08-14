import AppError from '../../utils/AppError.js';

const transitions = {
  request: {
    Draft: ['Open', 'Cancelled'],
    Open: ['Bidding Closed', 'Guide Selected', 'Booked', 'Cancelled', 'Expired'],
    'Bidding Closed': ['Guide Selected', 'Cancelled', 'Expired'],
    'Guide Selected': ['Booked', 'Cancelled'],
    Booked: ['Completed', 'Cancelled'],
  },
  bid: {
    Pending: ['Active', 'Rejected', 'Withdrawn', 'Expired'],
    Active: ['Accepted', 'Rejected', 'Withdrawn', 'Expired'],
  },
  booking: {
    Pending: ['Confirmed', 'Failed', 'Cancelled'],
    Confirmed: ['Pending Payment', 'Paid', 'Completed', 'Cancelled'],
    'Pending Payment': ['Paid', 'Failed', 'Cancelled'],
    Paid: ['Completed', 'Cancelled'],
  },
};

const assertTransition = (domain, current, next) => {
  if (current === next) return;
  if (!transitions[domain]?.[current]?.includes(next)) {
    throw new AppError(`Cannot change ${domain} status from ${current} to ${next}.`, 409, 'INVALID_STATUS_TRANSITION');
  }
};

export { assertTransition };
