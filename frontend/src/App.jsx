import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FinalTripReport from './pages/FinalTripReport';
import FinalTripReportPDF from './pages/FinalTripReportPDF';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<FinalTripReport />} />
          <Route path="/trip/:touristId/:tripId/pdf" element={<FinalTripReportPDF />} />
          <Route path="/trip/:touristId/:tripId" element={<FinalTripReportPDF />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
