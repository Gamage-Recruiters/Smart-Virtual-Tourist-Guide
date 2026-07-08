import { useState, useEffect } from "react";
import DestinationCard from "../../components/touristDashboard/destinationCard";

// ══════════════════════════════════════════════════════════════════════════════
// DiscoverSection.jsx — Updated by AI Itinerary Engine
// Replaced hardcoded data with POST /api/itinerary/recommendations API call
// UI structure kept exactly as original
// ══════════════════════════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:5000';

// Category to interest mapping for the API
const categoryInterestMap = {
    'Beach':    'beach',
    'Culture':  'culture',
    'Wildlife': 'wildlife',
    'Hiking':   'nature',
    'Food':     'food',
};

// Fallback images per destination (in case API doesn't return images)
const locationImages = {
    'Colombo':      'https://images.unsplash.com/photo-1660557989695-14fac79c086d?w=400&h=250&fit=crop',
    'Kandy':        'https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=400&h=250&fit=crop',
    'Sigiriya':     'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=400&h=250&fit=crop',
    'Galle':        'https://images.unsplash.com/photo-1579989197111-928f586796a3?w=400&h=250&fit=crop',
    'Ella':         'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=400&h=250&fit=crop',
    'Mirissa':      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400&h=250&fit=crop',
    'Trincomalee':  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=250&fit=crop',
    'Nuwara Eliya': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop',
    'Anuradhapura': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=250&fit=crop',
    'default':      'https://images.unsplash.com/photo-1612862862126-865765df2ded?w=400&h=250&fit=crop',
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
    'default':   'Explore this amazing destination',
};

function DiscoverSection({ touristProfile }) {
    const [activeTab, setActiveTab]         = useState("Beach");
    const [destinations, setDestinations]   = useState([]);
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState(null);

    // Fetch recommendations when tab changes
    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            setError(null);

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

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'error') {
                    throw new Error(data.message || 'Failed to load recommendations.');
                }

                const recs = data.result?.recommendations || data.recommendations || [];

                // Map API response to match DestinationCard props
                const mapped = recs.slice(0, 4).map((rec) => ({
                    title:       rec.destination,
                    rating:      parseFloat((rec.avg_rating || 4.5).toFixed(1)).toString(),
                    description: categoryDescriptions[rec.category] || categoryDescriptions['default'],
                    image:       getImage(rec.destination),
                }));

                setDestinations(mapped);

            } catch (err) {
                setError(err.message || 'Failed to load destinations.');
                console.error('DiscoverSection error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [activeTab, touristProfile]);

    return (
        <section className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 w-full overflow-hidden">
            <h3 className="text-3xl font-bold mb-8 text-slate-900">
                Discover Sri Lanka
            </h3>

            {/* Category Tabs */}
            <div className="flex gap-10 border-b border-slate-100 pb-1 mb-8">
                {["Beach", "Culture", "Wildlife", "Hiking", "Food"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`relative pb-2 text-base font-semibold transition-colors cursor-pointer ${
                            activeTab === cat
                                ? "text-blue-600"
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        {cat}
                        {activeTab === cat && (
                            <span className="absolute -bottom-1.5 left-0 w-full h-[3px] bg-blue-600 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            <h4 className="font-bold text-slate-800 text-lg mb-6">
                Featured Destinations
            </h4>

            {/* Loading state */}
            {loading && (
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="min-w-[200px] shrink-0 animate-pulse">
                            <div className="w-full h-40 bg-gray-200 rounded-xl mb-3" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-full" />
                        </div>
                    ))}
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Destinations Grid */}
            {!loading && !error && (
                <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
                    {destinations.map((dest, i) => (
                        <div key={i} className="min-w-[280px] w-[280px] shrink-0 snap-start">
                            <DestinationCard {...dest} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default DiscoverSection;