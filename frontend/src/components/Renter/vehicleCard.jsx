import { Star, Users, Briefcase, Fuel, ShieldCheck } from "lucide-react";
export const VehicleCard = ({
  id,
  tag,
  name,
  rating,
  price,
  priceWithDriver,
  type,
  transmission,
  image,
  onViewDetails,
  seats,
  airBags,
  fuelType,
  fullInsurance,
}) => (
  <div className=" bg-white rounded-4xl overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 group">
    {/* Image Section */}
    <div className="relative h-56 overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
        {tag}
      </div>
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
        <Star size={14} className="fill-amber-400 text-amber-400" />
        <span className="text-xs font-bold text-slate-800">{rating}</span>
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{name}</h3>
          <p className="text-sm font-semibold text-slate-700">with driver</p>
          <p className="text-[11px] text-slate-400 font-medium uppercase mt-1">
            {type} - {transmission}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-blue-600">${price}</p>
          <p className="text-xl font-extrabold text-blue-600">
            ${priceWithDriver}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">
            per day
          </p>
        </div>
      </div>

      <div className="flex justify-start gap-4 py-2 border-y border-slate-50">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Users size={16} />{" "}
          <span className="text-xs font-bold">{seats} Seats</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Briefcase size={16} />{" "}
          <span className="text-xs font-bold">{airBags} Bags</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Fuel size={16} />{" "}
          <span className="text-xs font-bold">{fuelType}</span>
        </div>
      </div>

      <div
        className={`flex items-center gap-2 p-2 rounded-lg ${fullInsurance
          ? "text-emerald-600 bg-emerald-50/50"
          : "text-slate-400 bg-slate-100/70"
          }`}
      >
        <ShieldCheck
          size={18}
          className={fullInsurance ? "text-emerald-600" : "text-slate-400"}
        />
        <span className="text-xs font-bold italic">
          {fullInsurance
            ? "Full Insurance Included"
            : "Standard Insurance Only"}
        </span>
      </div>

      <button
        className="w-full h-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-50 cursor-pointer"
        onClick={() => onViewDetails(id)}
      >
        View Details
      </button>
    </div>
  </div>
);
