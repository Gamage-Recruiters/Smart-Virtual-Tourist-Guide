import { useState, useEffect } from 'react'
import { FiCloud, FiNavigation, FiThermometer, FiUmbrella, FiWind, FiSun, FiCloudRain, FiCloudLightning, FiCloudDrizzle, FiCloudSnow, FiRefreshCw } from 'react-icons/fi'
import AlertBanner from '../../components/safety/AlertBanner'
import MapContainer from '../../components/safety/MapContainer'
import { useWeather } from '../../hooks/useSafetyData'
import safetyService from '../../services/safetyService'

const fallbackForecast = [
  { day: 'Mon', high: 29, low: 24, condition: 'Rain' },
  { day: 'Tue', high: 28, low: 23, condition: 'Cloudy' },
  { day: 'Wed', high: 27, low: 22, condition: 'Storms' },
  { day: 'Thu', high: 30, low: 24, condition: 'Sun' },
  { day: 'Fri', high: 31, low: 25, condition: 'Cloudy' },
  { day: 'Sat', high: 29, low: 24, condition: 'Rain' },
  { day: 'Sun', high: 28, low: 23, condition: 'Mist' },
]

const fallbackDistrictRisk = [
  { area: 'Colombo Fort', risk: 'Urban flooding', status: 'Medium', lat: 6.9344, lng: 79.8428 },
  { area: 'Kandy Lake', risk: 'Crowd and wet roads', status: 'Low', lat: 7.2936, lng: 80.6413 },
  { area: 'Nuwara Eliya', risk: 'Mist and landslide watch', status: 'High', lat: 6.9497, lng: 80.7891 },
  { area: 'Horton Plains', risk: 'Cold wind and mist', status: 'Medium', lat: 6.8021, lng: 80.8070 },
]

const statusClass = {
  Critical: 'bg-red-100 text-red-800',
  High: 'bg-orange-100 text-orange-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
}

const riskStyles = {
  Critical: {
    bg: 'bg-red-50 border-red-200 text-red-900',
    badge: 'bg-red-100 text-red-800 border-red-200',
    icon: '🔴',
    advice: 'Immediate, severe danger to safety. Halt outdoor movements and seek safe shelter instantly. Avoid mountain passes and coastal zones.',
  },
  High: {
    bg: 'bg-orange-50 border-orange-200 text-orange-900',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: '🟠',
    advice: 'Severe weather detected. High risk of dehydration or low visibility. Consider delaying travel and avoid waterfall trails.',
  },
  Medium: {
    bg: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '🟡',
    advice: 'Passing showers or elevated heat. Proceed with your itinerary but carry an umbrella and stay hydrated.',
  },
  Low: {
    bg: 'bg-green-50 border-green-200 text-green-900',
    badge: 'bg-green-100 text-green-800 border-green-200',
    icon: '🟢',
    advice: 'Favourable weather conditions. Great time for sightseeing, hiking, and outdoor activities. Standard precautions apply.',
  },
}

function assessWeatherRisk(openWeather) {
  if (!openWeather) return { status: 'Low', risk: 'Fetching conditions...' }

  const conditionId = openWeather.weather?.[0]?.id || 800
  const windSpeed = openWeather.wind?.speed || 0 // m/s
  const visibility = openWeather.visibility || 10000 // meters
  const rain1h = openWeather.rain?.['1h'] || 0 // mm
  const rain3h = openWeather.rain?.['3h'] || 0 // mm
  const temp = openWeather.main?.temp || 25

  const risks = []

  // --- Thunderstorm (2xx codes) → Critical ---
  if (conditionId >= 200 && conditionId < 300) {
    risks.push({ risk: 'Thunderstorm activity', severity: 4 })
  }

  // --- Rain condition codes (5xx) ---
  if (conditionId >= 500 && conditionId < 600) {
    if (conditionId >= 502) {
      risks.push({ risk: 'Heavy rainfall and flooding risk', severity: 3 })
    } else {
      risks.push({ risk: 'Light to moderate rain', severity: 2 })
    }
  }

  // --- Rain volume ---
  if (rain1h > 10 || rain3h > 25) {
    risks.push({ risk: 'Flash flooding possible', severity: 4 })
  } else if (rain1h > 5 || rain3h > 12) {
    risks.push({ risk: 'Heavy downpours', severity: 3 })
  } else if (rain1h > 2 || rain3h > 5) {
    risks.push({ risk: 'Moderate rain', severity: 2 })
  }

  // --- Wind ---
  if (windSpeed > 15) {
    risks.push({ risk: 'Strong winds', severity: 4 })
  } else if (windSpeed > 10) {
    risks.push({ risk: 'High winds', severity: 3 })
  } else if (windSpeed > 8) {
    risks.push({ risk: 'Moderate winds', severity: 2 })
  }

  // --- Visibility (fog, mist, haze) ---
  if (visibility < 500) {
    risks.push({ risk: 'Near-zero visibility', severity: 4 })
  } else if (visibility < 1000) {
    risks.push({ risk: 'Very low visibility', severity: 3 })
  } else if (visibility < 3000) {
    risks.push({ risk: 'Mist and reduced visibility', severity: 2 })
  }

  // --- Extreme heat ---
  if (temp > 37) {
    risks.push({ risk: 'Extreme heat', severity: 3 })
  } else if (temp > 35) {
    risks.push({ risk: 'Elevated heat', severity: 2 })
  }

  // --- Snow / sleet (6xx) ---
  if (conditionId >= 600 && conditionId < 700) {
    risks.push({ risk: 'Cold and icy conditions', severity: 3 })
  }

  const maxSeverity = risks.length ? Math.max(...risks.map(r => r.severity)) : 0
  let status = 'Low'
  if (maxSeverity >= 4) status = 'Critical'
  else if (maxSeverity >= 3) status = 'High'
  else if (maxSeverity >= 2) status = 'Medium'

  const topRisk = risks.length
    ? risks.sort((a, b) => b.severity - a.severity)[0].risk
    : 'Clear conditions – safe for travel'

  return { status, risk: topRisk }
}

