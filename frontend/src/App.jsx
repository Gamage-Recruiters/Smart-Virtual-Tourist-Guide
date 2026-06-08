import { useState } from 'react'

import FinalTripReport from './pages/FinalTripReport';
import FinalTripReportPDF from './pages/FinalTripReportPDF';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <FinalTripReport /> */}
      <FinalTripReportPDF />
    </>
  )
}

export default App
