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
  const isFormData = options.body instanceof FormData;
  const body = isFormData ? options.body : typeof options.body === 'string' ? options.body : options.body ? JSON.stringify(options.body) : undefined;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    body,
    headers: isFormData ? options.headers : {
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
  getBookings: (params) => request(`/bookings${buildQueryString(params)}`),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};
