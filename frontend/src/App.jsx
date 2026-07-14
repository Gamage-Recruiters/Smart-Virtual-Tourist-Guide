import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FinalTripReport from './pages/FinalTripReport';
import FinalTripReportPDF from './pages/FinalTripReportPDF';
import TouristArrivalReport from './pages/TouristArrivalReport';
import RevenueReport from './pages/RevenueReport';
import BehaviorStatReport from './pages/BehaviorStatReport';
import ComplaintReport from './pages/ComplaintReport';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<<<<<<< HEAD
      <Router>
        <Routes>
=======
      {/* <FinalTripReport /> */}
      {/* <FinalTripReportPDF /> */}
      <TouristArrivalReport />
      {/* <RevenueReport /> */}
      {/* <BehaviorStatReport /> */}
      {/* <ComplaintReport /> */}
>>>>>>> c6638ca808fe36df462b2fca057b749c13216e48

          <Route path="/" element={<FinalTripReport />} />
          {/* <Route path="/" element={<TouristArrivalReport />} /> */}
          {/* <Route path="/" element={<RevenueReport />} /> */}
          {/* <Route path="/" element={<BehaviorStatReport />} /> */}
          {/* <Route path="/" element={<ComplaintReport />} /> */}

          <Route path="/trip/:touristId/:tripId" element={<FinalTripReportPDF />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
