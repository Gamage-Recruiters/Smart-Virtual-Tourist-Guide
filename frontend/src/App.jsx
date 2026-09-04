import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ==================== Existing Project Imports ====================
import ActivityProviderDashboard from "./pages/ActivityProvider/ActivityProviderDashboard.jsx";
import ActivityList from "./pages/ActivityProvider/ActivityList.jsx";
import Activity from "./pages/ActivityProvider/AddActivity.jsx";
import ManageCalendar from "./pages/ActivityProvider/ManageCalendar.jsx";
import ViewRatings from "./pages/ActivityProvider/ViewRatings.jsx";
import AcceptBookings from "./pages/ActivityProvider/AcceptBookings.jsx";

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

import SignupForm from "./pages/Tourist/SignupForm1";
import TravelSafetyInfo from "./pages/Tourist/SignupForm2";

import LoginScreen from "./pages/Login/LoginScreen";
import ForgotPasswordScreen from "./pages/Login/ForgotPasswordScreen";
import NewPasswordCreate from "./pages/Login/NewPasswordCreate";

// ===== RESTAURANT ROUTES =====
import RestuarantSignup from "./pages/Restuarant/resturentRegistrationPage.jsx";
import RestuarantLogin from "./pages/Restuarant/resturentLogingPage.jsx";
import RestuarantDashboard from "./pages/Restuarant/resturentDashboardPage.jsx";
import RestuarantMenuPage from "./pages/Restuarant/resturentMenuPage.jsx";
import RestuarantAddMenuPage from "./pages/Restuarant/resturentAddMenuPage.jsx";
import RestuarantOfferPage from "./pages/Restuarant/resturentOfferPage.jsx";
import RestuarantProfilePage from "./pages/Restuarant/resturentProfilePage.jsx";
import RestuarantReservationPage from "./pages/Restuarant/resturentReservationPage.jsx";
import RestuarantRevenuePage from "./pages/Restuarant/resturentRevenuePage.jsx";
import RestuarantReviewPage from "./pages/Restuarant/resturentReviewPage.jsx";
import TouristRestaurantsPage from "./pages/Restuarant/TouristRestaurantsPage.jsx";
import TouristRestaurantDetailsPage from "./pages/Tourist/TouristRestaurantDetailsPage.jsx";
import RestaurantLayout from "./components/Restuarant/RestaurantLayout.jsx";
import HotelOwnerSignup from "./pages/HotelOwner/SignUp.jsx";
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

import GuideSignup from "./pages/Guide/SignupPage";
import RenterSignup from "./pages/Renter/SignupPage";
import GovernmentSignup from "./pages/Government/SignupPage";
import ActivityProviderSignup from "./pages/ActivityProvider/SignupPage";

import AdminLogin from "./pages/Admin/LoginPage";
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

import DriverSignUp1 from "./pages/Driver/SignUpForm1";
import DriverSignUp2 from "./pages/Driver/SignUpForm2";
import DriverSignUp3 from "./pages/Driver/SignUpForm3";

import { DriverSignupProvider } from "./context/DriverSignupContext";
import { PageTitleProvider } from "./context/PageTitleContext";


import DummyPageGuide from "./pages/Guide/dummyPage";
import DummyPageGovernment from "./pages/Government/dummyPage";
import DummyPageDriver from "./pages/Driver/dummyPage";
import DummyPageAdmin from "./pages/Admin/dummyPage";

import VehicleAdmin from "./pages/Renter/vehicleAdminDashboard/vehicleAdminPage";
import Dashboard from "./pages/Renter/vehicleAdminDashboard/dashboard";
import RentalRequestsPage from "./pages/Renter/vehicleAdminDashboard/rentalRequestsPage";
import MyFleetPage from "./pages/Renter/vehicleAdminDashboard/myFleetPage";
import EarningsPage from "./pages/Renter/vehicleAdminDashboard/earningsPage";
import SettingsPage from "./pages/Renter/vehicleAdminDashboard/settingsPage";

import MainPage from "./pages/Tourist/touristMainPage/mainPage.jsx";
import TouristProfilePage from "./pages/Tourist/touristProfile/touristProfilePage.jsx";

import NavigationMain from "./pages/NavigationAndMapping/NavigationMain.jsx";

// ==================== Safety Module Imports ====================
import { SafetyProvider } from "./context/SafetyContext.jsx";

