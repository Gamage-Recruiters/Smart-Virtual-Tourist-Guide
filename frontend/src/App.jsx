import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// ===== ACTIVITY PROVIDER (from main) =====
import ActivityProviderDashboard from './pages/ActivityProvider/ActivityProviderDashboard.jsx';
import ActivityList from './pages/ActivityProvider/ActivityList.jsx';
import Activity from './pages/ActivityProvider/AddActivity.jsx';
import ManageCalendar from './pages/ActivityProvider/ManageCalendar.jsx';
import ViewRatings from './pages/ActivityProvider/ViewRatings.jsx';
import AcceptBookings from './pages/ActivityProvider/AcceptBookings.jsx';

// ===== LANDING PAGES (from main) =====
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Destinations from './pages/Destinations';
import HowItWorks from './pages/HowItWork';
import ContactUs from './pages/Contact.jsx';
import AddDestination from './pages/addDestinations';
import DestinationDetails from './pages/DestinationDetails.jsx';
import ResultsPage from './pages/ResultsPage.jsx';

// ===== AUTH / LOGIN =====
import SignupForm from './pages/Tourist/SignupForm1';
import TravelSafetyInfo from './pages/Tourist/SignupForm2';
import LoginScreen from './pages/Login/LoginScreen';
import ForgotPasswordScreen from './pages/Login/ForgotPasswordScreen';
import NewPasswordCreate from './pages/Login/NewPasswordCreate';

// ===== HOTEL OWNER (from main) =====
import HotelOwnerSignup from './pages/HotelOwner/SignUp';
import HotelInfo from './pages/HotelOwner/HotelInfo';
import HotelOwnerDashboard from './pages/HotelOwner/HotelOwnerDashboard.jsx';
import ViewCurrentRoomsPackages from './pages/HotelOwner/ViewCurrentRoomsPackages.jsx';
import AddRoomPage from './pages/HotelOwner/AddRoomPage.jsx';
import AddSpecialPackages from './pages/HotelOwner/AddSpecialPackages.jsx';
import ManageRoomAvailability from './pages/HotelOwner/ManageRoomAvailability.jsx';
import ViewRoomAvailabilityCalenderPage from './pages/HotelOwner/ViewRoomAvailabilityCalenderPage.jsx';
import ViewRoomReservation from './pages/HotelOwner/ViewRoomReservation.jsx';
import FinancialAnalysisDashboard from './pages/HotelOwner/FinancialAnalysisDashboard.jsx';
import HotelOwnerProfileSettings from './pages/HotelOwner/HotelOwnerProfileSettings.jsx';

// ===== RESTAURANT (from Integration-resturent/shakir — OUR BRANCH) =====
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
import TouristRestaurantsPage from './pages/Tourist/TouristRestaurantsPage';
import TouristRestaurantDetailsPage from './pages/Tourist/TouristRestaurantDetailsPage';

// ===== OTHER SIGNUPS (from main) =====
import GuideSignup from './pages/Guide/SignupPage';
import RenterSignup from './pages/Renter/SignupPage';
import GovernmentSignup from './pages/Government/SignupPage';
import ActivityProviderSignup from './pages/ActivityProvider/SignupPage';
import AdminLogin from './pages/Admin/LoginPage';

// ===== DRIVER (from main) =====
import DriverSignUp1 from './pages/Driver/SignUpForm1';
import DriverSignUp2 from './pages/Driver/SignUpForm2';
import DriverSignUp3 from './pages/Driver/SignUpForm3';
import { DriverSignupProvider } from './context/DriverSignupContext';

// ===== DUMMY / DASHBOARD PAGES =====
import DummyPageTourist from './pages/Tourist/dummyPage';
import DummyPageGuide from './pages/Guide/dummyPage';
import DummyPageGovernment from './pages/Government/dummyPage';
import DummyPageAdmin from './pages/Admin/dummyPage';
import DummyPageDriver from './pages/Driver/dummyPage';

