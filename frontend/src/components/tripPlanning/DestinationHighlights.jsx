import React from "react";
import {
  Star,
} from "lucide-react";

const destinations = [
  {
    name: "Colombo",
    description: "Capital city, vibrant culture",
    rating: 4.5,
    day: "Day 1",
    image:
      "https://images.unsplash.com/photo-1586183189334-2e0056d9f2f6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Kandy",
    description: "Cultural capital, sacred temples",
    rating: 4.8,
    day: "Day 2",
    image:
      "https://images.unsplash.com/photo-1586500036706-41963de24d8d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Ella",
    description: "Tea country, scenic train rides",
    rating: 4.9,
    day: "Day 3",
    image:
      "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Sigiriya",
    description: "Ancient rock fortress, UNESCO site",
    rating: 4.7,
    day: "Add to plan",
    image:
      "https://images.unsplash.com/photo-1579988021463-9d1d9f6f0f2e?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function DestinationHighlights() {
  return (
    
      <div className="bg-white rounded-3xl p-6 shadow-sm w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-10">
          Destination Highlights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {destinations.map((place, index) => (
            <div key={index} className="group">
              <div className="overflow-hidden rounded-md">
                <img
                  src={place.image}
                  alt={place.name}
                  className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="pt-5 text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {place.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {place.description}
                </p>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />

                  <span className="font-medium text-gray-700">
                    {place.rating}
                  </span>

                  <span>•</span>

                  <span>{place.day}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    

  );
}