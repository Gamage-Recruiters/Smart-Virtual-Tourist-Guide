const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const parseJsonResponse = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
};

const submitBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
      throw new Error('Unable to connect to backend server. Please ensure the backend server is running on http://localhost:5000');
    }
    throw err;
  }
};

const getBookings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to load bookings');
    }
    return response.json();
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
      throw new Error('Unable to connect to backend server. Please ensure the backend server is running on http://localhost:5000');
    }
    throw err;
  }
};

const getBookingById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Booking not found');
    }
    return response.json();
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
      throw new Error('Unable to connect to backend server. Please ensure the backend server is running on http://localhost:5000');
    }
    throw err;
  }
};

// Generate PayHere hash from backend
const generatePayHereHash = async ({ bookingId, serviceType }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/generate-hash`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookingId, serviceType }),
    });

    if (!response.ok) {
      const err = await parseJsonResponse(response);
      throw new Error(err.message || 'Failed to generate payment hash');
    }

    return response.json();
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
      throw new Error('Unable to connect to backend server. Please ensure the backend server is running on http://localhost:5000');
    }
    throw err;
  }
};

// Confirm payment on client side when PayHere completes
const confirmPayment = async ({ orderId, paymentId }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId, paymentId }),
    });

    if (!response.ok) {
      const err = await parseJsonResponse(response);
      throw new Error(err.message || 'Failed to confirm payment');
    }

    return response.json();
  } catch (err) {
    console.error("Payment confirmation error:", err);
    return { success: false, message: err.message };
  }
};

export { submitBooking, getBookings, getBookingById, generatePayHereHash, confirmPayment };