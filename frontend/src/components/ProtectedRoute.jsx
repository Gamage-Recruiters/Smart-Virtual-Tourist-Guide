import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Restricts access based on JWT token presence and user role.
 *
 * @param {Object} props
 * @param {Array<string>} [props.allowedRoles] - Roles permitted to access the route
 * @param {React.ReactNode} props.children - Child components to render if authorized
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('userData');

  if (!token || token === 'null' || token === 'undefined') {
    return <Navigate to="/" replace />;
  }

  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }

  if (allowedRoles.length > 0) {
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      // If user lacks required role, redirect to login page
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
