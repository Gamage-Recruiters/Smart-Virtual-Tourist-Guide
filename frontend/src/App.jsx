import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from './pages/touristMainPage.jsx/mainPage.jsx';
import Dashboard from './pages/touristDashboard/dashboard.jsx';
import { RentVehiclePage } from './pages/rentVehicle/rentVehiclePage.jsx';
import VehicleDetailsPage from './pages/rentVehicle/vehicleDetailsPage.jsx';
import FindHotelPage from './pages/findHotel/FindHotelPage.jsx'
import HotelDetails from './pages/findHotel/HotelDetails.jsx'
import BookDriver from './pages/bookDriver/BookDriver.jsx'


function App() {

  return (
    <Router>
      <Routes>
        {/* MainPage acts as the parent layout wrapper */}
        <Route element={<MainPage />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rent-vehicle" element={<RentVehiclePage />} />
          <Route path="/vehicle-details/:id" element={<VehicleDetailsPage />} />
          <Route path="/find-hotel" element={<FindHotelPage/>} />
          <Route path="/hotel-details/:id" element={<HotelDetails/>} />
          <Route path="/book-driver" element={<BookDriver/>} />
        </Route>
      </Routes>
    </Router>    
  )
}

export default App;
