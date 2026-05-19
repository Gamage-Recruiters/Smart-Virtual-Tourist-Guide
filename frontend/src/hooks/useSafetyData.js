import { useEffect, useState, useCallback } from 'react'
import { useSafetyContext } from '../contexts/SafetyContext'
import safetyService from '../services/safetyService'

/**
 * Custom hook for fetching and managing safety data (alerts, incidents, weather)
 * @param {string} dataType - 'alerts', 'incidents', 'weather', or 'userIncidents'
 * @param {Object} options - Query options (filters, pagination, etc.)
 * @returns {Object} - { data, error, isLoading, refetch }
 */
export function useSafetyData(dataType = 'incidents', options = {}) {
  const context = useSafetyContext()
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      let response

      switch (dataType) {
        case 'alerts':
          response = await safetyService.getSecurityAlerts(options)
          context.updateAlerts(response || [])
          break

        case 'incidents':
          response = await safetyService.getIncidents(options)
          context.updateIncidents(response || [])
          setData(response || [])
          return

        case 'userIncidents':
          response = await safetyService.getUserIncidents(options)
          context.updateUserIncidents(response || [])
          break

        case 'weather':
          response = await safetyService.getWeatherData(options)
          context.updateWeatherData(response || {})
          break

        case 'weatherAlerts':
          response = await safetyService.getWeatherAlerts(options)
          context.updateWeatherAlerts(response?.alerts || response?.data?.alerts || [])
          break

        case 'emergencyLocations':
          response = await safetyService.getEmergencyLocations(options)
          break

        default:
          throw new Error(`Unknown data type: ${dataType}`)
      }

      setData(response || [])
      context.setErrorState(dataType, null)
    } catch (err) {
      console.error(`Error fetching ${dataType}:`, err)
      const errorMessage = err.message || `Failed to fetch ${dataType}`
      setError(errorMessage)
      context.setErrorState(dataType, errorMessage)
    } finally {
      setIsLoading(false)
      context.setLoadingState(dataType, false)
    }
  }, [dataType, options, context])

  useEffect(() => {
    if (options === null) return;
    context.setLoadingState(dataType, true)
    fetchData()
  }, [dataType, JSON.stringify(options)])

  return {
    data,
    error,
    isLoading,
    refetch: fetchData,
  }
}

/**
 * Alternative hook for fetching specific data types with better naming
 */
export function useAlerts(options = {}) {
  return useSafetyData('alerts', options)
}

export function useIncidents(options = {}) {
  return useSafetyData('incidents', options)
}

export function useUserIncidents(options = {}) {
  return useSafetyData('userIncidents', options)
}

export function useWeather(options = {}) {
  return useSafetyData('weather', options)
}

export function useWeatherAlerts(options = {}) {
  return useSafetyData('weatherAlerts', options)
}

export function useEmergencyLocations(options = {}) {
  return useSafetyData('emergencyLocations', options)
}
