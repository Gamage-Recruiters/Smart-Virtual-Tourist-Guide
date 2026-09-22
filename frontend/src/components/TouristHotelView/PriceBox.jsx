// frontend/src/components/TouristHotelView/PriceBox.jsx
import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Bed,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import apiClient from "../../services/api.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const getMonthMeta = (year, monthIndex) => {
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  return { daysInMonth, firstWeekday };
};

const STATUS_CELL_STYLES = {
  Available: "bg-green-100 text-green-700",
  "Non Available": "bg-rose-100 text-rose-700 font-bold",
  Maintenance: "bg-blue-100 text-blue-700 font-bold",
  Booked: "bg-purple-100 text-purple-700 font-bold",
};

const parseYMD = (str) => {
  if (!str) return NaN;
  const m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return NaN;
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
};

const todayUTC = () => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
};

const buildBookedDays = (bookings, roomName, year, monthNum) => {
  const booked = new Set();
  if (!Array.isArray(bookings) || !roomName) return booked;

  const monthStart = Date.UTC(year, monthNum - 1, 1);
  const monthEnd = Date.UTC(
    year,
    monthNum - 1,
    new Date(Date.UTC(year, monthNum, 0)).getUTCDate()
  );

  for (const b of bookings) {
    if (!b) continue;
    if (b.roomName !== roomName) continue;
    if (b.status === "cancelled" || b.status === "no-show") continue;

    const startTime = parseYMD(b.checkIn);
    const checkoutTime = parseYMD(b.checkOut);
    if (Number.isNaN(startTime) || Number.isNaN(checkoutTime)) continue;
    if (checkoutTime <= startTime) continue;

    const lastNightTime = checkoutTime - 24 * 60 * 60 * 1000;
    if (lastNightTime < monthStart || startTime > monthEnd) continue;

    const cursor = new Date(Math.max(startTime, monthStart));
    const last = new Date(Math.min(lastNightTime, monthEnd));
    while (cursor <= last) {
      booked.add(cursor.getUTCDate());
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  }

  return booked;
};

const getStatusForDate = (days, day) => {
  const match = days.find((d) => d.day === day);
  return match?.status || "Available";
};

const REASON_TEXT = {
  Booked: "this date is already booked",
  "Non Available": "this date is not available",
  Maintenance: "the room is under maintenance",
};

// ---------------------------------------------------------------------------
// CalendarContent — room‑level calendar
// ---------------------------------------------------------------------------
function CalendarContent({
  room,
  days,
  bookings,
  loading,
  error,
  onMonthChange,
  checkIn,
  checkOut,
  rangeValid,
}) {
  const [monthIdx, setMonthIdx] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const { daysInMonth, firstWeekday } = getMonthMeta(year, monthIdx);

  const prevMonth = () => {
    const newMonth = monthIdx === 0 ? 11 : monthIdx - 1;
    const newYear = monthIdx === 0 ? year - 1 : year;
    setMonthIdx(newMonth);
    setYear(newYear);
    onMonthChange?.(newMonth, newYear);
  };

  const nextMonth = () => {
    const newMonth = monthIdx === 11 ? 0 : monthIdx + 1;
    const newYear = monthIdx === 11 ? year + 1 : year;
    setMonthIdx(newMonth);
    setYear(newYear);
    onMonthChange?.(newMonth, newYear);
  };

  const dayToUtc = (day) => Date.UTC(year, monthIdx, day);
  const isPast = (day) => dayToUtc(day) < todayUTC();

  const checkInUtc = parseYMD(checkIn);
  const checkOutUtc = parseYMD(checkOut);
  const hasValidRange =
    rangeValid &&
    !Number.isNaN(checkInUtc) &&
    !Number.isNaN(checkOutUtc) &&
    checkOutUtc > checkInUtc;

  const isInRange = (day) => {
    if (!hasValidRange) return false;
    const d = dayToUtc(day);
    return d >= checkInUtc && d < checkOutUtc;
  };

  const isRangeEdge = (day) => {
    if (!hasValidRange) return false;
    const d = dayToUtc(day);
    return d === checkInUtc || d === checkOutUtc - 24 * 60 * 60 * 1000;
  };

  const bookedDays = buildBookedDays(
    bookings,
    room?.roomName,
    year,
    monthIdx + 1
  );

  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex items-center gap-2 mb-3">
        <Bed size={14} className="text-slate-500" />
        <p className="text-xs font-bold text-slate-700">
          {room?.roomNumber ? `${room.roomNumber} ` : ""}Availability
        </p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
          aria-label="Previous month"
        >
          <ChevronLeft size={14} />
        </button>

        <p className="text-xs font-bold text-slate-700">
          {MONTH_NAMES[monthIdx]} {year}
        </p>

        <button
          type="button"
          onClick={nextMonth}
          className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
          aria-label="Next month"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4 text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
          <p className="ml-2 text-[11px]">Loading calendar...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-2 text-[11px]">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-7 text-center text-[11px] gap-0.5">
          {[...Array(firstWeekday)].map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const past = isPast(day);
            const inRange = !past && isInRange(day);
            const edge = !past && isRangeEdge(day);

            let cellClass;
            if (past) {
              cellClass =
                "bg-slate-100 text-slate-300 cursor-not-allowed select-none";
            } else if (edge) {
              cellClass = "bg-yellow-200 text-yellow-800 rounded font-bold";
            } else if (inRange) {
              cellClass = "bg-yellow-100 text-yellow-700 rounded";
            } else {
              const backendStatus = getStatusForDate(days, day);
              const status = bookedDays.has(day) ? "Booked" : backendStatus;
              cellClass = `${
                STATUS_CELL_STYLES[status] || STATUS_CELL_STYLES["Available"]
              } rounded`;
            }

            return (
              <div
                key={day}
                className={`py-1 transition-colors ${cellClass}`}
                aria-disabled={past || undefined}
                title={past ? "Past date — not bookable" : undefined}
              >
                {day}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px] text-slate-600">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-200 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-200 inline-block" />
          Non Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-200 inline-block" />
          Maintenance
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-200 inline-block" />
          Booked
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-200 inline-block" />
          Past
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PackageRoomGrid — shows available room numbers (from server response)
// ---------------------------------------------------------------------------
function PackageRoomGrid({
  availableRooms = [],
  loading = false,
  error = "",
  selectedRoomNumber,
  onSelectRoom,
}) {
  if (loading) {
    return (
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-bold text-slate-700 mb-3 text-center">
          Choose One Room Number to Complete Booking
        </h4>
        <div className="border-2 border-slate-400 p-3 bg-gray-50 rounded-lg">
          <p className="text-center text-xs text-slate-400 py-4">
            Checking availability…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-bold text-slate-700 mb-3 text-center">
          Choose One Room Number to Complete Booking
        </h4>
        <div className="border-2 border-rose-300 p-3 bg-rose-50 rounded-lg">
          <p className="text-center text-xs text-rose-600 py-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!availableRooms.length) {
    return (
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-bold text-slate-700 mb-3 text-center">
          Choose One Room Number to Complete Booking
        </h4>
        <div className="border-2 border-slate-300 p-3 bg-gray-50 rounded-lg">
          <p className="text-center text-xs text-slate-500 py-2">
            All rooms of this type are booked or unavailable for your selected
            dates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex items-center justify-center gap-1.5 mb-3">
        <CheckCircle2 size={14} className="text-green-600" />
        <h4 className="text-sm font-bold text-slate-700">
          {availableRooms.length} room
          {availableRooms.length !== 1 ? "s" : ""} available — pick one
        </h4>
      </div>

      <div className="border-2 border-slate-400 p-3 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-5 gap-2">
          {availableRooms.map((r, i) => {
            const rNum =
              typeof r === "string"
                ? r
                : r.roomNumber || r.number || `R${i + 1}`;
            const isActive = String(selectedRoomNumber) === String(rNum);
            return (
              <div
                key={`${rNum}-${i}`}
                onClick={() => {
                  if (isActive) {
                    onSelectRoom?.(null);
                  } else {
                    onSelectRoom?.({
                      roomId: r._id || r.roomId || null,
                      roomNumber: rNum,
                      roomName: r.roomName || rNum,
                    });
                  }
                }}
                className={`aspect-square flex items-center justify-center text-xs font-medium rounded cursor-pointer transition-all ${
                  isActive
                    ? "bg-yellow-200 text-yellow-900 ring-2 ring-offset-1 ring-yellow-500 scale-105"
                    : "bg-green-100 text-green-700 hover:scale-105"
                }`}
                title={typeof r === "object" ? r.roomName || rNum : rNum}
              >
                {rNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PriceBox — main export
// ---------------------------------------------------------------------------
export default function PriceBox({
  price = 0,
  label = "",
  room,
  bookings = [],
  highlight = false,
  innerRef,
  hotelId,
  roomType,
  onSelectRoomNumber,
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");

  // ===== Package availability (room‑type based) =====
  const [availStatus, setAvailStatus] = useState("idle");
  const [availResult, setAvailResult] = useState(null);

  // ===== Room‑only calendar state =====
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const allDaysRef = useRef({});
  const [cacheVersion, setCacheVersion] = useState(0);

  const todayStr = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  })();

  // ---------------- ROOM‑ONLY CALENDAR ----------------
  const fetchMonthDays = async (month, year, roomId) => {
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    if (allDaysRef.current[key]) return allDaysRef.current[key];
    try {
      const params = new URLSearchParams({
        month: String(month + 1),
        year: String(year),
      });
      const data = await apiClient.get(
        `/room-availability/room/${roomId}?${params.toString()}`
      );
      const fetched = Array.isArray(data.days) ? data.days : [];
      allDaysRef.current[key] = fetched;
      setCacheVersion((v) => v + 1);
      return fetched;
    } catch {
      return [];
    }
  };

  useEffect(() => {
    allDaysRef.current = {};
    setDays([]);
    setCheckIn("");
    setCheckOut("");
    setSelectedRoomNumber("");
    const now = new Date();
    setCalMonth(now.getMonth());
    setCalYear(now.getFullYear());
    setCacheVersion(0);
  }, [room?.roomId]);

  useEffect(() => {
    setSelectedRoomNumber("");
  }, [roomType]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!room?.roomId) return;
      setLoading(true);
      setFetchError("");
      try {
        const fetched = await fetchMonthDays(calMonth, calYear, room.roomId);
        if (!isMounted) return;
        setDays(fetched);
      } catch (err) {
        if (!isMounted) return;
        setFetchError(err.message || "Failed to load availability.");
        setDays([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [room?.roomId, calMonth, calYear]);

  const handleCalMonthChange = (newMonth, newYear) => {
    setCalMonth(newMonth);
    setCalYear(newYear);
  };

  // ==============================================================
  // PACKAGE AVAILABILITY — fires when roomType + checkIn + checkOut ready
  // ==============================================================
  useEffect(() => {
    if (room?.roomId) {
      setAvailStatus("idle");
      setAvailResult(null);
      return;
    }

    if (!roomType || !checkIn || !checkOut) {
      setAvailStatus("idle");
      setAvailResult(null);
      return;
    }

    if (checkOut <= checkIn) {
      setAvailStatus("error");
      setAvailResult({ message: "Check-out must be after check-in" });
      return;
    }

    let cancelled = false;
    setAvailStatus("loading");

    const params = new URLSearchParams({
      hotelId: String(hotelId || ""),
      roomType,
      checkin: checkIn,
      checkout: checkOut,
    });

    apiClient
      .get(`/tourist/hotels/check-room-type-availability?${params.toString()}`)
      .then((data) => {
        if (cancelled) return;
        setAvailResult(data);
        setAvailStatus("done");
      })
      .catch((err) => {
        if (cancelled) return;
        setAvailResult({
          message: err?.message || "Failed to check availability",
        });
        setAvailStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [hotelId, roomType, checkIn, checkOut, room?.roomId]);

  // ---------------- ROOM‑ONLY availability helper ----------------
  const getStatusForUtcSync = (utc) => {
    const d = new Date(utc);
    const key = `${d.getUTCFullYear()}-${String(
      d.getUTCMonth() + 1
    ).padStart(2, "0")}`;

    const bookedForMonth = buildBookedDays(
      bookings,
      room?.roomName,
      d.getUTCFullYear(),
      d.getUTCMonth() + 1
    );
    if (bookedForMonth.has(d.getUTCDate())) return "Booked";

    const cached = allDaysRef.current[key];
    if (!cached) return null;
    return getStatusForDate(cached, d.getUTCDate());
  };

  const checkInTime = parseYMD(checkIn);
  const checkOutTime = parseYMD(checkOut);

  let checkInError = "";
  let checkOutError = "";
  let rangeWarning = "";

  if (checkIn) {
    if (Number.isNaN(checkInTime)) {
      checkInError = "Invalid date";
    } else if (checkInTime < todayUTC()) {
      checkInError = "You can't book this date — it's in the past";
    } else if (room?.roomId) {
      const status = getStatusForUtcSync(checkInTime);
      if (status !== null && status !== "Available") {
        checkInError = `You can't book this date — ${
          REASON_TEXT[status] || "this date is not available"
        }`;
      }
    }
  }

  if (checkOut) {
    if (Number.isNaN(checkOutTime)) {
      checkOutError = "Invalid date";
    } else if (checkOutTime < todayUTC()) {
      checkOutError = "You can't book this date — it's in the past";
    } else if (checkInTime && checkOutTime <= checkInTime) {
      checkOutError = "Check-out must be after check-in";
    }
  }

  if (
    room?.roomId &&
    checkIn &&
    checkOut &&
    !checkInError &&
    !checkOutError &&
    checkOutTime > checkInTime
  ) {
    let cursor = checkInTime;
    const lastNight = checkOutTime - 24 * 60 * 60 * 1000;
    while (cursor <= lastNight) {
      const status = getStatusForUtcSync(cursor);
      if (status !== null && status !== "Available") {
        rangeWarning = `You can't book this range — ${
          REASON_TEXT[status] || "some dates are not available"
        }`;
        break;
      }
      cursor += 24 * 60 * 60 * 1000;
    }
  }

  const rangeValid =
    !checkInError && !checkOutError && !rangeWarning && !!checkIn && !!checkOut;

  const handleCheckIn = (e) => {
    const v = e.target.value;
    setCheckIn(v);
    if (checkOut && parseYMD(checkOut) <= parseYMD(v)) {
      setCheckOut("");
    }
    setSelectedRoomNumber("");
  };

  const handleCheckOut = (e) => {
    setCheckOut(e.target.value);
    setSelectedRoomNumber("");
  };

  const handlePickRoom = (payload) => {
    if (!payload) {
      setSelectedRoomNumber("");
      onSelectRoomNumber?.(null);
      return;
    }
    setSelectedRoomNumber(payload.roomNumber);
    onSelectRoomNumber?.(payload);
  };

  const inputClass = (hasError) =>
    `w-full border rounded-lg px-4 py-3 pr-10 transition ${
      hasError
        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400"
        : "border-slate-200 focus:ring-2 focus:ring-blue-500"
    }`;

  const availableRooms = (() => {
    if (!availResult) return [];
    if (Array.isArray(availResult)) return availResult;
    if (Array.isArray(availResult.rooms)) return availResult.rooms;
    if (Array.isArray(availResult.availableRooms))
      return availResult.availableRooms;
    if (Array.isArray(availResult.data)) return availResult.data;
    return [];
  })();

  // -------- Decide what to show for the package section --------
  const datesIncomplete = !checkIn || !checkOut;
  const datesInvalid =
    !!checkIn && !!checkOut && checkOut <= checkIn;

  return (
    <div
      ref={innerRef}
      className={`bg-white rounded-2xl p-5 shadow-md transition-all duration-500 ${
        highlight
          ? "ring-4 ring-blue-300 ring-offset-2 ring-offset-[#eef7fd]"
          : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-blue-700">
            ${Number(price || 0).toLocaleString()}
          </h2>
          <div className="text-yellow-400 mt-1">★★★★★</div>
          <p className="text-gray-500 text-sm">
            {label ? `Selected: ${label}` : "No room or package selected"}
          </p>
        </div>
        <span className="text-gray-500 text-sm">per night</span>
      </div>

      {/* Room‑only calendar */}
      {room?.roomId && (
        <CalendarContent
          room={room}
          days={days}
          bookings={bookings}
          loading={loading}
          error={fetchError}
          onMonthChange={handleCalMonthChange}
          checkIn={checkIn}
          checkOut={checkOut}
          rangeValid={rangeValid}
        />
      )}

      <div className="space-y-4 mt-5 pt-4 border-t">
        {/* Check‑in */}
        <div>
          <label className="text-sm font-medium">Check-in</label>
          <div className="relative mt-2">
            <input
              type="date"
              value={checkIn}
              min={todayStr}
              onChange={handleCheckIn}
              className={inputClass(!!checkInError)}
            />
            <Calendar
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
          {checkInError && (
            <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600 font-medium">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              {checkInError}
            </p>
          )}
        </div>

        {/* Check‑out */}
        <div>
          <label className="text-sm font-medium">Check-out</label>
          <div className="relative mt-2">
            <input
              type="date"
              value={checkOut}
              min={checkIn || todayStr}
              onChange={handleCheckOut}
              className={inputClass(!!checkOutError)}
            />
            <Calendar
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
          {checkOutError && (
            <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600 font-medium">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              {checkOutError}
            </p>
          )}
        </div>

        {rangeWarning && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 font-medium">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            {rangeWarning}
          </div>
        )}

        {/* Package‑mode availability — three states */}
        {!room?.roomId && roomType && (
          <>
            {datesIncomplete ? (
              /* --- No dates yet --- */
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-bold text-slate-700 mb-3 text-center">
                  Choose One Room Number to Complete Booking
                </h4>
                <div className="border-2 border-dashed border-slate-300 p-3 bg-gray-50 rounded-lg">
                  <p className="text-center text-xs text-slate-500 py-2">
                    Select your check-in and check-out dates to see available
                    rooms.
                  </p>
                </div>
              </div>
            ) : datesInvalid ? (
              /* --- Dates invalid (checkOut <= checkIn) --- */
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-bold text-slate-700 mb-3 text-center">
                  Choose One Room Number to Complete Booking
                </h4>
                <div className="border-2 border-rose-200 p-3 bg-rose-50 rounded-lg">
                  <p className="text-center text-xs text-rose-600 py-2">
                    Check-out must be after check-in.
                  </p>
                </div>
              </div>
            ) : (
              /* --- Dates valid → real availability grid --- */
              <PackageRoomGrid
                availableRooms={availableRooms}
                loading={availStatus === "loading"}
                error={availStatus === "error" ? availResult?.message : ""}
                selectedRoomNumber={selectedRoomNumber}
                onSelectRoom={handlePickRoom}
              />
            )}
          </>
        )}

        {/* Price summary */}
        {rangeValid && checkInTime && checkOutTime && (() => {
          const nights = Math.round(
            (checkOutTime - checkInTime) / (24 * 60 * 60 * 1000)
          );
          const total = Number(price || 0) * nights;
          return (
            <div className="flex justify-between items-center pt-2 border-t text-sm">
              <span className="text-gray-500">
                {Number(price || 0).toLocaleString()} × {nights} night
                {nights !== 1 ? "s" : ""}
              </span>
              <span className="text-lg font-bold text-blue-700">
                LKR {total.toLocaleString()}
              </span>
            </div>
          );
        })()}

        {/* Book button */}
        <button
          disabled={
            !!checkInError ||
            !!checkOutError ||
            !!rangeWarning ||
            (!room?.roomId &&
              roomType &&
              (!selectedRoomNumber || availStatus !== "done"))
          }
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
        >
          Book
        </button>
      </div>
    </div>
  );
}