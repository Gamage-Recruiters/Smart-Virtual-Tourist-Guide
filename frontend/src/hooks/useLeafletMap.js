import { useRef, useState, useEffect } from 'react';
import L from 'leaflet';
import '../utils/leafletSetup'; // ensures default icon fix runs

/**
 * Hook that manages a Leaflet map instance lifecycle.
 *
 * @param {React.RefObject} containerRef - Ref to the DOM element for the map
 * @param {{ center: [number, number], zoom: number }} options
 * @returns {{ mapInstanceRef: React.RefObject<L.Map>, mapReady: boolean }}
 */
export function useLeafletMap(containerRef, options = {}) {
  const mapInstanceRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up existing instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const {
      center = [7.8731, 80.7718],
      zoom = 7,
      zoomControl = true,
    } = options;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl,
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Init once — callers re-center via mapInstanceRef

  return { mapInstanceRef, mapReady };
}
