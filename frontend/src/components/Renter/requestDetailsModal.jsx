import { useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import axios from "axios";

export const RequestDetailsModal = ({
  request,
  isOpen,
  onClose,
  onActionSuccess,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionType, setActionType] = useState(null); // 'accept' | 'decline' | null

  if (!isOpen || !request) return null;

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

  const handleStatusUpdate = async (newStatus) => {
    if (
      newStatus === "CANCELLED" &&
      !window.confirm("Are you sure you want to decline this request?")
    ) {
      return;
    }

    try {
      setIsUpdating(true);
      setActionType(newStatus === "CONFIRMED" ? "accept" : "decline");

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("renterToken") ||
        localStorage.getItem("userToken");

      await axios.patch(
        resolveApiUrl(`/renter/bookings/${request.id}/status`),
        { status: newStatus },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (onActionSuccess) {
        onActionSuccess();
      }
      onClose();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to update request status.");
    } finally {
      setIsUpdating(false);
      setActionType(null);
    }
  };

  const isPending = request.status === "PENDING" || request.status === "NOT BIDDED";
  const offeredPrice = request.offeredRate ?? request.offeredDailyRate ?? 0;
  const originalPrice = request.OriginalRate ?? request.originalDailyPrice ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isUpdating}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Tourist Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          {request.avatar ? (
            <img
              src={request.avatar}
              alt={request.name}
              className="w-14 h-14 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 font-black text-xl flex items-center justify-center">
              {request.name?.charAt(0) || "T"}
            </div>
          )}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {request.name}
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              {request.country}
            </p>
          </div>
        </div>

        {/* Trip Overview */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Route
                </p>
                <p className="text-sm font-bold text-slate-800 capitalize">
                  {request.route}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Duration
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {request.duration}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Financial Breakdown */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Requested Vehicle
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {request.vehicle}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Total Value
                </p>
                <p className="text-base font-black text-blue-600">
                  LKR {request.totalAmount?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* If it was a custom tourist bid, display the rate comparison */}
            {request.isBid || (originalPrice > 0 && offeredPrice !== originalPrice) ? (
              <div className="flex flex-col w-full items-end mt-2 pt-2 border-t border-slate-200/60">
                <p className="text-[12px] font-semibold text-amber-600">
                  Tourist Offered Rate: LKR {offeredPrice.toLocaleString()} / day
                </p>
                {originalPrice > 0 && (
                  <p className="text-[11px] font-medium text-slate-400 line-through">
                    Standard Price: LKR {originalPrice.toLocaleString()} / day
                  </p>
                )}
              </div>
            ) : (
              <div className="flex justify-end mt-2 pt-2 border-t border-slate-200/60">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Booked at Standard Rate (LKR {offeredPrice.toLocaleString()} / day)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Accept or Decline for Pending requests */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {isPending ? (
            <>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate("CONFIRMED")}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-100 disabled:opacity-50 cursor-pointer"
              >
                {isUpdating && actionType === "accept" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Accept Request
              </button>

              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate("CANCELLED")}
                className="px-5 py-3 bg-red-100 text-red-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-red-200 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isUpdating && actionType === "decline" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Decline
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Close Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};