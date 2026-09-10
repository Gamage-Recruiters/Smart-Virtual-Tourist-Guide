import { useState } from "react";
import { Link } from "react-router-dom";
import DriverFilter from "../../components/Driver/driverfilter";
import DriverList from "../../components/Driver/driverlist";

const initialFilters = {
  tripDate: "",
  duration: "",
  maxPrice: 300,
  vehicleType: "All Vehicles",
  minRating: 0,
};

export default function BookDriver() {
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState("Recommended");

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSortBy("Recommended");
  };

  return (
    <div className="min-h-screen bg-[#eef7fd] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/dashboard-Tourist" className="hover:text-gray-900 transition-colors duration-150">
            Dashboard
          </Link>
          <span>{">"}</span>
          <span>Book a Driver</span>
        </div> 

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Book a Driver
            </h1>

            <p className="text-gray-600 mt-1">
              Find and book experienced local drivers for your Sri Lankan adventure
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <span className="text-slate-500 text-sm font-medium">Sort by:</span>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent outline-none font-bold text-slate-800 text-sm cursor-pointer"
            >
              <option value="Recommended">Recommended</option>
              <option value="Highest Rated">Highest Rated</option>
              <option value="Lowest Price">Lowest Price</option>
              <option value="Highest Price">Highest Price</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter */}
          <div>
            <DriverFilter 
              filters={filters} 
              onFilterChange={setFilters} 
              onReset={handleResetFilters} 
            />
          </div>

          {/* Driver List */}
          <div className="lg:col-span-3">
            <DriverList 
              filters={filters} 
              sortBy={sortBy} 
              onResetFilters={handleResetFilters} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}