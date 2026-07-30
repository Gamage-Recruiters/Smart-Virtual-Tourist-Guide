import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { myLocationIcon } from '../../utils/mapUtils'

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
 * @param {Array} props.polyline - Array of [lat, lng] coordinates to draw as a route polyline
 * @param {string} props.polylineColor - Color of the route polyline (default: '#2563EB')
 * @param {Function} props.onPopupAction - Callback when a .popup-go-btn inside a popup is clicked: ({ lat, lng, name, type }) => {}
 */
export default function MapContainer({
  latitude = 6.9271,
  longitude = 80.7789,
  center = null,
  zoom = 13,
  className = '',
  minHeight = '400px',
  markers = [],
  userLocation = null,
  onMapClick = null,
  interactive = true,
  tileProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  polyline = null,
  polylineColor = '#2563EB',
  onPopupAction = null,
  showControls = true,
}) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const poiMarkersRef = useRef([])
  const userMarkerRef = useRef(null)
  const polylineRef = useRef(null)
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
        attributionControl: showControls,
        zoomControl: showControls,
      }).setView([mapCenterLat, mapCenterLng], zoom)

      L.tileLayer(tileProvider, { attribution }).addTo(map)

      mapInstanceRef.current = map
    }
  }, [interactive, showControls, tileProvider, attribution, mapCenterLat, mapCenterLng, zoom])

  //add smooth pan animation so the re-center is visible
  useEffect(() => {
    if (!mapInstanceRef.current) return
    mapInstanceRef.current.setView(
      [mapCenterLat, mapCenterLng],
      zoom,
      { animate: true, duration: 1.0 }   //smooth pan instead of instant jump
    )
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

    // Clear existing POI markers
    poiMarkersRef.current.forEach((m) => m.remove())
    poiMarkersRef.current = []

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

      poiMarkersRef.current.push(marker)
    })
  }, [markers])

  // Draw / update route polyline
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Remove old polyline
    if (polylineRef.current) {
      polylineRef.current.remove()
      polylineRef.current = null
    }

    // Draw new polyline if coordinates exist
    if (polyline && polyline.length > 1) {
      polylineRef.current = L.polyline(polyline, {
        color: polylineColor,
        weight: 5,
        opacity: 0.8,
        smoothFactor: 1,
      }).addTo(mapInstanceRef.current)

      // Fit the map to show the entire route
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), {
        padding: [40, 40],
      })
    }
  }, [polyline, polylineColor])

  // Event delegation for popup GO buttons
  useEffect(() => {
    if (!mapInstanceRef.current || !onPopupAction) return

    const container = mapRef.current
    const handler = (e) => {
      const btn = e.target.closest('.popup-go-btn')
      if (btn) {
        e.stopPropagation()
        onPopupAction({
          lat: parseFloat(btn.dataset.lat),
          lng: parseFloat(btn.dataset.lng),
          name: decodeURIComponent(btn.dataset.name || 'Destination'),
          type: btn.dataset.type || 'location',
        })
      }
    }
    container.addEventListener('click', handler)
    return () => container.removeEventListener('click', handler)
  }, [onPopupAction])

  // Update user's live location marker in place (no re-add)
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation?.latitude) return
    const latLng = [userLocation.latitude, userLocation.longitude]

    // Check if marker exists AND is still attached to the map
    // (StrictMode cleanup may have removed it while leaving the ref non-null)
    if (userMarkerRef.current && userMarkerRef.current._map) {
      userMarkerRef.current.setLatLng(latLng)
    } else {
      // Remove stale marker if it exists but was detached
      if (userMarkerRef.current) userMarkerRef.current.remove()
      userMarkerRef.current = L.marker(latLng, {
        icon: L.divIcon(myLocationIcon.options),
      })
        .bindPopup('<strong>📍 Your Current Location</strong>')
        .addTo(mapInstanceRef.current)
    }
  }, [userLocation])

  // Cleanup on unmount — null refs so StrictMode remount creates fresh markers
  useEffect(() => {
    return () => {
      poiMarkersRef.current.forEach((m) => m.remove())
      poiMarkersRef.current = []
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
        userMarkerRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mapRef}
      className={`w-full h-full rounded-lg overflow-hidden shadow-md ${className}`}
      style={{ minHeight }}
    />
  )
}
