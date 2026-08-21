import { Link, useParams } from "react-router-dom";
import HotelGallery from "../../components/HotelOwner/hotelDetails/HotelGallery";
import HotelInfo from "../../components/HotelOwner/hotelDetails/HotelInfo";
import CheckAvailability from "../../components/HotelOwner/hotelDetails/CheckAvailability";
import SafetyFeatures from "../../components/HotelOwner/hotelDetails/SafetyFeatures";
import AvailableRooms from "../../components/HotelOwner/hotelDetails/AvailableRooms";
import GuestReviews from "../../components/HotelOwner/hotelDetails/GuestReviews";


const hotels = [
  {
    id: 1,
    name: "Shangri-La Hotel Colombo",
    location: "Galle Face, Colombo 02",
    rating: "Exceptional",
    description: "Free cancellation until 24 hours before check-in",
    price: 285,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  },
  {
    id: 2,
    name: "Cinnamon Grand Colombo",
    location: "Kollupitiya, Colombo 03",
    rating: "Excellent",
    description: "Breakfast included",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 3,
    name: "Hilton Colombo Residences",
    location: "Colombo 02",
    rating: "Very Good",
    description: "Non-refundable rate",
    price: 175,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  },
  {
    id: 4,
    name: "Ocean Breeze Resort",
    location: "Bentota",
    rating: "Very Good",
    description: "Sea view room available",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  },
];

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