import { useMemo, useState, useEffect } from 'react';
import { FiSearch, FiLoader } from 'react-icons/fi';
import safetyService from '../../services/safetyService';
import AlertMap from '../../components/safety/AlertMap';
import AlertCard from '../../components/safety/AlertCard';

export default function SecurityAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);

  // 1. Fetch data from your frozen backend on mount
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await safetyService.getSecurityAlerts();
        setAlerts(data);
      } catch (error) {
        console.error("Failed to load security alerts");
      } finally {
        setLoading(false);
      }
    };
    loadAlerts();
  }, []);

  // 2. Filter logic based on search input
  const filteredAlerts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return alerts;
    return alerts.filter((alert) =>
      `${alert.title} ${alert.description} ${alert.region}`.toLowerCase().includes(query)
    );
  }, [alerts, search]);

  return (
    <main className="min-h-screen bg-[#F6F8FA] px-6 py-7 md:px-9">
      {/* Main Content Area */}
      <div className="mx-auto max-w-[1160px]">
            
            {/* Search Bar */}
            <div className="relative mx-auto block w-full max-w-[450px] mb-6">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search district or threat type..."
                className="h-[45px] w-full border border-slate-200 rounded-full bg-white px-6 pr-12 text-sm shadow-sm focus:border-[#2E5C88] outline-none transition-all"
              />
              <FiSearch className="absolute right-4 top-3.5 text-slate-400" size={18} />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
                <FiLoader className="animate-spin mb-2" size={30} />
                <p>Syncing with Security Feed...</p>
              </div>
            ) : (
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_350px]">
                
                {/* 3. The Real Leaflet Map */}
                <div className="order-2 xl:order-1">
                   <AlertMap 
                     alerts={filteredAlerts} 
                     selectedAlert={selectedAlert} 
                   />
                </div>

                {/* 4. The Live Feed Sidebar */}
                <div className="order-1 xl:order-2 flex flex-col h-[543px]">
                   <div className="mb-4">
                      <h2 className="text-lg font-extrabold text-black">Live Feed</h2>
                      <p className="text-xs text-slate-500">Real-time alerts from local authorities</p>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                      {filteredAlerts.length > 0 ? (
                        filteredAlerts.map((alert) => (
                          <AlertCard 
                            key={alert._id} 
                            alert={alert} 
                            isSelected={selectedAlert?._id === alert._id}
                            onSelect={() => setSelectedAlert(alert)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                           <p className="text-slate-400 text-sm font-medium">No active threats detected<br/>in this area.</p>
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
