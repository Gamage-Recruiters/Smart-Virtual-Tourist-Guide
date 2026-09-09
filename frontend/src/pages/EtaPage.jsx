import { useEffect, useRef, useState } from 'react';
import middle from '../assets/middle.png';
import carIcon from '../assets/carIcon.png';
import clockIcon from '../assets/clockIcon.png';
import busIcon from '../assets/busIcon.png';
import bikeIcon from '../assets/bikeIcon.png';
import manIcon from '../assets/manIcon.png';
import { useLocationContext } from '../contexts/LocationContext';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useAppNavigate } from '../hooks/useAppNavigate';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRoute } from '../utils/mapServices';
import '../utils/leafletSetup';

const MODE_ICONS = {
  drive: carIcon,
  bike: bikeIcon,
  transit: busIcon,
  walk: manIcon,
};

const MODE_LABELS = {
  drive: 'Car',
  bike: 'Bike',
  transit: 'Bus',
  walk: 'Walking',
};

// Fuel consumption rates (L per 100km)
const FUEL_RATES = {
  drive: 8,
  bike: 3,
  transit: 0,
  walk: 0,
};

const FUEL_PRICE_PER_LITER = 365; // Rs per liter (Sri Lanka avg)

const parseDistanceKm = (distText = '') => {
  const val = parseFloat(distText.replace(/[^0-9.]/g, '')) || 0;
  if (distText.toLowerCase().includes('m') && !distText.toLowerCase().includes('km')) {
    return val / 1000;
  }
  return val;
};

const getArrivalTime = (durationMinutes) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + (durationMinutes || 0));
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const getTrafficColor = (traffic) => {
  if (traffic === 'Heavy traffic') return '#EF4444';
  if (traffic === 'Moderate traffic') return '#F59E0B';
  return '#22C55E';
};

const getTrafficLabel = (traffic) => {
  if (traffic === 'Heavy traffic') return 'Heavy';
  if (traffic === 'Moderate traffic') return 'Moderate';
  return 'Low';
};

