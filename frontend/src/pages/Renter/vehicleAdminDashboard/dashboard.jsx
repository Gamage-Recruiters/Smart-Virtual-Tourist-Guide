import {
  Bell,
  Plus,
  Banknote,
  Truck,
  Star,
  CreditCard,
  Loader2,
  Car,
} from "lucide-react";
import AddVehicleModal from "./addVehicle/addVehicleModal";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// --- Notification System Imports ---
import { useDispatch, useSelector } from 'react-redux'; // Redux hooks for state management
import { toggleNotificationModal } from '../../../store/slices/notificationSlice'; // Action to toggle the notification modal
import NotificationModal from '../../../components/notifications/NotificationModal'; // The notification popup component
import LocationSelector from '../../../components/notifications/LocationSelector'; // The location selector popup component
// Note: Adjust the import paths above if your folder structure is different
// -----------------------------------

// --- MOCK DATA ---
const statsData = [
  {
    title: "TOTAL EARNINGS",
    value: "452,000",
    suffix: " LKR",
    icon: Banknote,
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "+12% ↑",
    badgeColor: "text-green-500",
  },
  {
    title: "ACTIVE RENTALS",
    value: "04",
    icon: Truck,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    badge: "Live",
    badgeColor: "text-slate-400",
  },
  {
    title: "AVG. RATING",
    value: "4.9",
    suffix: " / 5.0",
    icon: Star,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    title: "AVAILABLE PAYOUT",
    value: "84,500",
    suffix: " LKR",
    icon: CreditCard,
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

const requestsData = [
  {
    id: 1,
    name: "Marcus Berg",
    country: "Germany 🇩🇪",
    type: "SUV LUXURY",
    typeColor: "text-blue-600 bg-blue-50",
    route: "Colombo ➔ Ella",
    duration: "4 Days (Apr 12 - 16)",
  },
  {
    id: 2,
    name: "Elena Petrova",
    country: "Russia 🇷🇺",
    type: "MINI VAN",
    typeColor: "text-yellow-600 bg-yellow-50",
    route: "Kandy ➔ Sigiriya",
    duration: "2 Days (Apr 14 - 15)",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    country: "UK 🇬🇧",
    type: "SEDAN",
    typeColor: "text-green-600 bg-green-50",
    route: "Galle Coast",
    duration: "1 Day (Tomorrow)",
  },
];

function Dashboard() {
  const [isModdalOpen, setIsModdalOpen] = useState(false);
  const [fleetData, setFleetData] = useState([]);
  const [isFleetLoading, setIsFleetLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- Redux hooks for Notification System ---
  const dispatch = useDispatch();
  // Get the unread notification count from the Redux store
  const unreadCount = useSelector((state) => state.notifications?.unreadCount || 0);
  // -------------------------------------------

  const token = localStorage.getItem("renterToken") || localStorage.getItem("token");

  const resolveApiUrl = (path = "") => {
    const base = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return base.includes("/api") ? `${base}${normalizedPath}` : `${base}/api${normalizedPath}`;
  };

  const normalizeFleetData = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.vehicles)) return payload.vehicles;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
  };

  useEffect(() => {
    // --- Data Sync for Socket Connection ---
    // Sync renter user data to generic userData keys so the socket context can identify the user
    const rUser = localStorage.getItem('renterUser');
    const rToken = localStorage.getItem('renterToken');
    
    if (rUser && rToken) {
      localStorage.setItem('userData', rUser); 
      localStorage.setItem('token', rToken); 
    }
    // ---------------------------------------

    axios
      .get(resolveApiUrl("/vehicle/recent"), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFleetData(normalizeFleetData(res.data));
        setIsFleetLoading(false);
      })
      .catch((e) => {
        console.error(e.message);
        setFleetData([]);
        setIsFleetLoading(false);
      });
  }, [refreshTrigger, token]);

  return (
    <>
      {/* Location Selector Component: Asks for user's current city on login */}
      <LocationSelector />

      {/* Notification Modal Component: Displays notifications when the bell is clicked */}
      <NotificationModal />

      <div className="flex flex-col gap-8">
        {/* 1. Header Section */}
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              DASHBOARD
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Welcome back, Vehicles Rentals of SVTG
            </p>
          </div>
          <div className="flex items-center gap-4">
            
            {/* --- Notification Bell Button --- */}
            <button 
              className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => dispatch(toggleNotificationModal())} // Dispatches action to open the modal
            >
              <Bell size={20} className="text-slate-600" />
              
              {/* Unread Count Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-[20px] bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white shadow-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {/* -------------------------------------- */}

            <button
              className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors cursor-pointer"
              onClick={() => setIsModdalOpen(true)}
            >
              <Plus size={18} strokeWidth={3} />
              ADD NEW VEHICLE
            </button>
          </div>
          <AddVehicleModal
            isOpen={isModdalOpen}
            onClose={() => setIsModdalOpen(false)}
            onMutationSuccess={() => setRefreshTrigger((prev) => prev + 1)}
          />
        </header>

        {/* 2. Stats Grid */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col justify-between h-40 p-6 bg-white border shadow-sm rounded-3xl border-slate-100/50"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                {stat.badge && (
                  <span className={`text-xs font-bold ${stat.badgeColor}`}>
                    {stat.badge}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-[10px] font-extrabold text-slate-400 tracking-widest mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-extrabold text-slate-900">
                  {stat.value}
                  <span className="text-sm font-bold text-slate-400">
                    {stat.suffix}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* 3. Main Content (Requests & Fleet) */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Latest Tourist Requests */}
          <div className="p-6 bg-white border shadow-sm lg:col-span-2 rounded-3xl border-slate-100/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-extrabold text-slate-900">
                LATEST TOURIST REQUESTS
              </h2>
              <Link
                to="/vehicle-admin/requests"
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs tracking-widest uppercase border-b text-slate-400 border-slate-100">
                    <th className="pb-4 font-bold">Tourist</th>
                    <th className="pb-4 font-bold">Vehicle Type</th>
                    <th className="pb-4 font-bold">Route / Duration</th>
                    <th className="pb-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsData.map((req) => (
                    <tr
                      key={req.id}
                      className="transition-colors border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {req.name}
                            </p>
                            <p className="text-xs font-medium text-slate-500">
                              {req.country}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full ${req.typeColor}`}
                        >
                          {req.type}
                        </span>
                      </td>
                      <td className="py-4">
                        <p className="text-sm font-bold text-slate-900">
                          {req.route}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {req.duration}
                        </p>
                      </td>
                      <td className="py-4 text-right">
                        <button className="bg-[#2563EB] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-100">
                          Submit Bid
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Fleet Status with conditional rendering states */}
          <div className="flex flex-col h-full p-6 bg-white border shadow-sm rounded-3xl border-slate-100/50 min-h-95">
            <h2 className="mb-6 text-lg font-extrabold text-slate-900">
              FLEET STATUS
            </h2>

            <div className="flex flex-col justify-center flex-1 gap-2">
              {isFleetLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8 text-slate-400">
                  <Loader2
                    size={28}
                    className="mb-2 text-blue-600 animate-spin"
                  />
                  <p className="text-xs font-bold tracking-wider uppercase text-slate-400">
                    Fetching fleet data...
                  </p>
                </div>
              ) : fleetData.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-8 my-auto text-center border border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                  <div className="p-4 mb-3 rounded-full bg-slate-100 text-slate-400">
                    <Car size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    No Vehicles Registered
                  </h3>
                  <p className="mt-1 text-xs font-medium leading-normal text-slate-400 max-w-50">
                    Your vehicle listing is currently empty.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1 pr-1 overflow-y-auto max-h-80">
                  {fleetData.map((car) => (
                    <div
                      key={car._id}
                      className="flex items-center gap-4 p-2 transition-colors border border-transparent rounded-2xl hover:bg-slate-50 hover:border-slate-100"
                    >
                      <img
                        src={car?.photos?.exterior || "https://via.placeholder.com/64"}
                        alt={car.brand}
                        className="object-cover w-16 h-16 rounded-xl bg-slate-100"
                      />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold leading-none text-slate-900">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {car.licensePlate}
                        </p>
                        <div>
                          <span
                            className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                              car.status === "Available"
                                ? "text-green-600 bg-green-50"
                                : "text-orange-600 bg-orange-50"
                            }`}
                          >
                            {car.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/vehicle-admin/fleet"
              className="mt-6 w-full py-3.5 text-center rounded-2xl border-2 border-dashed border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors block"
            >
              Manage Fleet
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard;