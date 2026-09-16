import { useEffect, useState } from "react";
import { Filter, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import { VehicleCard } from "../../components/Renter/vehicleCard";
import { PaginationButton } from "../../components/Renter/paginationButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MyBookingsModal } from "../../components/Renter/myBookingsModal";

export const RentVehiclePage = () => {
  const navigate = useNavigate();
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);

  // Filter input states
  const [selectedFuelType, setSelectedFuelType] = useState("all");
  const [selectedTransmission, setSelectedTransmission] = useState("all");
  const [selectedPriceOrder, setSelectedPriceOrder] = useState("all");

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
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(resolveApiUrl("/vehicle/"));

        const vehicleList = Array.isArray(response.data)
          ? response.data
          : response.data.vehicles || [];

        // Ensure tourists only see 'Available' vehicles
        const availableOnly = vehicleList.filter(
          (vehicle) => vehicle.status?.toLowerCase() === "available"
        );

        setAllVehicles(availableOnly);
        setFilteredVehicles(availableOnly);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error.message);
        setAllVehicles([]);
        setFilteredVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  // Filter trigger handler
  const handleApplyFilters = () => {
    let result = [...allVehicles];

    // 1. Vehicle Type (Fuel Type)
    if (selectedFuelType !== "all") {
      result = result.filter(
        (v) => v.fuelType?.toLowerCase() === selectedFuelType.toLowerCase()
      );
    }

    // 2. Transmission
    if (selectedTransmission !== "all") {
      result = result.filter(
        (v) => v.transmission?.toLowerCase() === selectedTransmission.toLowerCase()
      );
    }

    // 3. Price Sorting
    if (selectedPriceOrder === "low_to_high") {
      result.sort((a, b) => (a.dailyRentalPrice || 0) - (b.dailyRentalPrice || 0));
    } else if (selectedPriceOrder === "high_to_low") {
      result.sort((a, b) => (b.dailyRentalPrice || 0) - (a.dailyRentalPrice || 0));
    }

    setFilteredVehicles(result);
    setCurrentPage(1); // Reset to first page after applying filters
  };

  // Safe slicing with filtered results
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentVehicles = filteredVehicles.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredVehicles.length / cardsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleViewDetails = (id) => {
    const selectedVehicle = allVehicles.find((v) => v._id === id || v.id === id);
    navigate(`/dashboard-Tourist/rent-vehicle/vehicle-details/${id}`, {
      state: { vehicle: selectedVehicle },
    });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Rent a Vehicle
          </h1>
          <p className="text-slate-500 mt-1">
            Find the perfect vehicle for your Sri Lankan adventure
          </p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-transform active:scale-95 cursor-pointer"
        onClick={()=> setIsBookingsOpen(true)}
        >
          <Bookmark size={18} />
          My Bookings
        </button>
        <MyBookingsModal isOpen={isBookingsOpen} onClose={() => setIsBookingsOpen(false)} />
      </div>

      {/* Filter Bar with Dropdowns */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-10">
        {/* Vehicle Type (Fuel Type) Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Vehicle Type
          </label>
          <select
            value={selectedFuelType}
            onChange={(e) => setSelectedFuelType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Vehicle Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Transmission Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Transmission
          </label>
          <select
            value={selectedTransmission}
            onChange={(e) => setSelectedTransmission(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {/* Price Range / Sorting Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Price Range
          </label>
          <select
            value={selectedPriceOrder}
            onChange={(e) => setSelectedPriceOrder(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Prices</option>
            <option value="low_to_high">Price: Low to High</option>
            <option value="high_to_low">Price: High to Low</option>
          </select>
        </div>

        {/* Filter Trigger Button */}
        <button
          type="button"
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer shadow-md shadow-blue-200"
        >
          <Filter size={18} />
          Apply Filters
        </button>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-120">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-20 text-slate-400 font-semibold">
            Loading available vehicles...
          </div>
        ) : currentVehicles.length > 0 ? (
          currentVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              id={vehicle._id}
              {...vehicle}
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col justify-center items-center py-20 text-slate-400 gap-2">
            <p className="text-base font-semibold text-slate-600">
              No vehicles found matching your criteria.
            </p>
            <p className="text-xs">Try adjusting or clearing your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button onClick={() => handlePageChange(currentPage - 1)}>
            <PaginationButton
              icon={<ChevronLeft size={20} />}
              disabled={currentPage === 1}
            />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => handlePageChange(i + 1)}>
              <PaginationButton
                label={(i + 1).toString()}
                active={currentPage === i + 1}
              />
            </button>
          ))}

          <button onClick={() => handlePageChange(currentPage + 1)}>
            <PaginationButton
              icon={<ChevronRight size={20} />}
              disabled={currentPage === totalPages}
            />
          </button>
        </div>
      )}
    </div>
  );
};