const EtaPage = () => {
  const { searchedPlace, userLocation } = useLocationContext();
  const { etaData } = useNavigationContext();
  const appNavigate = useAppNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);

  const distance = etaData?.distance || '--';
  const duration = etaData?.duration || '--';
  const durationMinutes = etaData?.durationMinutes || 0;
  const traffic = etaData?.traffic || 'Light traffic';
  const mode = etaData?.mode || 'drive';

  const distKm = parseDistanceKm(distance);
  const fuelRate = FUEL_RATES[mode] || 0;
  const fuelEstimate = fuelRate > 0 ? ((distKm * fuelRate) / 100).toFixed(1) : '0';
  const fuelCost = fuelRate > 0 ? Math.round(parseFloat(fuelEstimate) * FUEL_PRICE_PER_LITER) : 0;
  const arrivalTime = getArrivalTime(durationMinutes);

  // Road condition — derive from traffic + weather (simplified)
  const roadCondition = traffic === 'Heavy traffic' ? 'Congested' : 'Clear';

  useEffect(() => {
    const destLoc = searchedPlace?.location || searchedPlace?.geometry?.location;
    const originLat = userLocation?.lat != null ? (typeof userLocation.lat === 'function' ? userLocation.lat() : userLocation.lat) : null;
    const originLng = userLocation?.lng != null ? (typeof userLocation.lng === 'function' ? userLocation.lng() : userLocation.lng) : null;
    const hasOrigin = originLat != null && originLng != null;

    const initialCenter = hasOrigin
      ? [originLat, originLng]
      : destLoc
        ? [typeof destLoc.lat === 'function' ? destLoc.lat() : destLoc.lat, typeof destLoc.lng === 'function' ? destLoc.lng() : destLoc.lng]
        : [7.8731, 80.7718];

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: initialCenter,
      zoom: hasOrigin || destLoc ? 10 : 7,
      zoomControl: false,
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    if (hasOrigin && destLoc) {
      const modeMap = { drive: 'driving', bike: 'cycling', walk: 'foot', transit: 'driving' };
      const osrmProfile = modeMap[mode] || 'driving';
      const destLat = typeof destLoc.lat === 'function' ? destLoc.lat() : destLoc.lat;
      const destLng = typeof destLoc.lng === 'function' ? destLoc.lng() : destLoc.lng;

      getRoute(originLat, originLng, destLat, destLng, osrmProfile).then((osrmRoutes) => {
        if (osrmRoutes && osrmRoutes.length > 0) {
          const allRoutes = osrmRoutes.map((route, idx) => {
            const durationMins = Math.round(route.duration / 60);
            const distM = route.distance;
            const distText = distM >= 1000 ? `${(distM / 1000).toFixed(1)} km` : `${Math.round(distM)} m`;
            
            return {
              index: idx,
              duration: `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`,
              durationMinutes: durationMins,
              distance: distText,
              summary: route.summary || '',
              traffic: 'Light traffic',
              coordinates: (route.geometry?.coordinates || []).map(c => [c[1], c[0]])
            };
          });

          allRoutes.sort((a, b) => a.durationMinutes - b.durationMinutes);
          setAlternativeRoutes(allRoutes);

          const preferredIndex = etaData?.selectedRouteIndex ?? 0;
          const safeIndex = preferredIndex < osrmRoutes.length ? preferredIndex : 0;
          const selectedRoute = allRoutes[safeIndex];

          if (selectedRoute && selectedRoute.coordinates.length > 0) {
            L.polyline(selectedRoute.coordinates, {
              color: '#1A73E8',
              weight: 5,
              opacity: 1
            }).addTo(map);

            const bounds = L.latLngBounds(selectedRoute.coordinates);
            map.fitBounds(bounds, { padding: [30, 30] });

            // "You" Marker
            const originLoc = selectedRoute.coordinates[0];
            const youIcon = L.divIcon({
              className: '',
              html: `
                <div style="position:relative;display:flex;align-items:center;justify-content:center;">
                  <div style="width:20px;height:20px;border-radius:50%;background:#104bc0;border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.3);"></div>
                  <div class="map-you-label" style="position:absolute;top:22px;color:#104bc0;font-weight:bold;font-size:12px;">You</div>
                </div>
              `,
              iconSize: [20, 40],
              iconAnchor: [10, 10]
            });
            L.marker(originLoc, { icon: youIcon }).addTo(map);

            // "Full Overview" Label
            const midIndex = Math.floor(selectedRoute.coordinates.length / 2);
            const midLoc = selectedRoute.coordinates[midIndex];
            const midIcon = L.divIcon({
              className: '',
              html: `
                <div style="background:linear-gradient(90deg,#FFFFFF 0%,#A0DBFF 100%);border-radius:10px;box-shadow:0 2px 4px rgba(0,0,0,0.2);padding:8px 20px;font-family:Inter,sans-serif;font-size:13px;font-weight:600;color:#111827;white-space:nowrap;transform:translate(-50%,-50%);">
                  Full Overview
                </div>
              `,
              iconSize: [0, 0],
              iconAnchor: [0, 0]
            });
            L.marker(midLoc, { icon: midIcon, interactive: false }).addTo(map);
          }
        }
      }).catch(err => {
        console.error('Failed to load OSRM route on EtaPage:', err);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full bg-[#edf7ff]" style={{ minHeight: 'calc(100vh - 112px)' }}>
      {/* Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <img src={middle} alt="Ocean background" className="w-full h-full object-cover scale-x-[1.7]" />
      </div>

      <div className="relative z-10 w-full" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── ETA Info Card ── */}
        <div style={{
          background: 'linear-gradient(90deg, #FFFFFF 0%, #A0DBFF 100%)',
          borderRadius: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          padding: '20px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '500px',
          margin: '0 auto',
          width: '100%',
        }}>
          {/* Distance row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src={MODE_ICONS[mode] || carIcon} alt="transport" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: '26px', color: '#111827', fontFamily: "'Inter', sans-serif" }}>{distance}</span>
          </div>
          {/* ETA row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src={clockIcon} alt="clock" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: '26px', color: '#111827', fontFamily: "'Inter', sans-serif" }}>ETA: {duration}</span>
          </div>
          {/* Arrival time */}
          <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: "'Inter', sans-serif", marginTop: '4px' }}>
            Arrival: {arrivalTime}
          </div>
        </div>

        {/* ── Map ── */}
        <div style={{
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          height: '340px',
          width: '100%',
        }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* ── Traffic & Road Condition Card ── */}
        <div style={{
          background: 'linear-gradient(90deg, #FFFFFF 0%, #A0DBFF 100%)',
          borderRadius: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
        }}>
          {/* Traffic level indicator */}
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: getTrafficColor(traffic),
            boxShadow: `0 0 12px ${getTrafficColor(traffic)}80`,
            flexShrink: 0,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>Traffic Level:</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif" }}>{getTrafficLabel(traffic)}</div>
          </div>
          <div style={{ borderLeft: '1px solid #D1D5DB', paddingLeft: '20px' }}>
            <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>Road Condition:</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif" }}>{roadCondition}</div>
          </div>
        </div>

        {/* ── Fuel & Transport Card ── */}
        <div style={{
          background: 'linear-gradient(90deg, #FFFFFF 0%, #A0DBFF 100%)',
          borderRadius: '14px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>
          {/* Fuel Estimate */}
          <div>
            <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>Fuel Estimate</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>
              {fuelRate > 0 ? `${fuelEstimate}L` : 'N/A'}
            </div>
          </div>
          {/* Estimated Fuel Cost */}
          <div>
            <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>Estimated Fuel cost</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>
              {fuelRate > 0 ? `RS:${fuelCost.toLocaleString()}` : 'N/A'}
            </div>
          </div>
          {/* Transport Type */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>Transport Type:</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>{MODE_LABELS[mode] || 'Car'}</div>
            <img src={MODE_ICONS[mode] || carIcon} alt="transport" style={{ width: '28px', height: '28px', objectFit: 'contain', margin: '4px auto 0' }} />
          </div>
        </div>

        {/* ── Alternative Routes Card ── */}
        {alternativeRoutes.length > 0 && (
          <div style={{
            background: 'linear-gradient(90deg, #FFFFFF 0%, #A0DBFF 100%)',
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            padding: '20px 28px',
            width: '100%',
          }}>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '18px',
              color: '#111827',
              marginBottom: '16px',
            }}>
              Alternative Routes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '12px' }}>
              {alternativeRoutes.map((route, idx) => {
                const isFastest = idx === 0;
                const isCurrent = route.durationMinutes === durationMinutes;
                const trafficTag = route.traffic === 'Light traffic' ? 'less traffic'
                  : route.traffic === 'Moderate traffic' ? 'moderate traffic'
                  : 'heavy traffic';

                // Build the tag string
                const tags = [];
                if (isFastest) tags.push('fastest');
                if (isCurrent) tags.push('Current');
                if (!isFastest) tags.push(trafficTag);
                const tagStr = tags.length > 0 ? ` (${tags.join(', ')})` : '';

                return (
                  <div key={idx} style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: '#111827',
                    fontWeight: isCurrent ? 700 : 400,
                    lineHeight: '1.6',
                  }}>
                    <span style={{ fontWeight: 700 }}>Route {idx + 1}:</span>
                    <span>{route.duration}</span>
                    <span style={{
                      fontWeight: 600,
                      color: isCurrent ? '#1A73E8' : '#6B7280',
                    }}>{tagStr}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '120px', // Creates space between the centered buttons
          width: '100%',
          marginTop: '10px',
          marginBottom: '40px',
          padding: '0 20px',
        }}>
          <button
            type="button"
            onClick={() => appNavigate('direction')}
            style={{
              background: '#2B5BA9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              minWidth: '140px',
            }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => appNavigate('start')}
            style={{
              background: '#2B5BA9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              minWidth: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span>Start</span>
            <span>Navigation</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default EtaPage;
