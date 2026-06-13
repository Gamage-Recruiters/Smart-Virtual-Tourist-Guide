import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import Header from "../Header";
import Footer from "../Footer";
import bImage from "../../assets/B.png";
import { IoLocation } from "react-icons/io5";
import { FaMoneyBills } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { MdOutlineEditNote } from "react-icons/md";

// Leaflet default icon broken image fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom blue marker (pickup)
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom red marker (drop)
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Free geocoding using OpenStreetMap Nominatim (no API key needed)
async function geocode(placeName) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        placeName
      )}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  } catch (e) {
    console.error("Geocode error:", e);
    return null;
  }
}

export default function Ride_Details() {
  const navigate = useNavigate();

  // Form states
  const [pickup, setPickup] = useState("Sector 22, Chandigarh");
  const [drop, setDrop] = useState("Honidpur, Himachal Pradesh");
  
  // Input states for debouncing
  const [pickupInput, setPickupInput] = useState("Sector 22, Chandigarh");
  const [dropInput, setDropInput] = useState("Honidpur, Himachal Pradesh");

  const [distance, setDistance] = useState("12.5");
  const [price, setPrice] = useState("1500.00");
  const [customerName, setCustomerName] = useState("John Doe");
  const [contactNumber, setContactNumber] = useState("+94 77 123 4567");

  // Map states
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Sri Lanka default
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Status message states
  const [isMarkedPickup, setIsMarkedPickup] = useState(false);
  const [isTripCompleted, setIsTripCompleted] = useState(false);

  // Debounce typing to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pickupInput.trim() !== "") setPickup(pickupInput);
      if (dropInput.trim() !== "") setDrop(dropInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [pickupInput, dropInput]);

  // Geocode pickup & drop when component mounts or updates
  useEffect(() => {
    setMapLoading(true);
    setMapError(false);

    Promise.all([geocode(pickup), geocode(drop)]).then(async ([pCoords, dCoords]) => {
      if (pCoords && dCoords) {
        setPickupCoords(pCoords);
        setDropCoords(dCoords);
        setMapCenter([
          (pCoords[0] + dCoords[0]) / 2,
          (pCoords[1] + dCoords[1]) / 2,
        ]);
        setMapError(false);

        // Calculate Distance
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${pCoords[1]},${pCoords[0]};${dCoords[1]},${dCoords[0]}?overview=false`);
          const data = await res.json();
          let distKm = 0;
          
          if (data.routes && data.routes.length > 0) {
            distKm = (data.routes[0].distance / 1000).toFixed(1);
          } else {
            // Fallback Haversine
            const R = 6371;
            const dLat = (dCoords[0] - pCoords[0]) * (Math.PI/180);
            const dLon = (dCoords[1] - pCoords[1]) * (Math.PI/180); 
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(pCoords[0] * (Math.PI/180)) * Math.cos(dCoords[0] * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            distKm = (R * c).toFixed(1);
          }
          
          setDistance(distKm);
          setPrice((distKm * 120).toFixed(2)); // 120 LKR per km
        } catch(e) {
          console.error("OSRM error:", e);
        }

      } else {
        setMapError(true);
      }
      setMapLoading(false);
    });
  }, [pickup, drop]);

  // Navigate buttons open Google Maps with real directions
  const handleNavigatePickup = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pickup)}`,
      "_blank"
    );
  };

  const handleNavigateDropOff = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(drop)}`,
      "_blank"
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-[#E5F3FD]">
      {/* Background Section */}
      <div className="absolute inset-0 z-0">
        <img
          src={bImage}
          alt="Sri Lanka View"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#E5F3FD]/70 to-[#E5F3FD] backdrop-blur-[3px]"></div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 pt-32 pb-16 gap-6">

        {/* Leaflet Map Card */}
        <div className="w-full max-w-xl bg-white rounded-[24px] p-2 shadow-2xl border border-white overflow-hidden">
          <div className="w-full h-[180px] rounded-[18px] overflow-hidden relative">

            {/* Loading State */}
            {mapLoading && (
              <div className="absolute inset-0 bg-slate-100 rounded-[18px] flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-slate-400 text-xs font-medium">Loading map...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {mapError && !mapLoading && (
              <div className="absolute inset-0 bg-slate-100 rounded-[18px] flex items-center justify-center z-10">
                <span className="text-slate-400 text-xs font-medium text-center px-4">
                  Map unavailable. Check location names.
                </span>
              </div>
            )}

            {/* Real Leaflet Map */}
            {!mapLoading && !mapError && pickupCoords && dropCoords && (
              <MapContainer
                center={mapCenter}
                zoom={11}
                style={{ width: "100%", height: "100%" }}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* Pickup Marker (Blue) */}
                <Marker position={pickupCoords} icon={blueIcon}>
                  <Popup>
                    <span className="font-semibold text-blue-600">Pickup:</span> {pickup}
                  </Popup>
                </Marker>

                {/* Drop Marker (Red) */}
                <Marker position={dropCoords} icon={redIcon}>
                  <Popup>
                    <span className="font-semibold text-red-500">Drop:</span> {drop}
                  </Popup>
                </Marker>

                {/* Route Line */}
                <Polyline
                  positions={[pickupCoords, dropCoords]}
                  color="#007AFF"
                  weight={3}
                  dashArray="8, 6"
                />
              </MapContainer>
            )}
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-xl bg-white rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] p-6 md:p-8 border border-blue-100/50 flex flex-col gap-6">

          {/* Row 1: Pickup & Drop */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1.5 pl-1">
                <IoLocation size={17} className="text-blue-600" />
                <span>Pickup</span>
              </label>
              <input
                type="text"
                value={pickupInput}
                onChange={(e) => setPickupInput(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 py-3 text-sm text-center font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                placeholder="Enter pickup location"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1.5 pl-1">
                <IoLocation size={17} className="text-blue-600" />
                <span>Drop</span>
              </label>
              <input
                type="text"
                value={dropInput}
                onChange={(e) => setDropInput(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 py-3 text-sm text-center font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-colors"
                placeholder="Enter drop location"
              />
            </div>
          </div>

          {/* Row 2: Distance & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1.5 pl-1">
                <IoLocation size={17} className="text-blue-600" />
                <span>Distance</span>
              </label>
              <div className="relative flex items-center justify-center bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  {distance} Km
                </span>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1.5 pl-1">
                <FaMoneyBills size={17} className="text-blue-600" />
                <span>Price</span>
              </label>
              <input
                type="text"
                readOnly
                value={price}
                className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 py-3 text-sm text-center font-semibold text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Row 3: Customer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1.5 pl-1">
                <IoIosPeople size={17} className="text-blue-600" />
                <span>Customer name</span>
              </label>
              <input
                type="text"
                readOnly
                value={customerName}
                className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 py-3 text-sm text-center font-medium text-slate-600 outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1.5 pl-1">
                <IoIosPeople size={17} className="text-blue-600" />
                <span>Customer Contact number</span>
              </label>
              <input
                type="text"
                readOnly
                value={contactNumber}
                className="w-full bg-[#F8FAFC] border border-slate-100 rounded-2xl px-4 py-3 text-sm text-center font-medium text-slate-600 outline-none"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={handleNavigatePickup}
              className="w-full bg-[#007AFF] hover:bg-[#0063CC] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-blue-100 transition-all active:scale-[0.99]"
            >
              Navigate to pickup
            </button>

            <button
              onClick={handleNavigateDropOff}
              className="w-full bg-[#007AFF] hover:bg-[#0063CC] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-blue-100 transition-all active:scale-[0.99]"
            >
              Navigate to drop-off
            </button>
          </div>

          <hr className="border-slate-100 my-1" />

          {/* Action Sections */}
          <div className="space-y-5">

            {/* Pickup Action */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <MdOutlineEditNote size={10} className="text-blue-600" />
                  Pickup
                </span>
                <button
                  onClick={() => setIsMarkedPickup(true)}
                  className="bg-[#007AFF] hover:bg-[#0063CC] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow transition-all"
                >
                  Already at pickup <span>➔</span>
                </button>
              </div>

              {isMarkedPickup && (
                <div className="w-full bg-gradient-to-r from-cyan-50 to-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                  <p className="text-emerald-600 font-bold text-xs md:text-sm">
                    You're marked at pickup - passenger notified.
                  </p>
                </div>
              )}
            </div>

            {/* Finish Trip Action */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <MdOutlineEditNote size={10} className="text-blue-600" />
                  Finish trip
                </span>
                <button
                  onClick={() => setIsTripCompleted(true)}
                  className="bg-[#007AFF] hover:bg-[#0063CC] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow transition-all"
                >
                  <FaMoneyBills size={10} className="text-white" />
                  Finish Trip <span>➔</span>
                </button>
              </div>

              {isTripCompleted && (
                <div className="w-full bg-gradient-to-r from-cyan-50 to-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                  <p className="text-emerald-600 font-bold text-xs md:text-sm">
                    Trip completed. Earnings have been updated.
                  </p>
                </div>
              )}
            </div>

            {/* Earnings Navigation */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <FaMoneyBills size={10} className="text-blue-600" />
                Earning
              </span>
              <button
                onClick={() => alert("Redirecting to Earnings page...")}
                className="bg-[#007AFF] hover:bg-[#0063CC] text-white text-xs font-bold px-8 py-2.5 rounded-xl flex items-center gap-2 shadow transition-all"
              >
                Earnings <span>➔</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}