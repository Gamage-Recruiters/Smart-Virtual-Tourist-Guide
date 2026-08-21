import HotelCard from "./HotelCard";
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

export default function HotelList() {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <p className="text-gray-600">Showing 24 hotels in Colombo</p>

        <select className="border rounded-lg px-4 py-2">
          <option>Recommended</option>
          <option>Lowest Price</option>
          <option>Highest Rating</option>
        </select>
      </div>

      {/* Horizontal Scroller */}
      <div className="flex flex-col gap-6 max-h-[1200px] overflow-y-auto pr-2">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}