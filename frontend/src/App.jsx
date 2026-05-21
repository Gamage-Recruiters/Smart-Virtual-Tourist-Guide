import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { SafetyProvider } from './contexts/SafetyContext'
import SafetyDashboard from './pages/safety/SafetyDashboard'
import DashboardHome from './pages/safety/DashboardHome'
import EmergencyCallPage from './pages/safety/EmergencyCallPage'
import SecurityAlertsPage from './pages/safety/SecurityAlertsPage'
import IncidentReportPage from './pages/safety/IncidentReportPage'
import IncidentTrackingPage from './pages/safety/IncidentTrackingPage'
import MyIncidentsPage from './pages/safety/MyIncidentsPage'
import MyStatusDashboardPage from './pages/safety/MyStatusDashboardPage'
import IncidentReportSuccessPage from './pages/safety/IncidentReportSuccessPage'
import WeatherAlertsPage from './pages/safety/WeatherAlertsPage'
import NavigationDirectionsPage from './pages/safety/NavigationDirectionsPage'
import './App.css'

function App() {
  return (
    <SafetyProvider>
      <Router>
        <Routes>
          {/* Routes with the sidebar layout */}
          <Route path="/safety" element={<SafetyDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="alerts" element={<SecurityAlertsPage />} />
            <Route path="security-alerts" element={<Navigate to="/safety/alerts" replace />} />
            <Route path="my-incidents" element={<MyIncidentsPage />} />
            <Route path="my-reports" element={<Navigate to="/safety/my-incidents" replace />} />
            <Route path="status-dashboard" element={<MyStatusDashboardPage />} />
            <Route path="analytics" element={<IncidentTrackingPage />} />
            <Route path="public-incidents" element={<DashboardHome />} />
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
