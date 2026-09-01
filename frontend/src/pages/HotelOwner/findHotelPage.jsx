import { Link } from "react-router-dom";
import SearchSection from "../../components/HotelOwner/findHotel/SearchSection";
import FilterSidebar from "../../components/HotelOwner/findHotel/FilterSidebar";
import HotelList from "../../components/HotelOwner/findHotel/HotelList";


export default function FindHotelPage() {
  return (
    <div className="min-h-screen bg-[#eef7fd]">


      <main className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-gray-900 transition-colors duration-150">
            Dashboard
          </Link>
          <span>{">"}</span>
          <span>Find Hotel</span>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-bold">Find Hotels</h2>

            <p className="text-gray-600 mt-2">
              Discover and book the perfect accommodation for your stay
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-white px-4 py-2 rounded-lg shadow-sm text-blue-600 font-medium">
              Saved (3)
            </button>

            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
              My Bookings
            </button>
          </div>
        </div>
        
        <SearchSection />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <FilterSidebar />

          <div className="lg:col-span-3">
            <HotelList />
          </div>
        </div>
      </main>

    </div>
  );
}