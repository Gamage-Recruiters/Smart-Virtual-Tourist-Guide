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

// --- ProtectedRoute Component එක ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    // ලොග් වෙලා නැත්නම් Login එකට හරවා යවයි
    return <Navigate to="/login" replace />;
  }
  
  // ලොග් වෙලා නම්, Sidebar එක සහිත Admin Layout එක ඇතුළේ පිටුව පෙන්වයි
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes (ලොග් වෙන්නේ නැතුව යන්න පුළුවන් පිටු) */}
      <Route path="/login" element={<Login />} />
      <Route path="/add-admin" element={<AddNewAdmin />} />

      {/* Protected Routes (අනිවාර්යයෙන්ම ලොග් වෙලා ඉන්න ඕනේ පිටු) */}
      <Route path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
      <Route path="/manage-ads" element={<ProtectedRoute><ManageAds /></ProtectedRoute>} />
      <Route path="/create-ad" element={<ProtectedRoute><CreateAdvertisement /></ProtectedRoute>} />
      <Route path="/approve-listings" element={<ProtectedRoute><ApproveListings /></ProtectedRoute>} />
      <Route path="/view-details/:id" element={<ProtectedRoute><ViewFullDetails /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;