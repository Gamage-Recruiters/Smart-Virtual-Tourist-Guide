import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Tourist/Header';
import Footer from '../../components/Tourist/Footer';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const CATEGORIES = ["All", "Authentic Sri Lankan", "Appetizer", "Main Course", "Dessert", "Beverage"];

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

  // Reservation Modal & State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookDate, setBookDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookTableType, setBookTableType] = useState('ethereal');
  const [bookGuestCount, setBookGuestCount] = useState(1);
  const [availDetails, setAvailDetails] = useState(null);
  const [checkingAvail, setCheckingAvail] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');
  const [bookingErrorMsg, setBookingErrorMsg] = useState('');

  // Fetch slot availability when date or restaurant changes
  useEffect(() => {
    if (id && bookDate) {
      const fetchAvailability = async () => {
        setCheckingAvail(true);
        try {
          const res = await fetch(`${API_BASE}/reservations/availability?restaurantId=${id}&date=${bookDate}`);
          if (res.ok) {
            const data = await res.json();
            setAvailDetails(data);
          }
        } catch (err) {
          console.error("Error fetching availability:", err);
        } finally {
          setCheckingAvail(false);
        }
      };
      fetchAvailability();
    }
  }, [id, bookDate]);

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

  // Calculate pricing values
  const getTablePricePerPerson = () => {
    if (!restaurant) return 0;
    return restaurant.tables?.[bookTableType]?.pricePerPerson || (bookTableType === 'ethereal' ? 285 : 195);
  };

  const getBookingCostDetails = () => {
    const ppp = getTablePricePerPerson();
    const subtotal = ppp * bookGuestCount;
    const serviceCharge = parseFloat((subtotal * 0.15).toFixed(2));
    const total = parseFloat((subtotal + serviceCharge).toFixed(2));
    return { subtotal, serviceCharge, total };
  };

  const handleProcessBooking = async () => {
    if (submittingBooking) return;
    setSubmittingBooking(true);
    setBookingSuccessMsg('');
    setBookingErrorMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setBookingErrorMsg("Please sign in first to make a table reservation.");
        setSubmittingBooking(false);
        return;
      }

      const res = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          restaurantId: id,
          tableType: bookTableType,
          guestCount: Number(bookGuestCount),
          date: bookDate
        })
      });

      const data = await res.json();
      if (res.ok) {
        setBookingSuccessMsg("Seat reservation paid and completed successfully!");
        // Refresh availability
        const availRes = await fetch(`${API_BASE}/reservations/availability?restaurantId=${id}&date=${bookDate}`);
        if (availRes.ok) {
          const freshAvail = await availRes.json();
          setAvailDetails(freshAvail);
        }
        setTimeout(() => {
          setIsBookModalOpen(false);
          setBookingSuccessMsg('');
          setSubmittingBooking(false); // Only enable here after modal closes
        }, 2500);
      } else {
        setBookingErrorMsg(data.message || "Failed to complete reservation booking.");
        setSubmittingBooking(false); // Enable immediately on error
      }
    } catch (err) {
      setBookingErrorMsg("Network error. Please try again.");
      setSubmittingBooking(false); // Enable immediately on error
    }
  };


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

            {/* Operating Hours Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Opening Hours</h3>
              <div className="space-y-2 text-xs">
                {restaurant.operatingHours && restaurant.operatingHours.length > 0 ? (
                  restaurant.operatingHours.map(hours => (
                    <div key={hours.day} className="flex justify-between items-center text-slate-700">
                      <span className="font-medium">{hours.day}</span>
                      <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                        {hours.open} - {hours.close}
                      </span>
                    </div>
                  ))
                ) : (
                  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex justify-between items-center text-slate-700">
                      <span className="font-medium">{day}</span>
                      <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                        09:00 - 22:00
                      </span>
                    </div>
                  ))
                )}
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

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsBookModalOpen(true)}
                className="w-full py-3 bg-[#0075FF] hover:bg-[#0059CC] text-white font-bold rounded-xl text-sm transition-colors shadow-md hover:shadow-lg cursor-pointer"
              >
                Reserve a Table
              </button>
              
              <button
                onClick={() => navigate('/restaurants')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                ← All Restaurants
              </button>
            </div>
          </aside>

        </div>
      </div>

      {/* Booking Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative border border-slate-100 animate-fadeIn">
            {/* Close Button */}
            <button 
              onClick={() => setIsBookModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-2">Book a Seat</h3>
            <p className="text-xs text-slate-500 mb-6">Select your seat type, reservation date, and guests to calculate rates.</p>

            {/* Error Message */}
            {bookingErrorMsg && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600 font-semibold">
                {bookingErrorMsg}
              </div>
            )}

            {/* Success Message */}
            {bookingSuccessMsg && (
              <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 text-xs text-green-700 font-bold">
                {bookingSuccessMsg}
              </div>
            )}

            <div className="space-y-4">
              {/* Date selection */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">Select Date</label>
                <input
                  type="date"
                  value={bookDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setBookDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              {/* Table / Experience type */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">Experience Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBookTableType('ethereal')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      bookTableType === 'ethereal'
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-extrabold text-slate-800">
                      {restaurant.tables?.ethereal?.name || 'Luxury Experience'}
                    </span>
                    <span className="mt-1 block text-xs text-blue-600 font-bold">
                      ${restaurant.tables?.ethereal?.pricePerPerson || 285} / person
                    </span>
                    {availDetails && (
                      <span className="mt-2 block text-[10px] text-slate-400 font-medium">
                        {availDetails.ethereal.available} seats left today
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookTableType('obsidian')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      bookTableType === 'obsidian'
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-extrabold text-slate-800">
                      {restaurant.tables?.obsidian?.name || 'Sunset Dining'}
                    </span>
                    <span className="mt-1 block text-xs text-blue-600 font-bold">
                      ${restaurant.tables?.obsidian?.pricePerPerson || 195} / person
                    </span>
                    {availDetails && (
                      <span className="mt-2 block text-[10px] text-slate-400 font-medium">
                        {availDetails.obsidian.available} seats left today
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  value={bookGuestCount}
                  onChange={e => setBookGuestCount(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              {/* Calculations Block */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({bookGuestCount} × ${getTablePricePerPerson()})</span>
                  <span className="font-semibold">${getBookingCostDetails().subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service Charge (15%)</span>
                  <span className="font-semibold">${getBookingCostDetails().serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span>${getBookingCostDetails().total.toFixed(2)}</span>
                </div>
              </div>

              {/* Pay Now Action */}
              <button
                type="button"
                disabled={submittingBooking || (availDetails && bookGuestCount > (bookTableType === 'ethereal' ? availDetails.ethereal.available : availDetails.obsidian.available))}
                onClick={handleProcessBooking}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingBooking ? 'Processing Payment...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
