import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import TouristProfile from './pages/TouristProfile.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TouristProfile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
