import { useEffect, useRef } from 'react'
import { useSafetyContext } from '../../context/SafetyContext'

/**
 * Custom hook for managing user geolocation
 * Automatically tracks user's position and updates context
 *
 * @returns {Object} - {
 *   location,
 *   error,
 *   isLoading,
 *   stopTracking,
 *   getCurrentPosition
 * }
 */
export function useGeolocation() {
  const {
    userLocation,
    loading,
    setLoadingState,
    setErrorState,
    updateUserLocation,
  } = useSafetyContext()

  const watchIdRef = useRef(null)
  const hasInitialLocationRef = useRef(false)
  const recentAccuraciesRef = useRef([])

  /**
   * Adaptive accuracy filter.
   *
   * Keeps the last 10 readings and rejects fixes that are
   * significantly worse than the recent median.
   *
   * This helps avoid sudden inaccurate GPS readings.
   */
  const isAcceptableAccuracy = (accuracy) => {
    recentAccuraciesRef.current.push(accuracy)

    if (recentAccuraciesRef.current.length > 10) {
      recentAccuraciesRef.current.shift()
    }

    // Accept unconditionally until we have at least 3 readings
    if (recentAccuraciesRef.current.length < 3) {
      return true
    }

    // Calculate median accuracy
    const sorted = [...recentAccuraciesRef.current].sort(
      (a, b) => a - b
    )

    const mid = Math.floor(sorted.length / 2)

    const median =
      sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid]

    return accuracy <= median * 2
  }

  useEffect(() => {
    // Check browser geolocation support
    if (!('geolocation' in navigator)) {
      setErrorState(
        'location',
        'Geolocation is not supported by your browser'
      )

      setLoadingState('location', false)

      return
    }

    setLoadingState('location', true)

    /**
     * First get the current position.
     *
     * This is faster because the browser may already have
     * a cached location.
     */
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords

        updateUserLocation(
          latitude,
          longitude,
          accuracy
        )

        hasInitialLocationRef.current = true

        setLoadingState('location', false)
      },
      (error) => {
        console.warn(
          'getCurrentPosition failed, will try watchPosition:',
          error.message
        )
      },
      {
        enableHighAccuracy: false,
        maximumAge: 60000,
        timeout: 8000,
      }
    )

    /**
     * Start continuous location tracking.
     */
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords

        // Ignore poor accuracy readings
        if (!isAcceptableAccuracy(accuracy)) {
          setErrorState(
            'location',
            `Low accuracy (${Math.round(
              accuracy
            )}m) — waiting for better signal`
          )

          return
        }

        updateUserLocation(
          latitude,
          longitude,
          accuracy
        )

        hasInitialLocationRef.current = true

        // Stop loading once we receive a valid location
        if (
          !userLocation?.latitude ||
          !userLocation?.longitude
        ) {
          setLoadingState('location', false)
        }
      },
      (error) => {
        console.error(
          'watchPosition error:',
          error.message
        )

        if (!hasInitialLocationRef.current) {
          setErrorState(
            'location',
            error.message
          )

          setLoadingState(
            'location',
            false
          )
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 20000,
      }
    )

    watchIdRef.current = id

    // Cleanup watcher
    return () => {
      if (id !== null) {
        navigator.geolocation.clearWatch(id)
      }

      if (watchIdRef.current === id) {
        watchIdRef.current = null
      }
    }
  }, [
    setLoadingState,
    setErrorState,
    updateUserLocation,
    userLocation?.latitude,
    userLocation?.longitude,
  ])

  /**
   * Stop continuous location tracking.
   */
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(
        watchIdRef.current
      )

      watchIdRef.current = null
    }
  }

  /**
   * Manually request current location.
   */
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        const error = new Error(
          'Geolocation is not supported by your browser'
        )

        setErrorState(
          'location',
          error.message
        )

        reject(error)

        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {
            latitude,
            longitude,
            accuracy,
          } = position.coords

          updateUserLocation(
            latitude,
            longitude,
            accuracy
          )

          resolve(position.coords)
        },
        (error) => {
          setErrorState(
            'location',
            error.message
          )

          reject(error)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 20000,
        }
      )
    })
  }

  return {
    location: userLocation,
    error: userLocation?.error,
    isLoading: loading?.location ?? false,
    stopTracking,
    getCurrentPosition,
  }
}