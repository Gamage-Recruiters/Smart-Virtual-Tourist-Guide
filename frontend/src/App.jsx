import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AdminLayout from './components/layout/AdminLayout';
import ApproveListings from './pages/ApproveListings';
import ManageAds from './pages/ManageAds';
import CreateAdvertisement from './pages/CreateAdvertisement';
import AddNewAdmin from './pages/AddNewAdmin';
import ViewFullDetails from './pages/ViewFullDetails';
import Login from './pages/Login';

// --- ProtectedRoute Component ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes  */}
      <Route path="/login" element={<Login />} />
      <Route path="/add-admin" element={<AddNewAdmin />} />

      <Route path="/" element={
    localStorage.getItem('adminToken') ? (
      <ProtectedRoute><AdminDashboard /></ProtectedRoute>
    ) : (
      <Navigate to="/login" replace />
    )
  } />

      {/* Protected Routes  */}
     
      <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
      <Route path="/manage-ads" element={<ProtectedRoute><ManageAds /></ProtectedRoute>} />
      <Route path="/create-ad" element={<ProtectedRoute><CreateAdvertisement /></ProtectedRoute>} />
      <Route path="/approve-listings" element={<ProtectedRoute><ApproveListings /></ProtectedRoute>} />
      <Route path="/view-details/:id" element={<ProtectedRoute><ViewFullDetails /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;