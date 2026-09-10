import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DestinationDetails from './DestinationDetails';

// --- Constants & Options ---
const PROVINCES = [
    'Western',
    'Central',
    'Southern',
    'Northern',
    'Eastern',
    'North Western',
    'North Central',
    'Uva',
    'Sabaragamuwa'
];

const ADVENTURE_LEVELS = ['Low', 'Moderate', 'High', 'Extreme'];

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const CATEGORIES_LIST = [
    { name: 'All', icon: '✨' },
    { name: 'Beaches', icon: '🏖️' },
    { name: 'Mountains', icon: '⛰️' },
    { name: 'National Parks', icon: '🌿' },
    { name: 'Historical', icon: '🏛️' },
    { name: 'Waterfalls', icon: '🌊' },
    { name: 'Cities', icon: '🏙️' },
    { name: 'Cultural', icon: '🎭' },
    { name: 'Wildlife', icon: '🐘' },
    { name: 'Religious', icon: '🛕' },
    { name: 'Adventure', icon: '🧗' }
];

const SORT_OPTIONS = [
    { label: 'Featured & Newest', value: 'newest' },
    { label: 'Highest Rated', value: 'ratingDesc' },
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' }
];

// --- SVGs for Icons ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const StarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 text-yellow-400"
    >
        <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
        />
    </svg>
);

const ClockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 text-gray-600"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const UserIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 text-gray-600"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const FilterSlidersIcon = () => (
    <svg className="w-4 h-4 text-[#5BA3F5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
);

