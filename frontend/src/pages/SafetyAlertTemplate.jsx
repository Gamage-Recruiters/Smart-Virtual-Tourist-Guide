import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Phone,
  CloudRain,
  Car,
  Construction,
  ShieldAlert,
  MapPin,
  Calendar,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import bottomLogo from '../assets/bottomLogo.png';
import middle from '../assets/middle.png';
import { usePageTitle } from '../contexts/PageTitleContext';
import { fetchRoadBlockages, fetchWeatherAlerts } from '../services/api';
import { checkRouteForFlood } from '../utils/floodService';

/* Calculate distance between two coordinates in metres (Haversine) */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = (metres) => {
  if (metres == null || isNaN(metres)) return '';
  if (metres < 1000) return `${Math.round(metres)}m`;
  return `${(metres / 1000).toFixed(1)}km`;
};

// Helper to get category-specific badge and icon configuration
const getIncidentStyle = (category = '') => {
  const cat = category.toLowerCase();
  if (cat.includes('road') || cat.includes('block')) {
    return {
      bgBlock: 'bg-[#FB8C00]',
      cardBg: 'bg-[#FFF8E1]',
      borderColor: 'border-[#FFE082]',
      badgeBg: 'bg-[#FFE0B2] text-[#E65100]',
      icon: <Construction className="w-12 h-12 text-white" strokeWidth={1.8} />,
      label: 'Road Blockage',
    };
  }
  if (cat.includes('accident') || cat.includes('crash')) {
    return {
      bgBlock: 'bg-[#E53935]',
      cardBg: 'bg-[#FFEBEE]',
      borderColor: 'border-[#FFCDD2]',
      badgeBg: 'bg-[#FFCDD2] text-[#B71C1C]',
      icon: <Car className="w-12 h-12 text-white" strokeWidth={1.8} />,
      label: 'Accident',
    };
  }
  if (cat.includes('weather') || cat.includes('flood') || cat.includes('wind') || cat.includes('rain')) {
    return {
      bgBlock: 'bg-[#0288D1]',
      cardBg: 'bg-[#E1F5FE]',
      borderColor: 'border-[#B3E5FC]',
      badgeBg: 'bg-[#B3E5FC] text-[#01579B]',
      icon: <CloudRain className="w-12 h-12 text-white" strokeWidth={1.8} />,
      label: 'Severe Weather',
    };
  }
  return {
    bgBlock: 'bg-[#8E24AA]',
    cardBg: 'bg-[#F3E5F5]',
    borderColor: 'border-[#E1BEE7]',
    badgeBg: 'bg-[#E1BEE7] text-[#4A148C]',
    icon: <ShieldAlert className="w-12 h-12 text-white" strokeWidth={1.8} />,
    label: category || 'Emergency',
  };
};

