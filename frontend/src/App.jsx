import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

//Booking and reservation----------------------------------

import BookingPage from './pages/booking&reservation/BookingPage.jsx'
import ActivityBooking from './pages/more_details_services_booking/ActivityBooking.jsx'
import HotelBooking from './pages/more_details_services_booking/HotelBooking.jsx'
import DriverBooking from './pages/more_details_services_booking/DriverBooking.jsx'
import VehicleBooking from './pages/more_details_services_booking/VehicleBooking.jsx'
import GuideBooking from './pages/more_details_services_booking/GuideBooking.jsx'
import RestaurantBooking from './pages/more_details_services_booking/RestaurantBooking.jsx'
import MyBookings from './pages/booking&reservation/MyBookings.jsx'


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
      <Routes>

        <Route path="/booking-page" element={<BookingPage />} />
        <Route path="/activity-booking" element={<ActivityBooking />} />
        <Route path="/hotel-booking" element={<HotelBooking />} />
        <Route path="/driver-booking" element={<DriverBooking />} />
        <Route path="/vehicle-booking" element={<VehicleBooking />} />
        <Route path="/guide-booking" element={<GuideBooking />} />
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
        <Route path="/driver-details" element={<Driver_Details />} />
        <Route path="/other-drivers" element={<Submit_Bids />} />
        <Route path="/ride-details" element={<Ride_Details />} />
        <Route path="/submit-bids" element={<Driver_Bids />} />

      </Routes>
    </Router>
  )
}

