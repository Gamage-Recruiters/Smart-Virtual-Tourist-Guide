const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Public headers (no auth)
 */
const publicHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Private headers (with JWT if available)
 */
const privateHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');

  if (token && token !== 'null') {
    headers['Authorization'] = `Bearer ${token}`;
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

/**
 * Core API client
 */
const apiClient = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: isPublicRoute(endpoint)
          ? publicHeaders
          : privateHeaders(),
      });

      const json = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      return json;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const isFormData = data instanceof FormData;

      const headers = isPublicRoute(endpoint) ? { ...publicHeaders } : privateHeaders();

      if (isFormData) {
        delete headers['Content-Type'];
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });

      const json = await response.json();

      if (response.status === 401 && !endpoint.startsWith('/auth/login')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      if (!response.ok) {
        throw { message: json.message || 'Request failed' };
      }

      return json;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: isPublicRoute(endpoint)
          ? publicHeaders
          : privateHeaders(),
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw { message: json.message || 'Request failed' };
      }

      return json;
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: isPublicRoute(endpoint)
          ? publicHeaders
          : privateHeaders(),
      });

      return await response.json();
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },
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
