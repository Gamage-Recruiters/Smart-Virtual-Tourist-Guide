const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const publicHeaders = { 'Content-Type': 'application/json' };

const privateHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token && token !== 'null' && token !== 'undefined') {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Decide whether route should NOT include JWT
 */
const isPublicRoute = (endpoint = '') => {
  return (
    endpoint.startsWith('/auth/login') ||
    endpoint.startsWith('/auth/register') ||
    endpoint.startsWith('/auth/google') ||
    endpoint === '/auth/forgot-password' ||
    endpoint === '/auth/reset-password'
  );
};

const statusFallback = {
  400: 'Please check the submitted information.',
  401: 'Authentication required.',
  403: 'Permission denied.',
  404: 'Requested resource unavailable.',
  409: 'This action conflicts with an existing record.',
  500: 'The server could not complete the request.',
};

const request = async (method, endpoint, data) => {
  const formData = typeof FormData !== 'undefined' && data instanceof FormData;
  const headers = isPublicRoute(endpoint) ? { ...publicHeaders } : privateHeaders();
  if (formData) delete headers['Content-Type'];

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      ...(data !== undefined ? { body: formData ? data : JSON.stringify(data) } : {}),
    });
  } catch (cause) {
    console.error(`API ${method} network error:`, cause);
    const error = new Error('Unable to reach the server. Please check your connection and try again.');
    error.status = 0;
    throw error;
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = response.status === 204
    ? {}
    : contentType.includes('application/json')
      ? await response.json()
      : { message: await response.text() };

  if (!response.ok) {
    const error = new Error(payload.message || statusFallback[response.status] || 'The request could not be completed.');
    error.status = response.status;
    error.data = payload;
    if (response.status === 401 && !isPublicRoute(endpoint)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      window.dispatchEvent(new Event('auth:expired'));
    }
    throw error;
  }
  return payload;
};

const apiClient = {
  get: (endpoint) => request('GET', endpoint),
  post: (endpoint, data) => request('POST', endpoint, data),
  put: (endpoint, data) => request('PUT', endpoint, data),
  patch: (endpoint, data) => request('PATCH', endpoint, data),
  delete: (endpoint) => request('DELETE', endpoint),
};

/**
 * USER APIs
 */
export const userAPI = {
  register(userData) {
    return apiClient.post('/auth/register/tourist', userData);
  },
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },
  updateTravelInfo(travelData) {
    return apiClient.put('/auth/update-travel-info', travelData);
  },
};

/**
 * HOTEL OWNER APIs
 */
export const hotelOwnerAPI = {
  register(userData) {
    return apiClient.post('/auth/register/hotel-owner', userData);
  },
  addHotelInfo(hotelData) {
    return apiClient.post('/auth/add-hotel-info', hotelData);
  },
};

/**
 * GUIDE APIs
 */
export const guideAPI = {
  register(userData) {
    return apiClient.post('/auth/register/guide', userData);
  },
};

/**
 * RESTAURANT APIs
 */
export const restaurantAPI = {
  register(userData) {
    return apiClient.post('/auth/register/restaurant', userData);
  },
};

/**
 * RENTER APIs
 */
export const renterAPI = {
  register(userData) {
    return apiClient.post('/auth/register/renter', userData);
  },
};

/**
 * ACTIVITY PROVIDER APIs (from main)
 */
export const activityProviderAPI = {
  register(userData) {
    return apiClient.post('/auth/register/activity-provider', userData);
  },
};

/**
 * GOVERNMENT APIs
 */
export const governmentAPI = {
  register(userData) {
    return apiClient.post('/auth/register/government', userData);
  },
};

/**
 * DRIVER APIs (from main)
 */
export const driverAPI = {
  register(userData) {
    return apiClient.post('/auth/register/driver', userData);
  },
};

/**
 * SOCIAL AUTH
 */
export const socialAuthAPI = {
  googleAuth(idToken, role) {
    return apiClient.post('/auth/google', { idToken, role });
  },
};

// ==================== RESTAURANT-SPECIFIC APIs (from Integration-resturent/shakir) ====================

/**
 * Private headers using restaurantToken (for restaurant dashboard calls)
 */
const restaurantPrivateHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('restaurantToken');
  if (token && token !== 'null') {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * REVIEW APIs (Restaurant feature)
 */
export const reviewAPI = {
  /** Get reviews + stats for a restaurant (public, with optional auth for user review) */
  async getRestaurantReviews(restaurantId, page = 1) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('token');
      if (token && token !== 'null') {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(
        `${API_BASE_URL}/reviews/restaurant/${restaurantId}?page=${page}`,
        { method: 'GET', headers }
      );
      return await response.json();
    } catch (error) {
      console.error('API GET Reviews Error:', error);
      throw error;
    }
  },

  /** Create a review */
  createReview(data) {
    return apiClient.post('/reviews', data);
  },

  /** Update own review */
  updateReview(reviewId, data) {
    return apiClient.put(`/reviews/${reviewId}`, data);
  },

  /** Delete own review */
  deleteReview(reviewId) {
    return apiClient.delete(`/reviews/${reviewId}`);
  },

  /** Restaurant owner: reply to a review */
  async replyToReview(reviewId, reply) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reply`, {
        method: 'PUT',
        headers: restaurantPrivateHeaders(),
        body: JSON.stringify({ reply }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw { message: json.message || 'Request failed' };
      }
      return json;
    } catch (error) {
      console.error('API Reply Error:', error);
      throw error;
    }
  },

  /** Restaurant owner: get all reviews for own restaurant (dashboard) */
  async getOwnerReviews(restaurantId, page = 1) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/owner/${restaurantId}?page=${page}`,
        { method: 'GET', headers: restaurantPrivateHeaders() }
      );
      return await response.json();
    } catch (error) {
      console.error('API GET Owner Reviews Error:', error);
      throw error;
    }
  },
};

export default apiClient;
