import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AdminLayout from './components/layout/AdminLayout';
import ApproveListings from './pages/ApproveListings';

function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
       
        <Route path="/approve-listings" element={<ApproveListings />} /> {/* Active route */}
        <Route path="/approve-listings" element={<div className="p-12 text-center">Approve Listings Page Coming Soon</div>} />
        <Route path="/manage-ads" element={<div className="p-12 text-center">Manage Ads Page Coming Soon</div>} />
      </Routes>
    </AdminLayout>
  );
}

export default App;