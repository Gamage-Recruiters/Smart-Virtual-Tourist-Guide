import { useState } from "react";
import DriverCard from "./DriverCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const drivers = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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

  {
    id: 4,
    name: "Ravi Jayawardena",
    experience: "8 years experience",
    rating: 4.6,
    reviews: 68,
    price: 75,
    tags: ["English", "Nissan SUV", "AC"],
    description:
      "Young and energetic driver specializing in adventure tours and off-the-beaten-path destinations.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },

  {
    id: 5,
    name: "Lakshan Wijayasinghe",
    experience: "14 years experience",
    rating: 4.8,
    reviews: 112,
    price: 90,
    tags: ["English", "Sinhala", "Toyota Hiace", "AC"],
    description:
      "Experienced tour driver specializing in group tours and cultural heritage sites. Spacious vehicle perfect for families.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },

  {
    id: 6,
    name: "Dinesh Rodrigues",
    experience: "9 years experience",
    rating: 4.7,
    reviews: 78,
    price: 65,
    tags: ["English", "Honda City", "AC"],
    description:
      "Friendly and courteous driver with excellent local knowledge. Budget-friendly option for solo travelers and couples.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },

  {
    id: 7,
    name: "Chaminda Bandara",
    experience: "11 years experience",
    rating: 4.9,
    reviews: 135,
    price: 95,
    tags: ["English", "Tamil", "Sinhala", "Nissan Navara", "AC"],
    description:
      "Premium service driver with multilingual abilities. Perfect for business travelers and luxury tours.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },

  {
    id: 8,
    name: "Pradeep Kumar",
    experience: "7 years experience",
    rating: 4.5,
    reviews: 55,
    price: 60,
    tags: ["English", "Maruti Swift"],
    description:
      "Energetic driver offering affordable rates without compromising on quality service and comfort.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },

  {
    id: 9,
    name: "Thushara de Silva",
    experience: "13 years experience",
    rating: 4.8,
    reviews: 98,
    price: 100,
    tags: ["English", "German", "French", "Toyota Fortuner", "AC"],
    description:
      "Trilingual professional driver ideal for international tourists and corporate events.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },

  {
    id: 10,
    name: "Anil Jayasena",
    experience: "10 years experience",
    rating: 4.6,
    reviews: 71,
    price: 78,
    tags: ["English", "Sinhala", "Hyundai Santa Fe", "AC"],
    description:
      "Reliable driver with extensive experience in both tourist and business travel across Sri Lanka.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },

  {
    id: 11,
    name: "Saminda Wijewardena",
    experience: "16 years experience",
    rating: 4.9,
    reviews: 156,
    price: 110,
    tags: ["English", "Tamil", "Sinhala", "Mercedes E-Class", "AC"],
    description:
      "Senior driver with exceptional service record. Specializes in luxury and executive transport.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },

  {
    id: 12,
    name: "Roshan Perera",
    experience: "9 years experience",
    rating: 4.7,
    reviews: 89,
    price: 72,
    tags: ["English", "Sinhala", "Honda Accord", "AC"],
    description:
      "Professional driver with excellent communication skills and deep knowledge of hidden tourist attractions.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },
];

const DRIVERS_PER_PAGE = 5;

export default function DriverList() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(drivers.length / DRIVERS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * DRIVERS_PER_PAGE;
  const endIndex = startIndex + DRIVERS_PER_PAGE;
  const currentDrivers = drivers.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {currentDrivers.length} of {drivers.length} available drivers
        </p>

        <div className="w-[160px] h-[42px] bg-gray-100 rounded-lg"></div>
      </div>

      {/* Cards */}
      <div className="space-y-6">
        {currentDrivers.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
          />
        ))}
      </div>

      {/* Pagination */}
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
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-100"
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
    </div>
  );
}