// ===== VEHICLE ADMIN (from main) =====
import VehicleAdmin from './pages/vehicleAdminDashboard/vehicleAdminPage';
import Dashboard from './pages/vehicleAdminDashboard/dashboard';
import RentalRequestsPage from './pages/vehicleAdminDashboard/rentalRequestsPage';
import MyFleetPage from './pages/vehicleAdminDashboard/myFleetPage';
import EarningsPage from './pages/vehicleAdminDashboard/earningsPage';
import SettingsPage from './pages/vehicleAdminDashboard/settingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== ACTIVITY PROVIDER ROUTES (from main) ===== */}
        <Route path="/activityprovider/dashboard" element={<ActivityProviderDashboard />} />
        <Route path="/activityprovider/activities" element={<ActivityList />} />
        <Route path="/activityprovider/activities/new" element={<Activity />} />
        <Route path="/activityprovider/activities/edit/:id" element={<Activity />} />
        <Route path="/activityprovider/calendar" element={<ManageCalendar />} />
        <Route path="/activityprovider/viewratings" element={<ViewRatings />} />
        <Route path="/activityprovider/acceptbookings" element={<AcceptBookings />} />

        {/* ===== LANDING PAGES (from main) ===== */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="results" element={<ResultsPage />} />
        </Route>
        <Route path="/add-destination" element={<AddDestination />} />
        <Route path="/destination-detail" element={<DestinationDetails />} />


        {/* ===== AUTH ROUTES ===== */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/create-password" element={<NewPasswordCreate />} />

        {/* ===== SIGNUP FLOWS ===== */}
        <Route path="/tourist" element={<SignupForm />} />
        <Route path="/travel-safety" element={<TravelSafetyInfo />} />
        <Route path="/hotel-owner" element={<HotelOwnerSignup />} />
        <Route path="/hotel-info" element={<HotelInfo />} />
        <Route path="/guide" element={<GuideSignup />} />
        <Route path="/renter" element={<RenterSignup />} />
        <Route path="/government" element={<GovernmentSignup />} />
        <Route path="/activity-provider" element={<ActivityProviderSignup />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Driver signup — wrapped in shared context so all 3 steps share form state (from main) */}
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
        <Route path="/dashboard-HotelOwner" element={<HotelOwnerDashboard />} />
        <Route path="/dashboard-Guide" element={<DummyPageGuide />} />
        <Route path="/dashboard-Renter" element={<VehicleAdmin />} />
        <Route path="/dashboard-Government" element={<DummyPageGovernment />} />
        <Route path="/dashboard-Driver" element={<DummyPageDriver />} />
        <Route path="/dashboard-Admin" element={<DummyPageAdmin />} />
        <Route path="/dashboard-ActivityProvider" element={<ActivityProviderDashboard />} />

        {/* ===== VEHICLE ADMIN ROUTES (from main) ===== */}
        <Route path="/vehicle-admin" element={<VehicleAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="requests" element={<RentalRequestsPage />} />
          <Route path="fleet" element={<MyFleetPage />} />
          <Route path="earnings" element={<EarningsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ===== HOTEL OWNER MANAGEMENT ROUTES (from main) ===== */}
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
        <Route path="/Hotel-Owner-Profile-Settings" element={<HotelOwnerProfileSettings />} />

        {/* ===== TOURIST RESTAURANT PAGES (from our branch) ===== */}
        <Route path="/restaurants" element={<TouristRestaurantsPage />} />
        <Route path="/restaurants/:id" element={<TouristRestaurantDetailsPage />} />

        {/* ===== RESTAURANT MANAGEMENT (from our branch — FULL IMPLEMENTATION) ===== */}
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
          <Route path="menu/edit/:id" element={<ResturentAddMenuPage />} />
          <Route path="reservation" element={<ResturentReservationPage />} />
          <Route path="offers" element={<ResturentOfferPage />} />
          <Route path="reviews" element={<ResturentReviewPage />} />
          <Route path="revenue" element={<ResturentRevenuePage />} />
          <Route path="profile" element={<ResturentProfilePage />} />
        </Route>

        {/* ===== 404 FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
