import { useRef, useState } from 'react';
import L from 'leaflet';
import { fetchNearbyPlaces } from '../utils/geoapifyService';

export const useMapEngine = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const renderersRef = useRef([]);
  const clickPathsRef = useRef([]);
  const originMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const directionsResultRef = useRef(null);
  const routeRequestIdRef = useRef(0);
  const selectRouteRef = useRef(null);
  const activeRoutePairRef = useRef({ origin: null, destination: null });
  const userLocationRef = useRef(null);
  const zoomOverlayRef = useRef(null);
  const tooltipRef = useRef(null);
  const routeLabelsRef = useRef([]);
  const floodLabelsRef = useRef([]);
  const floodPollRef = useRef(null);
  const crimeLabelsRef = useRef([]);
  const crimeAlertsCacheRef = useRef([]);
  const crimeRoutePathRef = useRef([]);
  const roadblockLabelsRef = useRef([]);
  const roadblocksCacheRef = useRef([]);
  const roadblockRoutePathRef = useRef([]);
  const poiMarkersRef = useRef([]);
  const pathClickLabelRef = useRef(null);
  const nearestHospitalOverlayRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [floodDetected, setFloodDetected] = useState(false);

  const createRouteLabel = (map, position, content, onClick) => {
    let lat;
    let lng;
    if (Array.isArray(position)) {
      [lat, lng] = position;
    } else if (typeof position.lat === 'function') {
      lat = position.lat();
      lng = position.lng();
    } else {
      lat = position.lat;
      lng = position.lng;
    }
    const icon = L.divIcon({ html: content, className: 'custom-route-label', iconSize: [0, 0] });
    const marker = L.marker([lat, lng], { icon });
    if (onClick) marker.on('click', onClick);
    marker.addTo(map);
    return marker;
  };

  const findNearestHospital = (location, showDetailsPanel = true) => {
    if (!mapInstanceRef.current || showDetailsPanel || !location) return;
    fetchNearbyPlaces(location.lat, location.lng, 'hospital', 2000, 5).then((hospitals) => {
      if (nearestHospitalOverlayRef.current) mapInstanceRef.current.removeLayer(nearestHospitalOverlayRef.current);
      const hospital = hospitals[0];
      if (!hospital?.lat || !hospital?.lon) return;
      const name = hospital.name || 'Hospital';
      const shortName = name.length > 18 ? `${name.slice(0, 16)}…` : name;
      const html = `<div style="max-width:160px;min-width:120px;height:38px;border-radius:8px;background:#EAB308;display:flex;align-items:center;justify-content:center;padding:0 10px;box-shadow:0px 2px 4px rgba(0,0,0,0.3);gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c00" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v20M2 12h20"/></svg><span style="font-weight:700;font-size:13px;color:#000;white-space:nowrap;">${shortName}</span></div>`;
      nearestHospitalOverlayRef.current = createRouteLabel(mapInstanceRef.current, { lat: hospital.lat, lng: hospital.lon }, html);
    });
  };

  const clearPoiMarkers = () => {
    poiMarkersRef.current.forEach((marker) => mapInstanceRef.current?.removeLayer(marker));
    poiMarkersRef.current = [];
  };

  const clearPathClickLabel = () => {
    if (!pathClickLabelRef.current) return;
    mapInstanceRef.current?.removeLayer(pathClickLabelRef.current);
    pathClickLabelRef.current = null;
  };

  const clearFloodOverlays = () => {
    floodLabelsRef.current.forEach((label) => mapInstanceRef.current?.removeLayer(label));
    floodLabelsRef.current = [];
  };

  const clearCrimeOverlays = () => {
    crimeLabelsRef.current.forEach((label) => mapInstanceRef.current?.removeLayer(label));
    crimeLabelsRef.current = [];
  };

  const clearRoadblockOverlays = () => {
    roadblockLabelsRef.current.forEach((label) => mapInstanceRef.current?.removeLayer(label));
    roadblockLabelsRef.current = [];
  };

  const clearRouteOverlays = () => {
    renderersRef.current.forEach((renderer) => mapInstanceRef.current?.removeLayer(renderer));
    clickPathsRef.current.forEach((path) => mapInstanceRef.current?.removeLayer(path));
    routeLabelsRef.current.forEach((label) => mapInstanceRef.current?.removeLayer(label));
    clearFloodOverlays();
    clearCrimeOverlays();
    clearRoadblockOverlays();
    clearPathClickLabel();
    renderersRef.current = [];
    clickPathsRef.current = [];
    routeLabelsRef.current = [];
  };

  const placeOriginMarker = (location) => {
    if (!mapInstanceRef.current || !location) return;
    const lat = typeof location.lat === 'function' ? location.lat() : location.lat;
    const lng = typeof location.lng === 'function' ? location.lng() : location.lng;
    if (originMarkerRef.current) {
      originMarkerRef.current.setLatLng([lat, lng]);
    } else {
      originMarkerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
    }
  };

  return {
    mapRef,
    mapInstanceRef,
    renderersRef,
    clickPathsRef,
    originMarkerRef,
    destMarkerRef,
    directionsResultRef,
    routeRequestIdRef,
    selectRouteRef,
    activeRoutePairRef,
    userLocationRef,
    zoomOverlayRef,
    tooltipRef,
    routeLabelsRef,
    floodLabelsRef,
    floodPollRef,
    crimeLabelsRef,
    crimeAlertsCacheRef,
    crimeRoutePathRef,
    roadblockLabelsRef,
    roadblocksCacheRef,
    roadblockRoutePathRef,
    poiMarkersRef,
    pathClickLabelRef,
    nearestHospitalOverlayRef,
    mapReady,
    setMapReady,
    floodDetected,
    setFloodDetected,
    createRouteLabel,
    clearPoiMarkers,
    clearPathClickLabel,
    clearFloodOverlays,
    clearCrimeOverlays,
    clearRoadblockOverlays,
    clearRouteOverlays,
    placeOriginMarker,
    findNearestHospital,
  };
};

export default useMapEngine;
