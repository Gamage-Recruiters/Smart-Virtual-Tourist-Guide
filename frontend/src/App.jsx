import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AdminLayout from './components/layout/AdminLayout';
import ApproveListings from './pages/ApproveListings';
import ManageAds from './pages/ManageAds';
import CreateAdvertisement from './pages/CreateAdvertisement';
import AddNewAdmin from './pages/AddNewAdmin';
import ViewFullDetails from './pages/ViewFullDetails';
import Login from './pages/Login'

function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/manage-ads" element={<ManageAds />} />
        <Route path="/create-ad" element={<CreateAdvertisement />} />
       <Route path="/add-admin" element={<AddNewAdmin />} />
        <Route path="/approve-listings" element={<ApproveListings />} /> {/* Active route */}
        <Route path="/view-details/:id" element={<ViewFullDetails />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AdminLayout>
  );
}

export default App;