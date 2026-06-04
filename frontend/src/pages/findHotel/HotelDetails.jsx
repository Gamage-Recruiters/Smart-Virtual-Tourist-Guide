import { Link, useParams } from "react-router-dom";
import HotelGallery from "../../components/hotelDetails/HotelGallery";
import HotelInfo from "../../components/hotelDetails/HotelInfo";
import CheckAvailability from "../../components/hotelDetails/CheckAvailability";
import SafetyFeatures from "../../components/hotelDetails/SafetyFeatures";
import AvailableRooms from "../../components/hotelDetails/AvailableRooms";
import GuestReviews from "../../components/hotelDetails/GuestReviews";
import hotels from "../../data/hotels";

export default function HotelDetails() {
  const { id } = useParams();
  const hotelId = parseInt(id, 10);
  const hotel = hotels.find((h) => h.id === hotelId);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#eef7fd] py-10 px-6">
        <div className="max-w-7xl mx-auto">Hotel not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef7fd] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/dashboard" className="hover:text-gray-900 transition-colors duration-150">
            Dashboard
          </Link>
          <span>{">"}</span>
          <Link to="/find-hotel" className="hover:text-gray-900 transition-colors duration-150">
            Find Hotel
          </Link>
          <span>{">"}</span>
          <span>Hotel Details</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <HotelGallery images={hotel.images || [hotel.image]} />

            <HotelInfo hotel={hotel} />

            <AvailableRooms />

            <GuestReviews />
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            <CheckAvailability />

            <SafetyFeatures />
          </div>
        </div>
      </div>
    </div>
  );
}