import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SafetyProvider } from './contexts/SafetyContext'
import SafetyLayout from './pages/safety/SafetyLayout'
import PublicIncidentsPage from './pages/safety/PublicIncidentsPage'
import EmergencyCallPage from './pages/safety/EmergencyCallPage'
import SecurityAlertsPage from './pages/safety/SecurityAlertsPage'
import IncidentReportPage from './pages/safety/IncidentReportPage'
import IncidentTrackingPage from './pages/safety/IncidentTrackingPage'
import MyStatusDashboardPage from './pages/safety/MyStatusDashboardPage'
import IncidentReportSuccessPage from './pages/safety/IncidentReportSuccessPage'
import WeatherAlertsPage from './pages/safety/WeatherAlertsPage'
import NavigationDirectionsPage from './pages/safety/NavigationDirectionsPage'
import { Toaster } from 'react-hot-toast'
import './App.css'

function App() {
  return (
    <SafetyProvider>
      <Toaster />
      <Router>
        <Routes>
          {/* Routes with the sidebar layout */}
          <Route path="/safety" element={<SafetyLayout />}>
            <Route index element={<PublicIncidentsPage />} />
            <Route path="alerts" element={<SecurityAlertsPage />} />
            <Route path="security-alerts" element={<Navigate to="/safety/alerts" replace />} />
            <Route path="my-incidents" element={<MyStatusDashboardPage />} />
            <Route path="my-reports" element={<Navigate to="/safety/my-incidents" replace />} />
            <Route path="status-dashboard" element={<Navigate to="/safety/my-incidents" replace />} />
            <Route path="public-analytics" element={<IncidentTrackingPage />} />
            <Route path="analytics" element={<Navigate to="/safety/public-analytics" replace />} />
            <Route path="public-incidents" element={<PublicIncidentsPage />} />
            <Route path="weather" element={<WeatherAlertsPage />} />
          </Route>

          {/* Standalone routes without the sidebar */}
          <Route path="/safety/emergency" element={<EmergencyCallPage />} />
          <Route path="/safety/navigate" element={<NavigationDirectionsPage />} />
          <Route path="/safety/report-incident" element={<IncidentReportPage />} />
          <Route path="/safety/report-incident/form" element={<Navigate to="/safety/report-incident" replace />} />
          <Route path="/safety/report-success" element={<IncidentReportSuccessPage />} />

          <Route path="/" element={<Navigate to="/safety" replace />} />
          <Route path="*" element={<Navigate to="/safety" replace />} />
        </Routes>
      </Router>
    </SafetyProvider>
  )
}

export default App
