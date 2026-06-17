import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ResturentLogingPage from './pages/resturentLogingPage'
import ResturentRegistrationPage from './pages/resturentRegistrationPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResturentLogingPage />} />
        <Route path="/login" element={<ResturentLogingPage />} />
        <Route path="/register" element={<ResturentRegistrationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
