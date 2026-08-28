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
  /**
   * GET request
   */
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

  /**
   * POST request
   */
  async post(endpoint, data) {
    try {
      const isFormData = data instanceof FormData;

      const headers = isPublicRoute(endpoint)
        ? { ...publicHeaders }
        : privateHeaders();

      if (isFormData) {
        delete headers['Content-Type'];
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });

      const json = await response.json();

      if (
        response.status === 401 &&
        !endpoint.startsWith('/auth/login')
      ) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      if (!response.ok) {
        throw {
          message: json.message || 'Request failed',
        };
      }

      return json;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  /**
   * PUT request
   */
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
        throw {
          message: json.message || 'Request failed',
        };
      }

      return json;
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  /**
   * DELETE request
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: isPublicRoute(endpoint)
          ? publicHeaders
          : privateHeaders(),
      });

      const json = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      if (!response.ok) {
        throw {
          message: json.message || 'Delete request failed',
        };
      }

      return json;
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

  getProfile() {
    return apiClient.get('/auth/me');
  },

  updateProfile(profileData) {
    return apiClient.put('/auth/update-travel-info', profileData);
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
 * ACTIVITY PROVIDER APIs
 */
export const activityProviderAPI = {
  register(userData) {
    return apiClient.post(
      '/auth/register/activity-provider',
      userData
    );
  },
};

/**
 * GOVERNMENT APIs
 */
export const governmentAPI = {
  register(userData) {
    return apiClient.post(
      '/auth/register/government',
      userData
    );
  },
};

/**
 * DRIVER APIs
 */
export const driverAPI = {
  register(userData) {
    return apiClient.post(
      '/auth/register/driver',
      userData
    );
  },
};

/**
 * SOCIAL AUTH
 */
export const socialAuthAPI = {
  googleAuth(idToken, role) {
    return apiClient.post('/auth/google', {
      idToken,
      role,
    });
  },
};

/**
 * NAVIGATION & MAPPING APIs
 */
export const fetchRecentPlaces = async (userId, limit) => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (limit) params.append('limit', limit);
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get(`/recent-places${queryString}`);
};

export const saveRecentPlace = async (place, action = null, userId = null, imageUrls = []) => {
  if (!place) return;
  const name = place.displayName || place.name || place.formatted_address?.split(',')[0] || '';
  const placeId = place.place_id || place.placeId || '';
  const body = {
    name,
    placeId,
    action,
    imageUrls,
    ...(userId ? { userId } : {}),
  };
  return apiClient.post('/recent-places', body);
};

export const deleteRecentPlace = async (placeId) => {
  if (!placeId) {
    throw new Error('Place ID is required');
  }
  return apiClient.delete(`/recent-places/${placeId}`);
};

export const fetchFavoritePlaces = async (userId, category) => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (category) params.append('category', category);
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get(`/favorite-places${queryString}`);
};

export const saveFavoritePlace = async (place, category = 'favorite', userId = null, imageUrls = []) => {
  if (!place) return;
  const name = place.displayName || place.name || place.formatted_address?.split(',')[0] || 'Saved Place';
  const placeId = place.place_id || place.placeId || '';
  const body = {
    name,
    placeId,
    category,
    imageUrls,
    ...(userId ? { userId } : {}),
  };
  return apiClient.post('/favorite-places', body);
};

export const deleteFavoritePlace = async (placeId) => {
  if (!placeId) {
    throw new Error('Place ID is required');
  }
  return apiClient.delete(`/favorite-places/${placeId}`);
};

export const fetchHotels = async (location, lat, lng) => {
  const params = new URLSearchParams();
  if (location) params.append('location', location);
  if (lat !== undefined && lat !== null) params.append('lat', lat);
  if (lng !== undefined && lng !== null) params.append('lng', lng);
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get(`/hotels${queryString}`);
};

export const fetchCrimeAlerts = async () => {
  return apiClient.get('/security-alerts/crime');
};

export const fetchRoadBlockages = async () => {
  return apiClient.get('/incidents/public');
};

export const fetchWeatherAlerts = async (location) => {
  const params = new URLSearchParams();
  if (location) params.append('location', location);
  const queryString = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get(`/security-alerts/weather${queryString}`);
};

/**
 * REVIEWS API
 */
export const reviewAPI = {
  getRestaurantReviews(restaurantId, page = 1) {
    return apiClient.get(`/reviews/restaurant/${restaurantId}?page=${page}`);
  },
  createReview(data) {
    return apiClient.post('/reviews', data);
  },
  updateReview(id, data) {
    return apiClient.put(`/reviews/${id}`, data);
  },
  deleteReview(id) {
    return apiClient.delete(`/reviews/${id}`);
  },
  getOwnerReviews(restaurantId, page = 1) {
    return apiClient.get(`/reviews/owner/${restaurantId}?page=${page}`);
  },
  replyToReview(reviewId, replyText) {
    return apiClient.post(`/reviews/${reviewId}/reply`, { reply: replyText });
  },
};

/**
 * Default API client
 */
export default apiClient;