import { useEffect, useRef, useState } from 'react';
import middle from '../assets/middle.png';
import carIcon from '../assets/carIcon.png';
import clockIcon from '../assets/clockIcon.png';
import busIcon from '../assets/busIcon.png';
import bikeIcon from '../assets/bikeIcon.png';
import manIcon from '../assets/manIcon.png';
import { usePageTitle } from '../contexts/PageTitleContext';
import { fetchRoute } from '../utils/geoapifyService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const FUEL_RATES = { drive: 8, bike: 3, transit: 0, walk: 0 };
const FUEL_PRICE_PER_LITER = 365;

const parseDistanceKm = (distText = '') => {
  const val = parseFloat(String(distText).replace(/[^0-9.]/g, '')) || 0;
  if (String(distText).toLowerCase().includes('m') && !String(distText).toLowerCase().includes('km')) {
    return val / 1000;
  }
  return val;
};

const getArrivalTime = (durationMinutes) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + (durationMinutes || 0));
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const extractCoords = (val) => {
  if (!val) return null;
  if (typeof val.lat === 'function' && typeof val.lng === 'function') {
    return { lat: Number(val.lat()), lng: Number(val.lng()) };
  }
  if (typeof val.lat === 'number' && typeof val.lng === 'number') {
    return { lat: val.lat, lng: val.lng };
  }
  if (typeof val.lat === 'number' && typeof val.lon === 'number') {
    return { lat: val.lat, lng: val.lon };
  }
  if (typeof val.latitude === 'number' && typeof val.longitude === 'number') {
    return { lat: val.latitude, lng: val.longitude };
  }
  if (val.geometry?.location) return extractCoords(val.geometry.location);
  if (val.location) return extractCoords(val.location);
  return null;
};

