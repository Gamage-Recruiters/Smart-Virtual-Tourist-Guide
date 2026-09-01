import { useNavigate } from 'react-router-dom'
import MapContainer from './MapContainer'
import backgroundPath from '../../assets/safety/back_dp.png'

export default function IncidentReportSuccess({ referenceNumber, location, images = [], onClose, onViewDashboard }) {
  const navigate = useNavigate()

  const locationMarkers = location
    ? [
      {
        id: 'incident-location',
        lat: location.lat,
        lng: location.lng,
        color: 'red',
        popup: 'Incident Location',
      },
    ]
    : []

  const handleViewDashboard = () => {
    if (onViewDashboard) {
      onViewDashboard()
    } else {
      navigate('/safety/incident-tracking')
    }
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundPath})` }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Scrollable container for the card */}
      <div className="relative z-10 w-full px-3 py-10 sm:px-4 sm:py-16">
        {/* Central Glassmorphism Card */}
        <div className="mx-auto h-fit w-full max-w-md rounded-xl border border-white/30 bg-white/95 shadow-2xl backdrop-blur-md">
          <div className="p-5 sm:p-8 text-center">
            {/* Status Header */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 uppercase">
              Incident Report Submitted Successfully
            </h2>

            {/* Reference Section */}
            <div className="mt-8 space-y-2">
              <p className="text-sm font-semibold text-slate-700">Your reference number is:</p>
              <div className="mx-auto w-fit rounded-md border-2 border-slate-300 bg-white px-8 py-3 shadow-md">
                <span className="font-mono text-lg font-bold tracking-wider text-blue-700">
                  {referenceNumber || 'SRL-2026-0042'}
                </span>
              </div>
            </div>

            {/* Emergency Response Message */}
            <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm font-semibold text-slate-800">Our Emergency Response team will contact you shortly</p>
            </div>

            {/* Map Preview Container */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-800 mb-3 text-left pl-1">Location</p>
              <div className="overflow-hidden rounded-lg border-2 border-slate-300 shadow-lg bg-slate-100">
                <div className="h-48 bg-slate-200">
                  {location ? (
                    <MapContainer
                      center={[location.lat, location.lng]}
                      zoom={12}
                      markers={locationMarkers}
                      interactive={false}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-blue-100/50">
                      <p className="text-xs font-bold text-blue-900">Map Preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Photo Preview */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-800 mb-3 text-left pl-1">Uploaded Photo</p>
              <div className="h-48 w-full overflow-hidden rounded-lg border-2 border-slate-300 bg-slate-200 shadow-md">
                <img
                  src={images[0] || "https://images.unsplash.com/photo-1552423151-512534575825?auto=format&fit=crop&w=400&q=80"}
                  className="h-full w-full object-cover"
                  alt="Evidence Preview"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleViewDashboard}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold uppercase text-white shadow-lg transition hover:bg-blue-700 active:scale-95"
              >
                VIEW MY STATUS DASHBOARD
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-amber-100 border border-amber-300 py-3 text-sm font-bold uppercase text-slate-700 shadow-md transition hover:bg-amber-50 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}