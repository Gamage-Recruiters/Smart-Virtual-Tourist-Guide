
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

      if (!response.ok) {
        throw { message: json.message || 'Request failed', status: response.status };
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
      
      // Browser automatically sets correct Content-Type with boundary for FormData
      if (isFormData) {
        delete headers['Content-Type'];
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });

      const json = await response.json();

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
 * GUIDE PROFILE APIs
 */
export const guideProfileAPI = {
  /** Fetch the logged-in guide's profile */
  getMyProfile() {
    return apiClient.get('/guides/current/profile');
  },

  /** Update profile text fields */
  updateProfile(payload) {
    return apiClient.put('/guides/current/profile', payload);
  },

  /** Upload a new profile photo (File object) */
  uploadPhoto(file) {
    const form = new FormData();
    form.append('profilePhoto', file);
    return apiClient.post('/guides/current/profile/photo', form);
  },

  /** Remove the profile photo */
  removePhoto() {
    return apiClient.delete('/guides/current/profile/photo');
  },

  /** Upload NIC / identity proof document (File object) */
  uploadIdentityProof(file) {
    const form = new FormData();
    form.append('identityProof', file);
    return apiClient.post('/guides/current/profile/documents/identity', form);
  },

  /** Upload one or more certification files (File[] array) */
  uploadCertifications(files) {
    const form = new FormData();
    Array.from(files).forEach((f) => form.append('certifications', f));
    return apiClient.post('/guides/current/profile/documents/certifications', form);
  },

  /** Delete a single certification by its MongoDB sub-document ID */
  removeCertification(fileId) {
    return apiClient.delete(`/guides/current/profile/documents/certifications/${fileId}`);
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

/**
 * TOUR PACKAGE APIs
 */
export const tourPackageAPI = {
  createPackage(payload) {
    return apiClient.post('/tour-packages', payload);
  },
  listPackages(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/tour-packages${query ? `?${query}` : ''}`);
  },
  getPackageById(id) {
    return apiClient.get(`/tour-packages/${id}`);
  },
  updatePackage(id, payload) {
    return apiClient.put(`/tour-packages/${id}`, payload);
  },
  updateStatus(id, status) {
    return apiClient.patch(`/tour-packages/${id}/status`, { status });
  },
  deletePackage(id) {
    return apiClient.delete(`/tour-packages/${id}`);
  },
  addRouteStop(id, name) {
    return apiClient.post(`/tour-packages/${id}/route-stops`, { name });
  },
  updateRouteStop(id, stopId, name) {
    return apiClient.put(`/tour-packages/${id}/route-stops/${stopId}`, { name });
  },
  removeRouteStop(id, stopId) {
    return apiClient.delete(`/tour-packages/${id}/route-stops/${stopId}`);
  },
  uploadPhotos(id, files) {
    const form = new FormData();
    Array.from(files).forEach((f) => form.append('photos', f));
    return apiClient.post(`/tour-packages/${id}/photos`, form);
  },
  removePhoto(id, photoId) {
    return apiClient.delete(`/tour-packages/${id}/photos/${photoId}`);
  },
};

export default apiClient;
