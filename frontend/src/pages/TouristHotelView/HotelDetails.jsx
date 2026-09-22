import { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  MapPin,
  Wifi,
  Waves,
  Dumbbell,
  Utensils,
  Car,
  ShieldCheck,
  Check,
  Loader2,
  ImageOff,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  User,
} from "lucide-react";
import apiClient from "../../services/api.js";
import PriceBox from "../../components/TouristHotelView/PriceBox.jsx";
import ReviewSection from "../reviews/ReviewSection.jsx";
import { getBatchProviderRatings } from "../../services/reviews/review.service.js";

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};

const AMENITY_ICONS = {
  "Free WiFi": <Wifi size={18} />,
  "Free Parking": <Car size={18} />,
  "Swimming Pool": <Waves size={18} />,
  "Gym": <Dumbbell size={18} />,
  "Restaurant": <Utensils size={18} />,
  "Spa": <ShieldCheck size={18} />,
};

const ROOM_AMENITY_ICONS = {
  "Free WiFi": <Wifi size={14} />,
  "Free Parking": <Car size={14} />,
  "Swimming Pool": <Waves size={14} />,
  "Gym": <Dumbbell size={14} />,
  "Restaurant": <Utensils size={14} />,
  "Spa": <ShieldCheck size={14} />,
};

