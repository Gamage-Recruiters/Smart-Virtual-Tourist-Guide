import { useState, useEffect } from "react";
import DriverCard from "./driverCard";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { driverAPI } from "../../services/api";

const defaultSampleDrivers = [
  {
    id: "sample-1",
    name: "Kamal Perera",
    experience: "15 years experience",
    rating: 4.9,
    reviews: 127,
    price: 85,
    tags: ["English", "Sinhala", "Toyota SUV", "AC"],
    description:
      "Professional driver with extensive knowledge of Sri Lankan tourist destinations. Comfortable vehicle with AC and WiFi.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
  {
    id: "sample-2",
    name: "Nimal Silva",
    experience: "12 years experience",
    rating: 4.8,
    reviews: 95,
    price: 120,
    tags: ["English", "German", "Mercedes Van"],
    description:
      "Luxury travel specialist with multilingual skills. Perfect for family trips and group tours across the island.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },
  {
    id: "sample-3",
    name: "Sunil Fernando",
    experience: "10 years experience",
    rating: 4.7,
    reviews: 82,
    price: 70,
    tags: ["English", "Honda Sedan"],
    description:
      "Reliable and punctual driver with great knowledge of cultural sites and hidden gems around Sri Lanka.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
];

const DRIVERS_PER_PAGE = 5;

export default function DriverList({ filters, sortBy, onResetFilters }) {
  const [driversList, setDriversList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDriversFromDB = async () => {
      try {
        setLoading(true);
        const response = await driverAPI.getAllDrivers();
        if (response && response.success && Array.isArray(response.drivers) && response.drivers.length > 0) {
          const mappedDrivers = response.drivers.map((d, index) => {
            const vehicle = d.driverDetails?.vehicleName || d.vehicleType || "Vehicle Available";
            const vehicleNum = d.driverDetails?.vehicleNumber || d.vehicleNumber || "";
            const phone = d.contactNumber || d.email || "N/A";

            return {
              id: d._id || index,
              name: d.fullName || "Registered Driver",
              experience: d.experience || "Experienced Local Driver",
              rating: d.rating || 4.9,
              reviews: d.reviews || 15,
              price: d.price || 85,
              tags: [
                vehicle,
                vehicleNum ? `No: ${vehicleNum}` : null,
                d.vehicleColor || null,
                "AC"
              ].filter(Boolean),
              description: d.description || `Registered driver offering safe travel across Sri Lanka. Vehicle: ${vehicle} (${vehicleNum || "Verified"}). Contact: ${phone}.`,
              image: d.profileImage || d.image || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
            };
          });
          setDriversList(mappedDrivers);
        } else {
          setDriversList(defaultSampleDrivers);
        }
      } catch (error) {
        console.error("Error fetching drivers from database:", error);
        setDriversList(defaultSampleDrivers);
      } finally {
        setLoading(false);
      }
    };

    fetchDriversFromDB();
  }, []);

  // Filter Drivers
  const filteredDrivers = driversList.filter((driver) => {
    if (filters?.maxPrice && driver.price > filters.maxPrice) {
      return false;
    }
    if (filters?.minRating && driver.rating < filters.minRating) {
      return false;
    }
    if (filters?.vehicleType && filters.vehicleType !== "All Vehicles") {
      const vTerm = filters.vehicleType.toLowerCase();
      const matchTag = driver.tags?.some((t) => t.toLowerCase().includes(vTerm));
      const matchDesc = driver.description?.toLowerCase().includes(vTerm);
      const matchName = driver.name?.toLowerCase().includes(vTerm);
      if (!matchTag && !matchDesc && !matchName) {
        return false;
      }
    }
    return true;
  });

  // Sort Drivers
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (sortBy === "Highest Rated") return b.rating - a.rating;
    if (sortBy === "Lowest Price") return a.price - b.price;
    if (sortBy === "Highest Price") return b.price - a.price;
    return 0; // Recommended
  });

  const totalPages = Math.ceil((sortedDrivers.length || 1) / DRIVERS_PER_PAGE);
  const startIndex = (currentPage - 1) * DRIVERS_PER_PAGE;
  const endIndex = startIndex + DRIVERS_PER_PAGE;
  const currentDrivers = sortedDrivers.slice(startIndex, endIndex);

  // Reset page when filters/sortBy change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading drivers from database...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 font-medium text-sm">
          Showing <strong className="text-slate-900">{sortedDrivers.length}</strong> of <strong className="text-slate-900">{driversList.length}</strong> available drivers
        </p>
      </div>

      {/* Empty State when no matching drivers */}
      {sortedDrivers.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-1">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Drivers Match Your Filters</h3>
          <p className="text-slate-500 text-sm max-w-md">
            Try adjusting your price range, vehicle selection, or minimum rating to see more drivers.
          </p>
          {onResetFilters && (
            <button 
              onClick={onResetFilters}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        /* Cards */
        <div className="space-y-6">
          {currentDrivers.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`w-10 h-10 rounded-lg ${
                currentPage === page
                  ? "bg-blue-600 text-white font-bold"
                  : "border hover:bg-gray-100 text-slate-700"
              }`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}