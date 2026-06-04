import { useState } from "react";
import {
  Heart,
  MapPin,
  Wifi,
  Dumbbell,
  Utensils,
  Waves,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HotelCard({ hotel }) {

  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden min-w-[850px]">
      <div className="grid grid-cols-2">
        {/* Image */}
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-[400px] h-[250px] rounded xl object-cover"
        />

        {/* Content */}
        <div className="p-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold">{hotel.name}</h2>

                <div className="flex text-yellow-400 mt-1">
                  {"★★★★★"}
                </div>

                <div className="flex items-center gap-1 text-gray-500 mt-2">
                  <MapPin size={16} />
                  <span>{hotel.location}</span>
                </div>
              </div>

               {/* Clickable Heart */}
              <button
                onClick={() => setLiked(!liked)}
                className="transition"
              >
                <Heart
                  className={`cursor-pointer transition duration-300 ${
                    liked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Wifi size={16} />
                Free WiFi
              </div>

              <div className="flex items-center gap-2">
                <Waves size={16} />
                Pool
              </div>

              <div className="flex items-center gap-2">
                <Dumbbell size={16} />
                Gym
              </div>

              <div className="flex items-center gap-2">
                <Utensils size={16} />
                Restaurant
              </div>
            </div>

            <div className="mt-1">
              <p className="font-semibold text-lg">{hotel.rating}</p>

              <p className="text-gray-500 text-sm">{hotel.description}</p>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-end justify-between mt-6">
            <div>
              <p className="text-gray-400">From</p>

              <h3 className="text-2xl font-bold">
                ${hotel.price}
                <span className="text-lg text-gray-500"> /night</span>
              </h3>
            </div>

            <button

            onClick={() => navigate(`/hotel-details/${hotel.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}