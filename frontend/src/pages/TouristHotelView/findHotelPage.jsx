// frontend/src/pages/TouristHotelView/findHotelPage.jsx
import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Wifi,
  Heart,
  ImageOff,
  Loader2,
  X,
} from "lucide-react";
import {
  FaStar,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaUtensils,
  FaSpa,
} from "react-icons/fa";
import apiClient from "../../services/api.js";

// ✅ Extracted top search / filter bar
import SearchFilterBar from "../../components/TouristHotelView/SearchFilterBar";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_GUESTS = 10;

const readInt = (val, fallback = 0, max = MAX_GUESTS) => {
  const n = parseInt(val, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(max, n));
};

const AMENITY_ICONS = {
  "Free WiFi": <FaWifi />,
  "Free Parking": <FaParking />,
  "Swimming Pool": <FaSwimmingPool />,
  Gym: <FaDumbbell />,
  Restaurant: <FaUtensils />,
  Spa: <FaSpa />,
};

// ---------------------------------------------------------------------------
// HotelCard
// ---------------------------------------------------------------------------
function HotelCard({
  hotel,
  guests,
  cheapestRoom: presetRoom,
  availableRoomCount,
  availableRoomIds = [],
}) {
  const [liked, setLiked] = useState(false);
  const [fetchedRoom, setFetchedRoom] = useState(null);
  const navigate = useNavigate();

  const adults = Math.max(0, Number(guests?.adults) || 0);
  const children = Math.max(0, Number(guests?.children) || 0);

  const usePreset = !!presetRoom;

  useEffect(() => {
    if (usePreset) return;
    let isMounted = true;
    apiClient
      .get(
        `/tourist/hotels/${hotel._id}/rooms/cheapest?adults=${adults}&children=${children}`
      )
      .then((data) => {
        if (isMounted) setFetchedRoom(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [hotel._id, adults, children, usePreset]);

  const cheapestRoom = usePreset ? presetRoom : fetchedRoom;

  const images = Array.isArray(hotel.hotelImages) ? hotel.hotelImages : [];
  const hasImages = images.length > 0;
  const coverImage = hasImages ? images[0] : null;

  const amenities = Array.isArray(cheapestRoom?.amenities)
    ? cheapestRoom.amenities
    : [];
  const hasAmenities = amenities.length > 0;

  const hasLocation = !!(
    hotel.hotelLocation?.city ||
    hotel.hotelLocation?.district ||
    hotel.hotelAddress
  );
  const location =
    [hotel.hotelLocation?.city, hotel.hotelLocation?.district]
      .filter(Boolean)
      .join(", ") ||
    hotel.hotelAddress ||
    "";

  const fits = cheapestRoom?.fitsGuests !== false;

  const guestSummary =
    adults === 0 && children === 0
      ? "these guests"
      : `${adults} Adult${adults !== 1 ? "s" : ""}${
          children > 0
            ? `, ${children} Child${children !== 1 ? "ren" : ""}`
            : ""
        }`;

  return (
    <div className="bg-white rounded-2xl shadow-md min-w-[850px] overflow-hidden">
      <div className="grid grid-cols-2">
        <div className="relative min-h-[250px]">
          {hasImages ? (
            <img
              src={coverImage}
              alt={hotel.hotelName}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="absolute inset-0 w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400"
            style={{ display: hasImages ? "none" : "flex" }}
          >
            <ImageOff size={36} />
            <p className="text-sm mt-2">No images uploaded</p>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2 transition hover:scale-110"
          >
            <Heart
              size={20}
              className={`transition duration-300 ${
                liked ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {hotel.hotelName || "Unnamed Hotel"}
                </h2>
                {hasLocation && (
                  <div className="flex items-center gap-1 text-gray-500 mt-2">
                    <MapPin size={13} />
                    <span className="text-xs">{location}</span>
                  </div>
                )}
              </div>
              <div className="flex text-yellow-400 text-sm shrink-0 ml-2">
                {"★★★★★"}
              </div>
            </div>

            {availableRoomCount != null && (
              <p className="mt-2 text-xs font-medium text-emerald-600">
                {availableRoomCount} room
                {availableRoomCount !== 1 ? "s" : ""} available for your dates
              </p>
            )}

            {hasAmenities && (
              <div className="flex flex-wrap gap-3 mt-5 text-xs text-gray-600">
                {amenities.slice(0, 6).map((name) => (
                  <div key={name} className="flex items-center gap-1.5">
                    <span className="text-gray-500 text-[11px]">
                      {AMENITY_ICONS[name] || <Wifi size={12} />}
                    </span>
                    {name}
                  </div>
                ))}
              </div>
            )}

            {cheapestRoom && fits && (
              <div className="flex flex-wrap gap-3 mt-3 text-[13px] text-gray-500">
                {cheapestRoom.roomType && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                    {cheapestRoom.roomType}
                  </span>
                )}
                {(cheapestRoom.capacity?.adults != null ||
                  cheapestRoom.capacity?.children != null) && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                    {[
                      cheapestRoom.capacity.adults &&
                        `${cheapestRoom.capacity.adults} Adult${
                          cheapestRoom.capacity.adults !== 1 ? "s" : ""
                        }`,
                      cheapestRoom.capacity.children &&
                        `${cheapestRoom.capacity.children} Child${
                          cheapestRoom.capacity.children !== 1 ? "ren" : ""
                        }`,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
                {cheapestRoom.roomSize && cheapestRoom.measureType && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                    {cheapestRoom.roomSize} {cheapestRoom.measureType}
                  </span>
                )}
              </div>
            )}

            {cheapestRoom && !fits && (
              <div className="mt-3 text-xs text-rose-600 font-medium">
                No room available for {guestSummary}.
              </div>
            )}
          </div>

          <div className="flex justify-between items-end mt-6">
            <div>
              {cheapestRoom?.locationAndPricing?.[0]?.basePrice != null &&
                fits && (
                  <div>
                    <span className="text-xs text-gray-400">From</span>
                    <p className="text-lg font-bold text-blue-600">
                      LKR{" "}
                      {cheapestRoom.locationAndPricing[0].basePrice.toLocaleString()}
                      <span className="text-xs font-normal text-gray-400 ml-1">
                        / night
                      </span>
                    </p>
                  </div>
                )}
            </div>
            <button
              onClick={() =>
                navigate(
                  `/dashboard-Tourist/find-hotel/hotel-details/${hotel._id}#detail${
                    cheapestRoom?._id ? `-room-${cheapestRoom._id}` : ""
                  }`,
                  {
                    state: {
                      availableRoomIds: Array.isArray(availableRoomIds)
                        ? availableRoomIds
                        : [],
                    },
                  }
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterSidebar
// ---------------------------------------------------------------------------
const amenities = [
  { label: "Free WiFi", icon: <FaWifi /> },
  { label: "Free Parking", icon: <FaParking /> },
  { label: "Swimming Pool", icon: <FaSwimmingPool /> },
  { label: "Gym", icon: <FaDumbbell /> },
  { label: "Restaurant", icon: <FaUtensils /> },
  { label: "Spa", icon: <FaSpa /> },
];
const ratings = [
  { label: "5 Stars", stars: 5 },
  { label: "4 Stars", stars: 4 },
  { label: "3 Stars", stars: 3 },
];
const guestRatings = ["9+ Exceptional", "8+ Very Good", "7+ Good"];

function FilterSidebar({
  selectedAmenities = [],
  onToggleAmenity,
  minPrice,
  maxPrice,
  onApplyPrice,
  onClearPrice,
}) {
  const [draftMin, setDraftMin] = useState(minPrice ?? "");
  const [draftMax, setDraftMax] = useState(maxPrice ?? "");

  useEffect(() => {
    setDraftMin(minPrice ?? "");
  }, [minPrice]);
  useEffect(() => {
    setDraftMax(maxPrice ?? "");
  }, [maxPrice]);

  const handleApply = () => {
    onApplyPrice({
      minPrice: draftMin !== "" ? Number(draftMin) : null,
      maxPrice: draftMax !== "" ? Number(draftMax) : null,
    });
  };

  const handleClear = () => {
    setDraftMin("");
    setDraftMax("");
    onClearPrice();
  };

  const hasPriceFilter = draftMin !== "" || draftMax !== "";

  return (
    <aside className="bg-white rounded-2xl p-4 shadow-md h-fit max-w-[300px]">
      <h3 className="text-xl font-bold mb-4">Filters</h3>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-3">Price Range (LKR)</h4>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] text-gray-500 mb-1 block">Min</label>
            <input
              type="number"
              min={0}
              value={draftMin}
              onChange={(e) => setDraftMin(e.target.value)}
              placeholder="0"
              className="w-full h-[32px] border border-gray-300 rounded-md px-2 text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="text-[12px] text-gray-500 mb-1 block">Max</label>
            <input
              type="number"
              min={0}
              value={draftMax}
              onChange={(e) => setDraftMax(e.target.value)}
              placeholder="Any"
              className="w-full h-[32px] border border-gray-300 rounded-md px-2 text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 h-[32px] bg-blue-600 hover:bg-blue-700 transition rounded-md text-white text-sm"
            >
              Apply
            </button>
            {hasPriceFilter && (
              <button
                type="button"
                onClick={handleClear}
                className="h-[32px] px-3 border border-gray-300 rounded-md text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 bg-white"
              >
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-3">Star Rating</h4>
        <div className="space-y-3">
          {ratings.map((item) => (
            <label
              key={item.label}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input type="checkbox" className="w-4 h-4 border-gray-400" />
              <span className="text-gray-700 text-sm w-20">{item.label}</span>
              <div className="flex gap-1 text-yellow-400">
                {[...Array(item.stars)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-4">Amenities</h4>
        <div className="space-y-3">
          {amenities.map((item) => {
            const checked = selectedAmenities.includes(item.label);
            return (
              <label
                key={item.label}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={checked}
                  onChange={() => onToggleAmenity?.(item.label)}
                />
                <span className="text-gray-500 text-lg">{item.icon}</span>
                <span className="text-gray-700 text-sm">{item.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-4">Guest Rating</h4>
        <div className="space-y-3">
          {guestRatings.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-gray-700 text-sm">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-xl font-semibold text-sm">
        Apply Filters
      </button>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// HotelList
// ---------------------------------------------------------------------------
function HotelList({ hotels, loading, error, guests, usingDateSearch }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-3 text-sm">
          {usingDateSearch
            ? "Checking availability for your dates..."
            : "Loading hotels..."}
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
        {error}
      </div>
    );
  }
  if (!hotels || hotels.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-gray-500">
        <p className="text-lg font-medium mb-1">No hotels found</p>
        <p className="text-sm">
          {usingDateSearch
            ? "No rooms available for the selected dates and filters. Try different dates."
            : "Try adjusting your filters or check back later."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <p className="text-gray-600">
          Showing {hotels.length} hotel{hotels.length !== 1 ? "s" : ""}
          {usingDateSearch ? " with available rooms" : ""}
        </p>
      </div>

      <div className="flex flex-col gap-6 max-h-[1200px] overflow-y-auto pr-2">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel._id}
            hotel={hotel}
            guests={guests}
            cheapestRoom={hotel.cheapestRoom}
            availableRoomCount={hotel.availableRoomCount}
            availableRoomIds={hotel.availableRoomIds}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function FindHotelPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingDateSearch, setUsingDateSearch] = useState(false);
  const [cheapestPrices, setCheapestPrices] = useState({});

  const adults = readInt(searchParams.get("adults"));
  const children = readInt(searchParams.get("children"));
  const checkIn = searchParams.get("checkin") || "";
  const checkOut = searchParams.get("checkout") || "";
  const location = searchParams.get("location") || "";
  const locationType = searchParams.get("locationType") || null;
  const selectedAmenities = searchParams.getAll("amenity");
  const selectedAmenitiesKey = selectedAmenities.join("|");
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : null;

  const guests = { adults, children };

  const updateSearch = useCallback(
    (patch) => {
      const params = new URLSearchParams(searchParams);

      const setOrDelete = (key, value, isEmpty) => {
        if (isEmpty) params.delete(key);
        else params.set(key, String(value));
      };

      if ("adults" in patch) setOrDelete("adults", patch.adults, !patch.adults);
      if ("children" in patch)
        setOrDelete("children", patch.children, !patch.children);
      if ("checkIn" in patch)
        setOrDelete("checkin", patch.checkIn, !patch.checkIn);
      if ("checkOut" in patch)
        setOrDelete("checkout", patch.checkOut, !patch.checkOut);
      if ("location" in patch)
        setOrDelete("location", patch.location, !patch.location);
      if ("locationType" in patch)
        setOrDelete("locationType", patch.locationType, !patch.locationType);
      if ("minPrice" in patch)
        setOrDelete("minPrice", patch.minPrice, patch.minPrice == null);
      if ("maxPrice" in patch)
        setOrDelete("maxPrice", patch.maxPrice, patch.maxPrice == null);

      if ("guests" in patch) {
        setOrDelete("adults", patch.guests.adults, !patch.guests.adults);
        setOrDelete("children", patch.guests.children, !patch.guests.children);
      }

      setSearchParams(params, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  const toggleAmenity = useCallback(
    (label) => {
      const params = new URLSearchParams(searchParams);
      const current = params.getAll("amenity");
      params.delete("amenity");
      const next = current.includes(label)
        ? current.filter((a) => a !== label)
        : [...current, label];
      next.forEach((a) => params.append("amenity", a));
      setSearchParams(params, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  const applyPrice = useCallback(
    ({ minPrice, maxPrice }) => {
      updateSearch({ minPrice, maxPrice });
    },
    [updateSearch]
  );

  const clearPrice = useCallback(() => {
    updateSearch({ minPrice: null, maxPrice: null });
  }, [updateSearch]);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError("");

    const hasDates = !!checkIn && !!checkOut;
    const amenitiesArr = selectedAmenitiesKey
      ? selectedAmenitiesKey.split("|")
      : [];

    try {
      if (hasDates) {
        const params = new URLSearchParams();
        params.append("checkin", checkIn);
        params.append("checkout", checkOut);

        if (adults > 0) params.append("adults", String(adults));
        if (children > 0) params.append("children", String(children));

        if (locationType === "city" && location)
          params.append("city", location);
        else if (locationType === "district" && location)
          params.append("district", location);
        else if (location) params.append("search", location);

        amenitiesArr.forEach((a) => params.append("amenity", a));

        const qs = params.toString() ? `?${params.toString()}` : "";
        const data = await apiClient.get(`/tourist/hotels/search-by-date${qs}`);
        setHotels(Array.isArray(data.hotels) ? data.hotels : []);
        setUsingDateSearch(true);
        setCheapestPrices({});
      } else {
        const params = new URLSearchParams();
        if (locationType === "city" && location)
          params.append("city", location);
        else if (locationType === "district" && location)
          params.append("district", location);
        else if (location) params.append("search", location);

        if (adults > 0) params.append("adults", String(adults));
        if (children > 0) params.append("children", String(children));

        amenitiesArr.forEach((a) => params.append("amenity", a));

        const hasActiveFilters =
          !!location || adults > 0 || children > 0 || amenitiesArr.length > 0;
        if (!hasActiveFilters) {
          params.append("sort", "price_asc");
        } else {
          params.append("restrictedOnly", "false");
        }

        const qs = params.toString() ? `?${params.toString()}` : "";
        const data = await apiClient.get(`/tourist/hotels${qs}`);
        setHotels(Array.isArray(data.hotels) ? data.hotels : []);
        setUsingDateSearch(false);
        setCheapestPrices({});
      }
    } catch (err) {
      setError(err.message || "Failed to load hotels.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [
    adults,
    children,
    checkIn,
    checkOut,
    location,
    locationType,
    selectedAmenitiesKey,
  ]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleSearch = useCallback(() => {
    fetchHotels();
  }, [fetchHotels]);

  // For non-date searches, fetch cheapest room price per hotel for filtering
  useEffect(() => {
    if (usingDateSearch || hotels.length === 0) return;
    let isMounted = true;
    const hotelsWithoutPrice = hotels.filter(
      (h) => h.cheapestRoom?.locationAndPricing?.[0]?.basePrice == null
    );
    if (hotelsWithoutPrice.length === 0) return;
    Promise.all(
      hotelsWithoutPrice.map((h) =>
        apiClient
          .get(`/tourist/hotels/${h._id}/rooms/cheapest`)
          .then((data) => ({
            id: h._id,
            price: data?.locationAndPricing?.[0]?.basePrice ?? null,
          }))
          .catch(() => ({ id: h._id, price: null }))
      )
    ).then((results) => {
      if (!isMounted) return;
      const map = {};
      results.forEach(({ id, price }) => {
        map[id] = price;
      });
      setCheapestPrices(map);
    });
    return () => {
      isMounted = false;
    };
  }, [hotels, usingDateSearch]);

  const filteredHotels = hotels.filter((hotel) => {
    const price =
      hotel.cheapestRoom?.locationAndPricing?.[0]?.basePrice ??
      cheapestPrices[hotel._id] ??
      null;
    if (price == null) return true;
    if (minPrice != null && price < minPrice) return false;
    if (maxPrice != null && price > maxPrice) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#eef7fd]">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link
            to="/dashboard"
            className="hover:text-gray-900 transition-colors duration-150"
          >
            Dashboard
          </Link>
          <span>{">"}</span>
          <span>Find Hotel</span>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-bold">Find Hotels</h2>
            <p className="text-gray-600 mt-2">
              Discover and book the perfect accommodation for your stay
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white px-4 py-2 rounded-lg shadow-sm text-blue-600 font-medium">
              Saved (3)
            </button>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
              My Bookings
            </button>
          </div>
        </div>

        {/* Top search / filter bar */}
        <SearchFilterBar
          location={location}
          locationType={locationType}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          onUpdate={updateSearch}
          onSearch={handleSearch}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          <FilterSidebar
            selectedAmenities={selectedAmenities}
            onToggleAmenity={toggleAmenity}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onApplyPrice={applyPrice}
            onClearPrice={clearPrice}
          />
          <div className="lg:col-span-3">
            <HotelList
              hotels={filteredHotels}
              loading={loading}
              error={error}
              guests={guests}
              usingDateSearch={usingDateSearch}
            />
          </div>
        </div>
      </main>
    </div>
  );
}