import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ResturentLogingPage from './pages/resturentLogingPage'
import ResturentRegistrationPage from './pages/resturentRegistrationPage'
import ResturentSidebar from './components/resturentSidebar'
import ResturentDashboardPage from './pages/resturentDashboardPage'
import ResturentMenuPage from './pages/resturentMenuPage'
import ResturentAddMenuPage from './pages/resturentAddMenuPage'
import ResturentReservationPage from './pages/resturentReservationPage'
import ResturentOfferPage from './pages/resturentOfferPage'
import ResturentReviewPage from './pages/resturentReviewPage'
import ResturentRevenuePage from './pages/resturentRevenuePage'
import ResturentProfilePage from './pages/resturentProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResturentLogingPage />} />
        <Route path="/login" element={<ResturentLogingPage />} />
        <Route path="/register" element={<ResturentRegistrationPage />} />
        <Route path="/dashboard" element={<ResturentSidebar />}>
          <Route index element={<ResturentDashboardPage />} />
          <Route path="menu" element={<ResturentMenuPage />} />
          <Route path="menu/add" element={<ResturentAddMenuPage />} />
          <Route path="reservation" element={<ResturentReservationPage />} />
          <Route path="offers" element={<ResturentOfferPage />} />
          <Route path="reviews" element={<ResturentReviewPage />} />
          <Route path="revenue" element={<ResturentRevenuePage />} />
          <Route path="profile" element={<ResturentProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
