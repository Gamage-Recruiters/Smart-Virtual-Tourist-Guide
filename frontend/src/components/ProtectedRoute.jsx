import { Navigate, useLocation } from 'react-router-dom'

/**
 * ProtectedRoute — wraps restaurant dashboard routes.
 * Redirects to /resturent/login if no JWT token is found in localStorage.
 */
function ProtectedRoute({ children, allowedRoles, loginPath = '/login' }) {
  const location = useLocation()
  const primaryToken = localStorage.getItem('token')
  const restaurantToken = localStorage.getItem('restaurantToken')
  const parseUser = (value) => {
    try { return JSON.parse(value || 'null') } catch { return null }
  }
  const primaryUser = parseUser(localStorage.getItem('userData'))
  const restaurantUser = parseUser(localStorage.getItem('restaurantUser'))
  const sessions = [
    { token: primaryToken, user: primaryUser },
    { token: restaurantToken, user: restaurantUser },
  ]
  const session = allowedRoles?.length
    ? sessions.find((candidate) => candidate.token && candidate.user && allowedRoles.includes(candidate.user.role))
    : sessions.find((candidate) => candidate.token && candidate.user)
  const token = session?.token
  const user = session?.user

  // No token or user is not a restaurant_user → redirect to login
  if (!token || !user) {
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />
  }
  return children
}

export default ProtectedRoute
