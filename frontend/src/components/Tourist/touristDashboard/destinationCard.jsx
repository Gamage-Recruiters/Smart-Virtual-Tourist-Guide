import { Star, MapPin } from "lucide-react";

export default function DestinationCard({ title, rating, description, image }) {
  return (
    <div className="rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      {/* Image */}
      <div className="w-full h-44 bg-slate-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h5 className="font-bold text-slate-800 text-base">{title}</h5>
          <div className="flex items-center gap-1 text-sm">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-slate-700">{rating}</span>
          </div>
        </div>
        <div className="flex items-start gap-1 text-slate-400 text-sm">
          <MapPin size={13} className="mt-0.5 shrink-0" />
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
}