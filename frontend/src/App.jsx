import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
//import TouristProfile from './pages/TouristProfile.jsx'
import { TouristProfilePage } from './pages/touristProfile/touristProfilePage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TouristProfilePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
