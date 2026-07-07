import { MapPin, CloudSun } from "lucide-react";

function TripPlan() {
  return (
    <div className="bg-white w-full p-8 rounded-4xl shadow-sm border border-slate-100 flex gap-8">
          {/* Left: Featured Image */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-md">
            <img
              src= {null}
              alt="Sigiriya Rock Fortress"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Content Details */}
          <div className="flex-1 flex flex-col justify-between py-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-900">
                My Sri Lanka Tour
              </h2>

              {/* Metadata Grid */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="font-bold text-slate-700">Dates:</span>
                  <span>March 15 - March 25, 2026</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <MapPin size={18} className="text-blue-600" />
                  <span className="font-bold">Current:</span>
                  <span>Sigiriya</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="font-bold">Next Activity:</span>
                  <span className="text-slate-500">Temple Tour at 2:00 PM</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                  <span className="font-bold text-slate-800">Day 3 of 10</span>
                  <span className="text-slate-400 font-medium text-xs">
                    30% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>

              {/* Weather Widget */}
              <div className="bg-blue-50/50 rounded-xl p-3 flex items-center gap-3 border border-blue-100/50">
                <CloudSun className="text-blue-600" size={24} />
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-800">28°C</span>
                  <span className="text-slate-500 text-sm">Partly Cloudy</span>
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
  )
}

export default TripPlan