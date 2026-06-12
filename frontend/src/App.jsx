import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import HotelOwnerDashboard from './pages/HotelOwnerDashboard.jsx'
import ViewCurrentRoomsPackages from './pages/ViewCurrentRoomsPackages.jsx'
import AddRoomPage from './pages/AddRoomPage.jsx'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HotelOwnerDashboard />} />
          <Route path="/view-rooms-packages" element={<ViewCurrentRoomsPackages />} />
          <Route path="/add-room-package" element={<AddRoomPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
