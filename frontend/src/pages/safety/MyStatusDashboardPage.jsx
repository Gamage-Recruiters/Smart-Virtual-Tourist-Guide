import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiUser, FiTrash2 } from 'react-icons/fi'
import safetyService from '../../services/safetyService'
import backgroundImage from '../../assets/safety/back_dp.png'

const CURRENT_TOURIST_ID = 'Tourist_123'


export default function MyStatusDashboardPage() {
  const location = useLocation()
  const [myIncidents, setMyIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadReports() {
      try {
        const personalData = await safetyService.getIncidents({ touristId: CURRENT_TOURIST_ID })
        if (isMounted) {
          setMyIncidents(personalData)
        }
      } catch (error) {
        console.error('Unable to load my reports:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadReports()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedMyIncidents = useMemo(() => {
    return [...myIncidents].sort((a, b) => {
      const bDate = new Date(b.createdAt || b.incidentDate || 0).getTime()
      const aDate = new Date(a.createdAt || a.incidentDate || 0).getTime()
      return bDate - aDate
    })
  }, [myIncidents])

  const submittedReferenceNumber = location.state?.submittedReferenceNumber

  // Fetch and manage tourist profile name instead of relying on incident reporter name
  const [touristProfileName, setTouristProfileName] = useState(() => {
    try {
      const storedProfile = localStorage.getItem('touristProfile')
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile)
        if (parsed && parsed.name) return parsed.name
      }
      
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        if (parsed && parsed.name) return parsed.name
        if (typeof parsed === 'string') return parsed
      }

      const storedName = localStorage.getItem('touristName')
      if (storedName) return storedName
    } catch (e) {
      console.warn('Failed to read tourist name from localStorage:', e)
    }
    return 'Alex'
  })

  useEffect(() => {
    let isMounted = true

    async function loadTouristProfile() {
      try {
        const profile = await safetyService.getTouristProfile(CURRENT_TOURIST_ID)
        if (isMounted && profile && profile.name) {
          setTouristProfileName(profile.name)
          localStorage.setItem('touristProfile', JSON.stringify(profile))
        }
      } catch (error) {
        console.warn('Could not fetch tourist profile from backend, using localStorage/default fallback:', error)
      }
    }

    loadTouristProfile()

    return () => {
      isMounted = false
    }
  }, [])



  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incident report?')) return;
    try {
      await safetyService.deleteIncident(id)
      setMyIncidents((prev) => prev.filter((inc) => (inc._id || inc.id) !== id))
    } catch (error) {
      console.error('Failed to delete incident:', error)
      alert('Failed to delete incident.')
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-[#eef8ff] px-6 py-9 md:px-14"
      style={{ backgroundImage: `linear-gradient(rgba(214, 234, 244, 0.68), rgba(214, 234, 244, 0.68)), url(${backgroundImage})` }}
    >
      <div className="mx-auto max-w-5xl">
        <StatusOverviewTable
          incidents={sortedMyIncidents}
          loading={loading}
          highlightedReferenceNumber={submittedReferenceNumber}
          userName={touristProfileName}
          onDelete={handleDelete}
        />
      </div>
    </main>
  )
}

function StatusOverviewTable({ incidents, loading, highlightedReferenceNumber, userName, onDelete }) {
  return (
    <section className="mb-6 rounded-md bg-white/70 p-4 shadow-md backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700">
          <FiUser size={24} />
        </div>
        <div>
          <p className="text-[11px] font-extrabold text-black uppercase tracking-wide">Welcome, {userName}</p>
          <h2 className="font-bold text-slate-800">My Incident Reports</h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border border-black bg-white/80 text-left text-[13px] text-black">
          <thead>
            <tr className="bg-white/40">
              <th className="border border-black px-3 py-2.5 text-[13px] font-medium">Reference Number</th>
              <th className="border border-black px-3 py-2.5 text-[13px] font-medium">Incident Type</th>
              <th className="border border-black px-3 py-2.5 text-[13px] font-medium">Date</th>
              <th className="border border-black px-3 py-2.5 text-[13px] font-medium">Status</th>
              <th className="border border-black px-3 py-2.5 text-[13px] font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => {
              const referenceNumber = getReferenceNumber(incident, index)
              const isHighlighted = highlightedReferenceNumber && highlightedReferenceNumber === referenceNumber

              return (
                <tr key={incident._id || incident.id || referenceNumber} className={isHighlighted ? 'bg-orange-50' : 'bg-white/70'}>
                  <td className="border border-black px-3 py-2 font-medium">{referenceNumber}</td>
                  <td className="border border-black px-3 py-2">{getIncidentCategory(incident)}</td>
                  <td className="border border-black px-3 py-2">{formatStatusDate(incident.incidentDate || incident.createdAt)}</td>
                  <td className="border border-black px-3 py-2">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="border border-black px-3 py-2 text-center">
                    <button
                      onClick={() => onDelete(incident._id || incident.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-200 transition-colors"
                      title="Delete Report"
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}

            {!loading && incidents.length === 0 && (
              <tr>
                <td colSpan="5" className="border border-black px-3 py-5 text-center text-xs font-semibold text-slate-600">
                  No submitted incident requests yet.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="5" className="border border-black px-3 py-5 text-center text-xs font-semibold text-slate-600">
                  Loading request status...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status)
  const isResolved = normalized === 'resolved'

  return (
    <span className={`inline-flex min-w-28 justify-center rounded-lg px-4 py-1.5 text-xs font-medium text-black ${isResolved ? 'bg-[#079427]' : 'bg-[#ff9a35]'}`}>
      {isResolved ? 'Resolved' : 'Processing'}
    </span>
  )
}


function formatStatusDate(value) {
  if (!value) return 'Date not listed'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
}

function getIncidentCategory(incident) {
  return incident.incidentCategory || incident.category || incident.type || 'Other'
}

function getReferenceNumber(incident, index = 0) {
  if (incident.referenceNumber) return incident.referenceNumber
  const createdAt = incident.createdAt ? new Date(incident.createdAt) : new Date()
  const year = Number.isNaN(createdAt.getTime()) ? new Date().getFullYear() : createdAt.getFullYear()
  const source = incident._id || incident.id || String(index + 1)
  const digits = String(source).replace(/\D/g, '').slice(-4) || String(index + 1)
  return `SRL-${year}-${digits.padStart(4, '0')}`
}

function normalizeStatus(status) {
  if (status === 'closed') return 'resolved'
  if (status === 'investigating') return 'investigating'
  return status || 'reported'
}
