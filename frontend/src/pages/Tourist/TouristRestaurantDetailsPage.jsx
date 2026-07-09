import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Tourist/Header';
import Footer from '../../components/Tourist/Footer';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const CATEGORIES = ["All", "Appetizer", "Main Course", "Dessert", "Beverage"];

export default function TouristRestaurantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedFoodType, setSelectedFoodType] = useState('All'); // All, Vegetarian, Non-Vegetarian, Vegan

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [restRes, menuRes, offersRes] = await Promise.all([
          fetch(`${API_BASE}/restaurants`),
          fetch(`${API_BASE}/menu/restaurant/${id}`),
          fetch(`${API_BASE}/offers/restaurant/${id}`)
        ]);

        if (restRes.ok) {
          const allRest = await restRes.json();
          const matched = Array.isArray(allRest) ? allRest.find(r => r._id === id) : null;
          setRestaurant(matched);
        }

        if (menuRes.ok) {
          const menuData = await menuRes.json();
          setMenuItems(Array.isArray(menuData) ? menuData : []);
        }

        if (offersRes.ok) {
          const offersData = await offersRes.json();
          setOffers(Array.isArray(offersData) ? offersData : []);
        }
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const activeOffer = offers.find(o => o.isActive);

  const getDiscountedPrice = (price) => {
    if (!activeOffer) return price;
    const discount = (price * activeOffer.discountPercentage) / 100;
    return (price - discount).toFixed(2);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' ? true : item.category === selectedCategory;

    const matchesAvailability = onlyAvailable ? item.isAvailable : true;

    const matchesFoodType = selectedFoodType === 'All' ? true : item.foodType === selectedFoodType;

    return matchesSearch && matchesCategory && matchesAvailability && matchesFoodType;
  });


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <div>
          <Header />
          <div className="py-32 text-center text-slate-500 font-semibold">Loading restaurant information...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <div>
          <Header />
          <div className="py-32 text-center text-slate-500 font-semibold">
            <p>Restaurant not found.</p>
            <button onClick={() => navigate('/restaurants')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
              Back to Restaurants
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header />

        {/* Banner Section */}
        <div className="relative bg-slate-900 text-white py-20 px-4">
          {restaurant.bannerImage ? (
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url("${restaurant.bannerImage}")` }}></div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-40"></div>
          )}
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded px-2.5 py-1">
                {restaurant.district}
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{restaurant.restaurantName}</h1>
              <p className="text-slate-300 text-sm max-w-2xl">{restaurant.address}</p>
            </div>
            
            {activeOffer && (
              <div className="bg-amber-500 text-white rounded-2xl p-4 shadow-lg ring-4 ring-amber-500/20 max-w-xs shrink-0 animate-pulse">
                <span className="text-[10px] font-bold uppercase tracking-widest block text-amber-100">Special Promo Running</span>
                <span className="text-2xl font-black block mt-0.5">{activeOffer.discountPercentage}% OFF</span>
                <span className="text-xs font-medium block mt-1 text-amber-50">{activeOffer.title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          
          {/* Menu Items Section */}
          <main className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-bold text-slate-900">Food Menu & Dishes</h2>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Filters: Search bar and availability toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder="Search dishes by name or ingredients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 shadow-sm"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={e => setOnlyAvailable(e.target.checked)}
                  className="h-4 w-4 rounded border-blue-400 text-blue-600 focus:ring-blue-500"
                />
                <span>Available items only</span>
              </label>
            </div>

            {/* Food Type Selector */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Food Type</span>
              <div className="flex gap-2">
                {[
                  { id: 'All', label: 'All Foods' },
                  { id: 'Vegetarian', label: 'Vegetarian' },
                  { id: 'Non-Vegetarian', label: 'Non-Vegetarian' },
                  { id: 'Vegan', label: 'Vegan' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedFoodType(type.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedFoodType === type.id
                        ? 'bg-[#00B047] text-white shadow-sm hover:bg-[#00963C]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>


            {/* Menu Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">
                <p className="text-slate-500 font-medium">No dishes match your selection.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredItems.map(item => (
                  <article key={item._id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="h-40 bg-slate-100 relative">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 text-amber-500 text-lg font-bold">
                          {item.name}
                        </div>
                      )}
                      
                      {/* Availability Label */}
                      <span className={`absolute top-3 right-3 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{item.name}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded uppercase">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="border-t border-slate-50 pt-3 flex items-center justify-between">
                        <div>
                          {activeOffer ? (
                            <div className="space-y-0.5">
                              <span className="text-sm font-black text-slate-950">Rs. {getDiscountedPrice(item.price)}</span>
                              <span className="text-[10px] text-slate-400 line-through block">Rs. {item.price.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-slate-900">Rs. {item.price.toFixed(2)}</span>
                          )}
                        </div>
                        
                        {activeOffer && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                            {activeOffer.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

          {/* Restaurant Details Info Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Restaurant Details</h3>
              
              <div className="space-y-3.5 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Owner</span>
                  <span className="font-semibold text-slate-800">{restaurant.ownerName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Contact Phone</span>
                  <span className="font-semibold text-slate-800">{restaurant.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Email Address</span>
                  <span className="font-semibold text-slate-800">{restaurant.email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">License / Reg Number</span>
                  <span className="font-semibold text-slate-800">{restaurant.registrationNo}</span>
                </div>
              </div>
            </div>

            {/* Amenities Card */}
            {restaurant.amenities?.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Amenities Provided</h3>
                <div className="flex flex-wrap gap-2">
                  {restaurant.amenities.map(a => (
                    <span key={a} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-lg">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back button */}
            <button
              onClick={() => navigate('/restaurants')}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
            >
              ← All Restaurants
            </button>
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  );
}
