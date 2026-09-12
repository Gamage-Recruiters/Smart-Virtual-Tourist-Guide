import { useEffect, useState } from "react";
import { X, Calendar, MapPin, CarFront, Loader2, Clock, CheckCircle2, XCircle } from "lucide-react";
import axios from "axios";

export const MyBookingsModal = ({ isOpen, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const resolveApiUrl = (path = "") => {
    const base = (
      import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:5000/api"
    ).replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return base.includes("/api") ? `${base}${normalizedPath}` : `${base}/api${normalizedPath}`;
  };

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const token =
          localStorage.getItem("touristToken") ||
          localStorage.getItem("token") ||
          localStorage.getItem("userToken");

        const res = await axios.get(resolveApiUrl("/tourist/rent-vehicle-booking/my-bookings"), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (isMounted) {
          setBookings(res.data?.data || []);
        }
      } catch (err) {
        console.error("Error fetching tourist bookings:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "CONFIRMED":
      case "WON":
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <CheckCircle2 size={12} /> Confirmed / Rented
          </span>
        );
      case "COMPLETED":
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            <CheckCircle2 size={12} /> Completed Trip
          </span>
        );
      case "CANCELLED":
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
            <XCircle size={12} /> Declined / Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
            <Clock size={12} /> Waiting for Owner
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">My Rental Bookings</h2>
            <p className="text-xs text-slate-400 font-medium">Track your requested and confirmed trips</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Bookings List */}
        <div className="overflow-y-auto flex-1 py-4 space-y-4 pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 className="animate-spin text-blue-600" size={28} />
              <p className="text-xs font-semibold">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CarFront size={40} className="mx-auto mb-2 text-slate-300" strokeWidth={1.5} />
              <p className="text-sm font-bold text-slate-700">No bookings yet</p>
              <p className="text-xs text-slate-400 mt-1">Explore vehicles and submit your first rental offer.</p>
            </div>
          ) : (
            bookings.map((booking) => {
              const car = booking.vehicleId;
              const photo = car?.photos?.exterior || "https://via.placeholder.com/80";

              return (
                <div
                  key={booking._id}
                  className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:border-slate-200 transition-colors"
                >
                  <div className="flex gap-3.5 items-center">
                    <img
                      src={photo}
                      alt={car?.brand || "Vehicle"}
                      className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {car ? `${car.brand} ${car.model}` : "Vehicle Details"}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
                        <MapPin size={13} className="text-blue-600" />
                        <span>{booking.route}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                        <Calendar size={13} />
                        <span>{booking.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                    {getStatusBadge(booking.status)}
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-extrabold text-slate-400">Total Price</p>
                      <p className="text-sm font-black text-blue-600">
                        LKR {booking.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};