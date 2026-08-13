import { useEffect, useRef, useState } from 'react';
import middle from '../../assets/NavigationAndMapping/middle.png';
import carIcon from '../../assets/NavigationAndMapping/carIcon.png';
import clockIcon from '../../assets/NavigationAndMapping/clockIcon.png';
import busIcon from '../../assets/NavigationAndMapping/busIcon.png';
import bikeIcon from '../../assets/NavigationAndMapping/bikeIcon.png';
import manIcon from '../../assets/NavigationAndMapping/manIcon.png';
import { usePageTitle } from '../../context/PageTitleContext';
import { ensureMapsScript } from '../../utils/helpers';

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
  const { etaData, searchedPlace, userLocation, setActivePage } = usePageTitle();
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
    ensureMapsScript(() => {
      const destLoc = searchedPlace?.geometry?.location;
      const originLat = userLocation?.lat != null ? (typeof userLocation.lat === 'function' ? userLocation.lat() : userLocation.lat) : null;
      const originLng = userLocation?.lng != null ? (typeof userLocation.lng === 'function' ? userLocation.lng() : userLocation.lng) : null;
      const hasOrigin = originLat != null && originLng != null;

      const initialCenter = hasOrigin
        ? { lat: originLat, lng: originLng }
        : destLoc
          ? { lat: destLoc.lat(), lng: destLoc.lng() }
          : { lat: 7.8731, lng: 80.7718 };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: hasOrigin || destLoc ? 10 : 7,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        gestureHandling: 'cooperative',
        styles: [
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a2daf2' }] },
          { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#d0f0c0' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#9be79b' }] },
          { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#6abf69' }] },
        ],
      });
      setMapReady(true);

      // Request directions if origin + destination available
      if (hasOrigin && destLoc) {
        const directionsService = new window.google.maps.DirectionsService();
        const modeMap = { drive: 'DRIVING', bike: 'BICYCLING', transit: 'TRANSIT', walk: 'WALKING' };
        const travelMode = modeMap[mode] || 'DRIVING';
        const originLatLng = new window.google.maps.LatLng(originLat, originLng);

        directionsService.route(
          {
            origin: originLatLng,
            destination: destLoc,
            travelMode: window.google.maps.TravelMode[travelMode],
            provideRouteAlternatives: true,
            drivingOptions: travelMode === 'DRIVING' ? {
              departureTime: new Date(),
              trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
            } : undefined,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              // Parse all routes for the alternative routes card
              const allRoutes = result.routes.map((route, idx) => {
                const leg = route.legs[0];
                const freeMins = leg.duration?.value ? Math.round(leg.duration.value / 60) : 0;
                const trafficMins = leg.duration_in_traffic?.value
                  ? Math.round(leg.duration_in_traffic.value / 60)
                  : freeMins;
                const ratio = freeMins > 0 ? trafficMins / freeMins : 1;
                const routeTraffic =
                  ratio >= 1.4 ? 'Heavy traffic'
                  : ratio >= 1.15 ? 'Moderate traffic'
                  : 'Light traffic';
                return {
                  index: idx,
                  duration: leg.duration_in_traffic?.text || leg.duration?.text || '--',
                  durationMinutes: trafficMins || freeMins,
                  distance: leg.distance?.text || '--',
                  summary: route.summary || '',
                  traffic: routeTraffic,
                };
              });
              // Sort by duration so fastest is first
              allRoutes.sort((a, b) => a.durationMinutes - b.durationMinutes);
              setAlternativeRoutes(allRoutes);

              const preferredIndex = etaData?.selectedRouteIndex ?? 0;
              const safeIndex = preferredIndex < result.routes.length ? preferredIndex : 0;
              const renderer = new window.google.maps.DirectionsRenderer({
                map: mapInstanceRef.current,
                directions: result,
                routeIndex: safeIndex,
                suppressInfoWindows: true,
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#1A73E8',
                  strokeWeight: 5,
                  strokeOpacity: 1,
                },
              });

              // Fit map to show full route
              const bounds = new window.google.maps.LatLngBounds();
              const leg = result.routes[safeIndex]?.legs?.[0];
              if (leg) {
                bounds.extend(leg.start_location);
                bounds.extend(leg.end_location);
                const overviewPath = result.routes[safeIndex]?.overview_path || [];
                overviewPath.forEach(pt => bounds.extend(pt));
                mapInstanceRef.current.fitBounds(bounds, { top: 60, bottom: 60, left: 30, right: 30 });
              }

              // Add "You" label at origin
              const originLoc = result.routes[safeIndex]?.legs?.[0]?.start_location;
              if (originLoc) {
                new window.google.maps.Marker({
                  position: originLoc,
                  map: mapInstanceRef.current,
                  icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#104bc0',
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 2,
                  },
                  label: {
                    text: 'You',
                    color: '#104bc0',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    className: 'map-you-label',
                  },
                });
              }

              // Add "Full Overview" label at midpoint
              const path = result.routes[safeIndex]?.overview_path || [];
              if (path.length > 0) {
                const mid = path[Math.floor(path.length / 2)];
                const OverlayClass = class extends window.google.maps.OverlayView {
                  constructor(pos, html) { super(); this.pos = pos; this.html = html; this.div = null; }
                  onAdd() {
                    this.div = document.createElement('div');
                    this.div.style.cssText = 'position:absolute;pointer-events:none;transform:translate(-50%,-50%);z-index:1000;';
                    this.div.innerHTML = this.html;
                    this.getPanes().floatPane.appendChild(this.div);
                  }
                  draw() {
                    const p = this.getProjection()?.fromLatLngToDivPixel(this.pos);
                    if (p && this.div) { this.div.style.left = p.x + 'px'; this.div.style.top = p.y + 'px'; }
                  }
                  onRemove() { if (this.div) { this.div.parentNode?.removeChild(this.div); this.div = null; } }
                };
                const overlay = new OverlayClass(mid, `
                  <div style="background:linear-gradient(90deg,#FFFFFF 0%,#A0DBFF 100%);border-radius:10px;box-shadow:0 2px 4px rgba(0,0,0,0.2);padding:8px 20px;font-family:Inter,sans-serif;font-size:13px;font-weight:600;color:#111827;white-space:nowrap;">
                    Full Overview
                  </div>
                `);
                overlay.setMap(mapInstanceRef.current);
              }
            }
          }
        );
      }
    });
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
            onClick={() => setActivePage && setActivePage('direction')}
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
            onClick={() => setActivePage && setActivePage('start')}
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