// ---------------------------------------------------------------------------
// HotelGallery
// ---------------------------------------------------------------------------
function HotelGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div>
        <div className="w-full h-[420px] rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400">
          <ImageOff size={48} />
          <p className="text-sm mt-3">No images uploaded for this hotel</p>
        </div>
      </div>
    );
  }

  const activeImage = resolveImageUrl(images[activeIndex]);

  return (
    <div>
      <div className="relative">
        <img
          src={activeImage}
          alt=""
          onClick={() => setLightboxOpen(true)}
          className="w-full h-[420px] object-cover rounded-2xl cursor-zoom-in"
        />
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`shrink-0 w-[120px] h-[80px] rounded-lg overflow-hidden border-2 transition ${
                idx === activeIndex
                  ? "border-blue-600"
                  : "border-transparent hover:border-blue-300"
              }`}
            >
              <img
                src={resolveImageUrl(img)}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <button
          onClick={() => {
            setActiveIndex(0);
            setLightboxOpen(true);
          }}
          className="text-blue-600 text-sm mt-3 font-medium hover:underline"
        >
          View all {images.length} photos
        </button>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white text-3xl leading-none hover:text-gray-300"
            aria-label="Close"
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i - 1 + images.length) % images.length);
              }}
              className="absolute left-4 md:left-10 text-white text-4xl leading-none px-3 py-1 rounded-full hover:bg-white/10"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          <img
            src={resolveImageUrl(images[activeIndex])}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i + 1) % images.length);
              }}
              className="absolute right-4 md:right-10 text-white text-4xl leading-none px-3 py-1 rounded-full hover:bg-white/10"
              aria-label="Next"
            >
              ›
            </button>
          )}

          <div
            className="absolute bottom-5 left-0 right-0 flex gap-2 justify-center overflow-x-auto px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`shrink-0 w-[70px] h-[50px] rounded-md overflow-hidden border-2 transition ${
                  idx === activeIndex
                    ? "border-white"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={resolveImageUrl(img)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HotelInfo
// ---------------------------------------------------------------------------
function HotelInfo({ hotel, amenities, policies, ratingStats = { averageRating: 0, totalReviews: 0 } }) {
  const [expanded, setExpanded] = useState(false);

  const policyLines = policies
    ? policies
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  const desc = hotel.description || "";
  const descPreview = desc.slice(0, 220).trimEnd();
  const needsTruncation = desc.length > 220;

  const hasMoreContent =
    needsTruncation || amenities.length > 0 || policyLines.length > 0;

  const avgRating = ratingStats.averageRating || 0;
  const reviewCount = ratingStats.totalReviews || 0;

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold">{hotel.name}</h1>

        <div className="flex items-center gap-2 mt-2 text-gray-600">
          <MapPin size={16} />
          <span>{hotel.location}</span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex text-amber-400 text-base">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={star <= Math.round(avgRating) ? "text-amber-400" : "text-slate-200"}>★</span>
            ))}
          </div>
          <span className="font-bold text-slate-800">
            {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
          </span>
          <span className="text-gray-500 text-sm">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
        </div>

        {desc && (
          <div className="mt-5">
            <p className="text-gray-600 leading-7 whitespace-pre-line">
              {expanded || !needsTruncation ? desc : `${descPreview}…`}
            </p>

            {hasMoreContent && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
              >
                {expanded ? (
                  <>
                    See Less <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    See More <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {!desc && hasMoreContent && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
          >
            {expanded ? (
              <>
                See Less <ChevronUp size={14} />
              </>
            ) : (
              <>
                See More <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>

      {expanded && (
        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <div>
            <h2 className="text-lg font-bold mb-3">Amenities</h2>

            {amenities.length === 0 ? (
              <p className="text-gray-400 text-sm italic">
                No amenities listed yet.
              </p>
            ) : (
              <div className="space-y-2">
                {amenities.map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="shrink-0">
                      {AMENITY_ICONS[name] || <ShieldCheck size={14} />}
                    </span>
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold mb-3">Policies</h2>

            {policyLines.length === 0 ? (
              <p className="text-gray-400 text-sm italic">
                No policies listed yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {policyLines.map((line, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-gray-700 list-none"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" />
                    <span className="leading-5">{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContactInfo
// ---------------------------------------------------------------------------
function ContactInfo({ contactInfo }) {
  if (!contactInfo) return null;

  const hasContact =
    contactInfo.contactName ||
    contactInfo.contactNumber ||
    contactInfo.email;

  if (!hasContact) return null;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md">
      <h3 className="text-base font-bold mb-3 text-slate-800">
        Contact Information
      </h3>

      <div className="space-y-3 text-sm text-gray-700">
        {contactInfo.contactName && (
          <div className="flex items-center gap-3">
            <User size={16} className="text-blue-600 shrink-0" />
            <span>{contactInfo.contactName}</span>
          </div>
        )}

        {contactInfo.contactNumber && (
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-blue-600 shrink-0" />
            <a
              href={`tel:${contactInfo.contactNumber}`}
              className="hover:underline"
            >
              {contactInfo.contactNumber}
            </a>
          </div>
        )}

        {contactInfo.email && (
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-blue-600 shrink-0" />
            <a
              href={`mailto:${contactInfo.email}`}
              className="hover:text-blue-700 hover:underline break-all"
            >
              {contactInfo.email}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RoomImageGallery
// ---------------------------------------------------------------------------
function RoomImageGallery({ images, roomName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-[180px] h-[140px] rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 shrink-0">
        <ImageOff size={24} />
        <p className="text-xs mt-1">No image</p>
      </div>
    );
  }

  const activeImage = resolveImageUrl(images[activeIndex]);

  return (
    <div className="w-[180px] shrink-0">
      <img
        src={activeImage}
        alt={roomName}
        onClick={() => setLightboxOpen(true)}
        className="w-[180px] h-[140px] rounded-xl object-cover cursor-zoom-in"
      />

      {images.length > 1 && (
        <p className="text-[11px] text-gray-500 text-center mt-1">
          {activeIndex + 1} / {images.length} images
        </p>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 text-white text-3xl leading-none hover:text-gray-300"
            aria-label="Close"
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i - 1 + images.length) % images.length);
              }}
              className="absolute left-4 md:left-10 text-white text-4xl leading-none px-3 py-1 rounded-full hover:bg-white/10"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          <img
            src={resolveImageUrl(images[activeIndex])}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i + 1) % images.length);
              }}
              className="absolute right-4 md:right-10 text-white text-4xl leading-none px-3 py-1 rounded-full hover:bg-white/10"
              aria-label="Next"
            >
              ›
            </button>
          )}

          <div
            className="absolute bottom-5 left-0 right-0 flex gap-2 justify-center overflow-x-auto px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`shrink-0 w-[70px] h-[50px] rounded-md overflow-hidden border-2 transition ${
                  idx === activeIndex
                    ? "border-white"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={resolveImageUrl(img)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AvailableRooms
// ---------------------------------------------------------------------------
function AvailableRooms({ hotelId, onSelectRoom, highlightRoomId, availableRoomIds = [] }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [litRoomId, setLitRoomId] = useState(null);
  const roomRefs = useRef({});
  const availableRoomIdSet = new Set(
    Array.isArray(availableRoomIds) ? availableRoomIds.map(String) : []
  );

  useEffect(() => {
    let isMounted = true;

    const fetchRooms = async () => {
      if (!hotelId) return;
      setLoading(true);
      setError("");
      try {
        const data = await apiClient.get(
          `/tourist/hotels/${hotelId}/rooms`
        );
        if (!isMounted) return;

        const fetched = Array.isArray(data.rooms) ? data.rooms : [];

        const getPrice = (r) => {
          const p = r?.locationAndPricing?.[0]?.basePrice;
          return typeof p === "number" ? p : Number.MAX_SAFE_INTEGER;
        };

        const sorted = [...fetched].sort(
          (a, b) => getPrice(a) - getPrice(b)
        );

        setRooms(sorted);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load rooms.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRooms();

    return () => {
      isMounted = false;
    };
  }, [hotelId]);

  useEffect(() => {
    if (!highlightRoomId || loading || rooms.length === 0) return;
    const el = roomRefs.current[highlightRoomId];
    if (!el) return;

    const wait = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setLitRoomId(highlightRoomId);
    }, 300);

    return () => clearTimeout(wait);
  }, [highlightRoomId, loading, rooms]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <p className="ml-3 text-sm">Loading rooms...</p>
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

  if (!rooms || rooms.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-gray-500">
        <p className="text-lg font-medium mb-1">No rooms available yet</p>
        <p className="text-sm">
          This hotel hasn't added any rooms to its listing.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes roomBorderPulse {
          0%, 100% {
            border-left-color: #facc15;
          }
          50% {
            border-left-color: #fde68a;
          }
        }

        .room-date-highlight {
          border-left: 4px solid #facc15;
          animation: roomBorderPulse 1.8s ease-in-out infinite;
        }
      `}</style>

      <div className="space-y-5">
        {rooms.map((room, index) => {
          const roomImages = Array.isArray(room.images) ? room.images : [];
          const roomAmenities = Array.isArray(room.amenities)
            ? room.amenities
            : [];
          const price = room?.locationAndPricing?.[0]?.basePrice ?? 0;
          const roomId = String(room._id || index);
          const isDateSearchAvailableRoom = availableRoomIdSet.has(roomId);

          const sizeText = room.roomSize
            ? `${room.roomSize} ${room.measureType || ""}`.trim()
            : "";

          const capacityText = room.capacity
            ? [
                room.capacity.adults &&
                  `${room.capacity.adults} Adult${
                    room.capacity.adults !== 1 ? "s" : ""
                  }`,
                room.capacity.children &&
                  `${room.capacity.children} Child${
                    room.capacity.children !== 1 ? "ren" : ""
                  }`,
              ]
                .filter(Boolean)
                .join(", ")
            : "";

          return (
            <div
              key={room._id || index}
              ref={(el) => { if (room._id) roomRefs.current[room._id] = el; }}
              className={`bg-white rounded-2xl p-4 shadow-md flex gap-5 transition-all duration-700 ${
                litRoomId === room._id
                  ? "ring-4 ring-yellow-400 ring-offset-2 ring-offset-[#eef7fd]"
                  : ""
              } ${
                isDateSearchAvailableRoom
                  ? "room-date-highlight"
                  : ""
              }`}
            >
              <RoomImageGallery images={roomImages} roomName={room.roomName} />

              <div className="flex-1 flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold truncate">
                    {room.roomName || "Unnamed Room"}
                  </h3>

                  {room.roomType && (
                    <p className="text-gray-500 text-sm mt-0.5">
                      {room.roomType}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizeText && (
                      <span className="bg-slate-100 text-xs text-gray-600 px-2 py-0.5 rounded-md">
                        {sizeText}
                      </span>
                    )}
                    {capacityText && (
                      <span className="bg-slate-100 text-xs text-gray-600 px-2 py-0.5 rounded-md">
                        {capacityText}
                      </span>
                    )}
                  </div>

                  {roomAmenities.length > 0 && (
                    <div className="flex flex-wrap gap-3 text-xs text-blue-600 mt-3">
                      {roomAmenities.map((name) => (
                        <span key={name} className="flex items-center gap-1.5">
                          <span className="text-blue-500">
                            {ROOM_AMENITY_ICONS[name] || <Check size={14} />}
                          </span>
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <h3 className="text-3xl font-bold text-blue-700">
                    ${price}
                  </h3>
                  <p className="text-gray-500 text-sm">per night</p>
                  <button
                    onClick={() =>
                      onSelectRoom?.({
                        price,
                        label: room.roomName,
                        contactInfo: room.contactInfo || null,
                        roomId: room._id,
                        roomNumber: room.roomNumber,
                        roomName: room.roomName,
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg mt-5"
                  >
                    Select Room
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// SpecialPackages
// ---------------------------------------------------------------------------
function SpecialPackages({ hotelId, onSelectPackage }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedIds, setExpandedIds] = useState({});

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchPackages = async () => {
      if (!hotelId) return;
      setLoading(true);
      setError("");
      try {
        const data = await apiClient.get(
          `/tourist/hotels/${hotelId}/packages`
        );
        if (!isMounted) return;

        const fetched = Array.isArray(data.packages) ? data.packages : [];

        const getPrice = (p) => {
          const val = p?.locationAndPricing?.[0]?.basePrice;
          return typeof val === "number" ? val : Number.MAX_SAFE_INTEGER;
        };

        const sorted = [...fetched].sort(
          (a, b) => getPrice(a) - getPrice(b)
        );

        setPackages(sorted);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load packages.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPackages();

    return () => {
      isMounted = false;
    };
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <p className="ml-3 text-sm">Loading packages...</p>
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

  if (!packages || packages.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-gray-500">
        <p className="text-lg font-medium mb-1">No special packages yet</p>
        <p className="text-sm">
          This hotel hasn't published any special packages.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {packages.map((pkg, index) => {
        const key = pkg._id || index;
        const pkgImages = Array.isArray(pkg.images) ? pkg.images : [];
        const pkgAmenities = Array.isArray(pkg.amenities) ? pkg.amenities : [];
        const basePrice = pkg?.locationAndPricing?.[0]?.basePrice ?? 0;

        const discount = pkg?.discount;
        const discountExpired = discount?.validTo
          ? new Date().setHours(0,0,0,0) > new Date(discount.validTo).setHours(0,0,0,0)
          : false;
        const discountPercent = (!discountExpired && discount?.discountPercent) ? discount.discountPercent : 0;
        const hasDiscount = discountPercent > 0;

        const discountedPrice = hasDiscount
          ? Math.round(basePrice - (basePrice * discountPercent) / 100)
          : basePrice;

        const sizeText = pkg.roomSize
          ? `${pkg.roomSize} ${pkg.measureType || ""}`.trim()
          : "";

        const capacityText = pkg.capacity
          ? [
              pkg.capacity.adults &&
                `${pkg.capacity.adults} Adult${
                  pkg.capacity.adults !== 1 ? "s" : ""
                }`,
              pkg.capacity.children &&
                `${pkg.capacity.children} Child${
                  pkg.capacity.children !== 1 ? "ren" : ""
                }`,
            ]
              .filter(Boolean)
              .join(", ")
          : "";

        const isExpanded = !!expandedIds[key];
        const desc = pkg.description || "";
        const isLong = desc.length > 120;

        return (
          <div
            key={key}
            className="bg-white rounded-2xl p-4 shadow-md flex gap-5"
          >
            <RoomImageGallery images={pkgImages} roomName={pkg.packageName} />

            <div className="flex-1 flex justify-between items-center gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold truncate">
                    {pkg.packageName || "Untitled Package"}
                  </h3>

                  {hasDiscount && (
                    <span className="bg-red-100 text-red-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {pkg.roomType && (
                  <p className="text-gray-500 text-sm mt-0.5">
                    {pkg.roomType}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  {sizeText && (
                    <span className="bg-slate-100 text-xs text-gray-600 px-2 py-0.5 rounded-md">
                      {sizeText}
                    </span>
                  )}
                  {capacityText && (
                    <span className="bg-slate-100 text-xs text-gray-600 px-2 py-0.5 rounded-md">
                      {capacityText}
                    </span>
                  )}
                  {pkg?.discount?.promoCode && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-md font-medium">
                      Code: {pkg.discount.promoCode}
                    </span>
                  )}
                </div>

                {desc && (
                  <div className="mt-2 max-w-[460px]">
                    <p
                      className={`text-gray-500 text-xs leading-5 ${
                        isExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {desc}
                    </p>

                    {(isLong || pkgAmenities.length > 0) && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(key)}
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline"
                      >
                        {isExpanded ? (
                          <>
                            Show less <ChevronUp size={12} />
                          </>
                        ) : (
                          <>
                            Show more <ChevronDown size={12} />
                          </>
                        )}
                      </button>
                    )}

                    {isExpanded && pkgAmenities.length > 0 && (
                      <div className="flex flex-wrap gap-3 text-xs text-blue-600 mt-3">
                        {pkgAmenities.map((name) => (
                          <span
                            key={name}
                            className="flex items-center gap-1.5"
                          >
                            <span className="text-blue-500">
                              {ROOM_AMENITY_ICONS[name] || (
                                <Check size={14} />
                              )}
                            </span>
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-right shrink-0">
                {hasDiscount ? (
                  <>
                    <p className="text-xs text-gray-400 line-through">
                      ${basePrice}
                    </p>
                    <h3 className="text-3xl font-bold text-blue-700">
                      ${discountedPrice}
                    </h3>
                  </>
                ) : (
                  <h3 className="text-3xl font-bold text-blue-700">
                    ${basePrice}
                  </h3>
                )}
                <p className="text-gray-500 text-sm">per night</p>
                <button
                  onClick={() =>
                    onSelectPackage?.({
                      price: discountedPrice,
                      label: pkg.packageName,
                      contactInfo: pkg.contactInfo || null,
                      roomType: pkg.roomType || "",
                    })
                  }
                  className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg mt-5"
                >
                  Select Package
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GuestReviews
// ---------------------------------------------------------------------------
const reviews = [
  {
    id: 1,
    name: "Harindu Lakshan",
    time: "2 days ago",
    review:
      "Amazing resort with exceptional service. The ocean view from our suite was breathtaking, and the staff went above and beyond to make our stay memorable.",
  },
  {
    id: 2,
    name: "Ravindu Prabha",
    time: "1 week ago",
    review:
      "Beautiful location and great amenities. The pool area is stunning and the food at the restaurant was delicious.",
  },
];

function GuestReviews() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Guest Reviews</h2>
        <button className="text-blue-600 font-medium">View all reviews</button>
      </div>

      <div className="space-y-6">
        {reviews.map((item) => (
          <div key={item.id} className="border-b pb-6">
            <h3 className="font-bold">{item.name}</h3>

            <div className="flex items-center gap-3 mt-1">
              <div className="text-yellow-400">★★★★★</div>
              <span className="text-sm text-gray-500">{item.time}</span>
            </div>

            <p className="text-gray-600 leading-7 mt-4">{item.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RoomsPackagesSwitcher
// ---------------------------------------------------------------------------
function RoomsPackagesSwitcher({ hotelId, onSelectRoom, onSelectPackage, highlightRoomId, availableRoomIds = [] }) {
  const [tab, setTab] = useState("rooms");

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="inline-flex rounded-xl bg-slate-100 p-1.5">
          <button
            type="button"
            onClick={() => setTab("rooms")}
            className={`px-5 py-2.5 rounded-lg text-base font-semibold transition ${
              tab === "rooms"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Available Rooms
          </button>
          <button
            type="button"
            onClick={() => setTab("packages")}
            className={`px-5 py-2.5 rounded-lg text-base font-semibold transition ${
              tab === "packages"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Special Packages
          </button>
        </div>

        <p className="text-sm text-gray-500">
          {tab === "rooms"
            ? "Browse all rooms available at this hotel"
            : "Exclusive deals and packages offered by the hotel"}
        </p>
      </div>

      {tab === "rooms" ? (
        <AvailableRooms
          hotelId={hotelId}
          onSelectRoom={onSelectRoom}
          highlightRoomId={highlightRoomId}
          availableRoomIds={availableRoomIds}
        />
      ) : (
        <SpecialPackages
          hotelId={hotelId}
          onSelectPackage={onSelectPackage}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function HotelDetails() {
  const { id } = useParams();
  const { hash, state } = useLocation();
  const detailCardRef = useRef(null);
  const availableRoomIds = Array.isArray(state?.availableRoomIds)
    ? state.availableRoomIds
    : [];

  const highlightRoomId = hash.startsWith("#detail-room-") ? hash.slice(13) : null;

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalReviews: 0 });

  const [bookings, setBookings] = useState([]);

  const [selected, setSelected] = useState({
    price: 0,
    label: "",
    contactInfo: null,
    roomId: null,
    roomNumber: "",
    roomName: "",
    roomType: "",
  });
  const [highlight, setHighlight] = useState(false);

  const priceRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchHotel = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiClient.get(`/tourist/hotels/${id}`);
        if (!isMounted) return;
        setHotel(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load hotel.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchRatingStats = async () => {
      if (!id) return;
      try {
        const res = await getBatchProviderRatings("Hotel", [id]);
        if (isMounted && res && res.success && res.data && res.data[id]) {
          setRatingStats(res.data[id]);
        }
      } catch {
        // Fallback to default state
      }
    };

    if (id) {
      fetchHotel();
      fetchRatingStats();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      if (!id) return;
      try {
        const data = await apiClient.get(
          `/tourist/hotels/${id}/bookings`
        );
        if (!isMounted) return;
        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      } catch {
        if (isMounted) setBookings([]);
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!loading && !error && hotel && hash.startsWith("#detail") && detailCardRef.current) {
      detailCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading, error, hotel, hash]);

  const scrollToPrice = () => {
    if (!priceRef.current) return;

    const yOffset = -20;

    const y =
      priceRef.current.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    setHighlight(true);
    setTimeout(() => setHighlight(false), 1500);
  };

  const handleSelectRoom = ({
    price,
    label,
    contactInfo,
    roomId,
    roomNumber,
    roomName,
  }) => {
    setSelected({
      price: Number(price) || 0,
      label: label || "",
      contactInfo: contactInfo || null,
      roomId: roomId || null,
      roomNumber: roomNumber || "",
      roomName: roomName || "",
      roomType: "",
    });
    setTimeout(scrollToPrice, 50);
  };

  const handleSelectPackage = ({ price, label, contactInfo, roomType }) => {
    setSelected({
      price: Number(price) || 0,
      label: label || "",
      contactInfo: contactInfo || null,
      roomId: null,
      roomNumber: "",
      roomName: "",
      roomType: roomType || "",
    });
    setTimeout(scrollToPrice, 50);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef7fd] flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-3 text-sm">Loading hotel...</p>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-[#eef7fd] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error || "Hotel not found."}
          </div>
        </div>
      </div>
    );
  }

  const location =
    [hotel.hotelLocation?.city, hotel.hotelLocation?.district]
      .filter(Boolean)
      .join(", ") ||
    hotel.hotelAddress ||
    "";

  const mappedHotel = {
    name: hotel.hotelName || "Unnamed Hotel",
    location,
    rating: "Exceptional",
    reviews: 0,
    description: hotel.hotelDescription || "",
  };

  const hotelImages = Array.isArray(hotel.hotelImages) ? hotel.hotelImages : [];
  const hotelAmenities = Array.isArray(hotel.hotelAmenities)
    ? hotel.hotelAmenities
    : [];
  const hotelPolicies = hotel.hotelPolicies || "";

  return (
    <div className="min-h-screen bg-[#eef7fd] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link
            to="/dashboard"
            className="hover:text-gray-900 transition-colors duration-150"
          >
            Dashboard
          </Link>
          <span>{">"}</span>
          <Link
            to="/find-hotel"
            className="hover:text-gray-900 transition-colors duration-150"
          >
            Find Hotel
          </Link>
          <span>{">"}</span>
          <span>Hotel Details</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HotelGallery images={hotelImages} />

            <HotelInfo
              hotel={mappedHotel}
              amenities={hotelAmenities}
              policies={hotelPolicies}
              ratingStats={ratingStats}
            />

            <div ref={detailCardRef}>
              <RoomsPackagesSwitcher
                hotelId={hotel._id}
                onSelectRoom={handleSelectRoom}
                onSelectPackage={handleSelectPackage}
                highlightRoomId={highlightRoomId}
                availableRoomIds={availableRoomIds}
              />
            </div>

            {/* Dynamic Review & Rating System Component */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
              <ReviewSection 
                targetType="Hotel" 
                targetProviderId={id} 
                targetName={mappedHotel.name} 
              />
            </div>
          </div>

          <div className="space-y-5">
            <PriceBox
              innerRef={priceRef}
              price={selected.price}
              label={selected.label}
              bookings={bookings}
              hotelId={hotel._id}
              roomType={selected.roomType}
              room={
                selected.roomId
                  ? {
                      roomId: selected.roomId,
                      roomNumber: selected.roomNumber,
                      roomName: selected.roomName,
                    }
                  : null
              }
              highlight={highlight}
            />

            {selected.contactInfo && (
              <ContactInfo contactInfo={selected.contactInfo} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}