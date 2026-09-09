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

const PROMPT_TIMEOUT_MS = 1200;

function getMapContainer(map) {
  return (map && (map._container || (typeof map.getContainer === 'function' ? map.getContainer() : null))) || null;
}

function ensureOverlay(container) {
  if (!container) return null;
  let overlay = container.querySelector('.leaflet-ctrl-scroll-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'leaflet-ctrl-scroll-overlay';
    Object.assign(overlay.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(2px)',
      WebkitBackdropFilter: 'blur(2px)',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 0.2s ease-in-out',
      zIndex: '1000',
      padding: '16px',
      boxSizing: 'border-box',
      textAlign: 'center',
      borderRadius: 'inherit',
    });

    const badge = document.createElement('div');
    badge.className = 'leaflet-ctrl-scroll-badge';
    Object.assign(badge.style, {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(15, 23, 42, 0.92)',
      color: '#ffffff',
      padding: '10px 20px',
      borderRadius: '9999px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15)',
      fontSize: '14px',
      fontWeight: '500',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: '0.01em',
      userSelect: 'none',
    });

    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const keyLabel = isMac ? '⌘' : 'Ctrl';

    badge.innerHTML = `Use <kbd style="background: rgba(255, 255, 255, 0.2); color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 13px; border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 1px 2px rgba(0,0,0,0.2);">${keyLabel}</kbd> + scroll to zoom the map`;

    overlay.appendChild(badge);
    container.appendChild(overlay);

    // Fade out immediately if cursor leaves map container
    container.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0';
      if (overlay._hideTimer) {
        clearTimeout(overlay._hideTimer);
        overlay._hideTimer = null;
      }
    });
  }
  return overlay;
}

export function showCtrlScrollPrompt(map) {
  const container = getMapContainer(map);
  const overlay = ensureOverlay(container);
  if (!overlay) return;

  overlay.style.opacity = '1';
  if (overlay._hideTimer) {
    clearTimeout(overlay._hideTimer);
  }
  overlay._hideTimer = setTimeout(() => {
    overlay.style.opacity = '0';
    overlay._hideTimer = null;
  }, PROMPT_TIMEOUT_MS);
}

export function hideCtrlScrollPrompt(map) {
  const container = getMapContainer(map);
  if (!container) return;
  const overlay = container.querySelector('.leaflet-ctrl-scroll-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    if (overlay._hideTimer) {
      clearTimeout(overlay._hideTimer);
      overlay._hideTimer = null;
    }
  }
}

let isCtrlScrollPatched = false;

/**
 * Patches Leaflet ScrollWheelZoom so that normal scroll events bubble up
 * to allow natural page scrolling unless Ctrl/Cmd is pressed.
 */
export const setupCtrlScrollZoom = () => {
  if (isCtrlScrollPatched) return;
  if (typeof window === 'undefined' || !L.Map || !L.Map.ScrollWheelZoom) return;

  const originalOnWheelScroll = L.Map.ScrollWheelZoom.prototype._onWheelScroll;

  L.Map.ScrollWheelZoom.prototype._onWheelScroll = function (e) {
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const isCtrlOrCmd = isMac ? (e.metaKey || e.ctrlKey) : (e.ctrlKey || e.metaKey);

    // If map has scrollWheelZoom enabled and Ctrl/Cmd is NOT pressed:
    if (this._map.options.scrollWheelZoom && !isCtrlOrCmd) {
      showCtrlScrollPrompt(this._map);
      // DO NOT call DomEvent.stop(e) or preventDefault() -> event bubbles to page and scrolls normally!
      return;
    }

    // If Ctrl or Cmd is pressed:
    hideCtrlScrollPrompt(this._map);

    // Prevent default browser zoom (Ctrl+Wheel in Chrome/Edge zooms browser UI)
    if (e.preventDefault) {
      e.preventDefault();
    }

    // Call Leaflet's zoom implementation
    originalOnWheelScroll.call(this, e);
  };

  // If user presses Ctrl or Cmd while overlay is visible, dismiss it immediately
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Control' || e.key === 'Meta') {
      const overlays = document.querySelectorAll('.leaflet-ctrl-scroll-overlay');
      overlays.forEach((o) => {
        o.style.opacity = '0';
        if (o._hideTimer) {
          clearTimeout(o._hideTimer);
          o._hideTimer = null;
        }
      });
    }
  });

  isCtrlScrollPatched = true;
};

// Enable Ctrl+Scroll zoom globally across all Leaflet maps
setupCtrlScrollZoom();

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
