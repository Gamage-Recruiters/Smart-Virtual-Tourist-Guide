import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { TouristProfilePage } from './pages/touristProfile/touristProfilePage.jsx'
import MainPage from './pages/touristMainPage/mainPage.jsx'
import TripPlanMainPage from './pages/tripPlanMainPage/tripPlanMainPage.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect root URL to /tour-dashboard */}
          <Route path="/" element={<Navigate to="/tour-dashboard" replace />} />

          {/* Main Tourist Dashboard */}
          <Route path="/tour-dashboard" element={<MainPage />} />

          {/* Tourist Profile */}
          <Route path="/touristProfile" element={<TouristProfilePage />} />

          {/* Trip Plan */}
          <Route path="/trip-plan" element={<TripPlanMainPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

