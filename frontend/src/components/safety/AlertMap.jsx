import React, { useEffect } from 'react';
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

// Helper component to handle map panning when an alert is selected
function MapRecenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
  }, [position, map]);
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

const AlertMap = ({ alerts, selectedAlert }) => {
  // Center of Sri Lanka (Colombo) as default
  const defaultCenter = [6.9271, 79.8612];

  return (
    <div className="relative h-[543px] w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      <MapContainer 
        center={defaultCenter} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Cleaner UI
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Recenter logic: Pans map when user clicks an alert in the feed */}
        {selectedAlert && (
          <MapRecenter position={[selectedAlert.location.lat, selectedAlert.location.lng]} />
        )}

        {/* Map through your real backend alerts */}
        {alerts.map((alert) => (
          <Marker 
            key={alert._id || alert.id} 
            position={[alert.location.lat, alert.location.lng]}
            icon={getSeverityIcon(alert.severity)}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h4 className="font-extrabold text-black uppercase text-xs">{alert.severity} Priority</h4>
                <h3 className="font-bold text-sm mt-1">{alert.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                <div className="mt-2 text-[10px] font-bold text-slate-400">
                   Region: {alert.region}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Visual branding as per your UI report */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/80 px-2 py-1 rounded text-[10px] font-bold text-slate-500">
        Live Security Feed | Sri Lanka
      </div>
    </div>
  );
};

export default AlertMap;