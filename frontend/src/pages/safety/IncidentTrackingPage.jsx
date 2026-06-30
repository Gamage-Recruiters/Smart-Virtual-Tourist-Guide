import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import safetyService from '../../services/safetyService'
import backgroundImage from '../../assets/safety/back_dp.png'

export default function IncidentTrackingPage() {
  const [publicIncidents, setPublicIncidents] = useState([])
  const [month, setMonth] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadAnalyticsData() {
      try {
        const publicData = await safetyService.getPublicIncidents({ limit: 200 })

        if (isMounted) {
          setPublicIncidents(publicData)
        }
      } catch (error) {
        console.error('Unable to load reports analytics:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadAnalyticsData()

    return () => {
      isMounted = false
    }
  }, [])

  const scopedIncidents = useMemo(() => {
    if (month === 'all') return publicIncidents
    return publicIncidents.filter((incident) => {
      const value = incident.incidentDate || incident.createdAt
      if (!value) return false
      const date = new Date(value)
      return !Number.isNaN(date.getTime()) && String(date.getMonth() + 1).padStart(2, '0') === month
    })
  }, [month, publicIncidents])

  const categoryData = useMemo(() => countBy(scopedIncidents, getIncidentCategory), [scopedIncidents])
  const districtData = useMemo(() => countBy(scopedIncidents, (incident) => incident.district || 'Unknown'), [scopedIncidents])


  return (
    <main
      className="min-h-screen bg-cover bg-center bg-[#eef8ff] px-4 py-6 sm:px-6 sm:py-9 md:px-14"
      style={{ backgroundImage: `linear-gradient(rgba(214, 234, 244, 0.68), rgba(214, 234, 244, 0.68)), url(${backgroundImage})` }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col items-start gap-4">
          <h2 className="text-xl font-bold text-slate-800">Public Incident Analytics</h2>
          <div className="flex items-center gap-3 text-xs font-bold text-black">
            <span>Select Month:</span>
            <select
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="h-8 w-full sm:h-5 sm:w-40 border border-black bg-white px-2 text-xs rounded"
            >
              <option value="all">All</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            {loading && <span className="text-slate-600">Loading...</span>}
          </div>
        </div>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,620px)_340px]">
          <div className="space-y-8">

            <ChartPanel title="Regional Risk Levels by District">
                  <HorizontalBarChart data={districtData} />
                </ChartPanel>

                <ChartPanel title="Incident Distribution by Category">
                  <PieChart data={categoryData} />
                </ChartPanel>

                <ChartPanel title="Daily Incident Trend">
                  <TrendChart incidents={scopedIncidents} />
                </ChartPanel>
              </div>

              <div className="space-y-8">
                <section className="border border-black bg-white p-8 shadow-sm">
                  <h2 className="text-center text-xs font-extrabold uppercase text-black">Emergency & Safety Tools</h2>
                  <div className="mt-6 space-y-3">
                    <Link to="/safety/emergency" className="block rounded-lg bg-red-500 px-5 py-4 text-center text-xs font-bold text-white">
                      One-Tap Emergency Form
                    </Link>
                    <Link
                      to="/safety/report-incident"
                      className="block w-full bg-[#064796] px-5 py-5 text-center text-xs font-bold text-white hover:bg-[#053d7c]"
                    >
                      Incident Reporting Form
                    </Link>
                  </div>
                </section>
              </div>
            </section>
      </div>
    </main>
  )
}

function ChartPanel({ title, children }) {
  return (
    <section className="rounded-md border border-black bg-white p-5 shadow-md">
      <h2 className="mb-4 text-center text-sm font-semibold text-black">{title}</h2>
      {children}
    </section>
  )
}

