import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import apiClient from '../../services/Admin/adminApi';

const getRoleHome = (role) => {
  if (role === 'Administrator') return '/admin';
  if (role === 'Moderator') return '/admin/listings';
  return '/admin/access-denied';
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const response = await apiClient.get('/admin/auth/profile');

        if (!mounted) {
          return;
        }

        setAdmin(response.data);
      } catch {
        if (!mounted) {
          return;
        }

        setUnauthorized(true);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F9FF] text-sm text-gray-600">
        Checking administrator session...
      </div>
    );
  }

  if (unauthorized || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    return <Navigate to={getRoleHome(admin.role)} replace />;
  }

  return (
    <AdminLayout isAuthenticated admin={admin}>
      {children}
    </AdminLayout>
  );
};

export default ProtectedRoute;
