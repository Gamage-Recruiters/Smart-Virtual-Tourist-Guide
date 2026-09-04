import { useEffect } from 'react';

/**
 * Custom hook that calls a callback on a fixed interval.
 * Cleans up automatically on unmount or dependency change.
 *
 * @param {Function} callback - Function to call on each interval tick
 * @param {number} intervalMs - Interval in milliseconds (default: 5 minutes)
 */
export function useAutoRefresh(callback, intervalMs = 5 * 60 * 1000) {
  useEffect(() => {
    if (!callback) return;
    const id = setInterval(callback, intervalMs);
    return () => clearInterval(id);
  }, [callback, intervalMs]);
}
