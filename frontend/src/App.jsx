import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ApproveListings from './pages/ApproveListings';
import ManageAds from './pages/ManageAds';
import CreateAdvertisement from './pages/CreateAdvertisement';
import AddNewAdmin from './pages/AddNewAdmin';
import ViewFullDetails from './pages/ViewFullDetails';
import Login from './pages/Login';
import EditAdvertisement from './pages/EditAdvertisement';
import ViewAdvertisement from './pages/ViewAdvertisement';
import AccessDenied from './pages/AccessDenied';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Only genuinely public page */}
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['Administrator']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-management"
        element={
          <ProtectedRoute allowedRoles={['Administrator']}>
            <UserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-admin"
        element={
          <ProtectedRoute allowedRoles={['Administrator']}>
            <AddNewAdmin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-ads"
        element={
          <ProtectedRoute allowedRoles={['Administrator']}>
            <ManageAds />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-ad"
        element={
          <ProtectedRoute allowedRoles={['Administrator']}>
            <CreateAdvertisement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-ad/:id"
        element={
          <ProtectedRoute allowedRoles={['Administrator']}>
            <EditAdvertisement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/view-ad/:id"
        element={
          <ProtectedRoute allowedRoles={['Administrator']}>
            <ViewAdvertisement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/approve-listings"
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Moderator']}>
            <ApproveListings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/access-denied"
        element={
          <ProtectedRoute allowedRoles={['Editor']}>
            <AccessDenied />
          </ProtectedRoute>
        }
      />

      <Route
        path="/view-details/:id"
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Moderator']}>
            <ViewFullDetails />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