import SafetyLayout from './pages/safety/SafetyLayout';
import PublicIncidentsPage from './pages/safety/PublicIncidentsPage';
import EmergencyCallPage from './pages/safety/EmergencyCallPage';
import SecurityAlertsPage from './pages/safety/SecurityAlertsPage';
import IncidentReportPage from './pages/safety/IncidentReportPage';
import IncidentTrackingPage from './pages/safety/IncidentTrackingPage';
import MyStatusDashboardPage from './pages/safety/MyStatusDashboardPage';
import IncidentReportSuccessPage from './pages/safety/IncidentReportSuccessPage';
import WeatherAlertsPage from './pages/safety/WeatherAlertsPage';
import NavigationDirectionsPage from './pages/safety/NavigationDirectionsPage';


// ==================== CSS ====================
import "./App.css";
import { RentVehiclePage } from "./pages/Renter/rentVehiclePage.jsx";
import TouristDashboard from "./pages/Tourist/touristDashboard/dashboard.jsx";
import TripPlanningPage from "./pages/Tourist/tripPlanning/TripPlanningPage.jsx";
import VehicleDetailsPage from "./pages/Renter/vehicleDetailsPage.jsx";
import BookDriver from "./pages/Driver/bookDriver.jsx";
import FindHotelPage from "./pages/HotelOwner/findHotelPage.jsx";
import HotelDetails from "./pages/HotelOwner/HotelDetails.jsx";

