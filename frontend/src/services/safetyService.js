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

  // 7. COMBINED EMERGENCY LOCATIONS (Police + Hospitals)
  // Fetches all tourist police stations from DB and nearby hospitals from Overpass API
  async getEmergencyLocations(params = {}) {
    try {
      // Pass location params to both police and hospitals for filtering by proximity
      const [policeStations, hospitals] = await Promise.all([
        this.getPoliceStations(params).catch(() => []),
        this.getHospitals(params).catch(() => []),
      ])

      // Tag hospitals with type since Overpass data doesn't include it
      const taggedHospitals = hospitals.map((h) => ({ ...h, type: 'hospital' }))

      // Log for debugging
      console.log('Emergency locations fetched:', {
        police: policeStations.length,
        hospitals: taggedHospitals.length,
        params,
      })

      return [...policeStations, ...taggedHospitals]
    } catch (error) {
      console.error('Error fetching emergency locations:', error)
      throw error
    }
  }
}

export default safetyService
