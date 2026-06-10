import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import HotelOwnerDashboard from './pages/HotelOwnerDashboard.jsx'
import ViewCurrentRoomsPackages from './pages/ViewCurrentRoomsPackages.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/hotel-owner-dashboard" element={<HotelOwnerDashboard />} />
          <Route path="/view-rooms-packages" element={<ViewCurrentRoomsPackages />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
