import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute — wraps restaurant dashboard routes.
 * Redirects to /resturent/login if no JWT token is found in localStorage.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('restaurantToken')
  const user = JSON.parse(localStorage.getItem('restaurantUser') || 'null')

  // No token or user is not a restaurant_user → redirect to login
  if (!token || !user || user.role !== 'restaurant_user') {
    return <Navigate to="/resturent/login" replace />
  }

  return children
}

export default ProtectedRoute
