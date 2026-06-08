import { useState } from 'react'

import FinalTripReport from './pages/FinalTripReport';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FinalTripReport />
    </>
  )
}

export default App
