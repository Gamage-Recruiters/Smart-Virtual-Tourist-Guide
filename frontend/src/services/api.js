export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');
export const AUTH_STORAGE_KEY = 'token';
export const AUTH_USER_STORAGE_KEY = 'userData';

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

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

const readResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError('The server returned an invalid response.', response.status, 'INVALID_RESPONSE');
  }
};

/**
 * Structured request helper used by the Guide workflow. The existing default
 * client remains available to all current feature modules.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (!isPublicRoute(endpoint)) {
    const token = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (token && token !== 'null' && token !== 'undefined') {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
      credentials: 'include',
      body: options.body === undefined || options.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body),
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('The request timed out. Please try again.', 0, 'TIMEOUT');
    }
    throw new ApiError('Unable to reach the server. Check your connection and try again.', 0, 'NETWORK_ERROR');
  } finally {
    window.clearTimeout(timeout);
  }

  const payload = await readResponse(response);
  if (!response.ok) {
    if (response.status === 401 && payload.code !== 'INVALID_CREDENTIALS') {
      window.dispatchEvent(new CustomEvent('svtg:authentication-required'));
      throw new ApiError('Please sign in to continue.', response.status, payload.code || 'UNAUTHENTICATED', payload.details);
    }
    if (response.status >= 500) {
      throw new ApiError('The server could not complete your request. Please try again.', response.status, payload.code || 'INTERNAL_ERROR');
    }
    throw new ApiError(payload.message || 'The request could not be completed.', response.status, payload.code, payload.details);
  }

  return payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
    ? { ...payload, ...payload.data }
    : payload;
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
    return apiRequest('/auth/login', { method: 'POST', body: credentials });
  },
  getMe() {
    return apiRequest('/auth/me');
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
 * ACTIVITY PROVIDER APIs
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
 * DRIVER APIs
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

export const setAccessToken = (token) => {
  if (token) window.localStorage.setItem(AUTH_STORAGE_KEY, token);
  else window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const setStoredUser = (user) => {
  if (user) window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};

export default apiClient;
