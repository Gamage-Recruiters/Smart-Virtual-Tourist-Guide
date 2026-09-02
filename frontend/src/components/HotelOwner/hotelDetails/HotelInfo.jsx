import {
  MapPin,
  Wifi,
  Waves,
  Dumbbell,
  Utensils,
  Car,
  ShieldCheck,
  Ban,
  PawPrint,
} from "lucide-react";

export default function HotelInfo({ hotel }) {
  return (
    <div>
      {/* Title */}
      <div>
        <h1 className="text-4xl font-bold">{hotel.name}</h1>

        <div className="flex items-center gap-2 mt-2 text-gray-600">
          <MapPin size={16} />
          <span>{hotel.location}</span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <div className="text-yellow-400 text-lg">★★★★★</div>

          <span className="font-semibold">{hotel.rating}</span>

          <span className="text-gray-500">
            ({hotel.reviews} reviews)
          </span>
        </div>

        <p className="text-gray-600 leading-8 mt-5">
          {hotel.description}
        </p>
      </div>

      {/* Amenities + Policies */}
      <div className="grid md:grid-cols-2 gap-10 mt-10">
        {/* Amenities */}
        <div>
          <h2 className="text-2xl font-bold mb-5">Amenities</h2>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-center gap-3">
              <Wifi size={18} />
              Free Wi-Fi
            </div>

            <div className="flex items-center gap-3">
              <Waves size={18} />
              Infinity Pool
            </div>

            <div className="flex items-center gap-3">
              <Dumbbell size={18} />
              Fitness Center
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={18} />
              Spa & Wellness
            </div>

            <div className="flex items-center gap-3">
              <Utensils size={18} />
              3 Restaurants
            </div>

            <div className="flex items-center gap-3">
              <Car size={18} />
              Free Parking
            </div>
          </div>
        </div>

        {/* Policies */}
        <div>
          <h2 className="text-2xl font-bold mb-5">Policies</h2>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-1" />

              <div>
                <p className="font-medium">Check-in: 3:00 PM</p>
                <p className="text-sm text-gray-500">
                  Check-out: 11:00 AM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Ban size={18} />
              Non-smoking rooms available
            </div>

            <div className="flex items-center gap-3">
              <PawPrint size={18} />
              Pet-friendly
            </div>

            <div className="flex items-center gap-3 text-red-500">
              <Ban size={18} />
              No cancellation fee (up to 24h)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}