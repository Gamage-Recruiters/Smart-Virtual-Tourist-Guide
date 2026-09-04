import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

// Driver Dashboard
import Driver_Dashboard from "./components/bidding/Driver_Dashboard";
import Driver_Request   from "./components/bidding/Driver_Request";
import Driver_Earnings  from "./components/bidding/Driver_Earnings";
import Driver_Bids      from "./components/bidding/Driver_Bids";
import Submit_Bids      from "./components/bidding/Submit_Bids";
import Ride_Details     from "./components/bidding/Ride_Details";
import Driver_Details   from "./components/bidding/Driver_Deatils";

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>

        <Route path="/" element={<Navigate to="/driver-dashboard" replace />} />

        {/* Driver Dashboard Routes */}
        <Route path="/driver-dashboard"          element={<Driver_Dashboard />} />
        <Route path="/driver-request"            element={<Driver_Request />} />
        <Route path="/driver-earnings"           element={<Driver_Earnings />} />
        <Route path="/driver-details"            element={<Driver_Details />} />
        <Route path="/submit-bids"               element={<Driver_Bids />} />
        <Route path="/submit-bids/:id"           element={<Driver_Bids />} />
        <Route path="/other-drivers/:tripId"     element={<Submit_Bids />} />
        <Route path="/other-drivers"             element={<Submit_Bids />} />
        <Route path="/ride-details"              element={<Ride_Details />} />

      </Routes>
    </Router>
  )
}

