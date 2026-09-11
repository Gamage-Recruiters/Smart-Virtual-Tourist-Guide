import {
  Calendar,
  MapPin,
  Search,
  Users,
  SlidersHorizontal,
  Wifi,
  Waves,
  Utensils,
  Star,
  DollarSign,
} from "lucide-react";

export default function SearchSection() {
  return (
    <section className="bg-white p-4 rounded-2xl   w-full ]">
      
      {/* TOP SEARCH BAR */}
      <div className="grid grid-cols-5 gap-3 items-end">
        
        {/* LOCATION */}
        <div>
          <label className="text-[13px] text-black font-medium mb-1 block">
            Location
          </label>

          <div className="h-[32px] border border-gray-300 rounded-md px-2 flex items-center gap-2 bg-white">
            <MapPin size={14} className="text-gray-400" />

            <input
              type="text"
              placeholder="Colombo, Sri Lanka"
              className="outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* CHECK-IN */}
        <div>
          <label className="text-[13px] font-medium mb-1 block">
            Check-in
          </label>

          <div className="h-[32px] border border-gray-300 rounded-md px-2 flex items-center justify-between bg-white">
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              className="outline-none text-sm w-full placeholder:text-gray-500"
            />

            <Calendar size={14} className="text-gray-500" />
          </div>
        </div>

        {/* CHECK-OUT */}
        <div>
          <label className="text-[13px] font-medium mb-1 block">
            Check-out
          </label>

          <div className="h-[32px] border border-gray-300 rounded-md px-2 flex items-center justify-between bg-white">
            <input
              type="text"
              placeholder="mm/dd/yyyy"
              className="outline-none text-sm w-full placeholder:text-gray-500"
            />

            <Calendar size={14} className="text-gray-500" />
          </div>
        </div>

        {/* GUESTS */}
        <div>
          <label className="text-[13px] font-medium mb-1 block">
            Guests
          </label>

          <div className="h-[32px] border border-gray-300 rounded-md px-2 flex items-center gap-2 bg-white">
            <Users size={14} className="text-gray-400" />

            <select className="outline-none text-sm bg-transparent w-full text-gray-700">
              <option>2 Adults</option>
              <option>3 Adults</option>
              <option>Family</option>
            </select>
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <button className="h-[32px] bg-blue-600 hover:bg-blue-700 transition rounded-md text-white text-sm flex items-center justify-center gap-2">
          <Search size={14} />
          Search
        </button>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* FILTER TAGS */}
      <div className="flex flex-wrap gap-2">
        
        <button className="h-[28px] px-3 rounded-md bg-[#eef4fb] text-[#295B8D] text-xs flex items-center gap-2">
          <SlidersHorizontal size={13} />
          More Filters
        </button>

        <button className="h-[28px] px-3 border border-gray-300 rounded-md text-xs flex items-center gap-2 bg-white">
          <Star size={13} />
          5 Star
        </button>

        <button className="h-[28px] px-3 border border-gray-300 rounded-md text-xs flex items-center gap-2 bg-white">
          <Wifi size={13} />
          Free WiFi
        </button>

        <button className="h-[28px] px-3 border border-gray-300 rounded-md text-xs flex items-center gap-2 bg-white">
          <Waves size={13} />
          Pool
        </button>

        <button className="h-[28px] px-3 border border-gray-300 rounded-md text-xs flex items-center gap-2 bg-white">
          <Utensils size={13} />
          Restaurant
        </button>

        <button className="h-[28px] px-3 border border-gray-300 rounded-md text-xs flex items-center gap-2 bg-white">
          <DollarSign size={13} />
          Budget Friendly
        </button>
      </div>
    </section>
  );
}