export default function SafetyAlertTemplate() {
  const { setTitle, setActivePage, safetyData } = usePageTitle();

  useEffect(() => {
    setTitle('Safety Alert');
  }, [setTitle]);

  const routePath = safetyData?.routePath || [];
  const safeDestination = (safetyData?.destination || '')
    .replace(/[^a-zA-Z0-9\s,\-.]/g, '')
    .trim()
    .slice(0, 100);

  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);
  const [roadblocks, setRoadblocks] = useState([]);
  const [roadblocksLoading, setRoadblocksLoading] = useState(true);
  const [passedIncidentIds, setPassedIncidentIds] = useState(new Set());
  const [showAllNationwide, setShowAllNationwide] = useState(false);

  // ── Watch user's real-time GPS position ──
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true }
    );
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn('[SafetyAlert] Geolocation error:', err.message),
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ── Fetch road blockages from the incidents API ──
  useEffect(() => {
    let cancelled = false;
    const loadRoadblocks = async () => {
      setRoadblocksLoading(true);
      try {
        const data = await fetchRoadBlockages();
        if (!cancelled) {
          // The API may return { incidents: [...] } or an array directly
          const incidents = Array.isArray(data) ? data : (data?.incidents || data?.data || []);
          setRoadblocks(incidents);
        }
      } catch (err) {
        console.warn('[SafetyAlert] Failed to fetch road blockages:', err.message);
        if (!cancelled) setRoadblocks([]);
      } finally {
        if (!cancelled) setRoadblocksLoading(false);
      }
    };
    loadRoadblocks();
    return () => { cancelled = true; };
  }, []);



  // ── Fetch weather alerts from database ──
  useEffect(() => {
    let cancelled = false;

    const buildAlertObj = (alert, hasFlood) => {
      const condition = alert.weatherCondition || '';
      const temp = alert.temperature != null ? `${Math.round(alert.temperature)}\u00b0C` : '';
      const wind = alert.windSpeed != null ? `${alert.windSpeed} km/h wind` : '';
      const cityName = alert.district || alert.region || alert.location || safeDestination;

      const badConditions = [
        'thunderstorm', 'drizzle', 'rain', 'heavy rain', 'snow',
        'squall', 'tornado', 'mist', 'fog', 'haze', 'dust', 'sand', 'ash', 'clouds'
      ];
      const isBadWeather = badConditions.some((c) => condition.toLowerCase().includes(c)) || hasFlood;

      const metricLine = [cityName, condition, temp, wind].filter(Boolean).join(' · ');
      const descLine = alert.description || '';
      const floodWarning = hasFlood ? '⚠️ Flood/Landslide risk identified along route.' : '';

      return {
        id: alert._id || `weather-${cityName}`,
        cityName,
        condition,
        temperature: temp,
        windSpeed: wind,
        severity: alert.severity || 'medium',
        title: alert.title || (isBadWeather ? `Weather Alert — ${cityName}` : `Good Weather — ${cityName}`),
        summary: metricLine,
        description: descLine,
        floodWarning,
        isBadWeather,
      };
    };

    const runChecks = async () => {
      setWeatherLoading(true);
      const destination = safeDestination;

      try {
        let hasFlood = false;
        try {
          const floodRes = await checkRouteForFlood(routePath, destination);
          hasFlood = !!floodRes?.isFlood;
        } catch {
          // ignore flood check failure
        }

        const res = await fetchWeatherAlerts(destination);
        const data = res?.data || [];

        if (!cancelled) {
          if (data.length > 0) {
            // Map returned alerts
            const parsed = data.map((item, idx) => buildAlertObj(item, hasFlood && idx === 0));
            setWeatherAlerts(parsed);
          } else if (destination) {
            // Destination specified, but no active weather alert in DB -> conditions are clear
            setWeatherAlerts([
              {
                id: 'clear-destination',
                cityName: destination,
                condition: 'Clear',
                temperature: '',
                windSpeed: '',
                severity: 'low',
                title: 'Good weather',
                summary: `${destination} · Conditions Clear`,
                description: hasFlood ? 'Flood/Landslide alert on route.' : 'No active weather alerts reported for this destination.',
                floodWarning: hasFlood ? '⚠️ Flood/Landslide alert on route.' : '',
                isBadWeather: hasFlood,
              },
            ]);
          } else {
            // No destination & no alerts
            setWeatherAlerts([
              {
                id: 'clear-general',
                cityName: 'Sri Lanka',
                condition: 'Clear',
                temperature: '',
                windSpeed: '',
                severity: 'low',
                title: 'Good weather',
                summary: 'Sri Lanka · Conditions Clear',
                description: 'No active severe weather alerts reported.',
                floodWarning: '',
                isBadWeather: false,
              },
            ]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[SafetyAlert] Weather error:', err.message);
          setWeatherAlerts([
            {
              id: 'no-data',
              cityName: safeDestination || 'Current Route',
              condition: 'N/A',
              title: 'Weather Conditions',
              summary: 'Unable to fetch weather data.',
              description: 'Please proceed with caution.',
              isBadWeather: false,
            },
          ]);
        }
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    };

    runChecks();
    return () => {
      cancelled = true;
    };
  }, [safeDestination, routePath]);

  // ── Segregate Incidents into Route/Area Matches vs Other Nationwide ──
  const { routeIncidents, allIncidents } = useMemo(() => {
    if (roadblocksLoading) return { routeIncidents: [], allIncidents: [] };

    const normDest = safeDestination.toLowerCase();

    // Helper to calculate user distance
    const enrichIncident = (incident) => {
      const incLat = incident.location?.lat ?? incident.latitude ?? incident.lat;
      const incLng = incident.location?.lng ?? incident.longitude ?? incident.lng;
      let distMeters = null;
      if (userPos && incLat != null && incLng != null) {
        distMeters = haversineDistance(userPos.lat, userPos.lng, incLat, incLng);
      }
      return {
        ...incident,
        coordLat: incLat,
        coordLng: incLng,
        userDistanceMeters: distMeters,
      };
    };

    const enriched = roadblocks.map(enrichIncident);

    // Sort all by proximity if userPos is available, otherwise newest first
    enriched.sort((a, b) => {
      if (a.userDistanceMeters != null && b.userDistanceMeters != null) {
        return a.userDistanceMeters - b.userDistanceMeters;
      }
      return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
    });

    const routeMatches = [];
    const otherMatches = [];

    enriched.forEach((incident) => {
      const incLat = incident.coordLat;
      const incLng = incident.coordLng;
      const incDistrict = (incident.district || '').toLowerCase();

      let isRouteMatch = false;

      // 1. Check if incident is within 25km corridor of any point on routePath
      if (routePath.length > 0 && incLat != null && incLng != null) {
        isRouteMatch = routePath.some((pt) => haversineDistance(incLat, incLng, pt.lat, pt.lng) <= 25000);
      }

      // 2. Check if incident district matches destination (e.g. "Colombo", "Galle", etc.)
      if (!isRouteMatch && incDistrict && normDest) {
        if (normDest.includes(incDistrict) || incDistrict.includes(normDest)) {
          isRouteMatch = true;
        }
      }

      // 3. Check if user is within 30km of incident
      if (!isRouteMatch && incident.userDistanceMeters != null && incident.userDistanceMeters <= 30000) {
        isRouteMatch = true;
      }

      if (isRouteMatch) {
        routeMatches.push(incident);
      } else {
        otherMatches.push(incident);
      }
    });

    return { routeIncidents: routeMatches, allIncidents: enriched };
  }, [roadblocks, roadblocksLoading, routePath, userPos, safeDestination]);

  const togglePassed = (id) => {
    setPassedIncidentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const emergencyContacts = [
    { name: 'Police', number: '119' },
    { name: 'Ambulance', number: '1990' },
    { name: 'Tourist police', number: '1912' },
  ];

  // Helper renderer for an incident card
  const renderIncidentCard = (incident, isRouteSpecific = false) => {
    const isPassed = passedIncidentIds.has(incident._id);
    const style = getIncidentStyle(incident.incidentCategory);
    const distText = incident.userDistanceMeters != null ? formatDistance(incident.userDistanceMeters) : null;

    return (
      <div
        key={incident._id}
        className={`rounded-xl shadow-sm overflow-hidden transition-all duration-200 border ${style.borderColor} ${
          isPassed ? 'opacity-60 bg-gray-50' : style.cardBg
        }`}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Left visual icon block */}
          <div
            className={`w-full sm:w-[110px] ${
              isPassed ? 'bg-gray-400' : style.bgBlock
            } flex items-center justify-center p-4 sm:p-0 flex-shrink-0`}
          >
            {style.icon}
          </div>

          {/* Body */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              {/* Header row: Category & District & Proximity badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full ${style.badgeBg}`}>
                    {incident.incidentCategory || 'Incident'}
                  </span>
                  {incident.district && (
                    <span className="text-[13px] font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {incident.district}
                    </span>
                  )}
                  {isRouteSpecific && (
                    <span className="text-[11px] font-medium bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                      On Your Route
                    </span>
                  )}
                </div>

                {distText && (
                  <span className="text-[12px] font-semibold text-slate-600 bg-white/80 px-2.5 py-0.5 rounded-md border border-slate-200">
                    📍 {distText} away
                  </span>
                )}
              </div>

              {/* Title / Description */}
              <h3 className="font-bold text-slate-900 text-[17px] mb-1">
                {incident.incidentCategory} — {incident.district || 'Location Reported'}
              </h3>

              {incident.description ? (
                <p className="text-slate-700 text-[14px] leading-relaxed mb-3">{incident.description}</p>
              ) : (
                <p className="text-slate-600 text-[13px] italic mb-3">
                  Reported incident on {incident.incidentDate || 'recent date'}{' '}
                  {incident.incidentTime ? `at ${incident.incidentTime}` : ''} in {incident.district || 'Sri Lanka'}.
                  Proceed with caution.
                </p>
              )}

              {/* Details & Metadata */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-600 mb-3">
                {incident.referenceNumber && (
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                    Ref: {incident.referenceNumber}
                  </span>
                )}
                {incident.reporterName && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {incident.reporterName}
                  </span>
                )}
                {incident.incidentDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {incident.incidentDate}
                  </span>
                )}
                {incident.incidentTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {incident.incidentTime}
                  </span>
                )}
                <span className="capitalize text-emerald-700 font-semibold flex items-center gap-1">
                  ● Status: {incident.status || 'Reported'}
                </span>
              </div>
            </div>

            {/* Bottom action */}
            <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-200/60">
              <button
                type="button"
                onClick={() => togglePassed(incident._id)}
                className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isPassed
                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isPassed ? 'text-emerald-600' : 'text-slate-400'}`} />
                {isPassed ? 'Passed this location' : 'Mark as passed'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const hasActiveRoute = routePath.length > 0 || !!safeDestination;
  const showNationwideSection = !hasActiveRoute || showAllNationwide || routeIncidents.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 relative overflow-hidden font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        <img src={bottomLogo} alt="Decorative pattern" className="w-full h-full object-cover opacity-60 scale-x-150" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <img src={middle} alt="Ocean background" className="w-full h-full object-cover scale-x-[1.7]" />
        </div>

        <div className="relative z-10 space-y-6 mb-12">
          {/* Header banner if navigating */}
          {safeDestination && (
            <div className="bg-white/85 backdrop-blur-md rounded-xl p-4 shadow-sm border border-white/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-slate-600 text-sm">Destination:</span>
                <span className="font-bold text-slate-800 text-sm">{safeDestination}</span>
              </div>
              {routePath.length > 0 && (
                <span className="text-[12px] bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
                  Route Active
                </span>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              WEATHER ALERTS SECTION
             ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-blue-600" />
              Weather Alerts & Conditions
            </h2>

            {weatherLoading && (
              <div className="rounded-xl bg-white/80 p-5 text-sm text-slate-600 shadow-sm animate-pulse flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Checking weather and flood conditions from database...
              </div>
            )}

            {!weatherLoading && weatherAlerts.map((alert) => {
              const isGoodWeather = !alert.isBadWeather;
              return (
                <div
                  key={alert.id}
                  className={`${
                    isGoodWeather ? 'bg-[#CCF0CC] border border-[#81C784]/30' : 'bg-[#FAF0CC] border border-[#FDE047]/40'
                  } rounded-xl shadow-sm flex overflow-hidden transition-transform hover:scale-[1.01]`}
                  style={{ minHeight: '110px' }}
                >
                  <div className={`w-[110px] ${isGoodWeather ? 'bg-[#66BB6A]' : 'bg-[#FDD94A]'} flex items-center justify-center flex-shrink-0 p-4`}>
                    {isGoodWeather ? (
                      <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="24" fill="white" fillOpacity="0.3" />
                        <path d="M20 33L28 41L44 23" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <AlertTriangle className="w-14 h-14 text-slate-900" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-center">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-black text-[18px]">{alert.title}</h3>
                      {alert.severity && (
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/10 text-black">
                          {alert.severity}
                        </span>
                      )}
                    </div>
                    <div className="text-black text-[14px] font-semibold mb-1">{alert.summary}</div>
                    {alert.description && <div className="text-slate-800 text-[13px] leading-snug">{alert.description}</div>}
                    {alert.floodWarning && (
                      <div className="text-red-700 font-semibold text-[13px] mt-1.5">{alert.floodWarning}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ══════════════════════════════════════════════════════════════
              DATABASE INCIDENTS SECTION
             ══════════════════════════════════════════════════════════════ */}
          <div className="space-y-3 pt-2">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Road Blockages & Safety Incidents
            </h2>

            {roadblocksLoading && (
              <div className="rounded-xl bg-white/80 p-5 text-sm text-slate-600 shadow-sm animate-pulse flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                Loading reported incidents from database...
              </div>
            )}

            {!roadblocksLoading && (
              <>
                {/* 1. If Route is active: Route-specific Incidents */}
                {hasActiveRoute && (
                  <>
                    {routeIncidents.length > 0 ? (
                      <div className="space-y-3">
                        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-sm flex items-center gap-2 font-medium">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>
                            Found <strong>{routeIncidents.length}</strong> incident(s) directly on or near your route.
                          </span>
                        </div>
                        {routeIncidents.map((inc) => renderIncidentCard(inc, true))}
                      </div>
                    ) : (
                      /* Clear route banner */
                      <div className="bg-[#CCF0CC] rounded-xl shadow-sm flex overflow-hidden border border-[#81C784]/30" style={{ minHeight: '100px' }}>
                        <div className="w-[100px] bg-[#66BB6A] flex items-center justify-center flex-shrink-0">
                          <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="24" fill="white" fillOpacity="0.3" />
                            <path d="M20 33L28 41L44 23" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-center">
                          <h3 className="font-bold text-black text-[18px] mb-1">Route is clear</h3>
                          <div className="text-slate-800 text-[14px]">
                            No road blockages or accidents reported directly along your route{safeDestination ? ` to ${safeDestination}` : ''}.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Toggle button for other incidents nationwide */}
                    {routeIncidents.length > 0 && allIncidents.length > routeIncidents.length && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAllNationwide((prev) => !prev)}
                          className="w-full bg-white/80 hover:bg-white text-slate-700 font-semibold py-2.5 px-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
                        >
                          {showAllNationwide ? (
                            <>
                              Hide other nationwide incidents
                              <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              View all other active incidents in Sri Lanka ({allIncidents.length - routeIncidents.length})
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* 2. Nationwide incidents list */}
                {showNationwideSection && (
                  <div className="space-y-3 pt-2">
                    {hasActiveRoute && (
                      <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide px-1">
                        {routeIncidents.length === 0 ? 'All Reported Incidents in Sri Lanka' : 'Other Nationwide Incidents'}
                      </h3>
                    )}

                    {/* Filter out already shown route incidents if nationwide list is expanded */}
                    {(hasActiveRoute && routeIncidents.length > 0
                      ? allIncidents.filter((inc) => !routeIncidents.some((r) => r._id === inc._id))
                      : allIncidents
                    ).map((inc) => renderIncidentCard(inc, false))}

                    {allIncidents.length === 0 && (
                      <div className="bg-white/70 rounded-xl p-6 text-center text-slate-500 text-sm">
                        No incidents currently recorded in the database.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            EMERGENCY CONTACTS
           ══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-xl p-8 relative z-10 border border-white/80">
          <h2 className="text-center text-red-600 font-bold text-xl mb-6 flex items-center justify-center gap-2">
            <Phone className="w-6 h-6 text-red-600" />
            Emergency Contacts
          </h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                <div className="bg-red-100 rounded-full p-3">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-slate-800">{contact.name}: </span>
                  <a href={`tel:${contact.number}`} className="text-red-600 font-bold text-lg hover:underline">
                    {contact.number}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActivePage('start')}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
          >
            Back
          </button>
        </div>
      </main>
    </div>
  );
}
