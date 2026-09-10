import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getIncidentCategory, getCurrentTouristId } from '../../utils/safety/incidentUtils'
import { formatDate } from '../../utils/safety/dateUtils'
import { FiUser, FiTrash2 } from 'react-icons/fi'
import safetyService from '../../services/safety/safetyService'
import backgroundImage from '../../assets/safety/back_dp.png'




export default function MyStatusDashboardPage() {
  const location = useLocation()
  const [myIncidents, setMyIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadReports() {
      try {
        const touristId = getCurrentTouristId();
        if (!touristId) {
          if (isMounted) setLoading(false)
          return
        }
        const personalData = await safetyService.getIncidents({ touristId })
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

      const storedUser = localStorage.getItem('userData') || localStorage.getItem('user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        if (parsed) {
          return parsed.name || parsed.firstName || parsed.username || 'Tourist'
        }
        if (typeof parsed === 'string') return parsed
      }

      const storedName = localStorage.getItem('touristName')
      if (storedName) return storedName
    } catch (e) {
      console.warn('Failed to read tourist name from localStorage:', e)
    }
    return 'Tourist'
  })

  useEffect(() => {
    let isMounted = true

    async function loadTouristProfile() {
      const touristId = getCurrentTouristId();
      if (!touristId) return // Skip until auth is ready
      try {
        const profile = await safetyService.getTouristProfile(touristId)
        if (isMounted && profile) {
          const fetchedName = profile.name || profile.firstName || profile.username
          if (fetchedName) {
            setTouristProfileName(fetchedName)
            localStorage.setItem('touristProfile', JSON.stringify(profile))
          }
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
      className="min-h-screen bg-cover bg-center bg-[#eef8ff] px-4 py-6 sm:px-6 sm:py-9 md:px-14"
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

      {/* Mobile card layout */}
      <div className="space-y-3 sm:hidden">
        {incidents.map((incident, index) => {
          const referenceNumber = getReferenceNumber(incident, index)
          const isHighlighted = highlightedReferenceNumber && highlightedReferenceNumber === referenceNumber

          return (
            <div key={incident._id || incident.id || referenceNumber} className={`rounded-lg border p-4 shadow-sm ${isHighlighted ? 'bg-orange-50 border-orange-200' : 'bg-white/80 border-slate-200'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{referenceNumber}</p>
                  <p className="text-[13px] font-semibold text-slate-700 mt-1">{getIncidentCategory(incident)}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(incident.incidentDate || incident.createdAt)}</p>
                </div>
                <StatusBadge status={incident.status} />
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                {incident.status === 'reported' || !incident.status ? (
                  <button
                    onClick={() => onDelete(incident._id || incident.id)}
                    className="inline-flex items-center justify-center gap-1.5 rounded bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-200 transition-colors"
                    title="Delete Report"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-1.5 rounded bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400 cursor-not-allowed"
                    title="Cannot delete once processing has started"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {!loading && incidents.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white/80 px-3 py-8 text-center text-xs font-semibold text-slate-600">
            {getCurrentTouristId() ? 'No submitted incident requests yet.' : 'Please log in to view your incident reports.'}
          </div>
        )}
        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white/80 px-3 py-8 text-center text-xs font-semibold text-slate-600">
            Loading request status...
          </div>
        )}
      </div>

      {/* Desktop table layout */}
      <div className="overflow-x-auto hidden sm:block">
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
                  <td className="border border-black px-3 py-2">{formatDate(incident.incidentDate || incident.createdAt)}</td>
                  <td className="border border-black px-3 py-2">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="border border-black px-3 py-2 text-center">
                    {incident.status === 'reported' || !incident.status ? (
                      <button
                        onClick={() => onDelete(incident._id || incident.id)}
                        className="inline-flex items-center justify-center gap-1.5 rounded bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-200 transition-colors"
                        title="Delete Report"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center gap-1.5 rounded bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400 cursor-not-allowed"
                        title="Cannot delete once processing has started"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}

            {!loading && incidents.length === 0 && (
              <tr>
                <td colSpan="5" className="border border-black px-3 py-5 text-center text-xs font-semibold text-slate-600">
                  {getCurrentTouristId() ? 'No submitted incident requests yet.' : 'Please log in to view your incident reports.'}
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
  const normalized = normalizeStatus(status);
  
  let bgColor = 'bg-gray-200';
  let textColor = 'text-black';
  let label = 'Unknown';

  if (normalized === 'reported') {
    bgColor = 'bg-yellow-400';
    textColor = 'text-black';
    label = 'Reported';
  } else if (normalized === 'investigating') {
    bgColor = 'bg-blue-500';
    textColor = 'text-white';
    label = 'Investigating';
  } else if (normalized === 'resolved') {
    bgColor = 'bg-[#079427]';
    textColor = 'text-white';
    label = 'Resolved';
  }

  return (
    <span className={`inline-flex min-w-28 justify-center rounded-lg px-4 py-1.5 text-xs font-bold ${bgColor} ${textColor}`}>
      {label}
    </span>
  )
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
