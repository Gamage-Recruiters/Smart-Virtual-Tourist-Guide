const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const parseJsonResponse = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
};

const submitBooking = async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const errorBody = await parseJsonResponse(response);
    const message = Array.isArray(errorBody.errors)
      ? errorBody.errors.join(', ')
      : errorBody.message || response.statusText;
    throw new Error(message);
  }

  return response.json();
};

const getBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/bookings`);
  if (!response.ok) {
    throw new Error('Failed to load bookings');
  }
  return response.json();
};

const getBookingById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
  if (!response.ok) {
    throw new Error('Booking not found');
  }
  return response.json();
};

export { submitBooking, getBookings, getBookingById };