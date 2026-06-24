import { useState } from 'react'

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
      {/* <FinalTripReport /> */}
      {/* <FinalTripReportPDF /> */}
      {/* <TouristArrivalReport /> */}
      {/* <RevenueReport /> */}
      <BehaviorStatReport />
      {/* <ComplaintReport /> */}

    </>
  )
}

export default App