function App() {
  return (
    <SafetyProvider>
      <Router>
        <Routes>
          {/* ========================================================= */}
          {/*                     EXISTING PROJECT                      */}
          {/* ========================================================= */}

        {/* ===== LANDING PAGES (from main) ===== */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="results" element={<ResultsPage />} />
        <Route path="/destination-detail" element={<DestinationDetails />} />

        </Route>
        <Route path="/add-destination" element={<AddDestination />} />

          {/* Activity Provider */}
          <Route
            path="/activityprovider/dashboard"
            element={<ActivityProviderDashboard />}
          />
          <Route
            path="/activityprovider/activities"
            element={<ActivityList />}
          />
          <Route
            path="/activityprovider/activities/new"
            element={<Activity />}
          />
          <Route
            path="/activityprovider/activities/edit/:id"
            element={<Activity />}
          />
          <Route
            path="/activityprovider/calendar"
            element={<ManageCalendar />}
          />
          <Route
            path="/activityprovider/viewratings"
            element={<ViewRatings />}
          />
          <Route
            path="/activityprovider/acceptbookings"
            element={<AcceptBookings />}
          />

          {/* Authentication */}
          <Route path="/login" element={<LoginScreen />} />

          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

          <Route path="/create-password" element={<NewPasswordCreate />} />

          {/* Signup Flows */}
          <Route path="/tourist" element={<SignupForm />} />

          <Route path="/travel-safety" element={<TravelSafetyInfo />} />

          <Route path="/hotel-owner" element={<HotelOwnerSignup />} />

          <Route path="/hotel-info" element={<HotelInfo />} />

          {/* ===== RESTAURANT AUTH ROUTES ===== */}
          <Route path="/restuarant" element={<RestuarantSignup />} />
          <Route path="/resturent/register" element={<RestuarantSignup />} />
          <Route path="/resturent/login" element={<RestuarantLogin />} />

          <Route path="/guide" element={<GuideSignup />} />

          <Route path="/renter" element={<RenterSignup />} />

          <Route path="/government" element={<GovernmentSignup />} />

          <Route
            path="/activity-provider"
            element={<ActivityProviderSignup />}
          />

          <Route path="/admin/legacy-login" element={<AdminLogin />} />

          {/* Driver Signup */}
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

          {/*tourist Dashboards */}
          <Route path="/dashboard-Tourist" element={<MainPage />}>
            <Route index element={<TouristDashboard />} />
            <Route path="trip-plan" element={<TripPlanningPage />} />
            {/* Navigation */}
            <Route
              path="direction"
              element={
                <PageTitleProvider>
                  <NavigationMain />
                </PageTitleProvider>
              }
            />
            <Route path="touristProfile" element={<TouristProfilePage />} />
            <Route path="rent-vehicle" element={<RentVehiclePage />} />
            <Route
              path="rent-vehicle/vehicle-details/:id"
              element={<VehicleDetailsPage />}
            />
            <Route path="book-driver" element={<BookDriver />} />
            <Route path="find-hotel" element={<FindHotelPage />} />
            <Route
              path="find-hotel/hotel-details/:id"
              element={<HotelDetails />}
            />
            {/* Tourist Restaurant / Food routes */}
            <Route path="restaurants" element={<TouristRestaurantsPage />} />
            <Route
              path="restaurants/:id"
              element={<TouristRestaurantDetailsPage />}
            />
          </Route>

          <Route
            path="/dashboard-HotelOwner"
            element={<HotelOwnerDashboard />}
          />
          {/* ACCOMMODATION MANAGEMENT ROUTES */}
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
          {/* ===== RESTAURANT DASHBOARD WITH SIDEBAR LAYOUT ===== */}
          <Route path="/resturent/dashboard" element={<RestaurantLayout />}>
            <Route index element={<RestuarantDashboard />} />
            <Route path="menu" element={<RestuarantMenuPage />} />
            <Route path="menu/add" element={<RestuarantAddMenuPage />} />
            <Route path="menu/edit/:id" element={<RestuarantAddMenuPage />} />
            <Route path="offers" element={<RestuarantOfferPage />} />
            <Route path="profile" element={<RestuarantProfilePage />} />
            <Route path="reservations" element={<RestuarantReservationPage />} />
            <Route path="revenue" element={<RestuarantRevenuePage />} />
            <Route path="reviews" element={<RestuarantReviewPage />} />
          </Route>

          {/* Legacy route kept for backward compatibility */}
          <Route path="/dashboard-Restaurant" element={<RestaurantLayout />}>
            <Route index element={<RestuarantDashboard />} />
          </Route>

          <Route path="/dashboard-Guide" element={<DummyPageGuide />} />

          <Route path="/dashboard-Renter" element={<VehicleAdmin />} />

          <Route
            path="/dashboard-Government"
            element={<DummyPageGovernment />}
          />

          <Route path="/dashboard-Driver" element={<DummyPageDriver />} />

          <Route path="/dashboard-Admin" element={<DummyPageAdmin />} />

          <Route
            path="/dashboard-ActivityProvider"
            element={<ActivityProviderDashboard />}
          />

          {/* Vehicle Admin */}
          <Route path="/vehicle-admin" element={<VehicleAdmin />}>
            <Route index element={<Dashboard />} />

            <Route path="requests" element={<RentalRequestsPage />} />

            <Route path="fleet" element={<MyFleetPage />} />

            <Route path="earnings" element={<EarningsPage />} />

            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* ========================================================= */}
          {/*                         SAFETY MODULE                     */}
          {/* ========================================================= */}

          {/* Safety routes with Sidebar Layout */}
          <Route path="/safety" element={<SafetyLayout />}>
            {/* /safety */}
            <Route index element={<PublicIncidentsPage />} />

            {/* /safety/alerts */}
            <Route path="alerts" element={<SecurityAlertsPage />} />

            {/* Old route → new route */}
            <Route
              path="security-alerts"
              element={<Navigate to="/safety/alerts" replace />}
            />

            {/* /safety/my-incidents */}
            <Route path="my-incidents" element={<MyStatusDashboardPage />} />

            {/* Old route → new route */}
            <Route
              path="my-reports"
              element={<Navigate to="/safety/my-incidents" replace />}
            />

            {/* Old route → new route */}
            <Route
              path="status-dashboard"
              element={<Navigate to="/safety/my-incidents" replace />}
            />

            {/* /safety/public-analytics */}
            <Route path="public-analytics" element={<IncidentTrackingPage />} />

            {/* Old route → new route */}
            <Route
              path="analytics"
              element={<Navigate to="/safety/public-analytics" replace />}
            />

            {/* /safety/public-incidents */}
            <Route path="public-incidents" element={<PublicIncidentsPage />} />

            {/* /safety/weather */}
            <Route path="weather" element={<WeatherAlertsPage />} />
          </Route>

          {/* Safety Standalone Pages */}
          <Route element={<Layout />}>
            {/* Emergency Call */}
            <Route path="/safety/emergency" element={<EmergencyCallPage />} />

            {/* Navigation Directions */}
            <Route
              path="/safety/navigate"
              element={<NavigationDirectionsPage />}
            />

            {/* Incident Report */}
            <Route
              path="/safety/report-incident"
              element={<IncidentReportPage />}
            />

            {/* Old report form route */}
            <Route
              path="/safety/report-incident/form"
              element={<Navigate to="/safety/report-incident" replace />}
            />

            {/* ===== TOURIST-FACING RESTAURANT ROUTES ===== */}
            <Route path="/restaurants" element={<TouristRestaurantsPage />} />
            <Route path="/restaurants/:id" element={<TouristRestaurantDetailsPage />} />


            {/* Report Success */}
            <Route
              path="/safety/report-success"
              element={<IncidentReportSuccessPage />}
            />
          </Route>

          {/* ========================================================= */}
          {/*                    FALLBACK ROUTE                         */}
          {/* ========================================================= */}

          {/*
            IMPORTANT:
            Existing "/" route is preserved above.
            Therefore we should NOT redirect "/" to "/safety".

            Unknown URLs will go to the existing home page.
          */}

          {/* Integrated Admin routes */}
          <Route path="/admin/login" element={<IntegratedAdminLogin />} />
          <Route
            path="/admin"
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SafetyProvider>
  );
}

export default App;
