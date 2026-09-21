import { Star, Users, Briefcase, Fuel, ShieldCheck } from "lucide-react";

export const VehicleCard = ({
  _id,
  id,
  brand,
  model,
  name,
  photos,
  image,
  status,
  tag,
  rating = 4.9,
  dailyRentalPrice,
  price,
  // priceWithDriver,
  transmission,
  passengers,
  seats,
  luggage,
  airBags,
  fuelType,
  documents,
  fullInsurance,
  onViewDetails,
}) => {
  // Normalize fields between MongoDB schema and custom props
  const vehicleId = _id || id;
  const vehicleName = name || `${brand || ""} ${model || ""}`.trim() || "Vehicle";
  const vehicleImage =
    photos?.exterior ||
    photos?.side ||
    image ||
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80";
  const displayTag = tag || status || "Available";
  const basePrice = dailyRentalPrice || price || 0;
  // const driverPrice = priceWithDriver || Math.round(basePrice * 1.25);
  const totalSeats = passengers || seats || 4;
  const totalLuggage = luggage || airBags || 2;
  const hasInsurance = fullInsurance ?? Boolean(documents?.vehicleInsurance);

  return (
    <div className="bg-white rounded-4xl overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={vehicleImage}
          alt={vehicleName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
          {displayTag}
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-slate-800">{rating}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{vehicleName}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Self-Drive</p>
              <p className="text-[11px] text-slate-400 font-medium uppercase mt-1">
                {fuelType} • {transmission}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold text-blue-600">
                LKR {basePrice.toLocaleString()}
              </p>
              {/* <p className="text-xs font-semibold text-slate-400">
                + Driver: LKR {driverPrice.toLocaleString()}
              </p> */}
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                per day
              </p>
            </div>
          </div>

          <div className="flex justify-start gap-4 py-3 my-3 border-y border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Users size={16} />
              <span className="text-xs font-bold">{totalSeats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Briefcase size={16} />
              <span className="text-xs font-bold">{totalLuggage} Bags</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Fuel size={16} />
              <span className="text-xs font-bold">{fuelType}</span>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 p-2 rounded-lg ${
              hasInsurance
                ? "text-emerald-700 bg-emerald-50/70"
                : "text-slate-400 bg-slate-100/70"
            }`}
          >
            <ShieldCheck
              size={18}
              className={hasInsurance ? "text-emerald-600" : "text-slate-400"}
            />
            <span className="text-xs font-bold">
              {hasInsurance ? "Insurance Verified" : "Standard Insurance"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 cursor-pointer mt-2"
          onClick={() => onViewDetails(vehicleId)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};