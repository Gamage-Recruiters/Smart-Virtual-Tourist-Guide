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

const apiClient = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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

export default apiClient;
