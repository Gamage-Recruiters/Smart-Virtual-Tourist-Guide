import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

// ══════════════════════════════════════════════════════════════════════════════
// DestinationHighlights.jsx — Updated by AI Itinerary Engine
// Connected to POST /api/itinerary/recommendations
// UI kept exactly as original (2-column grid, large images, lucide-react)
// Props:
//   - touristProfile: { age, nationality, interest, budget_level, num_days }
// ══════════════════════════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:5000';

// ── Fallback hardcoded destinations (used when API unavailable) ───────────
const fallbackDestinations = [
  {
    name: "Colombo",
    description: "Capital city, vibrant culture",
    rating: 4.5,
    day: "Day 1",
    image: "https://images.unsplash.com/photo-1660557989695-14fac79c086d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Kandy",
    description: "Cultural capital, sacred temples",
    rating: 4.8,
    day: "Day 2",
    image: "https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Ella",
    description: "Tea country, scenic train rides",
    rating: 4.9,
    day: "Day 3",
    image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Sigiriya",
    description: "Ancient rock fortress, UNESCO site",
    rating: 4.7,
    day: "Add to plan",
    image: "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=1200&auto=format&fit=crop",
  },
];

// ── Location image map ────────────────────────────────────────────────────
const locationImages = {
  'Colombo':      'https://images.unsplash.com/photo-1660557989695-14fac79c086d?q=80&w=1200&auto=format&fit=crop',
  'Kandy':        'https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?q=80&w=1200&auto=format&fit=crop',
  'Sigiriya':     'https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=1200&auto=format&fit=crop',
  'Galle':        'https://images.unsplash.com/photo-1579989197111-928f586796a3?q=80&w=1200&auto=format&fit=crop',
  'Ella':         'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1200&auto=format&fit=crop',
  'Mirissa':      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=1200&auto=format&fit=crop',
  'Trincomalee':  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  'Nuwara Eliya': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
  'Anuradhapura': 'https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YW51cmFkaGFwdXJhJTIwQW5jaWVudCUyMHJ1aW5zJTIwYW5kJTIwaGlzdG9yaWMlMjBzaXRlc3xlbnwwfHwwfHx8MA%3D%3D',
  'Polonnaruwa':  'https://images.unsplash.com/photo-1709729519591-2fb2d25395df?q=80&w=765&auto=format&fit=crop',
  'default':      'https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=1200&auto=format&fit=crop',
};

const getImage = (destination) => {
  if (!destination) return locationImages['default'];
  const key = Object.keys(locationImages).find(k =>
    destination.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(destination.toLowerCase())
  );
  return key ? locationImages[key] : locationImages['default'];
};

const categoryDescriptions = {
  'Heritage':  'Ancient ruins and historic sites',
  'Nature':    'Scenic hill country and nature trails',
  'Beach':     'Beautiful coastline and beaches',
  'Cultural':  'Rich cultural heritage and temples',
  'Wildlife':  'National parks and wildlife sanctuaries',
  'Adventure': 'Thrilling outdoor activities',
  'City':      'Vibrant urban culture and food',
  'default':   'Explore this amazing destination',
};

export default function DestinationHighlights({ touristProfile }) {
  const [destinations, setDestinations] = useState(fallbackDestinations);
  const [loading, setLoading]           = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/itinerary/recommendations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            age:           touristProfile?.age          || 25,
            nationality:   touristProfile?.nationality  || 'local',
            interest:      touristProfile?.interest     || 'nature',
            budget_level:  touristProfile?.budget_level || 'medium',
            trip_duration: touristProfile?.num_days     || 5,
          }),
        });

        if (!response.ok) throw new Error('API error');

        const data = await response.json();
        if (data.status === 'error') throw new Error(data.message);

        const recs = data.result?.recommendations || data.recommendations || [];

        if (recs.length >= 2) {
          const mapped = recs.slice(0, 4).map((rec, index) => ({
            name:        rec.destination,
            description: categoryDescriptions[rec.category] || categoryDescriptions['default'],
            rating:      parseFloat((rec.avg_rating || 4.5).toFixed(1)),
            day:         index < 3 ? `Day ${index + 1}` : 'Add to plan',
            image:       getImage(rec.destination),
          }));
          setDestinations(mapped);
        }

      } catch (err) {
        // Silently fall back to hardcoded destinations
        console.warn('Recommendations API unavailable, using fallback:', err.message);
        setDestinations(fallbackDestinations);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [touristProfile]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm w-full">
      <h2 className="text-xl font-bold text-gray-900 mb-10">
        Destination Highlights
      </h2>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 w-full bg-gray-200 rounded-md" />
              <div className="pt-5 text-center space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destinations Grid — exact same UI as original */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
          {destinations.map((place, index) => (
            <div key={index} className="group">
              <div className="overflow-hidden rounded-md">
                <img
                  src={place.image}
                  alt={place.name}
                  className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => { e.target.src = locationImages['default']; }}
                />
              </div>

              <div className="pt-5 text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {place.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {place.description}
                </p>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-700">{place.rating}</span>
                  <span>•</span>
                  <span>{place.day}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}