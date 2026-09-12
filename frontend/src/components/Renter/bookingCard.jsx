import { useState, useMemo } from "react";
import { Calendar, MapPin, Loader2, Tag, DollarSign } from "lucide-react";
import axios from "axios";

export const BookingCard = ({ price = 0, vehicleId, onBookingSuccess }) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const tomorrowStr = (() => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split("T")[0];
  })();

  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [pickupDate, setPickupDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(tomorrowStr);

  // Bidding states
  const [isBidding, setIsBidding] = useState(false);
  const [bidPricePerDay, setBidPricePerDay] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const rentalDays = useMemo(() => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [pickupDate, returnDate]);

  const activeDailyRate = isBidding
    ? Number(bidPricePerDay) || 0
    : Number(price) || 0;

  const grandTotal = activeDailyRate * rentalDays;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fromLocation.trim()) {
      setErrorMessage("Please enter the Pick-up (From) location.");
      return;
    }

    if (!toLocation.trim()) {
      setErrorMessage("Please enter the Drop-off (To) location.");
      return;
    }

    if (!pickupDate || !returnDate) {
      setErrorMessage("Please select valid pick-up and return dates.");
      return;
    }

    if (new Date(returnDate) < new Date(pickupDate)) {
      setErrorMessage("Return date cannot be earlier than pick-up date.");
      return;
    }

    if (isBidding && (!bidPricePerDay || Number(bidPricePerDay) <= 0)) {
      setErrorMessage("Please enter a valid bid amount greater than 0.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("touristToken");

      // Both flows submit a request awaiting owner approval
      const bookingPayload = {
        vehicleId,
        fromLocation: fromLocation.trim(),
        toLocation: toLocation.trim(),
        route: `${fromLocation.trim()} to ${toLocation.trim()}`,
        startDate: pickupDate,
        endDate: returnDate,
        duration: `${rentalDays} Day${rentalDays > 1 ? "s" : ""} Trip`,
        totalDays: rentalDays,
        isBid: isBidding,
        offeredDailyRate: activeDailyRate,
        originalDailyPrice: price,
        totalAmount: grandTotal,
        status: "PENDING",
      };

      const response = await axios.post(
        resolveApiUrl("/renter/bookings"),
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onBookingSuccess) {
        onBookingSuccess(response.data);
      } else {
        alert(
          isBidding
            ? "Your bid offer has been sent to the vehicle owner!"
            : "Your rental request has been sent to the vehicle owner!"
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to process booking. Ensure backend /api/renter/bookings route is active."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-4xl shadow-sm border border-slate-100 space-y-6">
      {/* Pricing Header */}
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-black text-slate-900">
            LKR {price.toLocaleString()}
          </span>
          <span className="text-slate-400 text-xs font-bold uppercase">
            / day
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Self-drive rental
        </p>
      </div>

      <form onSubmit={handleBookingSubmit} className="space-y-4">
        {/* Pricing Mode Toggle */}
        <div className="flex bg-slate-100/80 p-1 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => {
              setIsBidding(false);
              setBidPricePerDay("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              !isBidding
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tag size={13} />
            Listed Price
          </button>
          <button
            type="button"
            onClick={() => {
              setIsBidding(true);
              setBidPricePerDay(price ? String(Math.round(price * 0.9)) : "");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isBidding
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <DollarSign size={13} />
            Make a Bid
          </button>
        </div>

        {/* Custom Bid Input */}
        {isBidding && (
          <div className="space-y-1.5 bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider">
                Your Offer / Day (LKR)
              </label>
              <span className="text-[10px] text-blue-600 font-semibold">
                Original: LKR {price.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1000"
                step="any"
                required
                value={bidPricePerDay}
                onChange={(e) => setBidPricePerDay(e.target.value)}
                placeholder="Enter your proposed daily rate"
                className="w-full bg-white border border-blue-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              />
            </div>
          </div>
        )}

        {/* Pick-up Location */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1">
            <MapPin size={12} className="text-blue-600" /> From (Pick-up Location)
          </label>
          <input
            type="text"
            required
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            placeholder="e.g. Colombo, Katunayake Airport, Negombo"
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
          />
        </div>

        {/* Drop-off Location */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1">
            <MapPin size={12} className="text-emerald-600" /> To (Drop-off Location)
          </label>
          <input
            type="text"
            required
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            placeholder="e.g. Kandy, Galle, Ella, Sigiriya"
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-4 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
          />
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1">
              <Calendar size={12} /> Pick-up
            </label>
            <input
              type="date"
              min={todayStr}
              value={pickupDate}
              onChange={(e) => {
                const newPickup = e.target.value;
                setPickupDate(newPickup);
                if (new Date(newPickup) > new Date(returnDate)) {
                  setReturnDate(newPickup);
                }
              }}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1">
              <Calendar size={12} /> Return
            </label>
            <input
              type="date"
              min={pickupDate || todayStr}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-2.5 pt-4 text-xs font-semibold text-slate-600 border-t border-slate-100">
          <div className="flex justify-between">
            <span>
              LKR {activeDailyRate.toLocaleString()} × {rentalDays}{" "}
              {rentalDays === 1 ? "day" : "days"}
            </span>
            <span className="font-bold text-slate-900">
              LKR {(activeDailyRate * rentalDays).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Insurance & Roadside Assist</span>
            <span className="font-bold text-emerald-600">Included</span>
          </div>

          <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
            <div>
              <span className="text-sm font-extrabold text-slate-900 block">
                {isBidding ? "Proposed Total Bid" : "Total Price"}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                For {rentalDays} {rentalDays === 1 ? "day" : "days"} rental
              </span>
            </div>
            <span className="text-2xl font-black text-blue-600">
              LKR {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {errorMessage && (
          <p className="text-xs text-red-500 font-semibold text-center bg-red-50 py-2.5 px-3 rounded-xl border border-red-100">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : isBidding ? (
            "Submit Bid Offer"
          ) : (
            "Request Booking"
          )}
        </button>
      </form>

      <p className="text-[11px] text-center font-medium text-slate-400">
        Free cancellation up to 24 hours before pick-up
      </p>
    </div>
  );
};