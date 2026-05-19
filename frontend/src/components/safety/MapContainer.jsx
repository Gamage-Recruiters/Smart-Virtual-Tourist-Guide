import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

/**
 * Reusable Leaflet map container component
 * @param {Object} props
 * @param {number} props.latitude - Center latitude
 * @param {number} props.longitude - Center longitude
 * @param {number} props.zoom - Zoom level (default: 13)
 * @param {string} props.className - CSS class name
 * @param {Array} props.markers - Array of marker objects: { lat, lng, popup, icon }
 * @param {Function} props.onMapClick - Callback when map is clicked: (lat, lng) => {}
 * @param {boolean} props.interactive - Enable/disable map interactivity (default: true)
 * @param {string} props.tileProvider - Tile provider URL
 */
export default function MapContainer({
  latitude = 6.9271,
  longitude = 80.7789,
  center = null,
  zoom = 13,
  className = '',
  minHeight = '400px',
  markers = [],
  onMapClick = null,
  interactive = true,
  tileProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const mapCenter = center || [latitude, longitude]
  const mapCenterLat = mapCenter[0]
  const mapCenterLng = mapCenter[1]

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        scrollWheelZoom: interactive,
        dragging: interactive,
        touchZoom: interactive,
      }).setView([mapCenterLat, mapCenterLng], zoom)

      L.tileLayer(tileProvider, { attribution }).addTo(map)

      mapInstanceRef.current = map
    }
  }, [interactive, tileProvider, attribution, mapCenterLat, mapCenterLng, zoom])

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([mapCenterLat, mapCenterLng], zoom)
    }
  }, [mapCenterLat, mapCenterLng, zoom])

  useEffect(() => {
    if (!mapInstanceRef.current || !onMapClick || !interactive) return undefined

    const handleClick = (event) => {
      onMapClick(event.latlng.lat, event.latlng.lng)
    }

    mapInstanceRef.current.on('click', handleClick)

    return () => {
      mapInstanceRef.current?.off('click', handleClick)
    }
  }, [onMapClick, interactive])

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      marker.remove()
    })
    markersRef.current = {}

    // Add new markers
    markers.forEach((markerData, index) => {
      const { lat, lng, popup, icon = null, color = 'blue' } = markerData

      let markerIcon = L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      if (icon) {
        markerIcon = icon
      }

      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(mapInstanceRef.current)

      if (popup) {
        marker.bindPopup(popup)
      }

      markersRef.current[index] = marker
    })
  }, [markers])

  return (
    <div
      ref={mapRef}
      className={`w-full h-full rounded-lg overflow-hidden shadow-md ${className}`}
      style={{ minHeight }}
    />
  )
}
