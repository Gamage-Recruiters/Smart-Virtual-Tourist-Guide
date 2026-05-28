import { Outlet } from 'react-router-dom'
import SafetySidebar from '../../components/safety/SafetySidebar'

export default function SafetyDashboard() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[225px_1fr]">
      <SafetySidebar />
      <Outlet />
    </div>
  )
}