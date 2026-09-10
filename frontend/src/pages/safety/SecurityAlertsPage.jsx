import { useState, useEffect, useCallback } from 'react';
import { FiMapPin } from 'react-icons/fi';
import safetyService from '../../services/safety/safetyService';
import AlertMap from '../../components/safety/AlertMap';
import AlertCard from '../../components/safety/AlertCard';
import LocationSearchBar from '../../components/safety/LocationSearchBar';
import LoadingSpinner from '../../components/safety/LoadingSpinner';
import { useAutoRefresh } from '../../hooks/safety/useAutoRefresh';

// Default to Colombo, Sri Lanka
const DEFAULT_COORDS = { lat: 6.9271, lng: 79.8612 };

export default function SecurityAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [mapCenter, setMapCenter] = useState([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng]);
  const [searchedLocation, setSearchedLocation] = useState('Colombo');

  // Fetch all alerts in Sri Lanka
  const fetchAlerts = useCallback(async () => {
    try {
      const data = await safetyService.getSecurityAlerts({});
      setAlerts(data);
    } catch (error) {
      console.error('Failed to load security alerts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Auto-refresh every 5 minutes
  useAutoRefresh(fetchAlerts);

  // Handle location selected from search bar
  const handleLocationSelect = useCallback((coords, name) => {
    setMapCenter([coords.lat, coords.lng]);
    setSearchedLocation(name);
    setSelectedAlert(null);
  }, []);



  return (
    <main className="min-h-screen bg-[#F6F8FA] px-4 py-5 sm:px-6 md:px-9 sm:py-7">
      {/* Main Content Area */}
      <div className="mx-auto max-w-[1160px]">

        {/* Search Bar with Autocomplete */}
        <LocationSearchBar
          onLocationSelect={handleLocationSelect}
          placeholder="Search location for safety alerts (e.g. Kandy, Galle)"
        />

        {/* Current search location indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-4 text-xs text-slate-500">
          <FiMapPin size={12} />
          {searchedLocation ? (
            <span>Map centered near <strong className="text-slate-700">{searchedLocation}</strong> | Showing all active alerts in Sri Lanka</span>
          ) : (
            <span>Showing all active security alerts in Sri Lanka</span>
          )}
        </div>

        {loading ? (
          <LoadingSpinner message="Syncing with Security Feed..." />
        ) : (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_350px]">

            {/* 3. The Real Leaflet Map */}
            <div className="order-2 xl:order-1">
              <AlertMap
                alerts={alerts}
                selectedAlert={selectedAlert}
                mapCenter={mapCenter}
                onPopupClose={() => setSelectedAlert(null)}
                onSelectAlert={(alert) => setSelectedAlert({ ...alert, clickTimestamp: Date.now() })}
              />
            </div>

            {/* 4. The Live Feed Sidebar */}
            <div className="order-1 xl:order-2 flex flex-col h-[320px] sm:h-[400px] xl:h-[543px]">
              <div className="mb-4">
                <h2 className="text-lg font-extrabold text-black">Alerts Feed</h2>
                <p className="text-xs text-slate-500">Live Active Alerts</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <AlertCard
                      key={alert._id}
                      alert={alert}
                      isSelected={selectedAlert?._id === alert._id}
                      onSelect={() => setSelectedAlert({ ...alert, clickTimestamp: Date.now() })}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm font-medium">No active threats detected<br />in this area.</p>
                  </div>
                )}
              </div>
            </div>

          </section>
        )}
      </div>
    </main>
  );
}
