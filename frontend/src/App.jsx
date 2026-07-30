import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ===== FEATURE/ACCOMMODATION-MANAGEMENT ROUTES =====
import HotelOwnerDashboard from './pages/HotelOwnerDashboard.jsx';
import ViewCurrentRoomsPackages from './pages/ViewCurrentRoomsPackages.jsx';
import AddRoomPage from './pages/AddRoomPage.jsx';
import AddSpecialPackages from './pages/AddSpecialPackages.jsx';
import ManageRoomAvailability from './pages/ManageRoomAvailability.jsx';
import ViewRoomAvailabilityCalenderPage from './pages/ViewRoomAvailabilityCalenderPage.jsx';
import ViewRoomReservation from './pages/ViewRoomReservation.jsx';
import FinancialAnalysisDashboard from './pages/FinancialAnalysisDashboard.jsx';

// ===== AUTH-ACCOMMODATION-INTEGRATION ROUTES =====
import LoginScreen from './pages/Login/LoginScreen';
import ForgotPasswordScreen from './pages/Login/ForgotPasswordScreen';
import NewPasswordCreate from './pages/Login/NewPasswordCreate';

import HotelOwnerSignup from './pages/HotelOwner/SignUp';
import HotelInfo from './pages/HotelOwner/HotelInfo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== AUTH ROUTES ===== */}
        {/* DEV: swap the element below to test any page directly */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/create-password" element={<NewPasswordCreate />} />

        {/* ===== HOTEL OWNER ROUTES ===== */}
        <Route path="/hotel-owner" element={<HotelOwnerSignup />} />
        <Route path="/hotel-info" element={<HotelInfo />} />

        {/* ===== DASHBOARD ROUTES ===== */}
        <Route path="/dashboard-HotelOwner" element={<HotelOwnerDashboard />} />

        {/* ===== ACCOMMODATION MANAGEMENT ROUTES ===== */}
        <Route path="/view-rooms-packages" element={<ViewCurrentRoomsPackages />} />
        <Route path="/add-room-package" element={<AddRoomPage />} />
        <Route path="/edit-room/:id" element={<AddRoomPage />} />
        <Route path="/add-special-package" element={<AddSpecialPackages />} />
        <Route path="/edit-package/:id" element={<AddSpecialPackages />} />
        <Route path="/manage-availability" element={<ManageRoomAvailability />} />
        <Route path="/view-availability-calendar" element={<ViewRoomAvailabilityCalenderPage />} />
        <Route path="/view-reservations" element={<ViewRoomReservation />} />
        <Route path="/financial-analysis" element={<FinancialAnalysisDashboard />} />
        <Route path="/dashboard" element={<HotelOwnerDashboard />} />

        {/* ===== 404 FALLBACK ===== */}
        <Route path="*" element={<h1 className="text-center mt-20 text-3xl font-bold">404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;