// --- Destination Card (Matching Destinations Page style) ---
const DestinationCard = ({
    image,
    title,
    rating,
    reviews,
    price,
    days,
    travelers,
    location,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className="w-full bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
        >
            <div className="relative">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1589391886645-d51941b1ee7b?q=80&w=1000&auto=format&fit=crop';
                    }}
                />

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <StarIcon />
                    <span className="text-xs font-medium text-gray-800">
                        {rating || 'N/A'} ({reviews || 0})
                    </span>
                </div>
            </div>

            <div className="p-5 text-center flex-1 flex flex-col justify-between">
                <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {title}
                </h4>

                <div className="flex flex-col items-center gap-1">
                    <div className="text-base font-semibold text-gray-700">
                        {price}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ClockIcon />
                        <span>{days}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <UserIcon />
                        <span>{travelers}</span>
                    </div>

                    <div className="text-gray-500 text-xs mt-1 line-clamp-1">
                        {location}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDestination, setSelectedDestination] = useState(null);

    // Filter States
    const [searchInput, setSearchInput] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeProvince, setActiveProvince] = useState('');
    const [activeAdventure, setActiveAdventure] = useState('');
    const [activeSeason, setActiveSeason] = useState('');
    const [activeTravelStyle, setActiveTravelStyle] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Sync state from URL parameters and perform multi-filtering
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') || '';
        const cat = params.get('category') || (params.get('action') === 'category' ? params.get('value') : 'All') || 'All';
        const prov = params.get('province') || (params.get('action') === 'province' ? params.get('value') : '');
        const adv = params.get('adventureLevel') || (params.get('action') === 'adventureLevel' ? params.get('value') : '');
        const season = params.get('bestSeason') || (params.get('action') === 'bestSeason' ? params.get('value') : '');
        const style = params.get('travelStyle') || (params.get('action') === 'filter' ? params.get('value') : '');
        const sort = params.get('sort') || 'newest';

        setSearchInput(q);
        setActiveCategory(cat);
        setActiveProvince(prov);
        setActiveAdventure(adv);
        setActiveSeason(season);
        setActiveTravelStyle(style);
        setSortBy(sort);

        fetchFilteredData({
            q,
            category: cat,
            province: prov,
            adventureLevel: adv,
            bestSeason: season,
            travelStyle: style,
            sort
        });
    }, [location.search]);

    // Fetch from backend MongoDB API with all combined filters
    const fetchFilteredData = async (filters) => {
        setLoading(true);
        try {
            const apiParams = new URLSearchParams();

            if (filters.q && filters.q.trim()) apiParams.append('q', filters.q.trim());
            if (filters.sort) apiParams.append('sort', filters.sort);
            if (filters.category && filters.category !== 'All') apiParams.append('category', filters.category);
            if (filters.province) apiParams.append('province', filters.province);
            if (filters.adventureLevel) apiParams.append('adventureLevel', filters.adventureLevel);
            if (filters.bestSeason) apiParams.append('bestSeason', filters.bestSeason);
            if (filters.travelStyle) {
                if (filters.travelStyle === 'Family Friendly') apiParams.append('isFamilyFriendly', 'true');
                else if (filters.travelStyle === 'Solo Travel') apiParams.append('isSoloTravel', 'true');
                else if (filters.travelStyle === 'Couple Friendly') apiParams.append('isCoupleFriendly', 'true');
                else if (filters.travelStyle === 'Group Friendly') apiParams.append('isGroupFriendly', 'true');
            }

            const res = await axios.get(`http://localhost:5000/api/destinations?${apiParams.toString()}`);

            const mapped = res.data.map(dest => ({
                ...dest,
                id: dest._id,
                image: dest.heroImage || (dest.images && dest.images[0]) || dest.thumbnailImage || 'https://images.unsplash.com/photo-1589391886645-d51941b1ee7b?q=80&w=1000&auto=format&fit=crop',
                priceDisplay: dest.priceDisplay || (dest.price ? `Rs. ${dest.price.toLocaleString()} / Per Person` : 'Contact for Price'),
                durationDisplay: dest.durationDisplay || (dest.duration ? `${dest.duration} Days` : 'N/A'),
                travelersDisplay: dest.travelersDisplay || (dest.travelersCount ? `${dest.travelersCount}+ Travelers` : 'N/A'),
                rating: dest.rating || 4.9,
                reviews: dest.reviewCount || 12
            }));

            setDestinations(mapped);
        } catch (err) {
            console.error('Error fetching destinations:', err);
            setDestinations([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper to merge and apply multi-filters simultaneously
    const updateFilters = (changes) => {
        const params = new URLSearchParams(location.search);

        const current = {
            q: params.get('q') || '',
            category: params.get('category') || (params.get('action') === 'category' ? params.get('value') : 'All') || 'All',
            province: params.get('province') || (params.get('action') === 'province' ? params.get('value') : ''),
            adventureLevel: params.get('adventureLevel') || (params.get('action') === 'adventureLevel' ? params.get('value') : ''),
            bestSeason: params.get('bestSeason') || (params.get('action') === 'bestSeason' ? params.get('value') : ''),
            travelStyle: params.get('travelStyle') || (params.get('action') === 'filter' ? params.get('value') : ''),
            sort: params.get('sort') || sortBy
        };

        const merged = { ...current, ...changes };

        const newParams = new URLSearchParams();
        if (merged.q && merged.q.trim()) newParams.set('q', merged.q.trim());
        if (merged.category && merged.category !== 'All') newParams.set('category', merged.category);
        if (merged.province) newParams.set('province', merged.province);
        if (merged.adventureLevel) newParams.set('adventureLevel', merged.adventureLevel);
        if (merged.bestSeason) newParams.set('bestSeason', merged.bestSeason);
        if (merged.travelStyle) newParams.set('travelStyle', merged.travelStyle);
        if (merged.sort && merged.sort !== 'newest') newParams.set('sort', merged.sort);

        const qs = newParams.toString();
        navigate(qs ? `/results?${qs}` : '/results');
    };

    const handleCategorySelect = (categoryName) => {
        updateFilters({ category: categoryName });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateFilters({ q: searchInput.trim() });
    };

    const clearAllFilters = () => {
        setSearchInput('');
        navigate('/results');
    };

    // If a destination is clicked, show DestinationDetails full page
    if (selectedDestination) {
        return (
            <DestinationDetails
                destination={selectedDestination}
                onBack={() => setSelectedDestination(null)}
            />
        );
    }

    const hasActiveFilters =
        (activeCategory && activeCategory !== 'All') ||
        activeProvince ||
        activeAdventure ||
        activeSeason ||
        activeTravelStyle ||
        searchInput;

    return (
        <div className="min-h-screen bg-[#fbfcfd] text-gray-800 font-sans pb-24">

            {/* ── Top Header / Search Banner (Clean Light Style) ── */}
            <div className="bg-white border-b border-gray-100 pt-8 pb-10 px-4 sm:px-6 lg:px-8 shadow-[0_2px_15px_rgb(0,0,0,0.03)]">
                <div className="max-w-7xl mx-auto">

                    {/* Top Bar: Back button only (SMART TOURIST GUIDE removed) */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate('/destinations')}
                            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-gray-200"
                        >
                            <ArrowLeftIcon />
                            <span>Back to Discovery</span>
                        </button>
                    </div>

                    {/* Heading */}
                    <div className="text-center max-w-3xl mx-auto mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-800 mb-3">
                            Explore Destinations in <span className="text-[#5BA3F5]">Sri Lanka</span>
                        </h1>
                        <p className="text-gray-500 text-sm sm:text-base">
                            Discover breathtaking attractions curated directly from verified local guides and database.
                        </p>
                    </div>

                    {/* Search Input Bar */}
                    <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
                        <div className="relative flex items-center bg-white rounded-full p-1.5 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-gray-200 focus-within:border-[#5BA3F5] transition-all">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by destination name, city, temple, beach..."
                                className="w-full bg-transparent text-gray-700 placeholder-gray-400 text-sm sm:text-base outline-none px-5 py-2"
                            />
                            <button
                                type="submit"
                                className="bg-[#5BA3F5] hover:bg-[#4a92e4] text-white p-3 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <SearchIcon />
                            </button>
                        </div>
                    </form>

                </div>
            </div>

            {/* ── Category Pill Bar (Horizontal Scroll) ── */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none scroll-smooth">
                        {CATEGORIES_LIST.map((cat) => {
                            const isSelected = activeCategory === cat.name;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => handleCategorySelect(cat.name)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${isSelected
                                            ? 'bg-[#5BA3F5] text-white shadow-md shadow-blue-500/20 scale-105'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                                        }`}
                                >
                                    <span className="text-base">{cat.icon}</span>
                                    <span>{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Multi-Filter Bar & Sorter ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        {/* Multi-Filter Selectors */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mr-1">
                                <FilterSlidersIcon /> Filters:
                            </span>

                            {/* Province Multi-Selector */}
                            <select
                                value={activeProvince}
                                onChange={(e) => updateFilters({ province: e.target.value })}
                                className={`text-sm rounded-xl px-3 py-2 border font-medium outline-none transition-colors cursor-pointer ${activeProvince
                                        ? 'bg-[#5BA3F5]/10 border-[#5BA3F5] text-[#2563EB]'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <option value="">All Provinces</option>
                                {PROVINCES.map((p) => (
                                    <option key={p} value={p}>{p} Province</option>
                                ))}
                            </select>

                            {/* Adventure Level Multi-Selector */}
                            <select
                                value={activeAdventure}
                                onChange={(e) => updateFilters({ adventureLevel: e.target.value })}
                                className={`text-sm rounded-xl px-3 py-2 border font-medium outline-none transition-colors cursor-pointer ${activeAdventure
                                        ? 'bg-[#5BA3F5]/10 border-[#5BA3F5] text-[#2563EB]'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <option value="">Adventure Level</option>
                                {ADVENTURE_LEVELS.map((lvl) => (
                                    <option key={lvl} value={lvl}>{lvl} Adventure</option>
                                ))}
                            </select>

                            {/* Best Season Month Multi-Selector */}
                            <select
                                value={activeSeason}
                                onChange={(e) => updateFilters({ bestSeason: e.target.value })}
                                className={`text-sm rounded-xl px-3 py-2 border font-medium outline-none transition-colors cursor-pointer ${activeSeason
                                        ? 'bg-[#5BA3F5]/10 border-[#5BA3F5] text-[#2563EB]'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <option value="">Best Month</option>
                                {MONTHS.map((m) => (
                                    <option key={m} value={m}>Best in {m}</option>
                                ))}
                            </select>

                            {/* Travel Style Buttons */}
                            <div className="hidden sm:flex items-center gap-1.5">
                                {['Family Friendly', 'Solo Travel', 'Couple Friendly'].map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => updateFilters({ travelStyle: activeTravelStyle === style ? '' : style })}
                                        className={`text-xs px-3 py-2 rounded-xl border font-medium transition-all ${activeTravelStyle === style
                                                ? 'bg-[#5BA3F5] text-white border-[#5BA3F5] shadow-sm'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                            }`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sorter */}
                        <div className="flex items-center gap-3 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
                            <span className="text-xs text-gray-400 font-medium">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => updateFilters({ sort: e.target.value })}
                                className="text-sm bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-gray-100"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Active Multi-Filter Badges */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-gray-100">
                            <span className="text-xs text-gray-400">Active filters:</span>

                            {activeCategory !== 'All' && (
                                <span className="inline-flex items-center gap-1 text-xs bg-[#5BA3F5]/10 text-[#2563EB] font-medium px-2.5 py-1 rounded-lg border border-[#5BA3F5]/20">
                                    Category: {activeCategory}
                                    <button onClick={() => updateFilters({ category: 'All' })} className="hover:text-red-500 font-bold ml-1">×</button>
                                </span>
                            )}

                            {activeProvince && (
                                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-lg border border-blue-200">
                                    Province: {activeProvince}
                                    <button onClick={() => updateFilters({ province: '' })} className="hover:text-red-500 font-bold ml-1">×</button>
                                </span>
                            )}

                            {activeAdventure && (
                                <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 font-medium px-2.5 py-1 rounded-lg border border-amber-200">
                                    Adventure: {activeAdventure}
                                    <button onClick={() => updateFilters({ adventureLevel: '' })} className="hover:text-red-500 font-bold ml-1">×</button>
                                </span>
                            )}

                            {activeSeason && (
                                <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-lg border border-emerald-200">
                                    Season: {activeSeason}
                                    <button onClick={() => updateFilters({ bestSeason: '' })} className="hover:text-red-500 font-bold ml-1">×</button>
                                </span>
                            )}

                            {activeTravelStyle && (
                                <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 font-medium px-2.5 py-1 rounded-lg border border-purple-200">
                                    Style: {activeTravelStyle}
                                    <button onClick={() => updateFilters({ travelStyle: '' })} className="hover:text-red-500 font-bold ml-1">×</button>
                                </span>
                            )}

                            {searchInput && (
                                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-lg border border-gray-200">
                                    "{searchInput}"
                                    <button onClick={() => { setSearchInput(''); updateFilters({ q: '' }); }} className="hover:text-red-500 font-bold ml-1">×</button>
                                </span>
                            )}

                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-red-500 hover:text-red-600 hover:underline font-semibold ml-2"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                </div>

                {/* ── Results Header Stats ── */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {loading ? 'Finding destinations...' : `${destinations.length} Destination${destinations.length === 1 ? '' : 's'} Found`}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500">
                            {activeCategory !== 'All' ? `Showing curated destinations in ${activeCategory}` : 'Showing all verified destinations in Sri Lanka'}
                        </p>
                    </div>
                </div>

                {/* ── Content Grid / Loading / Empty State ── */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="bg-white rounded-[32px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-pulse">
                                <div className="w-full h-52 bg-gray-200 rounded-[24px] mb-4"></div>
                                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mb-2"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/3 mx-auto mb-4"></div>
                            </div>
                        ))}
                    </div>
                ) : destinations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {destinations.map((dest) => (
                            <DestinationCard
                                key={dest.id}
                                image={dest.image}
                                title={dest.title}
                                rating={dest.rating}
                                reviews={dest.reviews}
                                price={dest.priceDisplay}
                                days={dest.durationDisplay}
                                travelers={dest.travelersDisplay}
                                location={dest.location}
                                onClick={() => setSelectedDestination(dest)}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty Search State */
                    <div className="bg-white rounded-[32px] p-12 text-center max-w-xl mx-auto border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.05)] mt-8">
                        <div className="w-20 h-20 bg-blue-50 text-[#5BA3F5] rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                            🏝️
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Destinations Found</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            We couldn't find any destinations matching your selected filter combination. Try clearing some filters or changing your search keywords.
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="bg-[#5BA3F5] hover:bg-[#4a92e4] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md transition-all"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}

            </div>

        </div>
    );
};

export default ResultsPage;

