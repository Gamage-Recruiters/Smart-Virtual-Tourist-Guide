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
    body: options.body && !(options.body instanceof FormData) ? JSON.stringify(options.body) : options.body,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) throw new Error(data.message || 'Request failed');
  return { data };
};

export const calendarAPI = {
  getMonth: (activityId, year, month) => request(`/calendar/${activityId}/month${buildQueryString({ year, month })}`),
  getSummary: (activityId) => request(`/calendar/${activityId}/summary`),
  getDate: (activityId, date) => request(`/calendar/${activityId}/date/${date}`),
  saveDate: (activityId, date, body) => request(`/calendar/${activityId}/date/${date}`, { method: 'POST', body }),
  markUnavailable: (activityId, date) => request(`/calendar/${activityId}/date/${date}/unavailable`, { method: 'PATCH' }),
};

export default calendarAPI;