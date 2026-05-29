import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Marketplace from './pages/BookingMarketplace.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Marketplace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
