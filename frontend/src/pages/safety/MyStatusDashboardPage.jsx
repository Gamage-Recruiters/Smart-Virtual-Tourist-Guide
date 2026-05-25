import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiUser, FiTrash2 } from 'react-icons/fi'
import safetyService from '../../services/safetyService'
import backgroundImage from '../../assets/safety/back_dp.png'

const CURRENT_TOURIST_ID = 'Tourist_123'
const statusSteps = ['reported', 'investigating', 'resolved']

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

  // Extract actual name from the first incident if available, else fallback
  const userName = useMemo(() => {
    if (myIncidents.length > 0) {
      return myIncidents[0].reporterName || 'Alex'
    }
    return 'Alex'
  }, [myIncidents])

  const [showAllSubmissions, setShowAllSubmissions] = useState(false)

  const displayedSubmissions = showAllSubmissions ? sortedMyIncidents : sortedMyIncidents.slice(0, 4)

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
          userName={userName}
          onDelete={handleDelete}
        />

        <section className="mt-6 rounded-md bg-white p-4 shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-black">My Submissions</h2>
              <p className="mt-1 text-xs text-slate-600">Filtered by touristId: {CURRENT_TOURIST_ID}</p>
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
              {myIncidents.length} reports
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {displayedSubmissions.map((incident) => (
              <MySubmissionCard key={incident._id || incident.id} incident={incident} />
            ))}
            {!loading && myIncidents.length === 0 && (
              <p className="rounded border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-semibold text-slate-700">
                No submissions found for this touristId.
              </p>
            )}
            {loading && (
              <p className="rounded border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-semibold text-slate-700">
                Loading submissions...
              </p>
            )}
          </div>

          {sortedMyIncidents.length > 4 && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllSubmissions(!showAllSubmissions)}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 hover:underline"
              >
                {showAllSubmissions ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </section>
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

function MySubmissionCard({ incident }) {
  const status = normalizeStatus(incident.status)
  const activeIndex = statusSteps.indexOf(status)

  return (
    <article className="rounded border border-black bg-slate-50 p-3">
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[13px] font-extrabold text-black">{getIncidentCategory(incident)}</p>
          <p className="text-[11px] text-slate-600">{incident.district || 'Unknown district'} | {incident.incidentDate || formatDate(incident.createdAt)}</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-700">{status}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {statusSteps.map((step, index) => (
          <div key={step} className="text-center">
            <div className={`mx-auto h-2.5 w-2.5 rounded-full ${index <= activeIndex ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <div className={`mt-0.5 h-0.5 ${index <= activeIndex ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <p className="mt-0.5 text-[10px] font-semibold capitalize text-slate-700">{step}</p>
          </div>
        ))}
      </div>
    </article>
  )
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

function formatDate(value) {
  if (!value) return 'Date not listed'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US')
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
