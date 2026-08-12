import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ActivityProviderDashboard from './pages/ActivityProvider/ActivityProviderDashboard.jsx';
import ActivityList from './pages/ActivityProvider/ActivityList.jsx';
import Activity from './pages/ActivityProvider/AddActivity.jsx';
import ManageCalendar from './pages/ActivityProvider/ManageCalendar.jsx';
import ViewRatings from './pages/ActivityProvider/ViewRatings.jsx';
import AcceptBookings from './pages/ActivityProvider/AcceptBookings.jsx';



import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Destinations from './pages/Destinations';
import ContactPage from './pages/Contact';
import HowItWorks from './pages/HowItWork';

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
import DummyPageGovernment from './pages/Government/dummyPage';
import DummyPageDriver from './pages/Driver/dummyPage';
import DummyPageAdmin from './pages/Admin/dummyPage';
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

        <Route path="/activityprovider/dashboard" element={<ActivityProviderDashboard />} />
        <Route path="/activityprovider/activities" element={<ActivityList />} />
        <Route path="/activityprovider/activities/new" element={<Activity />} />
        <Route path="/activityprovider/activities/edit/:id" element={<Activity />} />
        <Route path="/activityprovider/calendar" element={<ManageCalendar />} />
        <Route path="/activityprovider/viewratings" element={<ViewRatings />} />
        <Route path="/activityprovider/acceptbookings" element={<AcceptBookings />} />
        {/* Landing pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/create-password" element={<NewPasswordCreate />} />

        {/* Signup flows */}
        <Route path="/tourist" element={<SignupForm />} />
        <Route path="/travel-safety" element={<TravelSafetyInfo />} />
        <Route path="/hotel-owner" element={<HotelOwnerSignup />} />
        <Route path="/hotel-info" element={<HotelInfo />} />
        <Route path="/restuarant" element={<RestuarantSignup />} />
        <Route path="/guide" element={<GuideSignup />} />
        <Route path="/renter" element={<RenterSignup />} />
        <Route path="/government" element={<GovernmentSignup />} />
        <Route path="/activity-provider" element={<ActivityProviderSignup />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Driver signup — wrapped in shared context so all 3 steps share form state */}
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

        {/* Dashboards */}
        <Route path="/dashboard-Tourist" element={<DummyPageTourist />} />
        <Route path="/dashboard-HotelOwner" element={<DummyPageHotelOwner />} />
        <Route path="/dashboard-Restaurant" element={<DummyPageRestaurant />} />
        <Route path="/dashboard-Guide" element={<DummyPageGuide />} />
        <Route path="/dashboard-Renter" element={<VehicleAdmin />} />
        <Route path="/dashboard-Government" element={<DummyPageGovernment />} />
        <Route path="/dashboard-Driver" element={<DummyPageDriver />} />
        <Route path="/dashboard-Admin" element={<DummyPageAdmin />} />
        <Route path="/dashboard-ActivityProvider" element={<ActivityProviderDashboard />} />

        <Route path="/vehicle-admin" element={<VehicleAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="requests" element={<RentalRequestsPage />} />
          <Route path="fleet" element={<MyFleetPage />} />
          <Route path="earnings" element={<EarningsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
