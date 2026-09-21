import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from 'react';

// ==================== Existing Project Imports (From Main) ====================
import ActivityProviderDashboard from "./pages/ActivityProvider/ActivityProviderDashboard.jsx";
import ActivityList from "./pages/ActivityProvider/ActivityList.jsx";
import Activity from "./pages/ActivityProvider/AddActivity.jsx";
import ManageCalendar from "./pages/ActivityProvider/ManageCalendar.jsx";
import ViewRatings from "./pages/ActivityProvider/ViewRatings.jsx";
import AcceptBookings from "./pages/ActivityProvider/AcceptBookings.jsx";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import Destinations from "./pages/Destinations";
import HowItWorks from "./pages/HowItWork";
import ContactUs from "./pages/Contact.jsx";
import AddDestination from "./pages/addDestinations";
import DestinationDetails from "./pages/DestinationDetails.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";

import SignupForm from "./pages/Tourist/SignupForm1";
import TravelSafetyInfo from "./pages/Tourist/SignupForm2";
import LoginScreen from "./pages/Login/LoginScreen";
import ForgotPasswordScreen from "./pages/Login/ForgotPasswordScreen";
import NewPasswordCreate from "./pages/Login/NewPasswordCreate";

// Restaurant & Hotel
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
import GovernmentDashboard from "./pages/Government/governmentDashboard.jsx";
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
import Driver_Dashboard from "./components/Driver/Driver_Dashboard";
import Driver_Request from "./components/Driver/Driver_Request";
import Driver_Earnings from "./components/Driver/Driver_Earnings";
import Driver_Bids from "./components/Driver/Driver_Bids";
import Submit_Bids from "./components/Driver/Submit_Bids";
import Ride_Details from "./components/Driver/Ride_Details";
import Driver_Details from "./components/Driver/Driver_Deatils";

import MainPage from "./pages/Tourist/touristMainPage/mainPage.jsx";
import TouristProfilePage from "./pages/Tourist/touristProfile/touristProfilePage.jsx";
import NavigationMain from "./pages/NavigationAndMapping/NavigationMain.jsx";

// ==================== Safety & Others ====================
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
import { RentVehiclePage } from "./pages/Renter/rentVehiclePage.jsx";
import TouristDashboard from "./pages/Tourist/touristDashboard/dashboard.jsx";
import TripPlanningPage from "./pages/Tourist/tripPlanning/TripPlanningPage.jsx";
import MarketplacePage from "./pages/Tourist/MarketplacePage.jsx";
import VehicleDetailsPage from "./pages/Renter/vehicleDetailsPage.jsx";
import BookDriver from "./pages/Driver/bookDriver.jsx";
import FindHotelPage from "./pages/TouristHotelView/findHotelPage.jsx";
import HotelDetails from "./pages/TouristHotelView/HotelDetails.jsx";
import BookingPage from "./pages/booking&reservation/BookingPage.jsx";
import ActivityBooking from "./pages/more_details_services_booking/ActivityBooking.jsx";
import HotelBooking from "./pages/more_details_services_booking/HotelBooking.jsx";
import DriverBooking from "./pages/more_details_services_booking/DriverBooking.jsx";
import VehicleBooking from "./pages/more_details_services_booking/VehicleBooking.jsx";
import GuideBooking from "./pages/more_details_services_booking/GuideBooking.jsx";
import RestaurantBooking from "./pages/more_details_services_booking/RestaurantBooking.jsx";
import MyBookings from "./pages/booking&reservation/MyBookings.jsx";
import AddNewPackage from './pages/travelPackage/AddNewPackage.jsx';
import SucessPackage from './pages/travelPackage/SucessPackage.jsx';
import UserPackages from './pages/travelPackage/UserPackages.jsx';
import AdminPackages from './pages/travelPackage/AdminPackages.jsx';
import PackageView from './pages/travelPackage/PackageView.jsx';
import CreateAD from './pages/travelPackage/CreateAD.jsx';

// ==================== PRASHAN'S REVIEW SECTION ====================
import ReviewSection from './pages/reviews/ReviewSection';

function App() {
  const testProviderId = "64b5f8e2c3e1a2b3c4d5e6f8"; 
  const testProviderType = "Driver";

  // Test Component Wrapper
  const ReviewTestEnvironment = () => (
    <div className="min-h-screen bg-gray-50 py-10">
      <ReviewSection targetType={testProviderType} targetProviderId={testProviderId} />
    </div>
  );

  return (
    <SafetyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="destination-detail" element={<DestinationDetails />} />
          </Route>
          
          <Route path="/test-reviews" element={<ReviewTestEnvironment />} />
          
          {/* ... (All other Aysha/Main routes) ... */}
          <Route path="/login" element={<LoginScreen />} />
          {/* Add all other routes here exactly as they were in the main branch */}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SafetyProvider>
  );
}

export default App;