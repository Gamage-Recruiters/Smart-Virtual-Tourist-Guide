export default function DriverCard({ name, price, rating, image }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-[220px] object-cover"
        />

        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold">
          ⭐ {rating}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-gray-500 text-sm">Professional Driver</p>
          </div>

          <div className="text-[#2563eb] font-bold text-xl">
            {price}
            <span className="text-sm text-gray-500"> /day</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs">
            ENGLISH
          </span>

          <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs">
            SUV EXPERT
          </span>

          <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs">
            LOCAL GUIDE
          </span>
        </div>

        <button className="w-full mt-5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 rounded-xl font-semibold">
          BOOK NOW
        </button>
      </div>
    </div>
  );
}