import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import bottomLogo from '../../assets/NavigationAndMapping/bottomLogo.png';
import middle from '../../assets/NavigationAndMapping/middle.png';
import { usePageTitle } from '../../context/PageTitleContext';
import { fetchRoadBlockages, fetchWeatherAlerts } from '../../services/api';
import { checkRouteForFlood } from '../../utils/floodService';

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
  if (metres < 1000) return `${Math.round(metres)}m`;
  return `${(metres / 1000).toFixed(1)}km`;
};

export default function SafetyAlertTemplate() {
  const { setTitle, setActivePage, safetyData } = usePageTitle();

  useEffect(() => {
    setTitle('Safety Alert');
  }, [setTitle]);

  const routePath = safetyData?.routePath || [];
  const safeDestination = (safetyData?.destination || '').replace(/[^a-zA-Z0-9\s,\-.]/g, '').trim().slice(0, 100);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);
  const [roadblocks, setRoadblocks] = useState([]);
  const [roadblocksLoading, setRoadblocksLoading] = useState(true);

  const [currentRoadblockIndex, setCurrentRoadblockIndex] = useState(0);

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
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
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



  const [emergencyContacts] = useState([
    { name: 'Police', number: '119' },
    { name: 'Ambulance', number: '1990' },
    { name: 'Tourist police', number: '1912' }
  ]);

  const routeSummary = useMemo(() => {
    if (!safetyData) return '';
    return `${safetyData.origin ? 'From your current location' : 'Route'} to ${safeDestination || 'destination'}`;
  }, [safetyData]);

  useEffect(() => {
    let cancelled = false;

    const buildAlert = (alert, hasFlood) => {
      const condition = alert.weatherCondition || '';
      const temp = alert.temperature != null ? `${Math.round(alert.temperature)}\u00b0C` : '';
      const cityName = alert.location || safeDestination;

      const badConditions = ['Thunderstorm', 'Drizzle', 'Rain', 'Heavy Rain', 'Snow', 'Squall', 'Tornado', 'Mist', 'Fog', 'Haze', 'Dust', 'Sand', 'Ash', 'Clouds'];
      const isBadWeather = badConditions.some((c) => condition.toLowerCase().includes(c.toLowerCase())) || hasFlood;

      const summary = [cityName, condition, temp].filter(Boolean).join(' · ');
      const floodWarning = hasFlood ? 'Flood/Landslide alert on route.' : '';

      const descriptionLines = [summary, alert.description, floodWarning].filter(Boolean).join('\n');

      return {
        id: 'weather-live',
        type: 'weather',
        alertStyle: 'square-card',
        title: isBadWeather ? 'Weather alert' : 'Good weather',
        description: descriptionLines,
        isBadWeather,
      };
    };

    const runChecks = async () => {
      setLoading(true);
      const destination = safeDestination;

      try {
        const floodRes = await checkRouteForFlood(routePath, destination);
        const hasFlood = floodRes.isFlood;

        const res = await fetchWeatherAlerts(destination);
        const data = res?.data || [];
        if (!cancelled) {
          if (data.length > 0) {
            setAlerts([buildAlert(data[0], hasFlood)]);
          } else if (hasFlood) {
            setAlerts([{ 
              id: 'flood', 
              type: 'weather', 
              alertStyle: 'square-card', 
              title: 'Weather alert', 
              description: 'Flood/Landslide alert on route.',
              isBadWeather: true
            }]);
          } else {
            // No active weather alert for this location — conditions are clear
            setAlerts([{ 
              id: 'clear', 
              type: 'weather', 
              alertStyle: 'square-card', 
              title: 'Good weather', 
              description: `${safeDestination ? safeDestination + ' · ' : ''}No active weather alerts.`,
              isBadWeather: false
            }]);
          }
        }
      } catch {
        if (!cancelled) {
          setAlerts([{ id: 'no-data', type: 'weather', alertStyle: 'square-card', title: 'Weather conditions', description: 'Unable to fetch weather data.', isBadWeather: false }]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    runChecks();
    return () => { cancelled = true; };
  }, [safetyData?.destination, routePath]);

  // ── Filter crime alerts near the user's route (within 5km), sorted by distance ──
  const nearbyRoadblocks = useMemo(() => {
    if (roadblocksLoading) return [];
    const filtered = roadblocks.filter((incident) => {
      const incLat = incident.location?.lat ?? incident.latitude ?? incident.lat;
      const incLng = incident.location?.lng ?? incident.longitude ?? incident.lng;

      if (incLat != null && incLng != null) {
        if (routePath.length > 0) {
          return routePath.some((pt) => haversineDistance(incLat, incLng, pt.lat, pt.lng) <= 5000);
        }
        if (userPos) {
          return haversineDistance(incLat, incLng, userPos.lat, userPos.lng) <= 5000;
        }
      }

      // No coords — fall back to district name matching destination
      const incDistrict = (incident.district || '').toLowerCase();
      if (incDistrict && safeDestination) {
        return safeDestination.toLowerCase().includes(incDistrict) || incDistrict.includes(safeDestination.toLowerCase());
      }

      return false;
    });

    if (userPos) {
      filtered.sort((a, b) => {
        const aLat = a.location?.lat ?? a.latitude ?? a.lat;
        const aLng = a.location?.lng ?? a.longitude ?? a.lng;
        const bLat = b.location?.lat ?? b.latitude ?? b.lat;
        const bLng = b.location?.lng ?? b.longitude ?? b.lng;
        const dA = (aLat != null && aLng != null) ? haversineDistance(userPos.lat, userPos.lng, aLat, aLng) : Infinity;
        const dB = (bLat != null && bLng != null) ? haversineDistance(userPos.lat, userPos.lng, bLat, bLng) : Infinity;
        return dA - dB;
      });
    }

    return filtered;
  }, [roadblocks, roadblocksLoading, routePath, userPos, safeDestination]);



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 relative overflow-hidden font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
        <img src={bottomLogo} alt="Decorative pattern" className="w-full h-full object-cover opacity-60 scale-x-150" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src={middle} alt="Ocean background" className="w-full h-full object-cover scale-x-[1.7]" />
        </div>

        <div className="relative z-10 space-y-4 mb-12">
          {loading && (
            <div className="rounded-xl bg-white/80 p-4 text-sm text-slate-600 shadow-lg">Checking route conditions...</div>
          )}

          {!loading && alerts.map((alert) => {
            if (alert.alertStyle === 'square-card') {
              const isGoodWeather = !alert.isBadWeather;
              return (
                <div key={alert.id} className={`${isGoodWeather ? 'bg-[#CCF0CC] border border-[#81C784]/20' : 'bg-[#FAF0CC] border border-[#FDE047]/20'} rounded-lg shadow-sm flex overflow-hidden transition-transform hover:scale-[1.02]`} style={{ minHeight: '110px' }}>
                  <div className={`w-[110px] ${isGoodWeather ? 'bg-[#66BB6A]' : 'bg-[#FDD94A]'} flex items-center justify-center flex-shrink-0`}>
                    {isGoodWeather ? (
                      <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="24" fill="white" fillOpacity="0.3" />
                        <path d="M20 33L28 41L44 23" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <AlertTriangle className="w-14 h-14 text-black" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <h3 className="font-bold text-black text-[19px] mb-3">{alert.title}</h3>
                    <div className="text-black text-[15px] leading-snug">
                      {alert.description.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={alert.id} className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl p-6 shadow-lg flex items-start gap-4 transition-transform hover:scale-[1.02]">
                <div className="bg-yellow-400 rounded-full p-3 text-gray-800">{alert.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{alert.title}</h3>
                  <p className="text-gray-700 text-sm">{alert.description}</p>
                </div>
              </div>
            );
          })}

          {/* ── Route Incidents (from database) ── */}
          {!loading && !roadblocksLoading && (() => {
            const hasRoadblocks = nearbyRoadblocks.length > 0;
            const safeIndex = Math.min(currentRoadblockIndex, nearbyRoadblocks.length - 1);
            const incident = hasRoadblocks ? nearbyRoadblocks[safeIndex] : null;

            if (hasRoadblocks) {
              const incLat = incident.location?.lat ?? incident.latitude ?? incident.lat;
              const incLng = incident.location?.lng ?? incident.longitude ?? incident.lng;
              let blockDistance = '';
              if (userPos && incLat != null && incLng != null) {
                blockDistance = formatDistance(
                  haversineDistance(userPos.lat, userPos.lng, incLat, incLng)
                );
              }
              const locationName = incident.district || '';
              const description = incident.description || '';
              const title = incident.incidentCategory || 'Incident';

              return (
                <div className="space-y-2">
                  {safeIndex > 0 && (
                    <div className="flex flex-col gap-1">
                      {nearbyRoadblocks.slice(0, safeIndex).map((passed, idx) => (
                        <div
                          key={passed._id || passed.id || `roadblock-passed-${idx}`}
                          className="rounded-lg flex items-center gap-3 px-4 py-2 bg-gray-100 border border-gray-200 opacity-70"
                        >
                          <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="24" fill="#9CA3AF" fillOpacity="0.4" />
                            <path d="M20 33L28 41L44 23" stroke="#6B7280" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-gray-500 text-[13px]">
                          ✓ You passed: <span className="font-medium">{passed.incidentCategory || 'Incident'}</span>{passed.district ? ` — ${passed.district}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-[#FAF0CC] rounded-lg shadow-sm flex overflow-hidden transition-transform hover:scale-[1.02] border border-[#FDE047]/20" style={{ minHeight: '110px' }}>
                    <div className="w-[110px] bg-[#FDD94A] flex items-center justify-center flex-shrink-0">
                      <svg width="52" height="60" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="50" width="40" height="7" rx="2" fill="#444"/>
                        <rect x="8" y="50" width="36" height="4" rx="1.5" fill="#555"/>
                        <path d="M18 52L24 8H28L34 52H18Z" fill="#FF6D00"/>
                        <path d="M18.5 52L24.5 8H26L20.5 52H18.5Z" fill="#E65100" opacity="0.35"/>
                        <rect x="21" y="19" width="10" height="5" rx="1" fill="white" opacity="0.95"/>
                        <rect x="20" y="32" width="12" height="5" rx="1" fill="white" opacity="0.95"/>
                        <ellipse cx="26" cy="7" rx="3" ry="1.8" fill="#FF8F00"/>
                      </svg>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-black text-[19px]">
                          {title}{blockDistance ? ` — ${blockDistance} away` : ''}
                        </h3>
                        {nearbyRoadblocks.length > 1 && (
                          <span className="text-[12px] text-gray-500 ml-2 whitespace-nowrap">{safeIndex + 1} / {nearbyRoadblocks.length}</span>
                        )}
                      </div>
                      <div className="text-black text-[15px] leading-snug">
                        {locationName && <div>{locationName}</div>}
                        <div>{description}</div>
                      </div>
                      {safeIndex < nearbyRoadblocks.length - 1 && (
                        <button
                          type="button"
                          onClick={() => setCurrentRoadblockIndex(safeIndex + 1)}
                          className="self-start mt-3 text-[13px] bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-3 py-1 rounded-lg transition-colors"
                        >
                          I passed this location →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <>
                {/* ── Road is clear (no blockages from database) ── */}
                {!hasRoadblocks && (
                  <div className="bg-[#CCF0CC] rounded-lg shadow-sm flex overflow-hidden transition-transform hover:scale-[1.02] border border-[#81C784]/20" style={{ minHeight: '110px' }}>
                    <div className="w-[110px] bg-[#66BB6A] flex items-center justify-center flex-shrink-0">
                      <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="24" fill="white" fillOpacity="0.3" />
                        <path d="M20 33L28 41L44 23" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <h3 className="font-bold text-black text-[19px] mb-3">No incidents on route</h3>
                      <div className="text-black text-[15px] leading-snug">
                        <div>No incidents reported near your route.</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })()}


        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
          <h2 className="text-center text-red-600 font-bold text-xl mb-6">Emergency contact</h2>
          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-gray-200 rounded-full p-3">
                  <Phone className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{contact.name}: </span>
                  <span className="text-gray-700 font-bold">{contact.number}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActivePage('start')}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Back
          </button>
        </div>
      </main>

    </div>
  );
}
