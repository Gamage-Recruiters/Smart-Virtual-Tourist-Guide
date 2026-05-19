import { useEffect, useRef } from 'react'
import { useSafetyContext } from '../contexts/SafetyContext'

/**
 * Custom hook for managing user geolocation
 * Automatically tracks user's position and updates context
 * @returns {Object} - { location, error, isLoading, updateLocation }
 */
export function useGeolocation() {
  const { userLocation, setLoadingState, setErrorState, updateUserLocation } = useSafetyContext()
  const watchIdRef = useRef(null)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setErrorState('location', 'Geolocation is not supported by your browser')
      return
    }

    setLoadingState('location', true)

    const id = navigator.geolocation.watchPosition(
      (position) => {
        updateUserLocation(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        )
        setLoadingState('location', false)
      },
      (error) => {
        setErrorState('location', error.message)
        setLoadingState('location', false)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    )

    watchIdRef.current = id

    return () => {
      if (id) navigator.geolocation.clearWatch(id)
      if (watchIdRef.current === id) watchIdRef.current = null
    }
  }, [setLoadingState, setErrorState, updateUserLocation])

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateUserLocation(
            position.coords.latitude,
            position.coords.longitude,
            position.coords.accuracy
          )
          resolve(position.coords)
        },
        (error) => {
          setErrorState('location', error.message)
          reject(error)
        }
      )
    })
  }

  return {
    location: userLocation,
    error: userLocation.error,
    isLoading: false,
    stopTracking,
    getCurrentPosition,
  }
}
