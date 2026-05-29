import DriverCard from './DriverCard'

export default function DriversPage() {
  const drivers = [
    {
      name: "Amila Perera",
      price: "8,500",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
    {
      name: "Sarah Wickramage",
      price: "6,200",
      rating: "5.0",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    {
      name: "Fernando Tours",
      price: "6,200",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    },
    {
      name: "Dilan Subasinha",
      price: "7,500",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598",
    },
    {
      name: "Ranjith Kulathunga",
      price: "8,300",
      rating: "5.0",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
    {
      name: "Ishan Gunarathna",
      price: "9,200",
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] rounded-3xl p-8 text-white flex flex-col lg:flex-row items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold mb-3">
            Recommended Drivers for You
          </h2>

          <p className="max-w-xl text-blue-100 mb-5">
            Top-rated professional drivers with multi-language support and
            deep local knowledge.
          </p>

          <button className="bg-white text-[#2563eb] px-6 py-3 rounded-xl font-bold">
            EXPLORE DESTINATIONS
          </button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341"
          alt=""
          className="w-[320px] rounded-2xl mt-5 lg:mt-0"
        />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {drivers.map((driver, index) => (
          <DriverCard key={index} {...driver} />
        ))}
      </div>
    </div>
  );
}


