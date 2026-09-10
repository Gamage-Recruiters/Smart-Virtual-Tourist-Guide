import { useState } from "react";
import { Filter, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import { VehicleCard } from "../../components/Renter/vehicleCard";
import { FilterInput } from "../../components/Renter/filterInput";
import { PaginationButton } from "../../components/Renter/paginationButton";
import { useNavigate } from "react-router-dom";

const allVehicles = [
  {
    id: 1,
    name: "Honda Civic",
    tag: "Luxury",
    rating: "4.8",
    type: "Sedan",
    transmission: "Automatic",
    price: 80,
    seats: 5,
    airBags: 4,
    fuelType: "Petrol",
    fullInsurance: true,
    priceWithDriver: 130,
    image: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 2,
    name: "Toyota Fortuner",
    tag: "Popular",
    rating: "4.9",
    type: "SUV",
    transmission: "Automatic",
    price: 120,
    seats: 7,
    airBags: 6,
    fuelType: "Diesel",
    fullInsurance: true,
    priceWithDriver: 170,
    image: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 3,
    name: "Suzuki Alto",
    tag: "Budget",
    rating: "4.3",
    type: "Hatchback",
    transmission: "Manual",
    price: 35,
    seats: 4,
    airBags: 2,
    fuelType: "Petrol",
    fullInsurance: false,
    priceWithDriver: 80,
    image: [
      "https://images.unsplash.com/photo-1567808291548-fc3ee04dbac0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 4,
    name: "Mitsubishi Montero",
    tag: "Popular",
    rating: "4.6",
    type: "SUV",
    transmission: "Automatic",
    price: 110,
    seats: 7,
    airBags: 6,
    fuelType: "Diesel",
    fullInsurance: true,
    priceWithDriver: 160,
    image: [
      "https://images.unsplash.com/photo-1541199695279-f99df8e2b5e3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 5,
    name: "Mercedes-Benz E-Class",
    tag: "Luxury",
    rating: "5.0",
    type: "Sedan",
    transmission: "Automatic",
    price: 160,
    seats: 5,
    airBags: 8,
    fuelType: "Petrol",
    fullInsurance: true,
    priceWithDriver: 220,
    image: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800",
    ]
  },
  {
    id: 6,
    name: "Toyota Aqua",
    tag: "Budget",
    rating: "4.5",
    type: "Hatchback",
    transmission: "Automatic",
    price: 45,
    seats: 5,
    airBags: 2,
    fuelType: "Hybrid",
    fullInsurance: true,
    priceWithDriver: 95,
    image: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1621007947382-0ef0402896d4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 7,
    name: "Nissan X-Trail",
    tag: "Popular",
    rating: "4.7",
    type: "SUV",
    transmission: "Automatic",
    price: 95,
    seats: 5,
    airBags: 4,
    fuelType: "Hybrid",
    fullInsurance: true,
    priceWithDriver: 145,
    image: [
      "https://images.unsplash.com/photo-1566274360936-692e0df18903?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1579058917765-17409548aa41?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 8,
    name: "Audi A6",
    tag: "Luxury",
    rating: "4.9",
    type: "Sedan",
    transmission: "Automatic",
    price: 140,
    seats: 5,
    airBags: 6,
    fuelType: "Petrol",
    fullInsurance: true,
    priceWithDriver: 195,
    image: [
      "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542346156-443882314bb8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 9,
    name: "Perodua Axia",
    tag: "Budget",
    rating: "4.4",
    type: "Hatchback",
    transmission: "Automatic",
    price: 38,
    seats: 5,
    airBags: 2,
    fuelType: "Petrol",
    fullInsurance: false,
    priceWithDriver: 85,
    image: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1562141961-b5d1855d7cb0?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 10,
    name: "Honda Vezel",
    tag: "Popular",
    rating: "4.6",
    type: "SUV",
    transmission: "Automatic",
    price: 75,
    seats: 5,
    airBags: 4,
    fuelType: "Hybrid",
    fullInsurance: true,
    priceWithDriver: 125,
    image: [
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800"
    ]
  }
];

export const RentVehiclePage = () => {
  const navigate = useNavigate();
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6; // 3 columns * 2 rows

  // Logic to calculate which cards to show
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentVehicles = allVehicles.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(allVehicles.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
    }
  };

  const handleViewDetails = (id) => {
    const selectedVehicle = allVehicles.find((v) => v.id === id);
    navigate(`/dashboard-Tourist/rent-vehicle/vehicle-details/${id}`, { state: { vehicle: selectedVehicle } });
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
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-transform active:scale-95">
          <Bookmark size={18} />
          My Bookings
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-end gap-4 mb-10">
        <FilterInput label="Vehicle Type" placeholder="Select type" />
        <FilterInput label="Price Range" placeholder="Select range" />
        <FilterInput label="Transmission" placeholder="Select transmission" />
        <FilterInput label="Seats" placeholder="Select seats" />
        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Filter size={18} />
          Apply Filters
        </button>
      </div>

      {/* Vehicle Grid - Fixed to 3 columns, 2 rows max per page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-200">
        {currentVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            {...vehicle}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
};
