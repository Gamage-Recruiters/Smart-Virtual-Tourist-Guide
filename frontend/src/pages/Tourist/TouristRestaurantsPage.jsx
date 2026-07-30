import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Tourist/Header';
import Footer from '../../components/Tourist/Footer';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
  "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara", 
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
  "Monaragala", "Ratnapura", "Kegalle"
];

const AMENITY_OPTIONS = ["Free WiFi", "Parking", "Outdoor Seating", "Live Music"];

export default function TouristRestaurantsPage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [onlyWithOffers, setOnlyWithOffers] = useState(false);
  const [restaurantOffersMap, setRestaurantOffersMap] = useState({});

  // User Reservations States
  const [showReservations, setShowReservations] = useState(false);
  const [userReservations, setUserReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Load traveler logged in user info
  const token = localStorage.getItem('token');
  const userDataRaw = localStorage.getItem('userData');
  const loggedInUser = userDataRaw ? JSON.parse(userDataRaw) : null;

  // Fetch traveler user reservations
  useEffect(() => {
    if (showReservations && token) {
      const fetchUserReservations = async () => {
        setLoadingReservations(true);
        try {
          const res = await fetch(`${API_BASE}/reservations/tourist`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUserReservations(data);
          }
        } catch (err) {
          console.error("Error loading user reservations:", err);
        } finally {
          setLoadingReservations(false);
        }
      };
      fetchUserReservations();
    }
  }, [showReservations, token]);

  useEffect(() => {
    const fetchRestaurantsAndOffers = async () => {
      try {
        const [restRes, offersRes] = await Promise.all([
          fetch(`${API_BASE}/restaurants`),
          fetch(`${API_BASE}/offers/active`)
        ]);

        if (restRes.ok) {
          const data = await restRes.json();
          setRestaurants(Array.isArray(data) ? data : []);
        }

        if (offersRes.ok) {
          const offersData = await offersRes.json();
          if (Array.isArray(offersData)) {
            const mapping = {};
            offersData.forEach(o => {
              if (o.restaurantId) {
                const currentMax = mapping[o.restaurantId] || 0;
                mapping[o.restaurantId] = Math.max(currentMax, o.discountPercentage || 0);
              }
            });
            setRestaurantOffersMap(mapping);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantsAndOffers();
  }, []);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filteredRestaurants = restaurants.filter(r => {
    const matchesSearch = r.restaurantName?.toLowerCase().includes(search.toLowerCase()) ||
      r.address?.toLowerCase().includes(search.toLowerCase());

    const matchesDistrict = selectedDistrict ? r.district === selectedDistrict : true;

    const matchesAmenities = selectedAmenities.length > 0
      ? selectedAmenities.every(a => r.amenities?.includes(a))
      : true;

    const matchesOffers = onlyWithOffers ? !!restaurantOffersMap[r._id] : true;

    return matchesSearch && matchesDistrict && matchesAmenities && matchesOffers;
  });


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />
        
        {/* Banner Section */}
        <div className="relative bg-slate-900 text-white py-16 px-4 text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544025162-d76694265947?w=1200")' }}></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Explore Sri Lankan Restaurants</h1>
            <p className="mt-4 text-lg text-slate-300">Discover premium dining spots, authentic local cuisines, and traveler-friendly facilities in Sri Lanka.</p>
          </div>
        </div>

        {/* Filter and Content Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8 lg:grid-cols-[300px_1fr]">
          
          {/* Sidebar Filters */}
          <aside className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-fit">
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                {showReservations ? 'Reservations' : 'Filters'}
              </h3>
            </div>

            {!showReservations && (
              <>
                {/* District Dropdown Filter */}
                <div>
                  <label htmlFor="district-filter" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">District</label>
                  <select
                    id="district-filter"
                    value={selectedDistrict}
                    onChange={e => setSelectedDistrict(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white"
                  >
                    <option value="">All Districts</option>
                    {DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Amenities Checkboxes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Amenities</label>
                  <div className="space-y-2.5">
                    {AMENITY_OPTIONS.map(amenity => (
                      <label key={amenity} className="flex items-center gap-3 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="h-4 w-4 rounded border-blue-400 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Special Deals Checkbox */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-3 text-sm font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyWithOffers}
                      onChange={e => setOnlyWithOffers(e.target.checked)}
                      className="h-4 w-4 rounded border-amber-400 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="flex items-center gap-1.5 text-amber-700">
                      🔥 Active Offers Only
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Tourist Reservations Action buttons */}
            {loggedInUser && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setShowReservations(true)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    showReservations
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  📋 My Reservations
                </button>
                <button
                  onClick={() => setShowReservations(false)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !showReservations
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  🍔 View Restaurants Grid
                </button>
              </div>
            )}
            
            {!showReservations && (selectedDistrict || selectedAmenities.length > 0 || search || onlyWithOffers) && (
              <button 
                onClick={() => {
                  setSelectedDistrict('');
                  setSelectedAmenities([]);
                  setSearch('');
                  setOnlyWithOffers(false);
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </aside>
          {/* Main Grid Content */}
          <main className="space-y-6">
            {showReservations ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-bold text-slate-900">My Table Reservations</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Track your completed dining seat bookings here.</p>
                </div>

                {loadingReservations ? (
                  <div className="py-12 text-center text-xs text-slate-500">Retrieving your reservations...</div>
                ) : userReservations.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    You have not reserved any dining seats yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className="py-2.5 px-3">Restaurant</th>
                          <th className="py-2.5 px-3">District</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Table Experience</th>
                          <th className="py-2.5 px-3 text-center">Guests</th>
                          <th className="py-2.5 px-3 text-right">Cost ($)</th>
                          <th className="py-2.5 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userReservations.map(resv => (
                          <tr key={resv._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="py-3 px-3 font-semibold text-slate-900">
                              {resv.restaurantId?.restaurantName || 'Restaurant'}
                            </td>
                            <td className="py-3 px-3 text-slate-500">
                              {resv.restaurantId?.district || '—'}
                            </td>
                            <td className="py-3 px-3 text-slate-700 font-medium">{resv.date}</td>
                            <td className="py-3 px-3 text-blue-600 font-medium uppercase tracking-tight">
                              {resv.tableType === 'ethereal' ? 'Luxury Ethereal' : 'Obsidian Terrace'}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-slate-800">{resv.guestCount}</td>
                            <td className="py-3 px-3 text-right font-extrabold text-slate-950">${resv.subtotal?.toFixed(2)}</td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-50 border border-green-200 text-green-700">
                                {resv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Search Bar */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search restaurants by name or address..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 shadow-sm"
                  />
                </div>

                {/* Loader / Empty / Grid render */}
                {loading ? (
                  <div className="py-24 text-center text-slate-500 font-medium">Retrieving Restaurants...</div>
                ) : filteredRestaurants.length === 0 ? (
                  <div className="py-24 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <p className="text-slate-500 font-medium">No restaurants match your filters.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredRestaurants.map(restaurant => (
                      <article 
                        key={restaurant._id} 
                        onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="h-44 bg-slate-200 relative overflow-hidden">
                          {restaurant.bannerImage ? (
                            <img src={restaurant.bannerImage} alt={restaurant.restaurantName} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-sky-50 text-blue-400 text-2xl font-bold uppercase transition-transform duration-300 group-hover:scale-105">
                              {restaurant.restaurantName?.slice(0, 2)}
                            </div>
                          )}
                          <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5 shadow-sm">
                            {restaurant.district}
                          </span>
                          {restaurantOffersMap[restaurant._id] !== undefined && (
                            <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5 shadow-sm animate-pulse">
                              🔥 {restaurantOffersMap[restaurant._id]}% OFF
                            </span>
                          )}
                        </div>

                        <div className="p-5 space-y-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{restaurant.restaurantName}</h3>
                            <p className="text-xs text-slate-500 mt-1">{restaurant.address}</p>
                          </div>

                          {/* Amenities Icons/Badges list */}
                          {restaurant.amenities?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {restaurant.amenities.map(a => (
                                <span key={a} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  {a}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-600">
                            <div><span className="font-medium">Call:</span> {restaurant.phone}</div>
                            <div><span className="font-medium">Owner:</span> {restaurant.ownerName}</div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>

        </div>
      </div>
      <Footer />
    </div>
  );
}