const EtaPage = () => {
  const { etaData, searchedPlace, userLocation, setActivePage, setUserLocation } = usePageTitle();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayersRef = useRef([]);
  const markerLayersRef = useRef([]);

  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(etaData?.selectedRouteIndex ?? 0);
  const [loading, setLoading] = useState(false);

  const mode = etaData?.mode || 'drive';
  const fuelRate = FUEL_RATES[mode] || 0;

  // Active route values
  const activeRoute = alternativeRoutes[selectedRouteIdx] || null;
  const displayDuration = activeRoute?.duration || etaData?.duration || '--';
  const displayDistance = activeRoute?.distance || etaData?.distance || '--';
  const displayDurationMinutes = activeRoute?.durationMinutes ?? etaData?.durationMinutes ?? 0;
  const distKm = activeRoute?.distKm ?? parseDistanceKm(displayDistance);
  const fuelEstimate = (distKm * (fuelRate / 100)).toFixed(1);
  const fuelCost = Math.round(parseFloat(fuelEstimate) * FUEL_PRICE_PER_LITER);
  const arrivalTime = getArrivalTime(displayDurationMinutes);

  // Initialize and maintain map instance (clean locked view dedicated to showing the route)
  useEffect(() => {
    const mapContainer = mapRef.current;
    if (!mapContainer) return undefined;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainer, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: false, // Locked to focus on route only
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        crossOrigin: true,
      }).addTo(map);

      mapInstanceRef.current = map;
      map.setView([7.8731, 80.7718], 8);
    }

    const resizeTimer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch routes
  useEffect(() => {
    let isMounted = true;
    const map = mapInstanceRef.current;
    if (!map) return undefined;

    const originCoords = extractCoords(etaData?.origin) || extractCoords(userLocation);
    const destCoords = extractCoords(etaData?.destination) || extractCoords(searchedPlace);

    if (!originCoords && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (isMounted) {
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            if (typeof setUserLocation === 'function') setUserLocation(loc);
          }
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    if (!originCoords || !destCoords) {
      if (destCoords) {
        map.setView([destCoords.lat, destCoords.lng], 13);
      } else if (originCoords) {
        map.setView([originCoords.lat, originCoords.lng], 13);
      }
      return undefined;
    }

    setLoading(true);
    fetchRoute(originCoords, destCoords, mode, true)
      .then((data) => {
        if (!isMounted) return;
        const features = data?.features || [];
        if (!features.length) {
          setLoading(false);
          return;
        }

        const parsed = features.map((f, idx) => {
          const timeSec = Number(f.properties?.time || f.properties?.duration || 0);
          const distMeters = Number(f.properties?.distance || 0);
          const mins = Math.max(1, Math.ceil(timeSec / 60));
          const kmVal = (distMeters / 1000).toFixed(1);
          return {
            duration: `${mins} min`,
            durationMinutes: mins,
            distance: `${kmVal} km`,
            distKm: parseFloat(kmVal) || 0,
            summary: f.properties?.route_summary || `Route ${idx + 1}`,
            geojson: f,
          };
        });

        setAlternativeRoutes(parsed);
        const preferred = etaData?.selectedRouteIndex ?? 0;
        setSelectedRouteIdx(preferred < parsed.length ? preferred : 0);
      })
      .catch((err) => {
        console.error('[EtaPage] Error fetching route:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchedPlace, userLocation, mode, etaData, setUserLocation]);

  // Redraw route layers and automatically fit to show the complete route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous layers
    routeLayersRef.current.forEach((layer) => map.removeLayer(layer));
    routeLayersRef.current = [];
    markerLayersRef.current.forEach((marker) => map.removeLayer(marker));
    markerLayersRef.current = [];

    const originCoords = extractCoords(etaData?.origin) || extractCoords(userLocation);
    const destCoords = extractCoords(etaData?.destination) || extractCoords(searchedPlace);

    // Draw origin and destination markers
    const createDotIcon = (color, label) => L.divIcon({
      className: 'custom-dot-icon',
      html: `<div title="${label}" style="background-color:${color};width:20px;height:20px;border-radius:50%;border:3px solid #FFF;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    if (originCoords) {
      const origMarker = L.marker([originCoords.lat, originCoords.lng], {
        icon: createDotIcon('#1A73E8', 'Origin'),
      }).addTo(map);
      markerLayersRef.current.push(origMarker);
    }

    if (destCoords) {
      const destMarker = L.marker([destCoords.lat, destCoords.lng], {
        icon: createDotIcon('#EA4335', 'Destination'),
      }).addTo(map);
      markerLayersRef.current.push(destMarker);
    }

    if (!alternativeRoutes.length) {
      if (originCoords && destCoords) {
        const bounds = L.latLngBounds([
          [originCoords.lat, originCoords.lng],
          [destCoords.lat, destCoords.lng],
        ]);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [40, 40] });
        }
      }
      return;
    }

    let selectedLayer = null;

    // Draw unselected routes in background
    alternativeRoutes.forEach((route, idx) => {
      if (idx === selectedRouteIdx) return;
      const layer = L.geoJSON(route.geojson, {
        style: { color: '#94A3B8', weight: 4, opacity: 0.6, lineCap: 'round', lineJoin: 'round' },
      }).addTo(map);

      routeLayersRef.current.push(layer);
    });

    // Draw selected route in foreground
    const active = alternativeRoutes[selectedRouteIdx] || alternativeRoutes[0];
    if (active) {
      selectedLayer = L.geoJSON(active.geojson, {
        style: { color: '#1A73E8', weight: 6, opacity: 0.95, lineCap: 'round', lineJoin: 'round' },
      }).addTo(map);
      routeLayersRef.current.push(selectedLayer);
    }

    // Automatically fit to show the whole route cleanly
    if (selectedLayer && typeof selectedLayer.getBounds === 'function') {
      const bounds = selectedLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    } else if (originCoords && destCoords) {
      const bounds = L.latLngBounds([
        [originCoords.lat, originCoords.lng],
        [destCoords.lat, destCoords.lng],
      ]);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [alternativeRoutes, selectedRouteIdx, etaData, userLocation, searchedPlace]);

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 112px)',
      maxHeight: 'calc(100vh - 112px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(160, 219, 255, 0.8) 100%), url('${middle}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center bottom',
      backgroundRepeat: 'no-repeat',
      overflowY: 'auto',
      padding: '8px 24px',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        gap: '8px',
        maxWidth: '960px',
        margin: '0 auto',
        width: '100%',
      }}>
        
        {/* Top Centered Section: ETA Banner & Map */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '520px',
          width: '100%',
          margin: '0 auto',
        }}>
          {/* ETA & Arrival Banner */}
          <div style={{
            background: 'linear-gradient(90deg, #FFFFFF 0%, #A0DBFF 100%)',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            padding: '8px 20px',
            width: '100%',
            textAlign: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <img src={clockIcon} alt="clock" style={{ width: '22px', height: '22px' }} />
              <span style={{ fontWeight: 700, fontSize: '20px', color: '#111827', fontFamily: "'Inter', sans-serif" }}>
                ETA: {displayDuration}
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>
              Arrival: {arrivalTime}
            </div>
          </div>

          {/* Map Container (Clean route-only view) */}
          <div style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            height: '210px',
            width: '100%',
            position: 'relative',
            background: '#e2e8f0',
          }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

            {loading && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(255, 255, 255, 0.65)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10,
              }}>
                <div style={{
                  background: '#fff', padding: '8px 16px', borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 600,
                  color: '#1A73E8', fontSize: '13px',
                }}>
                  Loading route...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Increased Width: Fuel & Transport Info Card */}
        <div style={{
          background: 'linear-gradient(90deg, #FFFFFF 0%, #A0DBFF 100%)',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          padding: '10px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '920px',
          width: '100%',
          margin: '0 auto',
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>Fuel Estimate</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>
              {fuelRate > 0 ? `${fuelEstimate} L` : 'N/A'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>Estimated Fuel cost</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>
              {fuelRate > 0 ? `RS: ${fuelCost}` : 'N/A'}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>Transport Type:</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif", marginTop: '2px' }}>{MODE_LABELS[mode] || 'Car'}</div>
            <img src={MODE_ICONS[mode] || carIcon} alt="transport" style={{ width: '22px', height: '22px', objectFit: 'contain', margin: '2px auto 0' }} />
          </div>
        </div>

        {/* Increased Width: Alternative Routes Card */}
        {alternativeRoutes.length > 0 && (
          <div style={{
            background: 'linear-gradient(90deg, #FFFFFF 0%, #A0DBFF 100%)',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            padding: '10px 32px',
            maxWidth: '920px',
            width: '100%',
            margin: '0 auto',
          }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '15px', color: '#111827', marginBottom: '6px' }}>
              Alternative Routes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {alternativeRoutes.map((route, idx) => {
                const isSelected = idx === selectedRouteIdx;
                const isFastest = idx === 0;
                const tags = [];
                if (isFastest) tags.push('fastest');
                if (isSelected) tags.push('Current');
                const tagStr = tags.length > 0 ? ` (${tags.join(', ')})` : '';

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedRouteIdx(idx)}
                    style={{
                      fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#111827',
                      fontWeight: isSelected ? 700 : 500, lineHeight: '1.4',
                      cursor: 'pointer', padding: '4px 10px', borderRadius: '6px',
                      background: isSelected ? 'rgba(26, 115, 232, 0.12)' : 'transparent',
                      transition: 'background 0.15s ease',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700 }}>Route {idx + 1}:</span>
                      <span> {route.duration} ({route.distance})</span>
                      <span style={{ fontWeight: 600, color: isSelected ? '#1A73E8' : '#6B7280' }}>{tagStr}</span>
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: '12px', color: '#1A73E8', fontWeight: 700 }}>Selected</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons (Back and Start Navigation) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '60px',
          width: '100%',
          marginTop: '4px',
          marginBottom: '4px',
        }}>
          <button
            type="button"
            onClick={() => setActivePage && setActivePage('start')}
            style={{
              background: '#2B5BA9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 32px',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              minWidth: '140px',
              transition: 'background 0.15s ease',
            }}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setActivePage && setActivePage('start')}
            style={{
              background: '#2B5BA9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 32px',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              minWidth: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              lineHeight: 1.2,
              transition: 'background 0.15s ease',
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
