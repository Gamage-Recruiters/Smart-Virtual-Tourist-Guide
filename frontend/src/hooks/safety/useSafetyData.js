import { useEffect, useState, useCallback } from 'react'
import { useSafetyContext } from '../../context/SafetyContext'
import safetyService from '../../services/safety/safetyService'

/**
 * Custom hook for fetching and managing safety data (alerts, incidents, weather)
 * @param {string} dataType - 'alerts', 'incidents', 'weather', or 'userIncidents'
 * @param {Object} options - Query options (filters, pagination, etc.)
 * @returns {Object} - { data, error, isLoading, refetch }
 */
export function useSafetyData(dataType = 'incidents', options = {}) {
  const { updateAlerts, updateIncidents, updateUserIncidents, updateWeatherData, updateWeatherAlerts, setErrorState, setLoadingState } = useSafetyContext()
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
          updateAlerts(response || [])
          break

        case 'incidents':
          response = await safetyService.getIncidents(options)
          updateIncidents(response || [])
          setData(response || [])
          return

        case 'userIncidents':
          response = await safetyService.getUserIncidents(options)
          updateUserIncidents(response || [])
          break

        case 'weather':
          response = await safetyService.getWeatherData(options)
          updateWeatherData(response || {})
          break

        case 'weatherAlerts':
          response = await safetyService.getWeatherAlerts(options)
          updateWeatherAlerts(response?.alerts || response?.data?.alerts || [])
          break

        case 'hospitals':
          response = await safetyService.getHospitals(options)
          break

        case 'touristPoliceStations':
          response = await safetyService.getPoliceStations(options)
          break

        case 'localPoliceStations':
          response = await safetyService.getLocalPoliceStations(options)
          break

        default:
          throw new Error(`Unknown data type: ${dataType}`)
      }

      setData(response || [])
      setErrorState(dataType, null)
    } catch (err) {
      console.error(`Error fetching ${dataType}:`, err)
      const errorMessage = err.message || `Failed to fetch ${dataType}`
      setError(errorMessage)
      setErrorState(dataType, errorMessage)
    } finally {
      setIsLoading(false)
      setLoadingState(dataType, false)
    }
  }, [dataType, options, updateAlerts, updateIncidents, updateUserIncidents, updateWeatherData, updateWeatherAlerts, setErrorState, setLoadingState])

  useEffect(() => {
    if (options === null) return;
    setLoadingState(dataType, true)
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

export function useHospitals(options = {}) {
  return useSafetyData('hospitals', options)
}

export function useLocalPoliceStations(options = {}) {
  return useSafetyData('localPoliceStations', options)
}

export function useTouristPolice(options = {}) {
  return useSafetyData('touristPoliceStations', options)
}
