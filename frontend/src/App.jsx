import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Tourist routes
import SignupForm from './pages/Tourist/SignupForm1';
import TravelSafetyInfo from './pages/Tourist/SignupForm2';
import DummyPageTourist from './pages/Tourist/dummyPage';

// Login / Auth routes
import LoginScreen from './pages/Login/LoginScreen';
import ForgotPasswordScreen from './pages/Login/ForgotPasswordScreen';
import NewPasswordCreate from './pages/Login/NewPasswordCreate';

// Hotel Owner routes
import HotelOwnerSignup from './pages/HotelOwner/SignUp';
import HotelInfo from './pages/HotelOwner/HotelInfo';
import DummyPageHotelOwner from './pages/HotelOwner/dummyPage';

// Restaurant routes
import RestuarantSignup from './pages/Restuarant/SignupPage';
import DummyPageRestaurant from './pages/Restuarant/dummyPage';
import ResturentLogingPage from './pages/resturentLogingPage';
import ResturentRegistrationPage from './pages/resturentRegistrationPage';
import ResturentSidebar from './components/resturentSidebar';
import ResturentDashboardPage from './pages/resturentDashboardPage';
import ResturentMenuPage from './pages/resturentMenuPage';
import ResturentAddMenuPage from './pages/resturentAddMenuPage';
import ResturentReservationPage from './pages/resturentReservationPage';
import ResturentOfferPage from './pages/resturentOfferPage';
import ResturentReviewPage from './pages/resturentReviewPage';
import ResturentRevenuePage from './pages/resturentRevenuePage';
import ResturentProfilePage from './pages/resturentProfilePage';

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

// Driver routes
import DriverSignUp1 from './pages/Driver/SignUpForm1';
import DriverSignUp2 from './pages/Driver/SignUpForm2';
import DriverSignUp3 from './pages/Driver/SignUpForm3';
import DriverSignUp4 from './pages/Driver/SignUpForm4';
import DummyPageDriver from './pages/Driver/dummyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default / Login */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/create-password" element={<NewPasswordCreate />} />

        {/* Tourist */}
        <Route path="/tourist" element={<SignupForm />} />
        <Route path="/travel-safety" element={<TravelSafetyInfo />} />
        <Route path="/dashboard-Tourist" element={<DummyPageTourist />} />

        {/* Hotel Owner */}
        <Route path="/hotel-owner" element={<HotelOwnerSignup />} />
        <Route path="/hotel-info" element={<HotelInfo />} />
        <Route path="/dashboard-HotelOwner" element={<DummyPageHotelOwner />} />

        {/* Restaurant (signup flow) */}
        <Route path="/restuarant" element={<RestuarantSignup />} />
        <Route path="/dashboard-Restaurant" element={<DummyPageRestaurant />} />

        {/* Restaurant Management (dashboard) */}
        <Route path="/resturent/login" element={<ResturentLogingPage />} />
        <Route path="/resturent/register" element={<ResturentRegistrationPage />} />
        <Route path="/resturent/dashboard" element={<ResturentSidebar />}>
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

        {/* Driver */}
        <Route path="/driver-signup1" element={<DriverSignUp1 />} />
        <Route path="/driver-signup2" element={<DriverSignUp2 />} />
        <Route path="/driver-signup3" element={<DriverSignUp3 />} />
        <Route path="/driver-signup4" element={<DriverSignUp4 />} />
        <Route path="/dashboard-Driver" element={<DummyPageDriver />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
