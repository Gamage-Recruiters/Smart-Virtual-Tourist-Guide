import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

//Booking and reservation----------------------------------

import BookingPage from './pages/booking&reservation/BookingPage.jsx'
import PaymentResultPage from './pages/booking&reservation/PaymentResultPage.jsx'
import ActivityBooking from './pages/more_details_services_booking/ActivityBooking.jsx'
import HotelBooking from './pages/more_details_services_booking/HotelBooking.jsx'
import DriverBooking from './pages/more_details_services_booking/DriverBooking.jsx'
import VehicleBooking from './pages/more_details_services_booking/VehicleBooking.jsx'
import GuideBooking from './pages/more_details_services_booking/GuideBooking.jsx'
import RestaurantBooking from './pages/more_details_services_booking/RestaurantBooking.jsx'
import MyBookings from './pages/booking&reservation/MyBookings.jsx'
import CommunityDashboard from './pages/CommunityDashboard.jsx'
import SmeParticipationStats from './pages/SmeParticipationStats.jsx'
import CommunityEconomicImpact from './pages/CommunityEconomicImpact.jsx'
import TouristFeedback from './pages/TouristFeedback.jsx'





//Marketplace engine-------------------------------------

import Home_Page from "./pages/Home_Page";
import Drivers_Card from "./components/marketplace/Drivers_Card";
import Vehicles_Card from "./components/marketplace/Vehicles_Card";
import Submit_Bids from "./components/bidding/Submit_Bids";
import Driver_Details from "./components/bidding/Driver_Deatils";
import Ride_Details from "./components/bidding/Ride_Details";
import Driver_Bids from "./components/bidding/Driver_Bids";
import Guides_Card from "./components/marketplace/Guides_Card";
import Hotels_Card from "./components/marketplace/Hotels_Card";
import Restaurants_Card from "./components/marketplace/Restaurants_Card";
import Activities_Card from "./components/marketplace/Activities_Card";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>

        <Route path="/booking-page" element={<BookingPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/activity-booking" element={<ActivityBooking />} />
        <Route path="/hotel-booking" element={<HotelBooking />} />
        <Route path="/driver-booking/:id" element={<DriverBooking />} />
        <Route path="/vehicle-booking" element={<VehicleBooking />} />
        <Route path="/guide-booking/:id" element={<GuideBooking />} />
        <Route path="/restaurant-booking" element={<RestaurantBooking />} />
        <Route path="/my-bookings" element={<MyBookings />} /> 


        <Route path="/" element={<Home_Page />}>
          <Route index element={<Navigate to="/drivers" replace />} />
          {/* Booking Marketplace URL */}
          <Route path="drivers" element={<Drivers_Card />} />
          <Route path="vehicles" element={<Vehicles_Card />} />
          <Route path="guides" element={<Guides_Card />} />
          <Route path="hotels" element={<Hotels_Card />} />
          <Route path="restaurants" element={<Restaurants_Card />} />
          <Route path="activities" element={<Activities_Card />} />
        </Route>
        {/* Bidding Routes */}
        <Route path="/submit-bids" element={<Driver_Bids />} />
        <Route path="/submit-bids/:id" element={<Driver_Bids />} />
        
        {/* Added missing route for other-drivers */}
        <Route path="/other-drivers/:tripId" element={<Submit_Bids />} />
        <Route path="/other-drivers" element={<Submit_Bids />} />
        <Route path="/ride-details" element={<Ride_Details />} />

        {/* Community Dashboard */}
        <Route path="/community-dashboard" element={<CommunityDashboard />} />
        <Route path="/sme-participation-stats" element={<SmeParticipationStats />} />
        <Route path="/community-economic-impact" element={<CommunityEconomicImpact />} />
        <Route path="/tourist-feedback" element={<TouristFeedback />} />

      </Routes>
    </Router>
  )
}

