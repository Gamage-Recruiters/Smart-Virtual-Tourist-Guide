import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import MapContainer from '../../components/safety/MapContainer';
import RouteInfoPanel from '../../components/safety/RouteInfoPanel';
import { useGeolocation } from '../../hooks/useGeolocation';
import { fetchAllRoutes } from '../../services/routingService';


export default function NavigationDirectionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Destination from URL query params
  const destLat = parseFloat(searchParams.get('destLat'));
  const destLng = parseFloat(searchParams.get('destLng'));
  const destName = decodeURIComponent(searchParams.get('name') || 'Destination');
  const destType = searchParams.get('type') || 'location';

  // State
  const [activeMode, setActiveMode] = useState('car');
  const [allRoutes, setAllRoutes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Origin from GPS
  const { location } = useGeolocation();
  const originLat = location.latitude;
  const originLng = location.longitude;

  // Fetch all routes once we have both origin and destination
  useEffect(() => {
    if (!originLat || !originLng || !destLat || !destLng) return;

    let cancelled = false;
    const fetchRoutes = async () => {
      setLoading(true);
      setError(null);

      try {
        const routes = await fetchAllRoutes(originLat, originLng, destLat, destLng);
        if (!cancelled) {
          setAllRoutes(routes);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch routes:', err);
          setError('Could not calculate routes. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchRoutes();

    return () => { cancelled = true; };
  }, [originLat, originLng, destLat, destLng]);

  // Current route for the active mode
  const routeData = allRoutes[activeMode] || null;

  // Build estimates object for the mode tabs
  const allEstimates = useMemo(() => {
    const est = {};
    Object.entries(allRoutes).forEach(([key, val]) => {
      if (val) {
        est[key] = { duration: val.duration, distance: val.distance };
      }
    });
    return est;
  }, [allRoutes]);

  // Polyline for the active route
  const polyline = routeData?.geometry || null;

  // Polyline colour per mode
  const polylineColor = activeMode === 'foot' ? '#16a34a' : activeMode === 'bike' ? '#f59e0b' : '#2563EB';

  // Marker icons
  const originIcon = useMemo(() => L.divIcon({
    className: '',
    html: `<div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:rgba(34,197,94,0.25);animation:pulse-ring 1.8s ease-out infinite"></div>
      <div style="position:relative;width:14px;height:14px;border-radius:50%;background:#16a34a;border:2.5px solid #fff;box-shadow:0 0 0 2px rgba(22,163,74,0.5),0 2px 6px rgba(0,0,0,0.3)"></div>
      <style>@keyframes pulse-ring{0%{transform:scale(0.6);opacity:1}100%{transform:scale(2.2);opacity:0}}</style>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
  }), []);

  const destIcon = useMemo(() => {
    const pinColor = destType === 'hospital' ? '#DC2626' : '#1E3A8A';
    return L.divIcon({
      className: '',
      html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:44px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
          <path d="M18 0C8.06 0 0 7.6 0 17c0 12.75 18 27 18 27s18-14.25 18-27C36 7.6 27.94 0 18 0z" fill="${pinColor}"/>
          <circle cx="18" cy="16" r="11" fill="white"/>
          ${destType === 'hospital'
          ? `<rect x="15" y="9" width="6" height="14" rx="1" fill="${pinColor}"/><rect x="11" y="13" width="14" height="6" rx="1" fill="${pinColor}"/>`
          : `<path d="M18 7l2.5 3.5H24l-3 3.5 1.5 4-4.5-2.5L13.5 18l1.5-4-3-3.5h3.5z" fill="${pinColor}"/><circle cx="18" cy="16" r="3" fill="${pinColor}" opacity="0.9"/>`
        }
        </svg>
      </div>`,
      iconSize: [36, 44],
      iconAnchor: [18, 44],
      popupAnchor: [0, -40],
    });
  }, [destType]);

  // Build markers array
  const markers = useMemo(() => {
    const m = [];
    if (originLat && originLng) {
      m.push({
        id: 'origin',
        lat: originLat,
        lng: originLng,
        icon: originIcon,
        popup: '<strong>📍 Your Current Location</strong>',
      });
    }
    if (destLat && destLng) {
      m.push({
        id: 'destination',
        lat: destLat,
        lng: destLng,
        icon: destIcon,
        popup: `<strong>${destName}</strong>`,
      });
    }
    return m;
  }, [originLat, originLng, destLat, destLng, originIcon, destIcon, destName]);

  // Map center — midpoint between origin and destination, or just destination
  const mapCenter = useMemo(() => {
    if (originLat && originLng && destLat && destLng) {
      return [(originLat + destLat) / 2, (originLng + destLng) / 2];
    }
    if (destLat && destLng) return [destLat, destLng];
    if (originLat && originLng) return [originLat, originLng];
    return [7.8731, 80.7718]; // Sri Lanka center fallback
  }, [originLat, originLng, destLat, destLng]);

  // Handlers
  const handleStartNavigation = useCallback(() => {
    const modeMap = { car: 'driving', bike: 'bicycling', foot: 'walking' };
    const gmapsMode = modeMap[activeMode] || 'driving';
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=${gmapsMode}`;
    window.open(url, '_blank');
  }, [activeMode, originLat, originLng, destLat, destLng]);

  const handleShare = useCallback(async () => {
    const text = `Directions to ${destName}: https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Directions to ${destName}`, text });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Directions link copied to clipboard!');
    }
  }, [destName, destLat, destLng]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Destination type label


  return (
    <div className="min-h-screen bg-[#F0F4F8] pb-12 font-sans relative">
      {/* Back button on the top left of the page */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-2 top-2 sm:left-4 sm:top-4 md:left-8 md:top-8 z-40 flex h-9 w-9 items-center justify-center text-xl font-bold text-slate-700 hover:text-slate-900 transition-colors"
        style={{ zIndex: 1001 }}
        aria-label="Go back"
      >
        &larr;
      </button>

      {/* Main content container shifted downwards */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-8 mt-12 sm:mt-16 md:mt-20 space-y-6">
        {/* Map Container styled like EmergencyCallPage */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 h-[300px] sm:h-[400px] md:h-[450px]">
          <div className="h-full rounded-lg overflow-hidden relative">
            {!destLat || !destLng ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                <p>Invalid destination coordinates</p>
              </div>
            ) : (
              <MapContainer
                center={mapCenter}
                zoom={13}
                markers={markers}
                polyline={polyline}
                polylineColor={polylineColor}
                minHeight="100%"
                className="rounded-none"
              />
            )}

            {/* Loading overlay */}
            {!originLat && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-30">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-slate-500 font-medium">Getting your location...</p>
                </div>
              </div>
            )}

            {/* Error overlay */}
            {error && (
              <div className="absolute bottom-4 left-4 right-4 z-30">
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 shadow-md">
                  {error}
                </div>
              </div>
            )}

            {/* Location and Destination box on the top right of the map */}
            <div
              className="absolute right-2 top-2 sm:right-4 sm:top-4 z-40 flex items-start gap-2 border border-slate-300 rounded-md p-2 bg-white shadow-md max-w-[200px] sm:max-w-[280px] w-full md:max-w-xs text-left"
              style={{ zIndex: 1001 }}
            >
              {/* Dots connector */}
              <div className="flex flex-col items-center pt-1 shrink-0" style={{ width: '16px' }}>
                {/* Origin dot */}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#2563EB',
                    border: '1.5px solid #93c5fd',
                  }}
                />
                {/* Dotted line */}
                <div
                  style={{
                    width: '1px',
                    height: '14px',
                    backgroundImage: 'repeating-linear-gradient(to bottom, #94a3b8 0, #94a3b8 2px, transparent 2px, transparent 4px)',
                  }}
                />
                {/* Destination pin */}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#DC2626',
                    border: '1.5px solid #fca5a5',
                  }}
                />
              </div>

              {/* Labels */}
              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                {/* Origin */}
                <div className="flex items-center">
                  <span className="text-[11px] text-slate-600 font-medium truncate">
                    {originLat ? 'Your location' : 'Locating...'}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-b border-slate-200 my-0.5" />

                {/* Destination */}
                <div className="flex items-center">
                  <span className="text-[11px] text-slate-800 font-semibold truncate">
                    {destName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom panel: Route info + mode selector + Start button */}
        <div className="z-20 relative bg-[#F0F4F8]">
          <RouteInfoPanel
            activeMode={activeMode}
            routeData={routeData}
            allEstimates={allEstimates}
            onModeChange={setActiveMode}
            onStart={handleStartNavigation}
            onShare={handleShare}
            onClose={handleClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