export default function WeatherAlertsPage() {
  const [district, setDistrict] = useState('Nuwara Eliya')
  const [weatherFetchedAt, setWeatherFetchedAt] = useState(null)
  const [updatedAgoText, setUpdatedAgoText] = useState('Just now')

  const coordinates = {
    'Ampara': { lat: 7.2912, lng: 81.6724 },
    'Anuradhapura': { lat: 8.3114, lng: 80.4037 },
    'Badulla': { lat: 6.9847, lng: 81.0565 },
    'Batticaloa': { lat: 7.7102, lng: 81.6924 },
    'Colombo': { lat: 6.9271, lng: 79.8612 },
    'Galle': { lat: 6.0328, lng: 80.2150 },
    'Gampaha': { lat: 7.0840, lng: 80.0098 },
    'Hambantota': { lat: 6.1246, lng: 81.1213 },
    'Jaffna': { lat: 9.6615, lng: 80.0255 },
    'Kalutara': { lat: 6.5854, lng: 79.9607 },
    'Kandy': { lat: 7.2906, lng: 80.6337 },
    'Kegalle': { lat: 7.2513, lng: 80.3464 },
    'Kilinochchi': { lat: 9.3803, lng: 80.3770 },
    'Kurunegala': { lat: 7.4818, lng: 80.3609 },
    'Mannar': { lat: 8.9810, lng: 79.9044 },
    'Matale': { lat: 7.4675, lng: 80.6234 },
    'Matara': { lat: 5.9549, lng: 80.5550 },
    'Monaragala': { lat: 6.8728, lng: 81.3507 },
    'Mullaitivu': { lat: 9.2671, lng: 80.8142 },
    'Nuwara Eliya': { lat: 6.9497, lng: 80.7891 },
    'Polonnaruwa': { lat: 7.9403, lng: 81.0188 },
    'Puttalam': { lat: 8.0330, lng: 79.8260 },
    'Ratnapura': { lat: 6.7056, lng: 80.3847 },
    'Trincomalee': { lat: 8.5874, lng: 81.2152 },
    'Vavuniya': { lat: 8.7542, lng: 80.4982 },
  }

  const selectedCoords = coordinates[district] || coordinates['Nuwara Eliya']
  const { data: weatherData = {}, isLoading, error, refetch } = useWeather(selectedCoords)

  // Mark fetch timestamp whenever new weather data arrives
  useEffect(() => {
    if (weatherData.current) {
      setWeatherFetchedAt(new Date())
    }
  }, [weatherData])

  // Auto-refresh weather & forecast every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [refetch])

  // Update the relative "Updated X ago" text every 30 seconds
  useEffect(() => {
    const tick = () => {
      if (!weatherFetchedAt) { setUpdatedAgoText('--'); return }
      const diffSec = Math.floor((Date.now() - weatherFetchedAt.getTime()) / 1000)
      if (diffSec < 60) setUpdatedAgoText('Just now')
      else if (diffSec < 3600) setUpdatedAgoText(`${Math.floor(diffSec / 60)} min${Math.floor(diffSec / 60) > 1 ? 's' : ''} ago`)
      else setUpdatedAgoText(`${Math.floor(diffSec / 3600)} hr${Math.floor(diffSec / 3600) > 1 ? 's' : ''} ago`)
    }
    tick()
    const interval = setInterval(tick, 30 * 1000)
    return () => clearInterval(interval)
  }, [weatherFetchedAt])

  const openWeather = weatherData.current
  const weather = {
    temperature: openWeather?.main?.temp ? Math.round(openWeather.main.temp) : 24,
    condition: openWeather?.weather?.[0]?.main || 'Partly cloudy',
    humidity: openWeather?.main?.humidity || 85,
    windSpeed: openWeather?.wind?.speed ? Math.round(openWeather.wind.speed * 3.6) : 10, // m/s to km/h
    windDirection: openWeather?.wind?.deg ? getWindDirection(openWeather.wind.deg) : 'NE',
    updatedAt: new Date().toISOString(),
  }

  let forecastList = fallbackForecast
  if (weatherData.forecast?.list) {
    // OpenWeather 5-day forecast returns data every 3 hours (40 items).
    // We group by day and find high/low.
    const dailyData = {}
    weatherData.forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      if (!dailyData[dayName]) {
        dailyData[dayName] = {
          day: dayName,
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: item.weather[0].main,
        }
      } else {
        dailyData[dayName].high = Math.max(dailyData[dayName].high, item.main.temp_max)
        dailyData[dayName].low = Math.min(dailyData[dayName].low, item.main.temp_min)
      }
    })
    let parsedDays = Object.values(dailyData).map(day => ({
      ...day,
      high: Math.round(day.high),
      low: Math.round(day.low),
    }))

    // OpenWeather free tier provides up to 5 or 6 days depending on time of day.
    // Extrapolate to guarantee exactly 7 days for the UI.
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    while (parsedDays.length < 7) {
      const lastDay = parsedDays[parsedDays.length - 1]
      const lastIdx = daysOfWeek.indexOf(lastDay.day)
      const nextDayStr = daysOfWeek[(lastIdx + 1) % 7]

      parsedDays.push({
        ...lastDay,
        day: nextDayStr,
      })
    }

    forecastList = parsedDays.slice(0, 7)
  }

  // --- Live district alerts ---
  const [districtRisk, setDistrictRisk] = useState(fallbackDistrictRisk)
  const [alertsUpdatedAt, setAlertsUpdatedAt] = useState(null)
  const [alertsLoading, setAlertsLoading] = useState(false)
  const [emergencyWarning, setEmergencyWarning] = useState(null)

  const fetchAlerts = async () => {
    try {
      setAlertsLoading(true)
      const result = await safetyService.getWeatherAlerts()
      if (result?.alerts?.length) {
        setDistrictRisk(result.alerts)
        setAlertsUpdatedAt(result.updatedAt)
      }
      // Use the live emergency warning from the backend (derived from OpenWeather data)
      setEmergencyWarning(result?.emergencyWarning || null)
    } catch (err) {
      console.error('Failed to fetch live weather alerts:', err)
    } finally {
      setAlertsLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const markers = districtRisk.map((item) => ({
    id: item.area,
    lat: item.lat,
    lng: item.lng,
    color: item.status === 'Critical' ? 'red' : item.status === 'High' ? 'orange' : item.status === 'Medium' ? 'yellow' : 'green',
    popup: `<strong>${item.area}</strong><br/>${item.risk}<br/>${item.status}`,
  }))

  const selectedRisk = assessWeatherRisk(openWeather)

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h2 className="text-sm font-extrabold uppercase text-black">Weather alerts and recommendations</h2>
        </header>

        {emergencyWarning && (
          <AlertBanner
            type={emergencyWarning.type}
            title={emergencyWarning.title}
            message={emergencyWarning.message}
          />
        )}

        {error && (
          <AlertBanner type="warning" title="Live weather unavailable" message="Showing fallback travel-safety data until the backend responds." />
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-xs font-bold text-black mb-2">
                <span>Select District:</span>
                <select
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  className="h-5 w-40 border border-black bg-white px-2 text-xs font-normal"
                >
                  {Object.keys(coordinates).map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                {isLoading && <span className="text-slate-600 font-normal">Loading...</span>}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Current conditions</p>
                  <h2 className="mt-1 text-4xl font-bold text-slate-900">
                    {isLoading ? '--' : weather.temperature || '--'} C
                  </h2>
                  <p className="mt-1 text-slate-600">{weather.condition || 'Partly cloudy'}</p>
                </div>
                <FiCloud className="text-blue-500" size={40} />
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <WeatherStat icon={<FiUmbrella />} label="Humidity" value={`${weather.humidity || '--'}%`} />
                <WeatherStat icon={<FiWind />} label="Wind" value={`${weather.windSpeed || '--'} km/h ${weather.windDirection || ''}`} />
                <WeatherStat icon={<FiThermometer />} label="Updated" value={updatedAgoText} />
              </div>
            </div>

            <div className={`rounded-lg border p-5 transition-all duration-300 ${riskStyles[selectedRisk.status].bg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <FiNavigation />
                  Travel Recommendation
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${riskStyles[selectedRisk.status].badge}`}>
                  {riskStyles[selectedRisk.status].icon} {selectedRisk.status}
                </span>
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Risk Status:
              </p>
              <p className="mt-1 text-sm font-semibold leading-relaxed">
                {selectedRisk.risk}
              </p>
              <div className="mt-3 border-t border-current/10 pt-3">
                <p className="text-xs leading-relaxed opacity-90">
                  {riskStyles[selectedRisk.status].advice}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900">Live weather map</h2>
            </div>
            {/* Map + legend wrapper — position:relative so the legend overlay is anchored */}
            <div className="relative h-[560px]">
              <MapContainer center={[7.25, 80.75]} zoom={8} markers={markers} />

              {/* ── Color legend overlay (bottom-left corner of the map) ── */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  zIndex: 1000,
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(100,116,139,0.25)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  pointerEvents: 'none',
                }}
              >
                {/* Title row */}
                <p style={{ margin: '0 0 7px 0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569' }}>
                  Risk Level
                </p>
                {/* All three items in a single horizontal row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  {[
                    { color: '#e53935', label: 'Critical' },
                    { color: '#f97316', label: 'High' },
                    { color: '#eab308', label: 'Medium' },
                    { color: '#22c55e', label: 'Low' },
                  ].map(({ color, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '11px',
                          height: '11px',
                          borderRadius: '50%',
                          background: color,
                          flexShrink: 0,
                          border: '2px solid rgba(0,0,0,0.15)',
                          boxShadow: `0 0 0 3px ${color}33`,
                        }}
                      />
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569' }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">7-day forecast</h2>
          <div className="mt-4 grid grid-cols-7 gap-3">
            {forecastList.map((day) => (
              <div key={day.day} className="rounded-lg border border-slate-200 p-3 flex flex-col items-center text-center">
                <p className="font-bold text-slate-900">{day.day}</p>
                <div className="my-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <p className="mt-1 text-sm text-slate-600">{day.condition}</p>
                <p className="mt-2 font-semibold text-slate-800">{day.high} C / {day.low} C</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Live district alerts</h2>
              {alertsUpdatedAt && (
                <p className="text-xs text-slate-500 mt-1">Last updated: {new Date(alertsUpdatedAt).toLocaleTimeString()}</p>
              )}
            </div>
            <button
              onClick={fetchAlerts}
              disabled={alertsLoading}
              className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={alertsLoading ? 'animate-spin' : ''} size={14} />
              Refresh
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">Tourist area</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3">Temp</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {districtRisk.map((item) => (
                  <tr key={item.area}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.area}</td>
                    <td className="px-4 py-3 text-slate-600">{item.condition || '--'}</td>
                    <td className="px-4 py-3 text-slate-600">{item.temperature ? `${item.temperature} C` : '--'}</td>
                    <td className="px-4 py-3 text-slate-600">{item.risk}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[item.status]}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

function WeatherStat({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-3">
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  )
}

function getWindDirection(degree) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8
  return directions[index]
}

function getWeatherIcon(condition) {
  if (!condition) return <FiCloud className="text-slate-400" size={24} />

  const cond = condition.toLowerCase()
  if (cond.includes('thunder') || cond.includes('storm')) return <FiCloudLightning className="text-purple-500" size={28} />
  if (cond.includes('snow')) return <FiCloudSnow className="text-sky-300" size={28} />
  if (cond.includes('rain') || cond.includes('shower')) return <FiCloudRain className="text-blue-500" size={28} />
  if (cond.includes('drizzle')) return <FiCloudDrizzle className="text-blue-400" size={28} />
  if (cond.includes('sun') || cond.includes('clear')) return <FiSun className="text-amber-500" size={28} />
  if (cond.includes('mist') || cond.includes('fog')) return <FiCloud className="text-slate-300" size={28} />

  return <FiCloud className="text-slate-400" size={28} />
}

