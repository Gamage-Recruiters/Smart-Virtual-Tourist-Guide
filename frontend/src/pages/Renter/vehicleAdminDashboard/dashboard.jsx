import {
  Bell,
  Plus,
  Banknote,
  Truck,
  Star,
  Loader2,
  Car,
  KeyRound,
} from "lucide-react";
import AddVehicleModal from "./addVehicle/addVehicleModal";
import { RequestDetailsModal } from "../../../components/Renter/requestDetailsModal";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fleetData, setFleetData] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const token =
    localStorage.getItem("renterToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState(Boolean(token));

  const resolveApiUrl = (path = "") => {
    const base = (
      import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:5000/api"
    ).replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return base.includes("/api")
      ? `${base}${normalizedPath}`
      : `${base}/api${normalizedPath}`;
  };

  const normalizeFleetData = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.vehicles)) return payload.vehicles;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Fetch Fleet, Earnings stats, and Live Rental Requests simultaneously
        const [fleetRes, statsRes, requestsRes] = await Promise.allSettled([
          axios.get(resolveApiUrl("/vehicle/recent"), { headers }),
          axios.get(resolveApiUrl("/renter/earnings/dashboard-stats"), {
            headers,
          }),
          axios.get(resolveApiUrl("/renter/bookings/requests"), { headers }),
        ]);

        if (isMounted) {
          if (fleetRes.status === "fulfilled") {
            setFleetData(normalizeFleetData(fleetRes.value.data));
          }
          if (statsRes.status === "fulfilled") {
            setDashboardStats(statsRes.value.data);
          }
          if (requestsRes.status === "fulfilled") {
            const list = Array.isArray(requestsRes.value.data)
              ? requestsRes.value.data
              : [];
            // Show only the latest 3-5 requests on the dashboard
            setRecentRequests(list.slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (token) {
      fetchDashboardData();
    }

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger, token]);

  // 4 Top Metric Cards
  const statsData = [
    {
      title: "TOTAL EARNINGS",
      value: dashboardStats?.totalEarnings
        ? Number(dashboardStats.totalEarnings).toLocaleString()
        : "0",
      suffix: " LKR",
      icon: Banknote,
      color: "text-blue-600",
      bg: "bg-blue-50",
      // badge: "+12% ↑",
      badgeColor: "text-green-500",
    },
    {
      title: "ACTIVE RENTALS",
      value: dashboardStats?.activeRenatalsCount || "0",
      icon: Truck,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      badge: "● Available",
      badgeColor: "text-emerald-500",
    },
    {
      title: "RENTED VEHICLES",
      value: dashboardStats?.rentedVehiclesCount || "0",
      icon: KeyRound,
      color: "text-amber-500",
      bg: "bg-amber-50",
      badge: "On Trip",
      badgeColor: "text-amber-600",
    },
    {
      title: "AVG. RATING",
      value: dashboardStats?.averageRating || "4.9",
      suffix: " / 5.0",
      icon: Star,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "NOT BIDDED":
        return "text-blue-600 bg-blue-50";
      case "CONFIRMED":
      case "WON":
        return "text-emerald-600 bg-emerald-50";
      case "BID SENT":
        return "text-amber-600 bg-amber-50";
      case "CANCELLED":
      case "EXPIRED":
        return "text-red-500 bg-red-50";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Header Section */}
      <header className="flex flex-row md:items-center justify-between gap-4 mt-8 lg:mt-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            DASHBOARD
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Welcome back, Vehicles Rentals of SVTG
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button
            className="flex items-center gap-2 bg-[#2563EB] text-white px-2.5 lg:px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} strokeWidth={3} />
            <span className="hidden lg:block">ADD NEW VEHICLE</span>
          </button>
        </div>
        <AddVehicleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onMutationSuccess={() => setRefreshTrigger((prev) => prev + 1)}
        />
      </header>

      {/* 2. Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/50 flex flex-col justify-between h-40"
          >
            <div className="flex justify-between items-start">
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
                {isLoading ? (
                  <span className="animate-pulse text-sm text-slate-300">
                    Loading...
                  </span>
                ) : (
                  <>
                    {stat.value}
                    <span className="text-sm text-slate-400 font-bold ml-1">
                      {stat.suffix}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Main Content (Requests & Fleet) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Latest Tourist Requests (Live API Data) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  LATEST TOURIST REQUESTS
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Recent rental bookings and incoming bid requests
                </p>
              </div>
              <Link
                to="/vehicle-admin/requests"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                View All Requests →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-4 font-bold">Tourist</th>
                    <th className="pb-4 font-bold">Requested Vehicle</th>
                    <th className="pb-4 font-bold">Route / Duration</th>
                    <th className="pb-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-14 text-center text-slate-400"
                      >
                        <Loader2
                          className="animate-spin inline mr-2 text-blue-600"
                          size={20}
                        />
                        Loading recent requests...
                      </td>
                    </tr>
                  ) : recentRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-14 text-center text-slate-400 text-sm font-medium"
                      >
                        No pending rental requests for your vehicles.
                      </td>
                    </tr>
                  ) : (
                    recentRequests.map((req) => {
                      const reqId = req.id || req._id;
                      const isCustomBid =
                        req.isBid ||
                        (req.offeredRate &&
                          req.OriginalRate &&
                          req.offeredRate !== req.OriginalRate);

                      return (
                        <tr
                          key={reqId}
                          className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Tourist Info */}
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              {req.avatar ? (
                                <img
                                  src={req.avatar}
                                  alt={req.name}
                                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm shrink-0">
                                  {req.name
                                    ? req.name.charAt(0).toUpperCase()
                                    : "T"}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {req.name}
                                </p>
                                <p className="text-xs text-slate-500 font-medium">
                                  {req.country}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Vehicle Name & Offer Badge */}
                          <td className="py-4">
                            <p className="text-sm font-bold text-slate-800">
                              {req.vehicle}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadge(
                                  req.status,
                                )}`}
                              >
                                {req.status}
                              </span>
                              {isCustomBid && (
                                <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200/50">
                                  Bid Offer
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Route & Duration */}
                          <td className="py-4">
                            <p className="text-sm font-bold text-slate-900 capitalize">
                              {req.route}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              {req.duration}
                            </p>
                          </td>

                          {/* Action */}
                          <td className="py-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRequest(req)}
                              className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Fleet Status */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/50 flex flex-col h-full min-h-95">
          <h2 className="text-lg font-extrabold text-slate-900 mb-6">
            FLEET STATUS
          </h2>

          <div className="flex flex-col gap-2 flex-1 justify-center">
            {isLoading ? (
              <div className="flex flex-col gap-4 items-center justify-center py-8 text-slate-400">
                <Loader2
                  size={28}
                  className="animate-spin text-blue-600 mb-2"
                />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Fetching fleet data...
                </p>
              </div>
            ) : fleetData.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8 px-4 border border-dashed border-slate-100 rounded-2xl bg-slate-50/50 my-auto">
                <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-3">
                  <Car size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  No Vehicles Registered
                </h3>
                <p className="text-xs text-slate-400 font-medium max-w-50 mt-1 leading-normal">
                  Your vehicle listing is currently empty.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 overflow-y-auto max-h-80 pr-1">
                {fleetData.map((car) => (
                  <div
                    key={car._id}
                    className="flex items-center gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                  >
                    <img
                      src={
                        car?.photos?.exterior ||
                        "https://via.placeholder.com/64"
                      }
                      alt={car.brand}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-slate-900 leading-none">
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

      {/* Details Modal for Dashboard Requests */}
      <RequestDetailsModal
        isOpen={Boolean(selectedRequest)}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onActionSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
}

export default Dashboard;
