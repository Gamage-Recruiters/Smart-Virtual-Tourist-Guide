import L from 'leaflet';

/**
 * Haversine formula — returns distance in kilometers between two GPS points.
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Custom SVG icon for Tourist Police (blue shield with badge)
export const policeIcon = L.divIcon({
  className: '',
  html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:44px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
      <path d="M18 0C8.06 0 0 7.6 0 17c0 12.75 18 27 18 27s18-14.25 18-27C36 7.6 27.94 0 18 0z" fill="#1E3A8A"/>
      <circle cx="18" cy="16" r="11" fill="#2563EB"/>
      <path d="M18 7l2.5 3.5H24l-3 3.5 1.5 4-4.5-2.5L13.5 18l1.5-4-3-3.5h3.5z" fill="white"/>
      <circle cx="18" cy="16" r="3" fill="white" opacity="0.9"/>
    </svg>
  </div>`,
  iconSize: [36, 44],
  iconAnchor: [18, 44],
  popupAnchor: [0, -40],
});

// Pulsing icon for the NEAREST tourist police stations (auto-highlighted)
export const nearestPoliceIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:52px;filter:drop-shadow(0 2px 6px rgba(37,99,235,0.5))">
    <div style="position:absolute;top:2px;left:4px;width:36px;height:36px;border-radius:50%;background:rgba(37,99,235,0.25);animation:police-pulse 1.8s ease-out infinite"></div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44" style="position:relative;z-index:1">
      <path d="M18 0C8.06 0 0 7.6 0 17c0 12.75 18 27 18 27s18-14.25 18-27C36 7.6 27.94 0 18 0z" fill="#1E40AF"/>
      <circle cx="18" cy="16" r="11" fill="#3B82F6"/>
      <path d="M18 7l2.5 3.5H24l-3 3.5 1.5 4-4.5-2.5L13.5 18l1.5-4-3-3.5h3.5z" fill="#FDE047"/>
      <circle cx="18" cy="16" r="3" fill="white" opacity="0.95"/>
    </svg>
    <style>@keyframes police-pulse{0%{transform:scale(0.7);opacity:1}100%{transform:scale(2.2);opacity:0}}</style>
  </div>`,
  iconSize: [44, 52],
  iconAnchor: [22, 52],
  popupAnchor: [0, -48],
});

// Custom SVG icon for Hospital (red circle with white cross)
export const hospitalIcon = L.divIcon({
  className: '',
  html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:44px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
      <path d="M18 0C8.06 0 0 7.6 0 17c0 12.75 18 27 18 27s18-14.25 18-27C36 7.6 27.94 0 18 0z" fill="#DC2626"/>
      <circle cx="18" cy="16" r="11" fill="white"/>
      <rect x="15" y="9" width="6" height="14" rx="1" fill="#DC2626"/>
      <rect x="11" y="13" width="14" height="6" rx="1" fill="#DC2626"/>
    </svg>
  </div>`,
  iconSize: [36, 44],
  iconAnchor: [18, 44],
  popupAnchor: [0, -40],
});

// Custom SVG icon for Local Police (dark green shield with badge)
export const localPoliceIcon = L.divIcon({
  className: '',
  html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:40px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="32" height="40">
      <path d="M18 0C8.06 0 0 7.6 0 17c0 12.75 18 27 18 27s18-14.25 18-27C36 7.6 27.94 0 18 0z" fill="#14532D"/>
      <circle cx="18" cy="16" r="11" fill="#16A34A"/>
      <path d="M18 8l2 3h3.5l-2.5 3 1 3.5L18 15l-4 2.5 1-3.5-2.5-3H16z" fill="white"/>
      <circle cx="18" cy="16" r="2.5" fill="white" opacity="0.9"/>
    </svg>
  </div>`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -36],
});

// Custom pulsing icon for the user's current location
export const myLocationIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center">
    <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:rgba(34,197,94,0.25);animation:pulse-ring 1.8s ease-out infinite"></div>
    <div style="position:relative;width:14px;height:14px;border-radius:50%;background:#16a34a;border:2.5px solid #fff;box-shadow:0 0 0 2px rgba(22,163,74,0.5),0 2px 6px rgba(0,0,0,0.3)"></div>
    <style>@keyframes pulse-ring{0%{transform:scale(0.6);opacity:1}100%{transform:scale(2.2);opacity:0}}</style>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -18],
});
