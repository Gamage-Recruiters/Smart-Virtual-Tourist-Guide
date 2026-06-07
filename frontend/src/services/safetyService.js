import apiClient from './api'

// Senior Engineer Tip: Improved unwrapping to handle the { success, data } 
// pattern used in your Express controllers.
const unwrapList = (response) => {
  const data = response?.data?.data || response?.data || []
  return Array.isArray(data) ? data : []
}

const unwrapObject = (response) => response?.data?.data || response?.data || {}

const safetyService = {
  
  // 1. INCIDENTS (Supports Cloudinary/FormData)
  async getPublicIncidents(params = {}) {
    try {
      const response = await apiClient.get('/safety/incidents/public', { params })
      return unwrapList(response)
    } catch (error) {
      console.error('Error fetching public incidents:', error)
      throw error
    }
  },

  async getIncidents(params = {}) {
    try {
      const response = await apiClient.get('/incidents', { params })
      return unwrapList(response)
    } catch (error) {
      console.error('Error fetching incidents:', error)
      throw error
    }
  },

  async getUserIncidents(params = {}) {
    try {
      const response = await apiClient.get('/incidents', { params })
      return unwrapList(response)
    } catch (error) {
      console.error('Error fetching user incidents:', error)
      throw error
    }
  },

  async createIncident(formData) {
    try {
      // FormData will be automatically handled with multipart/form-data
      const response = await apiClient.post('/incidents', formData)
      return unwrapObject(response)
    } catch (error) {
      console.error('Error creating incident:', error)
      throw error
    }
  },

  async updateIncident(incidentId, updates) {
    try {
      const response = await apiClient.put(`/incidents/${incidentId}`, updates)
      return unwrapObject(response)
    } catch (error) {
      console.error('Error updating incident:', error)
      throw error
    }
  },

  async deleteIncident(incidentId) {
    try {
      const response = await apiClient.delete(`/incidents/${incidentId}`)
      return unwrapObject(response)
    } catch (error) {
      console.error('Error deleting incident:', error)
      throw error
    }
  },

  // 2. SECURITY ALERTS (Enhanced for proximity/Leaflet)
  // Usage: getSecurityAlerts({ lat: 6.9, lng: 79.8, radius: 5000 })
  async getSecurityAlerts(params = {}) {
    try {
      const response = await apiClient.get('/security-alerts', { params })
      return unwrapList(response)
    } catch (error) {
      console.error('Error fetching security alerts:', error)
      throw error
    }
  },

  // 2b. GEOCODE a location name to lat/lng via OpenWeather Geocoding API
  async geocodeLocation(query) {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)},LK&limit=1&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.length > 0) {
        return { lat: data[0].lat, lng: data[0].lon, name: data[0].name };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  },

  // 3. EMERGENCY CONTACTS & SHARING (New: Twilio Integration)
  async shareLiveLocation(payload) {
    try {
      // Payload: { currentCoords: [lat, lng], contactId: '...' }
      const response = await apiClient.post('/location/share', payload)
      return unwrapObject(response)
    } catch (error) {
      console.error('Error sharing location:', error)
      throw error
    }
  },

  // 4. EMERGENCY RESOURCES (Leaflet optimized)
  async getPoliceStations(params = {}) {
    try {
      const response = await apiClient.get('/emergency-locations/police', { params })
      return unwrapList(response)
    } catch (error) {
      console.error('Error fetching police stations:', error)
      throw error
    }
  },

  async getHospitals(params = {}) {
    try {
      // Calls the backend which fetches from Overpass API (OSM)
      const response = await apiClient.get('/emergency-locations/hospitals', { params })
      return unwrapList(response)
    } catch (error) {
      console.error('Error fetching hospitals:', error)
      throw error
    }
  },

  // 4b. LOCAL POLICE STATIONS (Overpass API — auto-filtered by proximity)
  async getLocalPoliceStations(params = {}) {
    try {
      const response = await apiClient.get('/emergency-locations/local-police', { params })
      return unwrapList(response)
    } catch (error) {
      console.error('Error fetching local police stations:', error)
      throw error
    }
  },

  // 5. WEATHER (Cron-job data)
  async getWeatherData(options) {
    try {
      const response = await apiClient.get('/weather', { params: options })
      return unwrapObject(response)
    } catch (error) {
      console.error('Error fetching weather:', error)
      throw error
    }
  },

  // 6. WEATHER ALERTS (Live risk assessments for tourist areas)
  async getWeatherAlerts() {
    try {
      const response = await apiClient.get('/weather/alerts')
      return unwrapObject(response)
    } catch (error) {
      console.error('Error fetching weather alerts:', error)
      throw error
    }
  },



  // 8. TOURIST PROFILE
  async getTouristProfile(touristId) {
    try {
      // Try safety-scoped endpoint first
      const response = await apiClient.get(`/tourists/profile/${touristId}`)
      return unwrapObject(response)
    } catch (error) {
      console.warn('Failed to fetch from /safety/tourists/profile, trying fallbacks...', error)
      try {
        const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/safety';
        const apiRoot = rawApiBaseUrl.replace(/\/safety\/?$/, '');
        
        // Try /api/tourists/profile/:id
        const res1 = await fetch(`${apiRoot}/tourists/profile/${touristId}`);
        if (res1.ok) {
          const json = await res1.json();
          return json?.data?.data || json?.data || json;
        }

        // Try /api/profile/:id
        const res2 = await fetch(`${apiRoot}/profile/${touristId}`);
        if (res2.ok) {
          const json = await res2.json();
          return json?.data?.data || json?.data || json;
        }
      } catch (innerError) {
        console.error('All profile fetch fallback attempts failed:', innerError)
      }
      throw error
    }
  }
}

export default safetyService
