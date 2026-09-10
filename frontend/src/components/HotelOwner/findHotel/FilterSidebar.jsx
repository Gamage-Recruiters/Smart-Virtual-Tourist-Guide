import { FaStar } from "react-icons/fa";
import {
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaUtensils,
  FaSpa,
} from "react-icons/fa";

const amenities = [
  { label: "Free WiFi", icon: <FaWifi /> },
  { label: "Free Parking", icon: <FaParking /> },
  { label: "Swimming Pool", icon: <FaSwimmingPool /> },
  { label: "Gym", icon: <FaDumbbell /> },
  { label: "Restaurant", icon: <FaUtensils /> },
  { label: "Spa", icon: <FaSpa /> },
];

const ratings = [
  { label: "5 Stars", stars: 5 },
  { label: "4 Stars", stars: 4 },
  { label: "3 Stars", stars: 3 },
];

const guestRatings = [
  "9+ Exceptional",
  "8+ Very Good",
  "7+ Good",
];


export default function FilterSidebar() {
  return (
    <aside className="bg-white rounded-2xl p-4 shadow-md h-fit max-w-[300px]">
      <h3 className="text-xl font-bold mb-4">Filters</h3>

      {/* Price */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-3">Price Range</h4>

        <input type="range" className="w-full" />

        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>$0</span>
          <span>$500+</span>
        </div>
      </div>

      {/* Star Rating */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-3">Star Rating</h4>

        <div className="space-y-3">
          {ratings.map((item) => (
            <label
              key={item.label}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 border-gray-400"
              />

              <span className="text-gray-700 text-sm w-20">
                {item.label}
              </span>

              <div className="flex gap-1 text-yellow-400">
                {[...Array(item.stars)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-4">Amenities</h4>

        <div className="space-y-3">
          {amenities.map((item) => (
            <label
              key={item.label}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4"
              />

              <span className="text-gray-500 text-lg">
                {item.icon}
              </span>

              <span className="text-gray-700 text-sm">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Guest Rating */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-4">Guest Rating</h4>

        <div className="space-y-3">
          {guestRatings.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4"
              />

              <span className="text-gray-700 text-sm">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-xl font-semibold text-sm">
        Apply Filters
      </button>
    </aside>
  );
}