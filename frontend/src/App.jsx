import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Global Notification Engine components
import ToastContainer from "./components/notifications/ToastContainer";
import NotificationBell from "./components/notifications/NotificationBell";
import NotificationModal from "./components/notifications/NotificationModal";
import ConnectionStatusBanner from "./components/notifications/ConnectionStatusBanner";

// ===== ACTIVITY PROVIDER (from main) =====
import ActivityProviderDashboard from "./pages/ActivityProvider/ActivityProviderDashboard.jsx";
import ActivityList from "./pages/ActivityProvider/ActivityList.jsx";
import Activity from "./pages/ActivityProvider/AddActivity.jsx";
import ManageCalendar from "./pages/ActivityProvider/ManageCalendar.jsx";
import ViewRatings from "./pages/ActivityProvider/ViewRatings.jsx";
import AcceptBookings from "./pages/ActivityProvider/AcceptBookings.jsx";

// ===== LANDING PAGES (from main) =====
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import Destinations from "./pages/Destinations";
import ContactPage from "./pages/Contact";
import HowItWorks from "./pages/HowItWork";

// ===== AUTH / LOGIN =====
import SignupForm from "./pages/Tourist/SignupForm1";
import TravelSafetyInfo from "./pages/Tourist/SignupForm2";
import LoginScreen from "./pages/Login/LoginScreen";
import ForgotPasswordScreen from "./pages/Login/ForgotPasswordScreen";
import NewPasswordCreate from "./pages/Login/NewPasswordCreate";

// ===== HOTEL OWNER (from main) =====
import HotelOwnerSignup from "./pages/HotelOwner/SignUp";
import HotelInfo from "./pages/HotelOwner/HotelInfo";
import HotelOwnerDashboard from "./pages/HotelOwner/HotelOwnerDashboard.jsx";
import ViewCurrentRoomsPackages from "./pages/HotelOwner/ViewCurrentRoomsPackages.jsx";
import AddRoomPage from "./pages/HotelOwner/AddRoomPage.jsx";
import AddSpecialPackages from "./pages/HotelOwner/AddSpecialPackages.jsx";
import ManageRoomAvailability from "./pages/HotelOwner/ManageRoomAvailability.jsx";
import ViewRoomAvailabilityCalenderPage from "./pages/HotelOwner/ViewRoomAvailabilityCalenderPage.jsx";
import ViewRoomReservation from "./pages/HotelOwner/ViewRoomReservation.jsx";
import FinancialAnalysisDashboard from "./pages/HotelOwner/FinancialAnalysisDashboard.jsx";
import HotelOwnerProfileSettings from "./pages/HotelOwner/HotelOwnerProfileSettings.jsx";

// ===== RESTAURANT (from main) =====
import ResturentLogingPage from "./pages/Restuarant/resturentLogingPage";
import ResturentRegistrationPage from "./pages/Restuarant/resturentRegistrationPage";
import ResturentSidebar from "./components/resturentSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import ResturentDashboardPage from "./pages/Restuarant/resturentDashboardPage";
import ResturentMenuPage from "./pages/Restuarant/resturentMenuPage";
import ResturentAddMenuPage from "./pages/Restuarant/resturentAddMenuPage";
import ResturentReservationPage from "./pages/Restuarant/resturentReservationPage";
import ResturentOfferPage from "./pages/Restuarant/resturentOfferPage";
import ResturentReviewPage from "./pages/Restuarant/resturentReviewPage";
import ResturentRevenuePage from "./pages/Restuarant/resturentRevenuePage";
import ResturentProfilePage from "./pages/Restuarant/resturentProfilePage";
import TouristRestaurantsPage from "./pages/Tourist/TouristRestaurantsPage";
import TouristRestaurantDetailsPage from "./pages/Tourist/TouristRestaurantDetailsPage";

// ===== OTHER SIGNUPS (from main) =====
import GuideSignup from "./pages/Guide/SignupPage";
import RenterSignup from "./pages/Renter/SignupPage";
import GovernmentSignup from "./pages/Government/SignupPage";
import ActivityProviderSignup from "./pages/ActivityProvider/SignupPage";
import AdminLogin from "./pages/Admin/LoginPage";

// ===== DRIVER (from main) =====
import DriverSignUp1 from "./pages/Driver/SignUpForm1";
import DriverSignUp2 from "./pages/Driver/SignUpForm2";
import DriverSignUp3 from "./pages/Driver/SignUpForm3";
import { DriverSignupProvider } from "./context/DriverSignupContext";

// ===== DUMMY / DASHBOARD PAGES =====
import DummyPageTourist from "./pages/Tourist/dummyPage";
import DummyPageGuide from "./pages/Guide/dummyPage";
import DummyPageGovernment from "./pages/Government/dummyPage";
import DummyPageAdmin from "./pages/Admin/dummyPage";
import DummyPageDriver from "./pages/Driver/dummyPage";
import RenterDashboard from "./pages/Renter/vehicleAdminDashboard/dashboard";

