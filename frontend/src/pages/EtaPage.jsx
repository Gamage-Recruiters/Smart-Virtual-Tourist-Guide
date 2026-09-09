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
import styles from './EtaPage.module.css';

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
    <div
      className={styles.pageContainer}
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(160, 219, 255, 0.8) 100%), url('${middle}')`,
      }}
    >
      <div className={styles.contentColumn}>
        
        {/* Top Centered Section: ETA Banner & Map */}
        <div className={styles.topCenteredSection}>
          {/* ETA & Arrival Banner */}
          <div className={styles.etaBanner}>
            <div className={styles.etaRow}>
              <img src={clockIcon} alt="clock" className={styles.etaClockIcon} />
              <span className={styles.etaTitle}>
                ETA: {displayDuration}
              </span>
            </div>
            <div className={styles.arrivalTime}>
              Arrival: {arrivalTime}
            </div>
          </div>

          {/* Map Container (Clean route-only view) */}
          <div className={styles.mapBox}>
            <div ref={mapRef} className={styles.mapCanvas} />

            {loading && (
              <div className={styles.mapLoadingOverlay}>
                <div className={styles.mapLoadingBox}>
                  Loading route...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Increased Width: Fuel & Transport Info Card */}
        <div className={styles.infoCard}>
          <div>
            <div className={styles.infoLabel}>Fuel Estimate</div>
            <div className={styles.infoValue}>
              {fuelRate > 0 ? `${fuelEstimate} L` : 'N/A'}
            </div>
          </div>
          <div>
            <div className={styles.infoLabel}>Estimated Fuel cost</div>
            <div className={styles.infoValue}>
              {fuelRate > 0 ? `RS: ${fuelCost}` : 'N/A'}
            </div>
          </div>
          <div className={styles.transportBox}>
            <div className={styles.infoLabel}>Transport Type:</div>
            <div className={styles.infoValue}>{MODE_LABELS[mode] || 'Car'}</div>
            <img src={MODE_ICONS[mode] || carIcon} alt="transport" className={styles.transportIcon} />
          </div>
        </div>

        {/* Increased Width: Alternative Routes Card */}
        {alternativeRoutes.length > 0 && (
          <div className={styles.routesCard}>
            <div className={styles.routesTitle}>
              Alternative Routes
            </div>
            <div className={styles.routesList}>
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
                    className={isSelected ? styles.routeRowSelected : styles.routeRow}
                  >
                    <div>
                      <span className="font-bold">Route {idx + 1}:</span>
                      <span> {route.duration} ({route.distance})</span>
                      <span className={`font-semibold ${isSelected ? 'text-[#1A73E8]' : 'text-[#6B7280]'}`}>{tagStr}</span>
                    </div>
                    {isSelected && (
                      <span className={styles.selectedTag}>Selected</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons (Back and Start Navigation) */}
        <div className={styles.actionsRow}>
          <button
            type="button"
            onClick={() => setActivePage && setActivePage('start')}
            className={styles.actionBtn}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setActivePage && setActivePage('start')}
            className={styles.startNavBtn}
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
