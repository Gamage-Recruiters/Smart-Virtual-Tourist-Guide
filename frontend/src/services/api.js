const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

const parseResponse = async (response) => {
  const text = await response.text();

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        message: text,
      };
    }
  }

  if (!response.ok) {
    const error = new Error(
      data.message || `HTTP Error: ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

const request = async (endpoint, options = {}) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      /*
       * Required for the HttpOnly session cookie.
       */
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }
  );

  try {
    return await parseResponse(response);
  } catch (error) {
    if (
      error.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      window.location.assign('/login');
    }

    throw error;
  }
};

const apiClient = {
  get(endpoint) {
    return request(endpoint, { method: 'GET' });
  },

  post(endpoint, data) {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data) {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch(endpoint, data) {
    return request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint) {
    return request(endpoint, { method: 'DELETE' });
  },
};

export default apiClient;