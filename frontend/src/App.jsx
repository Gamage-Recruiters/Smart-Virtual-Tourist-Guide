import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BookingPage from './pages/booking&reservation/BookingPage.jsx'
import ActivityBooking from './pages/more_details_services_booking/ActivityBooking.jsx'
import HotelBooking from './pages/more_details_services_booking/HotelBooking.jsx'
import DriverBooking from './pages/more_details_services_booking/DriverBooking.jsx'
import VehicleBooking from './pages/more_details_services_booking/VehicleBooking.jsx'
import GuideBooking from './pages/more_details_services_booking/GuideBooking.jsx'
import RestaurantBooking from './pages/more_details_services_booking/RestaurantBooking.jsx'
import MyBookings from './pages/booking&reservation/MyBookings.jsx'

function App() {

  return (
    <Router>
      <Routes>
      
          <Route path="/booking-page" element={<BookingPage/>} />
          <Route path="/activity-booking" element={<ActivityBooking/>} />
          <Route path="/hotel-booking" element={<HotelBooking/>} />
          <Route path="/driver-booking" element={<DriverBooking/>} />
          <Route path="/vehicle-booking" element={<VehicleBooking/>} />
          <Route path="/guide-booking" element={<GuideBooking/>} />
          <Route path="/restaurant-booking" element={<RestaurantBooking/>} />
          <Route path="/my-bookings" element={<MyBookings/>} />

      </Routes>
    </Router>    
  )
}

export default App;