// ===== VEHICLE ADMIN (from main) =====
//import VehicleAdmin from "./pages/vehicleAdminDashboard/vehicleAdminPage";
//import Dashboard from "./pages/vehicleAdminDashboard/dashboard";
//import RentalRequestsPage from "./pages/vehicleAdminDashboard/rentalRequestsPage";
// import MyFleetPage from "./pages/vehicleAdminDashboard/myFleetPage";
// import EarningsPage from "./pages/vehicleAdminDashboard/earningsPage";
// import SettingsPage from "./pages/vehicleAdminDashboard/settingsPage";

// ===== Notification =====
import GlobalNotificationUI from "./components/notifications/GlobalNotificationUI";
//import NotificationModal from "./components/notifications/NotificationModal.jsx";

// ============================================================
// BRANCH ADDITIONS
// ============================================================

// Destination / Search
import AddDestination from "./pages/addDestinations";
import DestinationDetails from "./pages/DestinationDetails.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";

// Integrated Admin
import IntegratedAdminDashboard from "./pages/Admin/AdminDashboard";
import IntegratedAdminUsers from "./pages/Admin/UserManagement";
import IntegratedAdminListings from "./pages/Admin/ApproveListings";
import IntegratedAdminAds from "./pages/Admin/ManageAds";
import IntegratedAdminCreateAd from "./pages/Admin/CreateAdvertisement";
import IntegratedAdminAddUser from "./pages/Admin/AddNewAdmin";
import IntegratedAdminViewDetails from "./pages/Admin/ViewFullDetails";
import IntegratedAdminLogin from "./pages/Admin/Login";
import IntegratedAdminEditAd from "./pages/Admin/EditAdvertisement";
import IntegratedAdminViewAd from "./pages/Admin/ViewAdvertisement";
import IntegratedAdminAccessDenied from "./pages/Admin/AccessDenied";
import IntegratedAdminProtectedRoute from "./components/Admin/ProtectedRoute";

// Tourist dashboard additions
import MainPage from "./pages/Tourist/touristMainPage/mainPage.jsx";
import TouristProfilePage from "./pages/Tourist/touristProfile/touristProfilePage.jsx";
import NavigationMain from "./pages/NavigationAndMapping/NavigationMain.jsx";
import { PageTitleProvider } from "./context/PageTitleContext";

import { RentVehiclePage } from "./pages/Renter/rentVehiclePage.jsx";
import TouristDashboard from "./pages/Tourist/touristDashboard/dashboard.jsx";
import TripPlanningPage from "./pages/Tourist/tripPlanning/TripPlanningPage.jsx";
import VehicleDetailsPage from "./pages/Renter/vehicleDetailsPage.jsx";
import BookDriver from "./pages/Driver/bookDriver.jsx";
import FindHotelPage from "./pages/HotelOwner/findHotelPage.jsx";
import HotelDetails from "./pages/HotelOwner/HotelDetails.jsx";

// Restaurant branch layout
import RestaurantLayout from "./components/Restuarant/RestaurantLayout.jsx";

// Safety module
import { SafetyProvider } from "./context/SafetyContext.jsx";
import SafetyLayout from "./pages/safety/SafetyLayout";
import PublicIncidentsPage from "./pages/safety/PublicIncidentsPage";
import EmergencyCallPage from "./pages/safety/EmergencyCallPage";
import SecurityAlertsPage from "./pages/safety/SecurityAlertsPage";
import IncidentReportPage from "./pages/safety/IncidentReportPage";
import IncidentTrackingPage from "./pages/safety/IncidentTrackingPage";
import MyStatusDashboardPage from "./pages/safety/MyStatusDashboardPage";
import IncidentReportSuccessPage from "./pages/safety/IncidentReportSuccessPage";
import WeatherAlertsPage from "./pages/safety/WeatherAlertsPage";
import NavigationDirectionsPage from "./pages/safety/NavigationDirectionsPage";

import "./App.css";