function HorizontalBarChart({ data }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const max = Math.max(...entries.map(([, value]) => value), 1)

  if (entries.length === 0) return <EmptyChart />

  return (
    <div className="space-y-3">
      {entries.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[80px_1fr_30px] sm:grid-cols-[120px_1fr_36px] items-center gap-2 sm:gap-3 text-xs">
          <span className="truncate text-right font-semibold text-slate-700">{label}</span>
          <div className="h-6 bg-slate-100">
            <div className="flex h-6 items-center justify-end bg-gradient-to-r from-sky-300 to-blue-600 pr-2 text-[10px] font-bold text-white" style={{ width: `${Math.max((value / max) * 100, 8)}%` }}>
              {value}
            </div>
          </div>
          <span className="font-bold text-slate-700">{value}</span>
        </div>
      ))}
      <p className="text-center text-[11px] font-semibold text-slate-600">Number of Incidents</p>
    </div>
  )
}

function PieChart({ data }) {
  const entries = Object.entries(data)
  const total = entries.reduce((sum, [, value]) => sum + value, 0)
  const colors = ['#3da4d6', '#f39a6b', '#34b44a', '#2d7ea3', '#f1c232']
  let cursor = 0

  if (!total) return <EmptyChart />

  return (
    <div className="flex flex-col items-center gap-5 md:flex-row md:justify-center">
      <svg viewBox="0 0 42 42" className="h-52 w-52 -rotate-90">
        {entries.map(([label, value], index) => {
          const portion = (value / total) * 100
          const dash = `${portion} ${100 - portion}`
          const circle = (
            <circle
              key={label}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={colors[index % colors.length]}
              strokeWidth="10"
              strokeDasharray={dash}
              strokeDashoffset={-cursor}
            />
          )
          cursor += portion
          return circle
        })}
      </svg>
      <div className="space-y-2 text-xs">
        {entries.map(([label, value], index) => (
          <div key={label} className="flex items-center gap-2">
            <span className="h-2 w-2" style={{ backgroundColor: colors[index % colors.length] }} />
            <span className="font-semibold text-slate-700">{label}</span>
            <span className="text-slate-500">({value})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendChart({ incidents }) {
  const buckets = incidents.reduce((acc, incident) => {
    const key = getDateKey(incident)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const labels = Object.keys(buckets).sort().slice(-7)
  const values = labels.map((label) => buckets[label])
  const max = Math.max(...values, 1)
  const points = values.map((value, index) => {
    const x = labels.length === 1 ? 300 : 30 + (index * 540) / (labels.length - 1)
    const y = 210 - (value / max) * 170
    return `${x},${y}`
  }).join(' ')

  if (labels.length === 0) return <EmptyChart />

  return (
    <svg viewBox="0 0 620 260" className="h-64 w-full">
      {[40, 80, 120, 160, 200].map((y) => (
        <line key={y} x1="30" x2="590" y1={y} y2={y} stroke="#e5e7eb" />
      ))}
      <polyline fill="none" stroke="#153cff" strokeWidth="3" points={points} />
      {points.split(' ').map((point) => {
        const [x, y] = point.split(',')
        return <circle key={point} cx={x} cy={y} r="5" fill="#153cff" />
      })}
      {labels.map((label, index) => {
        const x = labels.length === 1 ? 300 : 30 + (index * 540) / (labels.length - 1)
        return (
          <text key={label} x={x} y="245" textAnchor="middle" fontSize="11" fill="#111827">
            {label.slice(5)}
          </text>
        )
      })}
      <text x="310" y="20" textAnchor="middle" fontSize="12" fontWeight="700">Total Incidents</text>
    </svg>
  )
}


function EmptyChart() {
  return <div className="flex h-48 items-center justify-center text-xs font-semibold text-slate-500">No incident data available</div>
}

function countBy(rows, getKey) {
  return rows.reduce((acc, row) => {
    const key = getKey(row) || 'Unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
}

function getIncidentCategory(incident) {
  return incident.incidentCategory || incident.category || incident.type || 'Other'
}

function getDateKey(incident) {
  const value = incident.incidentDate || incident.createdAt
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return date.toISOString().slice(0, 10)
}
