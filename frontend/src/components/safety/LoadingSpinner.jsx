import { FiLoader } from 'react-icons/fi';

/**
 * Centered loading spinner with optional message text.
 * Used by SecurityAlertsPage and WeatherAlertsPage during data fetches.
 *
 * @param {Object} props
 * @param {string} props.message - Text to show below the spinner
 * @param {string} props.height - Container height (default: '500px')
 */
export default function LoadingSpinner({ message = 'Loading...', height = '500px' }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-slate-400"
      style={{ height }}
    >
      <FiLoader className="animate-spin mb-2" size={30} />
      <p>{message}</p>
    </div>
  );
}
