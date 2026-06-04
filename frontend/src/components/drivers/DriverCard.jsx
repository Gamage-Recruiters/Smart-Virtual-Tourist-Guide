import { Star } from "lucide-react";

export default function DriverCard({ driver }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row gap-5 justify-between">
      {/* Left */}
      <div className="flex gap-5">
        {/* Image */}
        <img
          src={driver.image}
          alt={driver.name}
          className="w-[140px] h-[140px] rounded-xl object-cover"
        />

        {/* Details */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {driver.name}
          </h2>

          <p className="text-gray-500 mt-1">
            {driver.experience}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {driver.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-600 mt-5 max-w-2xl leading-7">
            {driver.description}
          </p>

          {/* Price */}
          <div className="mt-5">
            <span className="text-4xl font-bold">
              ${driver.price}
            </span>

            <span className="text-gray-500 text-lg">
              /day
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col justify-between items-end">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="font-bold">
            {driver.rating}
          </span>

          <span className="text-gray-500">
            ({driver.reviews})
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 transition px-5 py-3 rounded-xl font-medium">
            View Profile
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-xl font-medium">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}