const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const RECENT_PLACES_ENDPOINT = '/recent-places';

const resolvePlaceName = (place) => {
  let name = place?.displayName || place?.name || place?.formatted_address?.split(',')[0] || '';
  const plusCodeRegex = /^[23456789CFGHJMPQRVWX]{2,6}\+/i;
  if (plusCodeRegex.test(name) && place?.formatted_address) {
    const parts = place.formatted_address.split(',');
    if (parts.length > 1) {
      name = parts[1].trim();
    }
  }
  return name;
};

const resolvePlaceId = (place) => {
  return place?.place_id || place?.placeId || '';
};

const resolvePlaceImageUrl = (place) => {
  const photo = place?.photos?.[0];
  if (!photo?.getUrl) return '';
  try {
    return photo.getUrl({ maxWidth: 400, maxHeight: 400 });
  } catch {
    return '';
  }
};

const ALLOWED_ENDPOINTS = [
  '/recent-places',
  '/favorite-places',
  '/security-alerts',
  '/security-alerts/weather',
  '/security-alerts/crime',
  '/incidents/public',
  '/hotels',
];

const isSafeEndpoint = (endpoint) =>
  ALLOWED_ENDPOINTS.some((allowed) => endpoint === allowed || endpoint.startsWith(`${allowed}?`) || endpoint.startsWith(`${allowed}/`));

const apiClient = {
  async get(endpoint) {
    if (!isSafeEndpoint(endpoint)) throw new Error(`Blocked unsafe endpoint: ${endpoint}`);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    if (!isSafeEndpoint(endpoint)) throw new Error(`Blocked unsafe endpoint: ${endpoint}`);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    if (!isSafeEndpoint(endpoint)) throw new Error(`Blocked unsafe endpoint: ${endpoint}`);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    if (!isSafeEndpoint(endpoint)) throw new Error(`Blocked unsafe endpoint: ${endpoint}`);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      return await response.json();
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },
};

export const saveRecentPlace = async (place, action = null, userId, imageUrls = []) => {
  const name = resolvePlaceName(place);
  if (!name) return null;

  const normalizedImageUrls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean).slice(0, 2) : [];
  if (!normalizedImageUrls.length) {
    const fallbackImageUrl = resolvePlaceImageUrl(place);
    if (fallbackImageUrl) normalizedImageUrls.push(fallbackImageUrl);
  }

  return apiClient.post(RECENT_PLACES_ENDPOINT, {
    userId,
    placeId: resolvePlaceId(place) || undefined,
    name,
    action,
    imageUrl: normalizedImageUrls[0] || undefined,
    imageUrls: normalizedImageUrls.length ? normalizedImageUrls : undefined,
    timestamp: new Date().toISOString(),
  });
};

export const fetchRecentPlaces = async (userId, limit) => {
  const params = new URLSearchParams();
  if (userId) params.set('userId', userId);
  if (limit != null) params.set('limit', String(limit));
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get(`${RECENT_PLACES_ENDPOINT}${suffix}`);
};

export const deleteRecentPlace = async (id) => {
  return apiClient.delete(`${RECENT_PLACES_ENDPOINT}/${id}`);
};

export const saveFavoritePlace = async (place, category = 'favorite', userId, imageUrls = []) => {
  const name = resolvePlaceName(place);
  if (!name) return null;

  const normalizedImageUrls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean).slice(0, 2) : [];
  if (!normalizedImageUrls.length) {
    const fallbackImageUrl = resolvePlaceImageUrl(place);
    if (fallbackImageUrl) normalizedImageUrls.push(fallbackImageUrl);
  }

  return apiClient.post('/favorite-places', {
    userId,
    placeId: resolvePlaceId(place) || undefined,
    name,
    category,
    imageUrl: normalizedImageUrls[0] || undefined,
    imageUrls: normalizedImageUrls.length ? normalizedImageUrls : undefined,
    timestamp: new Date().toISOString(),
  });
};

export const fetchFavoritePlaces = async (userId, category) => {
  const params = new URLSearchParams();
  if (userId) params.set('userId', userId);
  if (category) params.set('category', category);
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get(`/favorite-places${suffix}`);
};

export const deleteFavoritePlace = async (id) => {
  return apiClient.delete(`/favorite-places/${id}`);
};

export const fetchRoadBlockages = async () => {
  return apiClient.get('/incidents/public?status=reported');
};

const ALLOWED_LOCATION_RE = /^[a-zA-Z0-9\s,\-.]{1,100}$/;

export const fetchWeatherAlerts = async (location) => {
  if (!location) return apiClient.get('/security-alerts/weather');
  const sanitized = location.replace(/[^a-zA-Z0-9\s,\-.]/g, '').trim().slice(0, 100);
  if (!sanitized || !ALLOWED_LOCATION_RE.test(sanitized)) return { data: [] };
  return apiClient.get(`/security-alerts/weather?location=${encodeURIComponent(sanitized)}`);
};

export const fetchCrimeAlerts = async () => {
  return apiClient.get('/security-alerts/crime');
};

export const fetchHotels = async (location, lat, lng) => {
  const sanitized = (location || '').replace(/[^a-zA-Z0-9\s,\-.]/g, '').trim().slice(0, 100);
  const params = new URLSearchParams();
  if (sanitized) params.set('location', sanitized);
  if (lat != null && lng != null) {
    params.set('lat', String(lat));
    params.set('lng', String(lng));
  }
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get(`/hotels${suffix}`);
};

export default apiClient;
