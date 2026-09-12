import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, CarFront, Inbox, Loader2 } from "lucide-react";
import axios from "axios";
import { RequestDetailsModal } from "../../../components/Renter/requestDetailsModal";

const filterTabs = [
  { label: "All Requests", value: "ALL" },
  { label: "Pending", value: "PENDING" }, // Awaiting your approval
  { label: "Approved", value: "APPROVED" }, // Accepted / Confirmed
  { label: "Declined", value: "DECLINED" }, // Cancelled / Expired
  { label: "Completed", value: "COMPLETED" }, // Completed
];

function RentalRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  useEffect(() => {
    let isMounted = true;

    const loadRequests = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("renterToken") ||
          localStorage.getItem("userToken");

        const res = await axios.get(
          resolveApiUrl("/renter/bookings/requests"),
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );

        if (isMounted) {
          setRequests(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Failed to load rental requests:", err.message);
        if (isMounted) {
          setRequests([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const handleActionSuccess = useCallback(() => {
    setSelectedRequest(null);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
      case "NOT BIDDED":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "CONFIRMED":
      case "WON":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "COMPLETED":
        return "bg-teal-50 text-teal-700 border border-teal-200";
      case "CANCELLED":
      case "EXPIRED":
        return "bg-red-50 text-red-500 border border-red-100";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  // Filter pipeline (Tab selection + Search query)
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      let matchesTab = true;

      if (activeTab === "PENDING") {
        matchesTab =
          (request.status === "PENDING" || request.status === "NOT BIDDED") &&
          !request.isExpired;
      } else if (activeTab === "APPROVED") {
        matchesTab =
          (request.status === "CONFIRMED" || request.status === "WON") &&
          !request.isExpired;
      } else if (activeTab === "COMPLETED") {
        matchesTab = request.status === "COMPLETED";
      } else if (activeTab === "DECLINED") {
        matchesTab =
          request.isExpired ||
          request.status === "CANCELLED" ||
          request.status === "EXPIRED";
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        request.name?.toLowerCase().includes(q) ||
        request.route?.toLowerCase().includes(q) ||
        request.vehicle?.toLowerCase().includes(q) ||
        request.country?.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchQuery]);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mt-8 lg:mt-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Rental Requests
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Review, accept, or decline booking requests from tourists
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by route, vehicle, or name..."
              className="w-full border border-slate-200 bg-slate-100/80 text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400 text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center justify-center md:justify-start gap-1 md:gap-3 pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap border cursor-pointer ${
              activeTab === tab.value
                ? "bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-200"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Requests List */}
      <div className="flex flex-col gap-4 pb-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-sm font-semibold">Loading rental requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((request) => {
            const reqId = request.id || request._id;
            return (
              <div
                key={reqId}
                className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100/80 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                {/* Profile Section */}
                <div className="flex items-center gap-4 min-w-50">
                  {request.avatar ? (
                    <img
                      src={request.avatar}
                      alt={request.name}
                      className="w-14 h-14 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-lg shrink-0">
                      {request.name
                        ? request.name.charAt(0).toUpperCase()
                        : "T"}
                    </div>
                  )}
                  <div>
                    <h3
                      className={`text-base font-extrabold ${
                        request.isExpired ? "text-slate-500" : "text-slate-900"
                      }`}
                    >
                      {request.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">
                      {request.country}
                    </p>
                  </div>
                </div>

                {/* Middle Grid Info */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-4">
                  {/* Route & Duration */}
                  <div className="w-full flex flex-col items-center">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                      Route & Duration
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        request.isExpired
                          ? "text-slate-400 line-through"
                          : "text-slate-800"
                      }`}
                    >
                      {request.route}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        request.isExpired ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {request.duration}
                    </p>
                  </div>

                  {/* Vehicle Preference */}
                  <div className="w-full flex flex-col items-center">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                      Vehicle Preference
                    </p>
                    <div className="flex items-center gap-2">
                      <CarFront
                        size={16}
                        className={
                          request.isExpired
                            ? "text-slate-400"
                            : "text-orange-500"
                        }
                      />
                      <p
                        className={`text-sm font-bold ${
                          request.isExpired
                            ? "text-slate-400"
                            : "text-slate-800"
                        }`}
                      >
                        {request.vehicle}
                      </p>
                    </div>
                  </div>

                  {/* Request Status Badge */}
                  <div className="w-full flex flex-col items-center">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                      Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusStyles(
                        request.status,
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="shrink-0 mt-4 md:mt-0">
                  <button
                    type="button"
                    disabled={request.isExpired}
                    onClick={() => setSelectedRequest(request)}
                    className={`w-full md:w-auto px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                      request.isExpired
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-[#2563EB] text-white hover:bg-blue-700 shadow-blue-200 cursor-pointer"
                    }`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 flex flex-col items-center justify-center gap-3">
            <div className="p-4 bg-slate-50 rounded-full text-slate-400">
              <Inbox size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-700">
              No rental requests found
            </h3>
            <p className="text-sm text-slate-400 max-w-sm">
              There are currently no requests matching this filter.
            </p>
          </div>
        )}
      </div>

      <RequestDetailsModal
        isOpen={Boolean(selectedRequest)}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onActionSuccess={handleActionSuccess}
      />
    </div>
  );
}

export default RentalRequestsPage;
