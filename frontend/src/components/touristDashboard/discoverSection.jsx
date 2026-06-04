import { useState } from "react";
import DestinationCard from "../../components/touristDashboard/destinationCard";

const destinationsByCategory = {
  Beach: [
    {
      title: "Mirissa",
      rating: "4.8",
      description: "Stunning crescent beach with whale watching",
      image:
        "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400&h=250&fit=crop",
    },
    {
      title: "Unawatuna",
      rating: "4.7",
      description: "Golden sands with coral reef snorkeling",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop",
    },
  ],
  Culture: [
    {
      title: "Sigiriya",
      rating: "4.8",
      description: "Ancient rock fortress with stunning views",
      image:
        "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=400&h=250&fit=crop",
    },
    {
      title: "Galle Fort",
      rating: "4.7",
      description: "Historic colonial fortification by the sea",
      image:
        "https://images.unsplash.com/photo-1546708770-599a3abdf230?w=400&h=250&fit=crop",
    },
    {
      title: "Kandy",
      rating: "4.9",
      description: "Cultural capital with the Temple of the Tooth",
      image:
        "https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?w=400&h=250&fit=crop",
    },
    {
      title: "Kandy",
      rating: "4.9",
      description: "Cultural capital with the Temple of the Tooth",
      image:
        "https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?w=400&h=250&fit=crop",
    },
  ],
  Wildlife: [
    {
      title: "Yala National Park",
      rating: "4.9",
      description: "Leopards and elephants in the wild",
      image:
        "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=250&fit=crop",
    },
    {
      title: "Udawalawe",
      rating: "4.7",
      description: "Best place to see wild elephants up close",
      image:
        "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400&h=250&fit=crop",
    },
    {
      title: "Sinharaja Forest",
      rating: "4.8",
      description: "UNESCO rainforest with rare endemic birds",
      image:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=250&fit=crop",
    },
  ],
  Hiking: [
    {
      title: "Ella",
      rating: "4.9",
      description: "Scenic hill country with tea plantations",
      image:
        "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=250&fit=crop",
    },
    {
      title: "Adam's Peak",
      rating: "4.8",
      description: "Sacred mountain with breathtaking sunrise",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop",
    },
    {
      title: "Knuckles Range",
      rating: "4.7",
      description: "Mist-covered peaks and hidden waterfalls",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    },
  ],
  Food: [
    {
      title: "Colombo Food Tour",
      rating: "4.8",
      description: "Street food and spicy Sri Lankan curries",
      image:
        "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=250&fit=crop",
    },
    {
      title: "Jaffna Cuisine",
      rating: "4.9",
      description: "Unique northern flavors and seafood delights",
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop",
    },
    {
      title: "Tea Country",
      rating: "4.7",
      description: "Ceylon tea estates with plantation lunches",
      image:
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=250&fit=crop",
    },
  ],
};

function DiscoverSection() {
  const [activeTab, setActiveTab] = useState("Beach");
  const destinations = destinationsByCategory[activeTab];

  return (
    <section className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
      <h3 className="text-3xl font-bold mb-8 text-slate-900">
        Discover Sri Lanka
      </h3>

      {/* Category Tabs */}
      <div className="flex gap-10 border-b border-slate-100 pb-1 mb-8">
        {["Beach", "Culture", "Wildlife", "Hiking", "Food"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`text-base font-semibold transition-colors relative pb-1 cursor-pointer ${
              activeTab === cat
                ? "text-blue-600 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-1 after:bg-blue-600 after:rounded-full"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <h4 className="font-bold text-slate-800 text-lg mb-6">
        Featured Destinations
      </h4>

      {/* Grid */}
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {destinations.map((dest, i) => (
          <div key={i} className="min-w-25 shrink-0 snap-start">
            <DestinationCard {...dest} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default DiscoverSection;
