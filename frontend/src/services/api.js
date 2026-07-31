const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/safety';
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/$/, '');
const API_ROOT_URL = normalizedApiBaseUrl.endsWith('/safety')
  ? normalizedApiBaseUrl.slice(0, -'/safety'.length)
  : normalizedApiBaseUrl;
const API_BASE_URL = `${API_ROOT_URL}/safety`;

const apiClient = {
  buildUrl(endpoint) {
    if (/^https?:\/\//.test(endpoint)) return endpoint
    if (endpoint.startsWith('/safety/')) {
      return `${API_ROOT_URL}${endpoint}`
    }
    return `${API_BASE_URL}${endpoint}`
  },

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async get(endpoint, options = {}) {
    try {
      const params = options.params ? `?${new URLSearchParams(options.params).toString()}` : ''
      const response = await fetch(`${apiClient.buildUrl(endpoint)}${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...apiClient.getAuthHeaders(),
        },
      });
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorBody.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const isFormData = data instanceof FormData;
      const response = await fetch(apiClient.buildUrl(endpoint), {
        method: 'POST',
        headers: isFormData
          ? { ...apiClient.getAuthHeaders() }
          : { 'Content-Type': 'application/json', ...apiClient.getAuthHeaders() },
        body: isFormData ? data : JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorBody.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(apiClient.buildUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...apiClient.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorBody.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(apiClient.buildUrl(endpoint), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...apiClient.getAuthHeaders(),
        },
      });
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorBody.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },
};

export default apiClient;
