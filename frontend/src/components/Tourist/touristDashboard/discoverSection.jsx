import { useState, useEffect } from "react";
import DestinationCard from "./destinationCard";

// ══════════════════════════════════════════════════════════════════════════════
// DiscoverSection.jsx — Updated by AI Itinerary Engine
// Uses hardcoded data for correct images/destinations per tab
// Uses POST /api/itinerary/recommendations to get real ML ratings
// ══════════════════════════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:5000';

// ── Hardcoded destination data per category (correct Sri Lanka images) ────
const destinationsByCategory = {
  Beach: [
    { title: "Mirissa", rating: "4.8", description: "Stunning crescent beach with whale watching", image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400&h=250&fit=crop" },
    { title: "Unawatuna", rating: "4.7", description: "Golden sands with coral reef snorkeling", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop" },
    { title: "Trincomalee", rating: "4.6", description: "Pristine beaches and historic forts on the east coast", image: "https://plus.unsplash.com/premium_photo-1730035378497-6f182674961c?w=400&h=250&fit=crop" },
  ],
  Culture: [
    { title: "Sigiriya", rating: "4.8", description: "Ancient rock fortress with stunning views", image: "https://images.unsplash.com/photo-1612862862126-865765df2ded?w=400&h=250&fit=crop" },
    { title: "Galle Fort", rating: "4.7", description: "Historic colonial fortification by the sea", image: "https://images.unsplash.com/photo-1566299597203-225f611b865f?w=400&h=250&fit=crop" },
    { title: "Kandy", rating: "4.9", description: "Cultural capital with the Temple of the Tooth", image: "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=400&h=250&fit=crop" },
  ],
  Wildlife: [
    { title: "Yala National Park", rating: "4.9", description: "Leopards and elephants in the wild", image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=250&fit=crop" },
    { title: "Udawalawe", rating: "4.7", description: "Best place to see wild elephants up close", image: "https://images.unsplash.com/photo-1674556275189-e78fd6223e6d?w=400&h=250&fit=crop" },
    { title: "Sinharaja Forest", rating: "4.8", description: "UNESCO rainforest with rare endemic birds", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=250&fit=crop" },
  ],
  Hiking: [
    { title: "Ella", rating: "4.9", description: "Scenic hill country with tea plantations", image: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=250&fit=crop" },
    { title: "Adam's Peak", rating: "4.8", description: "Sacred mountain with breathtaking sunrise", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop" },
    { title: "Knuckles Range", rating: "4.7", description: "Mist-covered peaks and hidden waterfalls", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop" },
  ],
  Food: [
    { title: "Colombo Food Tour", rating: "4.8", description: "Street food and spicy Sri Lankan curries", image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=250&fit=crop" },
    { title: "Jaffna Cuisine", rating: "4.9", description: "Unique northern flavors and seafood delights", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop" },
    { title: "Tea Country", rating: "4.7", description: "Ceylon tea estates with plantation lunches", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=250&fit=crop" },
  ],
};

// Category to interest mapping for API
const categoryInterestMap = {
  Beach:    'beach',
  Culture:  'culture',
  Wildlife: 'wildlife',
  Hiking:   'nature',
  Food:     'food',
};

function DiscoverSection({ touristProfile }) {
  const [activeTab, setActiveTab]   = useState("Beach");
  const [mlRatings, setMlRatings]   = useState({});  // ML ratings from API

  // ── Fetch ML ratings from API in background ───────────────────────────────
  useEffect(() => {
    const fetchMLRatings = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/itinerary/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            age:           touristProfile?.age          || 25,
            nationality:   touristProfile?.nationality  || 'local',
            interest:      categoryInterestMap[activeTab] || 'nature',
            budget_level:  touristProfile?.budget_level || 'medium',
            trip_duration: touristProfile?.num_days     || 5,
          }),
        });

        if (!response.ok) return;

        const data = await response.json();
        if (data.status === 'error') return;

        const recs = data.result?.recommendations || data.recommendations || [];

        // Build a map of destination → ML rating
        const ratingsMap = {};
        recs.forEach(rec => {
          if (rec.destination && rec.avg_rating) {
            ratingsMap[rec.destination] = parseFloat(rec.avg_rating.toFixed(1));
          }
        });

        setMlRatings(prev => ({ ...prev, ...ratingsMap }));

      } catch (err) {
        // Silently fail — hardcoded ratings will be used
        console.warn('ML ratings fetch failed, using default ratings:', err.message);
      }
    };

    fetchMLRatings();
  }, [activeTab, touristProfile]);

  // ── Merge hardcoded data with ML ratings ──────────────────────────────────
  const destinations = destinationsByCategory[activeTab].map(dest => ({
    ...dest,
    // Use ML rating if available, otherwise keep hardcoded rating
    rating: mlRatings[dest.title]
      ? mlRatings[dest.title].toString()
      : dest.rating,
  }));

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

      {/* Destinations Grid */}
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