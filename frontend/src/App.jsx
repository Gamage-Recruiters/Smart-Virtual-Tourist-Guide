import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
//import TouristProfile from './pages/TouristProfile.jsx'
import MainPage from './pages/touristMainPage/mainPage.jsx'
import { TouristProfilePage } from './pages/touristProfile/touristProfilePage.jsx'
import TripPlanMainPage from './pages/tripPlanMainPage/tripPlanMainPage.jsx'
import SignInPage from './pages/signIn/signInPage.jsx'



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TouristProfilePage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/trip-plan" element={<TripPlanMainPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
