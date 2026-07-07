import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
//import TouristProfile from './pages/TouristProfile.jsx'
import MainPage from './pages/touristMainPage.jsx/mainPage.jsx'
import { TouristProfilePage } from './pages/touristProfile/touristProfilePage.jsx'


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TouristProfilePage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
