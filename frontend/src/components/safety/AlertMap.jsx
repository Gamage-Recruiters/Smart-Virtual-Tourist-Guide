import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not showing up correctly in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle map bounds and panning
function MapBoundsManager({ alerts, selectedAlert, center }) {
  const map = useMap();
  const prevCenterRef = useRef(center);

  useEffect(() => {
    if (selectedAlert) {
      const pos = getAlertLatLng(selectedAlert);
      if (pos) {
        map.flyTo(pos, 14, { duration: 1.5 });
      }
    } else {
      const prevCenter = prevCenterRef.current;
      const centerChanged = prevCenter[0] !== center[0] || prevCenter[1] !== center[1];
      prevCenterRef.current = center;

      if (centerChanged) {
        map.flyTo(center, 12, { duration: 1.5 });
      } else if (alerts && alerts.length > 0) {
        const validPoints = alerts
          .map(getAlertLatLng)
          .filter(pos => pos !== null);
        
        if (validPoints.length > 0) {
          const bounds = L.latLngBounds(validPoints);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        } else {
          map.flyTo(center, 11, { duration: 1.5 });
        }
      } else {
        map.flyTo(center, 11, { duration: 1.5 });
      }
    }
  }, [alerts, selectedAlert, center, map]);

  return null;
}

// Function to generate dynamic colors based on your backend 'severity' enum
const getSeverityIcon = (severity) => {
  const colors = {
    critical: '#E53935', // Emergency Red
    high: '#EA580C',     // Orange
    medium: '#CA8A04',    // Yellow
    low: '#16A34A'       // Green
  };

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${colors[severity] || '#3b82f6'}; 
               width: 15px; height: 15px; border-radius: 50%; 
               border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
           </div>`,
    iconSize: [15, 15],
    iconAnchor: [7, 7]
  });
};

/**
 * Helper to extract lat/lng from an alert, supporting both GeoJSON and legacy formats.
 */
const getAlertLatLng = (alert) => {
  // GeoJSON format: location.coordinates = [lng, lat]
  if (alert.location?.coordinates?.length === 2) {
    return [alert.location.coordinates[1], alert.location.coordinates[0]];
  }
  // Legacy format: location.lat, location.lng
  if (alert.location?.lat != null && alert.location?.lng != null) {
    return [alert.location.lat, alert.location.lng];
  }
  return null;
};

/**
 * Custom Marker component to handle opening Leaflet Popups programmatically
 * when selected from the Alert Feed Sidebar.
 */
const AlertMarker = ({ alert, selectedAlert, onPopupClose, onSelectAlert }) => {
  const markerRef = useRef(null);
  const isSelected = selectedAlert?._id === alert._id;

  useEffect(() => {
    if (isSelected && markerRef.current) {
      // Small timeout ensures MapBoundsManager pan completes before opening popup
      const timer = setTimeout(() => {
        markerRef.current.openPopup();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSelected, selectedAlert]);

  const pos = getAlertLatLng(alert);
  if (!pos) return null;

  return (
    <Marker 
      ref={markerRef}
      position={pos}
      icon={getSeverityIcon(alert.severity)}
      eventHandlers={{
        click: () => {
          if (onSelectAlert) {
            onSelectAlert(alert);
          }
        },
        popupclose: () => {
          if (isSelected && onPopupClose) {
            onPopupClose();
          }
        }
      }}
    >
      <Popup className="custom-popup">
        <div className="p-1">
          <h4 className="font-extrabold text-black uppercase text-xs">{alert.severity} Priority</h4>
          <h3 className="font-bold text-sm mt-1">{alert.title}</h3>
          <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
          <div className="mt-2 text-[10px] font-bold text-slate-400">
             Region: {alert.region}
             {alert.district && ` | District: ${alert.district}`}
          </div>
          {alert.source === 'openweather' && (
            <div className="mt-1 text-[10px] text-sky-600 font-bold">
              🌡️ {alert.temperature}°C | 💨 {alert.windSpeed} km/h
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

const AlertMap = ({ alerts, selectedAlert, mapCenter, onPopupClose, onSelectAlert }) => {
  // Use provided center or default to Colombo
  const center = mapCenter || [6.9271, 79.8612];

  return (
    <div className="relative h-[543px] w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Cleaner UI
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic Map Bounds and Recenter Manager */}
        <MapBoundsManager
          alerts={alerts}
          selectedAlert={selectedAlert}
          center={center}
        />

        {/* Map through your real backend alerts using Custom AlertMarker */}
        {alerts.map((alert) => (
          <AlertMarker 
            key={alert._id || alert.id} 
            alert={alert}
            selectedAlert={selectedAlert}
            onPopupClose={onPopupClose}
            onSelectAlert={onSelectAlert}
          />
        ))}
      </MapContainer>
      
      {/* Visual branding as per your UI report */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/80 px-2 py-1 rounded text-[10px] font-bold text-slate-500">
        Live Security Feed | Sri Lanka
      </div>

      {/* Color legend overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(100,116,139,0.25)',
          borderRadius: '10px',
          padding: '8px 14px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          pointerEvents: 'none',
        }}
      >
        <p style={{ margin: '0 0 7px 0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569' }}>
          Priority Level
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[
            { color: '#E53935', label: 'Critical' },
            { color: '#F97316', label: 'High' },
            { color: '#EAB308', label: 'Medium' },
            { color: '#22C55E', label: 'Low' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '11px',
                  height: '11px',
                  borderRadius: '50%',
                  background: color,
                  flexShrink: 0,
                  border: '2px solid rgba(0,0,0,0.15)',
                  boxShadow: `0 0 0 3px ${color}33`,
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertMap;