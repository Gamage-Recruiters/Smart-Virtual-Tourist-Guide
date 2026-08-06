import { MapPin, CloudSun, Calendar, Banknote } from "lucide-react";
import Sigiriya from "../../assets/sigiriya.jpg";


function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function calcDayInfo(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));

  // Days elapsed since start (clamped 0…totalDays)
  const elapsed = Math.round((now - start) / (1000 * 60 * 60 * 24));
  const currentDay = Math.min(Math.max(elapsed + 1, 1), totalDays);

  // Progress: 0 before trip, 100 after trip
  const pct = now < start ? 0 : now > end ? 100 : Math.round((elapsed / totalDays) * 100);

  return { totalDays, currentDay, pct };
}

function TripPlan() {
  // Read real tourist data from localStorage
  const tripInfo = JSON.parse(localStorage.getItem("tripInfo") || "{}");
  const user     = JSON.parse(localStorage.getItem("user")     || "{}");

  const startDate  = tripInfo.startDate   || "";
  const endDate    = tripInfo.endDate     || "";
  const budgetLKR  = Number(tripInfo.budgetLKR || tripInfo.budgetUSD || 0);
  const firstName  = (user.fullName || "Traveller").split(" ")[0];

  const { totalDays, currentDay, pct } = startDate && endDate
    ? calcDayInfo(startDate, endDate)
    : { totalDays: 0, currentDay: 0, pct: 0 };

  const tripStarted = startDate && new Date() >= new Date(startDate);
  const tripStatus  = !startDate       ? "Not started"
                    : pct >= 100       ? "Completed"
                    : tripStarted      ? `Day ${currentDay} of ${totalDays}`
                    :                    "Upcoming";

  return (
    <div className="bg-white w-full p-8 rounded-4xl shadow-sm border border-slate-100 flex gap-8">
      {/* Left: Featured Image */}
      <div className="flex-1 rounded-2xl overflow-hidden shadow-md">
        <img
          src={Sigiriya}
          alt="Sigiriya Rock Fortress"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Content Details */}
      <div className="flex-1 flex flex-col justify-between py-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-slate-900">
            {firstName}'s Sri Lanka Tour
          </h2>

          {/* Metadata Grid */}
          <div className="space-y-3">
            {/* Trip Dates */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar size={16} className="text-blue-500 flex-shrink-0" />
              <span className="font-bold text-slate-700">Dates:</span>
              <span>
                {startDate && endDate
                  ? `${formatDate(startDate)} – ${formatDate(endDate)}`
                  : "Not set"}
              </span>
            </div>

            {/* Budget */}
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Banknote size={16} className="text-emerald-500 flex-shrink-0" />
              <span className="font-bold">Budget:</span>
              <span className="text-slate-500">
                {budgetLKR > 0
                  ? `LKR ${budgetLKR.toLocaleString("en-US")}`
                  : "Not set"}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <MapPin size={16} className="text-blue-600 flex-shrink-0" />
              <span className="font-bold">Destination:</span>
              <span className="text-slate-500">Sri Lanka</span>
            </div>
          </div>

          {/* Progress Section */}
          {totalDays > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-end text-sm">
                <span className="font-bold text-slate-800">{tripStatus}</span>
                <span className="text-slate-400 font-medium text-xs">
                  {pct}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                {totalDays} day{totalDays !== 1 ? "s" : ""} total
                {startDate ? ` · starts ${formatDate(startDate)}` : ""}
              </p>
            </div>
          )}

          {/* Weather Widget */}
          <div className="bg-blue-50/50 rounded-xl p-3 flex items-center gap-3 border border-blue-100/50">
            <CloudSun className="text-blue-600" size={24} />
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-800">28°C</span>
              <span className="text-slate-500 text-sm">Partly Cloudy · Sri Lanka</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            View Itinerary
          </button>
          <button className="flex-1 bg-white text-slate-700 border-2 border-slate-200 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors">
            Plan Trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripPlan;