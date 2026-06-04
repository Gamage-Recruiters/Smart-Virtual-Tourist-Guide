import HotelCard from "./HotelCard";
import hotels from "../../data/hotels";

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