import { FiX, FiAlertTriangle } from 'react-icons/fi'

/**
 * Alert banner component for displaying critical safety alerts
 * @param {Object} props
 * @param {string} props.type - 'critical', 'warning', 'info' (default: 'warning')
 * @param {string} props.title - Alert title
 * @param {string} props.message - Alert message
 * @param {string} props.icon - Custom icon element
 * @param {Function} props.onClose - Callback when close button clicked
 * @param {Array} props.actions - Array of action buttons: { label, onClick }
 */
export default function AlertBanner({
  type = 'warning',
  title = 'Alert',
  message = '',
  icon = null,
  onClose = null,
  actions = [],
}) {
  const typeStyles = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      title: 'text-red-900',
      message: 'text-red-800',
      icon: 'text-red-600',
      action: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
      icon: 'text-yellow-600',
      action: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      title: 'text-blue-900',
      message: 'text-blue-800',
      icon: 'text-blue-600',
      action: 'bg-blue-600 hover:bg-blue-700',
    },
  }

  const styles = typeStyles[type] || typeStyles.warning

  return (
    <div
      className={`${styles.bg} border-l-4 ${styles.border} p-4 rounded-r-lg flex items-start gap-4 shadow-md animate-slide-down`}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${styles.icon} mt-0.5`}>
        {icon || <FiAlertTriangle size={24} />}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className={`font-bold text-sm ${styles.title}`}>{title}</h3>
        {message && <p className={`text-sm ${styles.message} mt-1`}>{message}</p>}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-2 mt-3">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`${styles.action} text-white text-sm px-3 py-1 rounded transition-colors`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${styles.icon} hover:opacity-70 transition-opacity`}
          aria-label="Close alert"
        >
          <FiX size={20} />
        </button>
      )}
    </div>
  )
}
