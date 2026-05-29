import VehicleCard from './VehicleCard'

export default function VehiclesPage() {
  const vehicles = [
    {
      name: "Honda Dio",
      type: "Scooter",
      price: "2,500",
      image:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39",
    },
    {
      name: "TVS NTORQ 125",
      type: "Scooter",
      price: "2,700",
      image:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39",
    },
    {
      name: "Bajaj Tuk Tuk",
      type: "Manual",
      price: "3,800",
      image:
        "https://images.unsplash.com/photo-1591768575198-88dac53fbd0a",
    },
    {
      name: "Honda Vezel",
      type: "Automatic",
      price: "12,500",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    },
    {
      name: "Mitsubishi Montero",
      type: "Automatic",
      price: "25,000",
      image:
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
    },
    {
      name: "Toyota Dolphin",
      type: "Automatic",
      price: "30,000",
      image:
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] rounded-3xl p-8 text-white flex flex-col lg:flex-row items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold mb-3">
            Find Your Ideal Vehicles in Lanka
          </h2>

          <p className="max-w-xl text-blue-100 mb-5">
            Explore the best car rentals across the island from trusted
            providers.
          </p>

          <button className="bg-white text-[#2563eb] px-6 py-3 rounded-xl font-bold">
            Search All Vehicles
          </button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c"
          alt=""
          className="w-[320px] rounded-2xl mt-5 lg:mt-0"
        />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {vehicles.map((vehicle, index) => (
          <VehicleCard key={index} {...vehicle} />
        ))}
      </div>
    </div>
  );
}

