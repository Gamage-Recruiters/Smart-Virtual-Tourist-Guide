import { useEffect, useMemo, useState } from 'react'
import safetyService from '../../services/safetyService'
import backgroundImage from '../../assets/safety/back_dp.png'
import IncidentCard from '../../components/safety/IncidentCard'

export default function DashboardHome() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchIncidents() {
      try {
        setError('')
        const data = await safetyService.getPublicIncidents({ limit: 20 })
        if (isMounted) setIncidents(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching incidents:', err)
        if (isMounted) {
          setIncidents([])
          setError('Could not load public incidents from the backend.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchIncidents()

    return () => {
      isMounted = false
    }
  }, [])

  const visibleIncidents = useMemo(() => {
    return incidents
  }, [incidents])

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-[#eef8ff] px-6 py-10 md:px-14"
      style={{ backgroundImage: `linear-gradient(rgba(214, 234, 244, 0.68), rgba(214, 234, 244, 0.68)), url(${backgroundImage})` }}
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-9 text-sm font-extrabold uppercase text-black">
          COMMUNITY ALERT FEED: <span className="text-[#0e3160]">PUBLIC INCIDENT LIST</span>
        </h2>

        <div className="space-y-10">
          {visibleIncidents.map((incident) => (
            <IncidentCard key={incident._id || incident.id} incident={incident} />
          ))}
        </div>

        {loading && (
          <p className="mt-8 text-sm font-semibold text-slate-700">Loading live incidents...</p>
        )}
        {!loading && error && (
          <p className="mt-8 border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        {!loading && !error && visibleIncidents.length === 0 && (
          <p className="mt-8 border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-slate-700">
            No public incidents are available from the backend yet.
          </p>
        )}
      </div>
    </main>
  )
}
