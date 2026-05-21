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
  const hasInitialLocationRef = useRef(false)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setErrorState('location', 'Geolocation is not supported by your browser')
      return
    }

    setLoadingState('location', true)

    // First, try to get current position immediately (faster, uses cached location)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateUserLocation(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        )
        hasInitialLocationRef.current = true
        setLoadingState('location', false)
      },
      (error) => {
        console.warn('getCurrentPosition failed, will try watchPosition:', error.message)
      },
      {
        enableHighAccuracy: false,
        maximumAge: 60000,
        timeout: 8000,
      }
    )

    // Then start watching for position updates (continuous tracking)
    const id = navigator.geolocation.watchPosition(
      (position) => {
        updateUserLocation(
          position.coords.latitude,
          position.coords.longitude,
          position.coords.accuracy
        )
        hasInitialLocationRef.current = true
        if (!userLocation.latitude || !userLocation.longitude) {
          setLoadingState('location', false)
        }
      },
      (error) => {
        console.error('watchPosition error:', error.message)
        if (hasInitialLocationRef.current === false) {
          setErrorState('location', error.message)
          setLoadingState('location', false)
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      }
    )

    watchIdRef.current = id

    return () => {
      if (id) navigator.geolocation.clearWatch(id)
      if (watchIdRef.current === id) watchIdRef.current = null
    }
  }, [setLoadingState, setErrorState, updateUserLocation, userLocation.latitude, userLocation.longitude])

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
