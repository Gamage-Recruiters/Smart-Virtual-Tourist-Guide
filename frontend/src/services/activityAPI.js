const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, value);
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: options.body instanceof FormData ? options.headers : {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return { data };
};

export const activityAPI = {
  getAll: (params) => request(`/activities${buildQueryString(params)}`),
  getById: (id) => request(`/activities/${id}`),
  create: (body) => request('/activities', { method: 'POST', body }),
  update: (id, body) => request(`/activities/${id}`, { method: 'PUT', body }),
  delete: (id) => request(`/activities/${id}`, { method: 'DELETE' }),
  publish: (id) => request(`/activities/${id}/publish`, { method: 'PATCH' }),
};
