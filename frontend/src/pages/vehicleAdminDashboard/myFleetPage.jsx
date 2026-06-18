import "react";
import {
  Bell,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Loader2,
  Car,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddVehicleModal from "./addVehicle/addVehicleModal";
import axios from "axios";

function MyFleetPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fleetData, setFleetData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFleetLoading, setIsFleetLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("none");

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      try {
        if (searchTerm.trim() === "") {
          const res = await axios.get(
            import.meta.env.VITE_BACKEND_URL + "/api/vehicle/",
          );
          setFleetData(res.data);
        } else {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/vehicle/search?query=${searchTerm}`,
          );
          setFleetData(res.data);
        }
      } catch (error) {
        console.error("Fetch/Search failed:", error.message);
      } finally {
        setIsFleetLoading(false);
      }
    }, 500);

    return () => {
      setIsFleetLoading(true);
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm]);

  // Helper to style the status badges dynamically
  const getStatusBadge = (status) => {
    if (status === "Available") {
      return (
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Available
        </span>
      );
    }
    return (
      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        Rented
      </span>
    );
  };

  const processedFleet = [...fleetData]
    .filter((car) => {
      if (statusFilter === "All") return true;
      return car.status === statusFilter;
    })
    .sort((a, b) => {
      if (sortBy === "priceLowHigh") {
        return a.dailyRentalPrice - b.dailyRentalPrice;
      }
      if (sortBy === "priceHighLow") {
        return b.dailyRentalPrice - a.dailyRentalPrice;
      }
      return 0; // Default: 'none' (Order returned by the database query)
    });

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Fleet
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {isFleetLoading
              ? "Updating fleet status..."
              : `Manage and track your ${fleetData.length} vehicle assets`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 bg-white rounded-full shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button
            className="flex items-center gap-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} strokeWidth={3} />
            ADD NEW VEHICLE
          </button>
        </div>
        <AddVehicleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </header>

      {/* 2. Toolbar (Search & Filters) */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search Bar Container */}
        <div className="relative flex-1 w-full">
          {isFleetLoading ? (
            <Loader2
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 animate-spin"
              size={18}
            />
          ) : (
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          )}
          <input
            type="text"
            placeholder="Search by plate, model or brand name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-sm py-3 pl-11 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-slate-700 shadow-sm border border-slate-100/50"
          />
        </div>

        {/* Filter & Sort Dropdown Containers */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter Wrapper */}
          <div className="relative flex-1 md:flex-none">
            {/* Trigger Button */}
            <button
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsSortOpen(false);
              }}
              className="w-full md:w-48 flex items-center justify-between gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 text-sm font-bold hover:bg-slate-50 transition-all cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <span>
                  {statusFilter === "All" ? "All Statuses" : statusFilter}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Options Menu */}
            {isStatusOpen && (
              <>
                {/* Invisible overlay window to close the dropdown when clicking outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsStatusOpen(false)}
                />

                <div className="absolute right-0 left-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
                  {[
                    { label: "All Statuses", value: "All" },
                    { label: "Available", value: "Available" },
                    { label: "Rented", value: "Rented" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                        statusFilter === option.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sort Menu Wrapper */}
          <div className="relative flex-1 md:flex-none">
            {/* Trigger Button */}
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsStatusOpen(false);
              }}
              className="w-full md:w-48 flex items-center justify-between gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 text-sm font-bold hover:bg-slate-50 transition-all cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-slate-400" />
                <span>
                  {sortBy === "none" && "Sort By"}
                  {sortBy === "priceLowHigh" && "Low to High"}
                  {sortBy === "priceHighLow" && "High to Low"}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Options Menu */}
            {isSortOpen && (
              <>
                {/* Invisible overlay window to close the dropdown when clicking outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSortOpen(false)}
                />

                <div className="absolute right-0 left-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
                  {[
                    { label: "Default Order", value: "none" },
                    { label: "Price: Low to High", value: "priceLowHigh" },
                    { label: "Price: High to Low", value: "priceHighLow" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                        sortBy === option.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Rendering View Area */}
      {isFleetLoading ? (
        //Active Data Fetching Spinner
        <div className="flex flex-col items-center justify-center flex-1 py-20 text-slate-400">
          <Loader2 size={36} className="animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Filtering fleet logs...
          </p>
        </div>
      ) : processedFleet?.length === 0 ? (
        // Empty Query Result Fallback UI
        <div className="flex flex-col items-center justify-center text-center flex-1 max-w-xl mx-auto w-full">
          <div className="p-4 bg-slate-200 text-slate-600 rounded-2xl mb-4">
            <Car size={36} strokeWidth={1.5} />
          </div>
          <h3 className="text-base xl:text-xl font-extrabold text-slate-800">
            No Vehicles Found
          </h3>
          <p className="text-xs xl:text-sm text-slate-400 font-medium max-w-xs mt-1.5 leading-relaxed">
            We couldn't find matches for{" "}
            <span className="text-blue-600 font-bold">"{searchTerm}"</span>.
            Double check your typing accuracy or register a new fleet item
            instead.
          </p>
        </div>
      ) : (
        // Live Populated Fleet Display Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-10">
          {processedFleet.map((car) => (
            <div
              key={car._id}
              className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100/50 flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              {/* Image & Status Badge */}
              <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={car.photos?.exterior}
                  alt={car.model}
                  className="w-full h-full object-cover"
                />
                {getStatusBadge(car.status)}
              </div>

              {/* Vehicle Info */}
              <div className="px-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                      {car.model}{" "}
                      <span className="text-slate-600 font-bold text-sm">
                        ({car.brand})
                      </span>
                    </h3>

                    {/* Price Tag Section */}
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-blue-600 leading-none">
                        {Number(car.dailyRentalPrice).toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mt-1">
                          LKR / Day
                        </span>
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-5">
                    {car.licensePlate}
                  </p>

                  {/* Stats Box */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                        Trips
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {car.tripsCompleted || 0}
                      </p>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                        Location
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate max-w-25">
                        {car.currentLocation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-[#2563EB] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 text-sm mt-auto">
                  Edit Info
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyFleetPage;
