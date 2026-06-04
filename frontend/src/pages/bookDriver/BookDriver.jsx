import { Link } from "react-router-dom";
import DriverFilter from "../../components/drivers/DriverFilter";
import DriverList from "../../components/drivers/DriverList";

export default function BookDriver() {
  return (
    <div className="min-h-screen bg-[#eef7fd] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-gray-900 transition-colors duration-150">
            Dashboard
          </Link>
          <span>{">"}</span>
          <span>Book a Driver</span>
        </div> 

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Book a Driver
            </h1>

            <p className="text-gray-600 mt-2">
              Find and book experienced local drivers for your Sri Lankan
              adventure
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-600">Sort by:</span>

            <select className="bg-transparent outline-none font-medium">
              <option>Recommended</option>
              <option>Highest Rated</option>
              <option>Lowest Price</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter */}
          <div>
            <DriverFilter />
          </div>

          {/* Driver List */}
          <div className="lg:col-span-3">
            <DriverList />
          </div>
        </div>
      </div>
    </div>
  );
}