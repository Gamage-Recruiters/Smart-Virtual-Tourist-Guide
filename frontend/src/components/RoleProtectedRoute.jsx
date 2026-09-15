import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="guide-auth-loading" role="status">Restoring your session…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (user.role !== role) {
    const route = user.role === 'guide_user' ? '/dashboard-Guide' : user.role === 'tourist_user' ? '/dashboard-Tourist' : '/';
    return <Navigate to={route} replace />;
  }
  return children;
}