function App() {
  return (
    <>
      {/* Notification UI components that float above all pages */}
      <GlobalNotificationUI />

      <Routes>
        {/* ========================================================= */}
        {/*                  MAIN BRANCH ROUTES                       */}
        {/* ========================================================= */}

        {/* ===== ACTIVITY PROVIDER ROUTES ===== */}
        <Route
          path="/activityprovider/dashboard"
          element={<ActivityProviderDashboard />}
        />

        <Route path="/activityprovider/activities" element={<ActivityList />} />

        <Route path="/activityprovider/activities/new" element={<Activity />} />

        <Route
          path="/activityprovider/activities/edit/:id"
          element={<Activity />}
        />

        <Route path="/activityprovider/calendar" element={<ManageCalendar />} />

        <Route path="/activityprovider/viewratings" element={<ViewRatings />} />

        <Route
          path="/activityprovider/acceptbookings"
          element={<AcceptBookings />}
        />

        {/* ===== LANDING PAGES ===== */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* ===== BRANCH ADDITIONS ===== */}
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/destination-detail" element={<DestinationDetails />} />
        <Route path="/add-destination" element={<AddDestination />} />

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

        {/* MAIN /admin kept unchanged */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* Branch restaurant legacy signup route */}
        <Route path="/restuarant" element={<ResturentRegistrationPage />} />

        {/* ===== DRIVER SIGNUP ===== */}
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

        {/* ===== MAIN DASHBOARD ROUTES ===== */}
        <Route
          path="/dashboard-Tourist"
          // element={<DummyPageTourist />}
          element={<DummyPageDriver />}
        />

        <Route path="/dashboard-HotelOwner" element={<HotelOwnerDashboard />} />

        <Route path="/dashboard-Guide" element={<DummyPageGuide />} />

        <Route path="/vehicle-admin" element={<RenterDashboard />} />

        <Route path="/dashboard-Government" element={<DummyPageGovernment />} />

        <Route path="/dashboard-Driver" element={<DummyPageDriver />} />

        <Route path="/dashboard-Admin" element={<DummyPageAdmin />} />

        <Route
          path="/dashboard-ActivityProvider"
          element={<ActivityProviderDashboard />}
        />

        {/* ===== VEHICLE ADMIN ===== */}
        {/* <Route
          path="/vehicle-admin"
          element={<VehicleAdmin />}
        >
          <Route index element={<Dashboard />} />
          <Route
            path="requests"
            element={<RentalRequestsPage />}
          />
          <Route
            path="fleet"
            element={<MyFleetPage />}
          />
          <Route
            path="earnings"
            element={<EarningsPage />}
          />
          <Route
            path="settings"
            element={<SettingsPage />}
          />
        </Route> */}

        {/* ===== HOTEL OWNER MANAGEMENT ===== */}
        <Route
          path="/view-rooms-packages"
          element={<ViewCurrentRoomsPackages />}
        />

        <Route path="/add-room-package" element={<AddRoomPage />} />

        <Route path="/edit-room/:id" element={<AddRoomPage />} />

        <Route path="/add-special-package" element={<AddSpecialPackages />} />

        <Route path="/edit-package/:id" element={<AddSpecialPackages />} />

        <Route
          path="/manage-availability"
          element={<ManageRoomAvailability />}
        />

        <Route
          path="/view-availability-calendar"
          element={<ViewRoomAvailabilityCalenderPage />}
        />

        <Route path="/view-reservations" element={<ViewRoomReservation />} />

        <Route
          path="/financial-analysis"
          element={<FinancialAnalysisDashboard />}
        />

        <Route path="/dashboard" element={<HotelOwnerDashboard />} />

        <Route
          path="/Hotel-Owner-Profile-Settings"
          element={<HotelOwnerProfileSettings />}
        />

        {/* ===== TOURIST RESTAURANT PAGES ===== */}
        <Route path="/restaurants" element={<TouristRestaurantsPage />} />

        <Route
          path="/restaurants/:id"
          element={<TouristRestaurantDetailsPage />}
        />

        {/* ===== RESTAURANT MANAGEMENT ===== */}
        <Route path="/resturent/login" element={<ResturentLogingPage />} />

        <Route
          path="/resturent/register"
          element={<ResturentRegistrationPage />}
        />

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

        {/* ========================================================= */}
        {/*              BRANCH-ONLY TOURIST FEATURES                */}
        {/* ========================================================= */}

        {/* These are separate paths because /dashboard-Tourist
            already exists in MAIN and must not be changed. */}

        <Route path="/tourist-trip-plan" element={<TripPlanningPage />} />

        <Route
          path="/tourist-direction"
          element={
            <PageTitleProvider>
              <NavigationMain />
            </PageTitleProvider>
          }
        />

        <Route path="/tourist-profile" element={<TouristProfilePage />} />

        <Route path="/rent-vehicle" element={<RentVehiclePage />} />

        <Route
          path="/rent-vehicle/vehicle-details/:id"
          element={<VehicleDetailsPage />}
        />

        <Route path="/book-driver" element={<BookDriver />} />

        <Route path="/find-hotel" element={<FindHotelPage />} />

        <Route
          path="/find-hotel/hotel-details/:id"
          element={<HotelDetails />}
        />

        {/* Branch restaurant legacy dashboard */}
        <Route path="/dashboard-Restaurant" element={<RestaurantLayout />}>
          <Route index element={<ResturentDashboardPage />} />
        </Route>

        {/* ========================================================= */}
        {/*                       SAFETY MODULE                      */}
        {/* ========================================================= */}

        <Route
          path="/safety"
          element={
            <SafetyProvider>
              <SafetyLayout />
            </SafetyProvider>
          }
        >
          <Route index element={<PublicIncidentsPage />} />

          <Route path="alerts" element={<SecurityAlertsPage />} />

          <Route
            path="security-alerts"
            element={<Navigate to="/safety/alerts" replace />}
          />

          <Route path="my-incidents" element={<MyStatusDashboardPage />} />

          <Route
            path="my-reports"
            element={<Navigate to="/safety/my-incidents" replace />}
          />

          <Route
            path="status-dashboard"
            element={<Navigate to="/safety/my-incidents" replace />}
          />

          <Route path="public-analytics" element={<IncidentTrackingPage />} />

          <Route
            path="analytics"
            element={<Navigate to="/safety/public-analytics" replace />}
          />

          <Route path="public-incidents" element={<PublicIncidentsPage />} />

          <Route path="weather" element={<WeatherAlertsPage />} />
        </Route>

        {/* ===== SAFETY STANDALONE PAGES ===== */}

        <Route
          path="/safety/emergency"
          element={
            <SafetyProvider>
              <EmergencyCallPage />
            </SafetyProvider>
          }
        />

        <Route
          path="/safety/navigate"
          element={
            <SafetyProvider>
              <NavigationDirectionsPage />
            </SafetyProvider>
          }
        />

        <Route
          path="/safety/report-incident"
          element={
            <SafetyProvider>
              <IncidentReportPage />
            </SafetyProvider>
          }
        />

        <Route
          path="/safety/report-incident/form"
          element={<Navigate to="/safety/report-incident" replace />}
        />

        <Route
          path="/safety/report-success"
          element={
            <SafetyProvider>
              <IncidentReportSuccessPage />
            </SafetyProvider>
          }
        />

        {/* ========================================================= */}
        {/*                   INTEGRATED ADMIN                       */}
        {/* ========================================================= */}

        <Route path="/admin/login" element={<IntegratedAdminLogin />} />

        {/* Main already owns /admin.
            Therefore Integrated Admin dashboard is exposed
            separately instead of replacing MAIN /admin. */}

        <Route
          path="/admin/integrated"
          element={
            <IntegratedAdminProtectedRoute allowedRoles={["Administrator"]}>
              <IntegratedAdminDashboard />
            </IntegratedAdminProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <IntegratedAdminProtectedRoute allowedRoles={["Administrator"]}>
              <IntegratedAdminUsers />
            </IntegratedAdminProtectedRoute>
          }
        />

        <Route
          path="/admin/users/new"
          element={
            <IntegratedAdminProtectedRoute allowedRoles={["Administrator"]}>
              <IntegratedAdminAddUser />
            </IntegratedAdminProtectedRoute>
          }
        />

        <Route
          path="/admin/listings"
          element={
            <IntegratedAdminProtectedRoute
              allowedRoles={["Administrator", "Moderator"]}
            >
              <IntegratedAdminListings />
            </IntegratedAdminProtectedRoute>
          }
        />

        <Route
          path="/admin/view-details/:id"
          element={
            <IntegratedAdminProtectedRoute
              allowedRoles={["Administrator", "Moderator"]}
            >
              <IntegratedAdminViewDetails />
            </IntegratedAdminProtectedRoute>
          }
        />

        <Route
          path="/admin/ads"
          element={
            <IntegratedAdminProtectedRoute allowedRoles={["Administrator"]}>
              <IntegratedAdminAds />
            </IntegratedAdminProtectedRoute>
          }
        />

        <Route
          path="/admin/ads/create"
          element={
            <IntegratedAdminProtectedRoute allowedRoles={["Administrator"]}>
              <IntegratedAdminCreateAd />
            </IntegratedAdminProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-ad/:id"
          element={
            <IntegratedAdminProtectedRoute allowedRoles={["Administrator"]}>
              <IntegratedAdminEditAd />
            </IntegratedAdminProtectedRoute>
          }
        />

        <Route
          path="/admin/view-ad/:id"
          element={
            <IntegratedAdminProtectedRoute allowedRoles={["Administrator"]}>
              <IntegratedAdminViewAd />
            </IntegratedAdminProtectedRoute>
          }
        />

        <Route
          path="/admin/access-denied"
          element={
            <IntegratedAdminProtectedRoute allowedRoles={["Editor"]}>
              <IntegratedAdminAccessDenied />
            </IntegratedAdminProtectedRoute>
          }
        />

        {/* ===== 404 FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <NotificationModal />
      <ToastContainer />
    </>
  );
}

export default App;
