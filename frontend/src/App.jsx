import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Login / Auth routes
import LoginScreen from './pages/Login/LoginScreen';
import ForgotPasswordScreen from './pages/Login/ForgotPasswordScreen';
import NewPasswordCreate from './pages/Login/NewPasswordCreate';

// Tourist routes
import SignupForm from './pages/Tourist/SignupForm1';
import TravelSafetyInfo from './pages/Tourist/SignupForm2';
import DummyPageTourist from './pages/Tourist/dummyPage';

// Hotel Owner routes
import HotelOwnerSignup from './pages/HotelOwner/SignUp';
import HotelInfo from './pages/HotelOwner/HotelInfo';
import DummyPageHotelOwner from './pages/HotelOwner/dummyPage';

// Restaurant routes
import ResturentLogingPage from './pages/Restuarant/resturentLogingPage';
import ResturentRegistrationPage from './pages/Restuarant/resturentRegistrationPage';
import ResturentSidebar from './components/resturentSidebar';
import ProtectedRoute from './components/ProtectedRoute';
import ResturentDashboardPage from './pages/Restuarant/resturentDashboardPage';
import ResturentMenuPage from './pages/Restuarant/resturentMenuPage';
import ResturentAddMenuPage from './pages/Restuarant/resturentAddMenuPage';
import ResturentReservationPage from './pages/Restuarant/resturentReservationPage';
import ResturentOfferPage from './pages/Restuarant/resturentOfferPage';
import ResturentReviewPage from './pages/Restuarant/resturentReviewPage';
import ResturentRevenuePage from './pages/Restuarant/resturentRevenuePage';
import ResturentProfilePage from './pages/Restuarant/resturentProfilePage';

// Guide routes
import GuideSignup from './pages/Guide/SignupPage';
import DummyPageGuide from './pages/Guide/dummyPage';

// Renter routes
import RenterSignup from './pages/Renter/SignupPage';
import DummyPageRenter from './pages/Renter/dummyPage';

// Government routes
import GovernmentSignup from './pages/Government/SignupPage';
import DummyPageGovernment from './pages/Government/dummyPage';

// Admin routes
import AdminLogin from './pages/Admin/LoginPage';
import DummyPageAdmin from './pages/Admin/dummyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default / Login */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/create-password" element={<NewPasswordCreate />} />

        {/* ─── HOTEL OWNER ─── */}
        <Route path="/hotel-owner" element={<HotelOwnerSignup />} />
        <Route path="/hotel-info" element={<HotelInfo />} />
        <Route path="/dashboard-HotelOwner" element={<DummyPageHotelOwner />} />

        {/* Tourist */}
        <Route path="/tourist" element={<SignupForm />} />
        <Route path="/travel-safety" element={<TravelSafetyInfo />} />
        <Route path="/dashboard-Tourist" element={<DummyPageTourist />} />

        {/* Restaurant Management */}
        <Route path="/resturent/login" element={<ResturentLogingPage />} />
        <Route path="/resturent/register" element={<ResturentRegistrationPage />} />
        <Route
          path="/resturent/dashboard"
          element={
            <ProtectedRoute>
              <ResturentSidebar />
            </ProtectedRoute>
          }
        >
          <Route index element={<ResturentDashboardPage />} />
          <Route path="menu" element={<ResturentMenuPage />} />
          <Route path="menu/add" element={<ResturentAddMenuPage />} />
          <Route path="reservation" element={<ResturentReservationPage />} />
          <Route path="offers" element={<ResturentOfferPage />} />
          <Route path="reviews" element={<ResturentReviewPage />} />
          <Route path="revenue" element={<ResturentRevenuePage />} />
          <Route path="profile" element={<ResturentProfilePage />} />
        </Route>

        {/* Guide */}
        <Route path="/guide" element={<GuideSignup />} />
        <Route path="/dashboard-Guide" element={<DummyPageGuide />} />

        {/* Renter */}
        <Route path="/renter" element={<RenterSignup />} />
        <Route path="/dashboard-Renter" element={<DummyPageRenter />} />

        {/* Government */}
        <Route path="/government" element={<GovernmentSignup />} />
        <Route path="/dashboard-Government" element={<DummyPageGovernment />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard-Admin" element={<DummyPageAdmin />} />

        {/* Driver routes — awaiting Driver team pages */}
        {/* <Route path="/driver-signup1" element={<DriverSignUp1 />} /> */}
        {/* <Route path="/driver-signup2" element={<DriverSignUp2 />} /> */}
        {/* <Route path="/driver-signup3" element={<DriverSignUp3 />} /> */}
        {/* <Route path="/driver-signup4" element={<DriverSignUp4 />} /> */}
        {/* <Route path="/dashboard-Driver" element={<DummyPageDriver />} /> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
