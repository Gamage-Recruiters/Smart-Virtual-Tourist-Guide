const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ALLOWED_ORIGIN = new URL(API_URL).origin;

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = new URL(`${API_URL}${endpoint}`);
    if (url.origin !== ALLOWED_ORIGIN) {
      throw new Error('Request blocked: invalid endpoint origin');
    }

    const headers = { ...options.headers };

    if (!options.isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url.toString(), { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  },

  get(endpoint) { return this.request(endpoint); },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  upload(endpoint, formData) {
    return this.request(endpoint, { method: 'PUT', body: formData, isFormData: true });
  },

  uploadMultiple(endpoint, formData) {
    return this.request(endpoint, { method: 'POST', body: formData, isFormData: true });
  }
};
