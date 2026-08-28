/**
 * Shared Leaflet setup and icon factories.
 * Extracted from Direction.jsx and Explore.jsx to eliminate duplication.
 */
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * Fix Leaflet default marker icon paths (broken by bundlers like Vite).
 * Safe to call multiple times — the fix is idempotent.
 */
export const fixLeafletDefaultIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
};

// Apply fix immediately on import
fixLeafletDefaultIcons();

/**
 * Standard blue marker icon used for navigation markers.
 * @returns {L.Icon}
 */
export const getBlueMarkerIcon = () =>
  L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

// Alias — both names were used in Direction.jsx
export const getNavigationMarkerIcon = getBlueMarkerIcon;

/**
 * Blue pulsing dot icon for the user's current location.
 * @returns {L.DivIcon}
 */
export const createUserLocationIcon = () =>
  L.divIcon({
    className: '',
    html: '<div style="width:20px;height:20px;background:#4285F4;border:3px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(66,133,244,0.6);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

/**
 * Create a custom label overlay on the map using a Leaflet DivIcon marker.
 * Replaces the old Google Maps OverlayView pattern.
 *
 * @param {L.Map} map - The Leaflet map instance
 * @param {{ lat: number|Function, lng: number|Function }} position - Label position
 * @param {string} content - HTML content for the label
 * @param {Function} [onClick] - Optional click handler
 * @returns {L.Marker} The created marker (with a `.setMap(null)` compat method)
 */
export const createRouteLabel = (map, position, content, onClick) => {
  const lat = typeof position.lat === 'function' ? position.lat() : position.lat;
  const lng = typeof position.lng === 'function' ? position.lng() : position.lng;
  const icon = L.divIcon({
    className: '',
    html: `<div style="transform:translate(-50%,-50%);${onClick ? 'cursor:pointer;' : 'pointer-events:none;'}">${content}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
  const marker = L.marker([lat, lng], { icon, interactive: !!onClick }).addTo(map);
  if (onClick) marker.on('click', onClick);
  // Leaflet-compatible setMap(null) pattern for uniform cleanup
  marker.setMap = (m) => { if (!m) marker.remove(); };
  return marker;
};
