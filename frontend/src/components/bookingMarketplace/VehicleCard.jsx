export default function VehicleCard({ name, type, price, image }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition">
      <img
        src={image}
        alt={name}
        className="w-full h-[220px] object-cover"
      />

      <div className="p-5">
        <h3 className="font-bold text-lg">{name}</h3>

        <p className="text-gray-500 text-sm mt-1">{type}</p>

        <div className="flex justify-between items-center mt-5">
          <div>
            <p className="text-xs text-gray-500">PER DAY</p>

            <h2 className="text-[#2563eb] text-2xl font-bold">
              {price} LKR
            </h2>
          </div>

          <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-3 rounded-xl font-semibold">
            Rent Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
