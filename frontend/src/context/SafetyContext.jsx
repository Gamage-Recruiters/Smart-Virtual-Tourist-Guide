/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const SafetyContext = createContext()

export function SafetyProvider({ children }) {
  // Geolocation state
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    error: null,
  })

  // Alerts state
  const [alerts, setAlerts] = useState([])
  const filteredAlerts = alerts

  // Incidents state
  const [incidents, setIncidents] = useState([])
  const [userIncidents, setUserIncidents] = useState([])

  // Weather state
  const [weatherData, setWeatherData] = useState(null)
  const [weatherAlerts, setWeatherAlerts] = useState([])

  // UI state
  const [activeTab, setActiveTab] = useState('home') // home, weather, security, emergency, incidents
  const [loading, setLoading] = useState({
    location: false,
    alerts: false,
    incidents: false,
    weather: false,
  })
  const [error, setError] = useState({
    location: null,
    alerts: null,
    incidents: null,
    weather: null,
  })

  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    severity: 'all', // all, low, medium, high, critical
    district: 'all',
    category: 'all',
    timeRange: 'all', // all, 24h, 7d, 30d
  })

  // Incident form draft state
  const [incidentFormDraft, setIncidentFormDraft] = useState({
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
    reporterType: 'tourist', // tourist, local, other
    category: '',
    description: '',
    timeOfIncident: new Date(),
    district: '',
    latitude: null,
    longitude: null,
    images: [],
    attachments: [],
  })

  // Context methods
  const updateUserLocation = useCallback((latitude, longitude, accuracy = null) => {
    setUserLocation({
      latitude,
      longitude,
      accuracy,
      timestamp: new Date(),
      error: null,
    })
  }, [])

  const updateAlerts = useCallback((newAlerts) => {
    setAlerts(newAlerts)
  }, [])

  const updateIncidents = useCallback((newIncidents) => {
    setIncidents(newIncidents)
  }, [])

  const updateUserIncidents = useCallback((newUserIncidents) => {
    setUserIncidents(newUserIncidents)
  }, [])

  const updateWeatherData = useCallback((data) => {
    setWeatherData(data)
  }, [])

  const updateWeatherAlerts = useCallback((alerts) => {
    setWeatherAlerts(alerts)
  }, [])

  const setLoadingState = useCallback((key, value) => {
    setLoading((prev) => {
      if (prev[key] === value) return prev
      return { ...prev, [key]: value }
    })
  }, [])

  const setErrorState = useCallback((key, value) => {
    setError((prev) => {
      if (prev[key] === value) return prev
      return { ...prev, [key]: value }
    })
  }, [])

  const updateIncidentFormDraft = useCallback((updates) => {
    setIncidentFormDraft((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetIncidentFormDraft = useCallback(() => {
    setIncidentFormDraft({
      reporterName: '',
      reporterEmail: '',
      reporterPhone: '',
      reporterType: 'tourist',
      category: '',
      description: '',
      timeOfIncident: new Date(),
      district: '',
      latitude: null,
      longitude: null,
      images: [],
      attachments: [],
    })
  }, [])

  const updateFilters = useCallback((newFilters) => {
    setActiveFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const value = useMemo(() => ({
    // State
    userLocation,
    alerts,
    filteredAlerts,
    incidents,
    userIncidents,
    weatherData,
    weatherAlerts,
    activeTab,
    loading,
    error,
    activeFilters,
    incidentFormDraft,

    // Methods
    updateUserLocation,
    updateAlerts,
    updateIncidents,
    updateUserIncidents,
    updateWeatherData,
    updateWeatherAlerts,
    setActiveTab,
    setLoadingState,
    setErrorState,
    updateIncidentFormDraft,
    resetIncidentFormDraft,
    updateFilters,
  }), [
    userLocation,
    alerts,
    filteredAlerts,
    incidents,
    userIncidents,
    weatherData,
    weatherAlerts,
    activeTab,
    loading,
    error,
    activeFilters,
    incidentFormDraft,
    updateUserLocation,
    updateAlerts,
    updateIncidents,
    updateUserIncidents,
    updateWeatherData,
    updateWeatherAlerts,
    setLoadingState,
    setErrorState,
    updateIncidentFormDraft,
    resetIncidentFormDraft,
    updateFilters,
  ])

  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>
}

export function useSafetyContext() {
  const context = useContext(SafetyContext)
  if (!context) {
    throw new Error('useSafetyContext must be used within SafetyProvider')
  }
  return context
}
