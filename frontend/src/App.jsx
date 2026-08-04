import React from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import HotelOwnerDashboard from './pages/HotelOwnerDashboard.jsx'
import ViewCurrentRoomsPackages from './pages/ViewCurrentRoomsPackages.jsx'
import AddRoomPage from './pages/AddRoomPage.jsx'
import AddSpecialPackages from './pages/AddSpecialPackages.jsx'
import ManageRoomAvailability from './pages/ManageRoomAvailability.jsx'
import ViewRoomAvailabilityCalenderPage from './pages/ViewRoomAvailabilityCalenderPage.jsx'
import ViewRoomReservation from './pages/ViewRoomReservation.jsx'
import FinancialAnalysisDashboard from './pages/FinancialAnalysisDashboard.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
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

          {/* 404 fallback */}
          <Route path="*" element={<h1 className="text-center mt-20 text-3xl font-bold">404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
