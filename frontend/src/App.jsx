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
import SignupForm from './pages/Tourist/SignupForm1';
import TravelSafetyInfo from './pages/Tourist/SignupForm2';
import LoginScreen from './pages/Login/LoginScreen';
import ForgotPasswordScreen from './pages/Login/ForgotPasswordScreen';
import NewPasswordCreate from './pages/Login/NewPasswordCreate';

import HotelOwnerSignup from './pages/HotelOwner/SignUp';
import HotelInfo from './pages/HotelOwner/HotelInfo';

import RestuarantSignup from './pages/Restuarant/SignupPage';

import GuideSignup from './pages/Guide/SignupPage';

import RenterSignup from './pages/Renter/SignupPage';

import GovernmentSignup from './pages/Government/SignupPage';

import ActivityProviderSignup from './pages/ActivityProvider/SignupPage';

import AdminLogin from './pages/Admin/LoginPage';

import DriverSignUp1 from './pages/Driver/SignUpForm1';
import DriverSignUp2 from './pages/Driver/SignUpForm2';
import DriverSignUp3 from './pages/Driver/SignUpForm3';
import { DriverSignupProvider } from './context/DriverSignupContext';

import DummyPageTourist from './pages/Tourist/dummyPage';
import DummyPageHotelOwner from './pages/HotelOwner/dummyPage';
import DummyPageRestaurant from './pages/Restuarant/dummyPage';
import DummyPageGuide from './pages/Guide/dummyPage';
import DummyPageRenter from './pages/Renter/dummyPage';
import DummyPageGovernment from './pages/Government/dummyPage';
import DummyPageDriver from './pages/Driver/dummyPage';
import DummyPageAdmin from './pages/Admin/dummyPage';
import DummyPageActivityProvider from './pages/ActivityProvider/dummyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== AUTH ROUTES ===== */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/tourist" element={<SignupForm />} />
        <Route path="/travel-safety" element={<TravelSafetyInfo />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/create-password" element={<NewPasswordCreate />} />

        {/* ===== HOTEL OWNER ROUTES ===== */}
        <Route path="/hotel-owner" element={<HotelOwnerSignup />} />
        <Route path="/hotel-info" element={<HotelInfo />} />

        {/* ===== OTHER SIGNUP ROUTES ===== */}
        <Route path="/restuarant" element={<RestuarantSignup />} />
        <Route path="/guide" element={<GuideSignup />} />
        <Route path="/renter" element={<RenterSignup />} />
        <Route path="/government" element={<GovernmentSignup />} />
        <Route path="/activity-provider" element={<ActivityProviderSignup />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* ===== DRIVER SIGNUP (with context) ===== */}
        <Route
          path="/driver-signup1"
          element={
            <DriverSignupProvider>
              <DriverSignUp1 />
            </DriverSignupProvider>
          }
        />
        <Route
          path="/driver-signup2"
          element={
            <DriverSignupProvider>
              <DriverSignUp2 />
            </DriverSignupProvider>
          }
        />
        <Route
          path="/driver-signup3"
          element={
            <DriverSignupProvider>
              <DriverSignUp3 />
            </DriverSignupProvider>
          }
        />

        {/* ===== DASHBOARD ROUTES ===== */}
        <Route path="/dashboard-Tourist" element={<DummyPageTourist />} />
        <Route path="/dashboard-HotelOwner" element={<DummyPageHotelOwner />} />
        <Route path="/dashboard-Restaurant" element={<DummyPageRestaurant />} />
        <Route path="/dashboard-Guide" element={<DummyPageGuide />} />
        <Route path="/dashboard-Renter" element={<DummyPageRenter />} />
        <Route path="/dashboard-Government" element={<DummyPageGovernment />} />
        <Route path="/dashboard-Driver" element={<DummyPageDriver />} />
        <Route path="/dashboard-Admin" element={<DummyPageAdmin />} />
        <Route path="/dashboard-ActivityProvider" element={<DummyPageActivityProvider />} />

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