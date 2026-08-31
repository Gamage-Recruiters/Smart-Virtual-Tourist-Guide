import { useState, useRef, useCallback } from 'react';
import { createRouteLabel } from '../utils/leafletSetup';
import { haversineDist } from '../utils/geo';
import { checkRouteForFlood } from '../utils/floodService';
import { fetchCrimeAlerts, fetchRoadBlockages } from '../services/api';
import { getDistanceToPath } from '../utils/geo';

const SHOW_CRIME_LABELS_ON_START_MAP = false;
const SHOW_ROADBLOCK_LABELS_ON_START_MAP = false;

/**
 * Hook that manages safety overlay labels (flood, crime, roadblock, hospital)
 * on the navigation map.
 *
 * @param {React.RefObject<L.Map>} mapInstanceRef
 * @param {boolean} showDetailsPanel
 * @returns {Object}
 */
export function useSafetyAlerts(mapInstanceRef, showDetailsPanel) {
  const [floodDetected, setFloodDetected] = useState(false);

  const floodLabelsRef = useRef([]);
  const floodPollRef = useRef(null);
  const crimeLabelsRef = useRef([]);
  const crimeAlertsCacheRef = useRef([]);
  const crimeRoutePathRef = useRef([]);
  const roadblockLabelsRef = useRef([]);
  const roadblocksCacheRef = useRef([]);
  const roadblockRoutePathRef = useRef([]);
  const nearestHospitalOverlayRef = useRef(null);

  const clearFloodOverlays = useCallback(() => {
    floodLabelsRef.current.forEach((l) => l.remove());
    floodLabelsRef.current = [];
  }, []);

  const clearCrimeOverlays = useCallback(() => {
    crimeLabelsRef.current.forEach((l) => l.remove());
    crimeLabelsRef.current = [];
  }, []);

  const clearRoadblockOverlays = useCallback(() => {
    roadblockLabelsRef.current.forEach((l) => l.remove());
    roadblockLabelsRef.current = [];
  }, []);

  const clearAllSafetyOverlays = useCallback(() => {
    clearFloodOverlays();
    clearCrimeOverlays();
    clearRoadblockOverlays();
    if (nearestHospitalOverlayRef.current) {
      nearestHospitalOverlayRef.current.remove();
      nearestHospitalOverlayRef.current = null;
    }
    if (floodPollRef.current) {
      clearInterval(floodPollRef.current);
      floodPollRef.current = null;
    }
  }, [clearFloodOverlays, clearCrimeOverlays, clearRoadblockOverlays]);

  const checkAndDrawFloodLabel = useCallback(async (overviewPath, destination) => {
    if (!mapInstanceRef.current || !overviewPath?.length || showDetailsPanel) return;
    clearFloodOverlays();

    const { isFlood, floodPoint, alert } = await checkRouteForFlood(overviewPath, destination);
    setFloodDetected(isFlood);
    if (!isFlood) return;

    const fallbackPoint = overviewPath[Math.floor(overviewPath.length / 3)];
    const labelPoint = floodPoint || fallbackPoint;
    if (!labelPoint) return;

    const condition = (alert?.weatherCondition || '').toLowerCase();
    const alertLocation = (alert?.location || '').trim();
    const isSpecificallyLandslide = condition.includes('landslide');
    const isSpecificallyFlood = condition.includes('flood');

    let titlePrefix = 'Weather warning';
    if (isSpecificallyLandslide) titlePrefix = 'Landslide warning';
    else if (isSpecificallyFlood) titlePrefix = 'Flood warning';
    else titlePrefix = 'Landslide or flood warning';

    const labelMessage = alertLocation ? `${titlePrefix} - ${alertLocation}` : titlePrefix;

    const floodLabel = `
      <div style="
        transform: translateY(-60px);
        min-width: 220px; max-width: 300px; height: 44px;
        border-radius: 12px; background: #E8CC1C;
        display: flex; align-items: center; justify-content: center;
        gap: 10px; box-shadow: 0px 2px 6px rgba(0,0,0,0.28); padding: 0 14px;
      ">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            fill="none" stroke="#E53935" stroke-width="1.8" stroke-linejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke="#E53935" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="12" cy="17" r="1" fill="#E53935"/>
        </svg>
        <span style="font-weight:700;font-size:11px;color:#000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${labelMessage}</span>
      </div>`;

    const overlay = createRouteLabel(mapInstanceRef.current, labelPoint, floodLabel);
    floodLabelsRef.current.push(overlay);
  }, [mapInstanceRef, showDetailsPanel, clearFloodOverlays]);

  const updateNearestCrimeLabel = useCallback((userLoc) => {
    if (!SHOW_CRIME_LABELS_ON_START_MAP) return;
    if (!mapInstanceRef.current || showDetailsPanel) return;
    clearCrimeOverlays();

    const cachedAlerts = crimeAlertsCacheRef.current;
    const overviewPath = crimeRoutePathRef.current;
    if (!cachedAlerts.length || !overviewPath.length) return;

    const userLat = userLoc?.lat;
    const userLng = userLoc?.lng;
    if (userLat == null || userLng == null) return;

    let userRouteIdx = 0;
    let userMinDist = Infinity;
    overviewPath.forEach((pt, idx) => {
      const ptLat = typeof pt.lat === 'function' ? pt.lat() : pt.lat;
      const ptLng = typeof pt.lng === 'function' ? pt.lng() : pt.lng;
      const d = haversineDist(userLat, userLng, ptLat, ptLng);
      if (d < userMinDist) { userMinDist = d; userRouteIdx = idx; }
    });

    let bestCrime = null;
    let bestDistToUser = Infinity;

    cachedAlerts.forEach((crime) => {
      const crimeLat = crime.latitude ?? crime.lat;
      const crimeLng = crime.longitude ?? crime.lng ?? crime.lon;
      if (crimeLat == null || crimeLng == null) return;

      let crimeRouteIdx = 0;
      let crimeRouteDist = Infinity;
      overviewPath.forEach((pt, idx) => {
        const ptLat = typeof pt.lat === 'function' ? pt.lat() : pt.lat;
        const ptLng = typeof pt.lng === 'function' ? pt.lng() : pt.lng;
        const d = haversineDist(crimeLat, crimeLng, ptLat, ptLng);
        if (d < crimeRouteDist) { crimeRouteDist = d; crimeRouteIdx = idx; }
      });

      if (crimeRouteDist > 5000) return;
      if (crimeRouteIdx < userRouteIdx) return;

      const distToUser = haversineDist(userLat, userLng, crimeLat, crimeLng);
      if (distToUser < bestDistToUser) { bestDistToUser = distToUser; bestCrime = crime; }
    });

    if (!bestCrime) return;

    const crimeLat = bestCrime.latitude ?? bestCrime.lat;
    const crimeLng = bestCrime.longitude ?? bestCrime.lng ?? bestCrime.lon;
    const crimeTitle = bestCrime.title || 'Crime alert';
    const crimeLocation = bestCrime.location || '';
    const distText = bestDistToUser < 1000 ? `${Math.round(bestDistToUser)}m away` : `${(bestDistToUser / 1000).toFixed(1)}km away`;
    const labelText = crimeLocation ? `${crimeTitle} · ${crimeLocation} · ${distText}` : `${crimeTitle} · ${distText}`;

    const crimeLabelHtml = `
      <div style="
        transform: translateY(-60px);
        min-width: 200px; max-width: 300px; height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #FF5252 0%, #D32F2F 100%);
        display: flex; align-items: center; justify-content: center;
        gap: 10px; box-shadow: 0px 3px 8px rgba(211,47,47,0.45); padding: 0 14px;
      ">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            fill="none" stroke="#FFF" stroke-width="1.8" stroke-linejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke="#FFF" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="12" cy="17" r="1" fill="#FFF"/>
        </svg>
        <span style="font-weight:700;font-size:11px;color:#FFF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${labelText}</span>
      </div>`;

    const crimePos = { lat: crimeLat, lng: crimeLng };
    const overlay = createRouteLabel(mapInstanceRef.current, crimePos, crimeLabelHtml);
    crimeLabelsRef.current.push(overlay);
  }, [mapInstanceRef, showDetailsPanel, clearCrimeOverlays]);

  const checkAndDrawCrimeLabels = useCallback(async (overviewPath) => {
    if (!SHOW_CRIME_LABELS_ON_START_MAP) return;
    if (!mapInstanceRef.current || !overviewPath?.length || showDetailsPanel) return;
    clearCrimeOverlays();
    crimeRoutePathRef.current = overviewPath;

    try {
      const res = await fetchCrimeAlerts();
      const alerts = Array.isArray(res) ? res : (res?.data || []);
      crimeAlertsCacheRef.current = alerts;
    } catch (err) {
      console.warn('[useSafetyAlerts] Failed to fetch crime alerts:', err.message);
    }
  }, [mapInstanceRef, showDetailsPanel, clearCrimeOverlays]);

  const updateNearestRoadblockLabel = useCallback((userLoc) => {
    if (!SHOW_ROADBLOCK_LABELS_ON_START_MAP) return;
    if (!mapInstanceRef.current || showDetailsPanel) return;
    clearRoadblockOverlays();

    const cachedRoadblocks = roadblocksCacheRef.current;
    const overviewPath = roadblockRoutePathRef.current;
    if (!cachedRoadblocks.length || !overviewPath.length) return;

    const fallbackPoint = overviewPath[0];
    const fallbackLat = fallbackPoint ? (typeof fallbackPoint.lat === 'function' ? fallbackPoint.lat() : fallbackPoint.lat) : null;
    const fallbackLng = fallbackPoint ? (typeof fallbackPoint.lng === 'function' ? fallbackPoint.lng() : fallbackPoint.lng) : null;
    const refLat = userLoc?.lat ?? fallbackLat;
    const refLng = userLoc?.lng ?? fallbackLng;
    if (refLat == null || refLng == null) return;

    let userRouteIdx = 0;
    let userMinDist = Infinity;
    overviewPath.forEach((pt, idx) => {
      const ptLat = typeof pt.lat === 'function' ? pt.lat() : pt.lat;
      const ptLng = typeof pt.lng === 'function' ? pt.lng() : pt.lng;
      const d = haversineDist(refLat, refLng, ptLat, ptLng);
      if (d < userMinDist) { userMinDist = d; userRouteIdx = idx; }
    });

    let bestRoadblock = null;
    let bestDistToUser = Infinity;

    cachedRoadblocks.forEach((incident) => {
      const incLat = incident.latitude ?? incident.lat;
      const incLng = incident.longitude ?? incident.lng ?? incident.lon;
      if (incLat == null || incLng == null) return;

      let incidentRouteIdx = 0;
      let incidentRouteDist = Infinity;
      overviewPath.forEach((pt, idx) => {
        const ptLat = typeof pt.lat === 'function' ? pt.lat() : pt.lat;
        const ptLng = typeof pt.lng === 'function' ? pt.lng() : pt.lng;
        const d = haversineDist(incLat, incLng, ptLat, ptLng);
        if (d < incidentRouteDist) { incidentRouteDist = d; incidentRouteIdx = idx; }
      });

      if (incidentRouteDist > 5000) return;
      if (incidentRouteIdx < userRouteIdx) return;

      const distToUser = haversineDist(refLat, refLng, incLat, incLng);
      if (distToUser < bestDistToUser) { bestDistToUser = distToUser; bestRoadblock = incident; }
    });

    if (!bestRoadblock) return;

    const roadblockLat = bestRoadblock.latitude ?? bestRoadblock.lat;
    const roadblockLng = bestRoadblock.longitude ?? bestRoadblock.lng ?? bestRoadblock.lon;
    const roadblockTitle = bestRoadblock.title || bestRoadblock.incidentCategory || 'Road blockage';
    const roadblockLocation = bestRoadblock.location || bestRoadblock.locationName || bestRoadblock.address || '';
    const distText = bestDistToUser < 1000 ? `${Math.round(bestDistToUser)}m away` : `${(bestDistToUser / 1000).toFixed(1)}km away`;
    const labelText = roadblockLocation ? `${roadblockTitle} · ${roadblockLocation} · ${distText}` : `${roadblockTitle} · ${distText}`;

    const roadblockLabelHtml = `
      <div style="
        transform: translateY(-60px);
        min-width: 200px; max-width: 310px; height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #FACC15 0%, #EAB308 100%);
        display: flex; align-items: center; justify-content: center;
        gap: 10px; box-shadow: 0px 3px 8px rgba(161,98,7,0.35); padding: 0 14px;
      ">
        <svg width="22" height="24" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="6" y="50" width="40" height="7" rx="2" fill="#444"/>
          <rect x="8" y="50" width="36" height="4" rx="1.5" fill="#555"/>
          <path d="M18 52L24 8H28L34 52H18Z" fill="#FF6D00"/>
          <rect x="21" y="19" width="10" height="5" rx="1" fill="white" opacity="0.95"/>
          <rect x="20" y="32" width="12" height="5" rx="1" fill="white" opacity="0.95"/>
          <ellipse cx="26" cy="7" rx="3" ry="1.8" fill="#FF8F00"/>
        </svg>
        <span style="font-weight:700;font-size:11px;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${labelText}</span>
      </div>`;
    const roadblockPos = { lat: roadblockLat, lng: roadblockLng };
    const overlay = createRouteLabel(mapInstanceRef.current, roadblockPos, roadblockLabelHtml);
    roadblockLabelsRef.current.push(overlay);
  }, [mapInstanceRef, showDetailsPanel, clearRoadblockOverlays]);

  const checkAndDrawRoadblockLabels = useCallback(async (overviewPath) => {
    if (!SHOW_ROADBLOCK_LABELS_ON_START_MAP) return;
    if (!mapInstanceRef.current || !overviewPath?.length || showDetailsPanel) return;
    clearRoadblockOverlays();
    roadblockRoutePathRef.current = overviewPath;

    try {
      const res = await fetchRoadBlockages();
      const incidents = Array.isArray(res) ? res : (res?.incidents || res?.data || []);
      roadblocksCacheRef.current = incidents;
    } catch (err) {
      console.warn('[useSafetyAlerts] Failed to fetch roadblock alerts:', err.message);
    }
  }, [mapInstanceRef, showDetailsPanel, clearRoadblockOverlays]);

  const findNearestHospital = useCallback(async (loc) => {
    if (!mapInstanceRef.current || showDetailsPanel) return;
    const HOSPITAL_NAV_RADIUS = 2000;
    try {
      if (nearestHospitalOverlayRef.current) {
        nearestHospitalOverlayRef.current.remove();
        nearestHospitalOverlayRef.current = null;
      }
      // Import findNearbyPlaces from mapServices (not api)
      const { findNearbyPlaces: findNearbyPlacesFn } = await import('../utils/mapServices');
      const results = await findNearbyPlacesFn(loc.lat, loc.lng, HOSPITAL_NAV_RADIUS, '"amenity"="hospital"');
      if (!results?.length) return;
      const EXCLUDE_KEYWORDS = /medical cent(er|re)|medi cent(er|re)/i;
      const getDistanceMeters = (a, b) => haversineDist(a.lat, a.lng, b.lat, b.lng);
      const hospital = results
        .filter(p => !EXCLUDE_KEYWORDS.test(p.name || ''))
        .sort((a, b) => {
          const dA = getDistanceMeters(loc, { lat: a.lat, lng: a.lng }) ?? Infinity;
          const dB = getDistanceMeters(loc, { lat: b.lat, lng: b.lng }) ?? Infinity;
          return dA - dB;
        })[0];

      if (!hospital || (getDistanceMeters(loc, { lat: hospital.lat, lng: hospital.lng }) ?? Infinity) > HOSPITAL_NAV_RADIUS) return;

      const name = hospital.name || 'Hospital';
      const shortName = name.length > 18 ? name.slice(0, 16) + '…' : name;
      const html = `
        <div style="max-width:160px;min-width:120px;height:38px;border-radius:8px;background:#EAB308;display:flex;align-items:center;justify-content:center;padding:0 10px;box-shadow:0px 2px 4px rgba(0,0,0,0.3);gap:6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c00" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M2 12h20"/></svg>
          <span style="font-weight:700;font-size:13px;color:#000;white-space:nowrap;">${shortName}</span>
        </div>`;
      nearestHospitalOverlayRef.current = createRouteLabel(mapInstanceRef.current, { lat: hospital.lat, lng: hospital.lng }, html);
    } catch (err) { console.warn('Hospital search failed', err); }
  }, [mapInstanceRef, showDetailsPanel]);

  return {
    floodDetected,
    floodPollRef,
    clearAllSafetyOverlays,
    checkAndDrawFloodLabel,
    checkAndDrawCrimeLabels,
    checkAndDrawRoadblockLabels,
    updateNearestCrimeLabel,
    updateNearestRoadblockLabel,
    findNearestHospital,
  };
}
