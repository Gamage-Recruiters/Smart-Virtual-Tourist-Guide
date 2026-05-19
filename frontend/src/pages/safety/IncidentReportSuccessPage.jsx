import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import IncidentReportSuccess from '../../components/safety/IncidentReportSuccess'

export default function IncidentReportSuccessPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  // If state is missing (e.g., page was refreshed or accessed directly),
  // redirect to a safe fallback page.
  if (!state?.referenceNumber) {
    return <Navigate to="/safety/my-incidents" replace />
  }

  const handleClose = () => {
    // When closing, navigate to the main report form to submit another one
    navigate('/safety/report-incident', { replace: true })
  }

  const handleViewDashboard = () => {
    // Navigate to the incident tracking page
    navigate('/safety/status-dashboard', {
      replace: true,
      state: { submittedReferenceNumber: state.referenceNumber },
    })
  }

  return (
    <IncidentReportSuccess
      referenceNumber={state.referenceNumber}
      location={state.location}
      district={state.district}
      images={state.images}
      onClose={handleClose}
      onViewDashboard={handleViewDashboard}
    />
  )
}