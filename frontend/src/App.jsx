import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignupForm1 from './pages/Tourist/SignupForm1.jsx'
import SignupForm2 from './pages/Tourist/SignupForm2.jsx'
import SignIn from './pages/Tourist/SignIn.jsx'
import { TouristProfilePage } from './pages/touristProfile/touristProfilePage.jsx'
import MainPage from './pages/touristMainPage/mainPage.jsx'
import TripPlanMainPage from './pages/tripPlanMainPage/tripPlanMainPage.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Sign In Route */}
          <Route path="/sign-in" element={<SignIn />} />

          {/* Signup 1 loaded first as main route */}
          <Route path="/" element={<SignupForm1 />} />
          <Route path="/signup" element={<SignupForm1 />} />
          <Route path="/signup-1" element={<SignupForm1 />} />

          {/* Signup 2 / Travel Safety */}
          <Route path="/travel-safety" element={<SignupForm2 />} />
          <Route path="/signup-2" element={<SignupForm2 />} />

          {/* Tourist Profile */}
          <Route path="/profile" element={<TouristProfilePage />} />
          <Route path="/touristProfile" element={<TouristProfilePage />} />

          {/* Main App Routes */}
          <Route path="/main" element={<MainPage />} />
          <Route path="/dashboard" element={<MainPage />} />
          <Route path="/trip-plan" element={<TripPlanMainPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

