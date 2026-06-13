import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Header from "../Header";
import Footer from "../Footer";
import bImage from "../../assets/B.png";

import { MdOutlineEditNote, MdOutlineSocialDistance } from "react-icons/md";
import { FaMoneyBills } from "react-icons/fa6";
import {
  IoCaretBackOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Blue marker (pickup)
const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Red marker (drop)
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Helper: recenter map when center changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Geocode using Nominatim (free, no API key needed)
async function geocode(placeName) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`,
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

export default function Driver_Bids() {
  const navigate = useNavigate();

  // Form fields
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupInput, setPickupInput] = useState("");
  const [dropInput, setDropInput] = useState("");
  const [distance, setDistance] = useState("");
  const [price, setPrice] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [submitBidAmount, setSubmitBidAmount] = useState("");

  // Map states
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Sri Lanka center
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Bid states
  const [submitting, setSubmitting] = useState(false);
  const [otherBids, setOtherBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);

  // Temporary tripId
  const tripId = "TRIP_001";

  // Debounce: update actual pickup/drop after 1s typing pause
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pickupInput.trim() !== "") setPickup(pickupInput.trim());
      if (dropInput.trim() !== "") setDrop(dropInput.trim());
    }, 1000);
    return () => clearTimeout(timer);
  }, [pickupInput, dropInput]);

  // Geocode when pickup or drop changes
  useEffect(() => {
    if (!pickup && !drop) return;
    if (!pickup || !drop) return;

    setMapLoading(true);
    setMapError(false);
    setShowMap(false);

    Promise.all([geocode(pickup), geocode(drop)]).then(async ([pCoords, dCoords]) => {
      if (pCoords && dCoords) {
        setPickupCoords(pCoords);
        setDropCoords(dCoords);
        const center = [
          (pCoords[0] + dCoords[0]) / 2,
          (pCoords[1] + dCoords[1]) / 2,
        ];
        setMapCenter(center);
        setShowMap(true);

        // Calculate distance via OSRM
        try {
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${pCoords[1]},${pCoords[0]};${dCoords[1]},${dCoords[0]}?overview=false`
          );
          const data = await res.json();
          let distKm = 0;
          if (data.routes && data.routes.length > 0) {
            distKm = (data.routes[0].distance / 1000).toFixed(1);
          } else {
            // Haversine fallback
            const R = 6371;
            const dLat = (dCoords[0] - pCoords[0]) * (Math.PI / 180);
            const dLon = (dCoords[1] - pCoords[1]) * (Math.PI / 180);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(pCoords[0] * (Math.PI / 180)) *
                Math.cos(dCoords[0] * (Math.PI / 180)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            distKm = (R * c).toFixed(1);
          }
          setDistance(distKm);
          setPrice((distKm * 120).toFixed(2)); // 120 LKR per km
        } catch (e) {
          console.error("OSRM error:", e);
        }
      } else {
        setMapError(true);
      }
      setMapLoading(false);
    });
  }, [pickup, drop]);

  // Fetch existing bids for this trip
  const fetchBids = async () => {
    try {
      setBidsLoading(true);
      const res = await fetch(`/api/bids/${tripId}`);
      const result = await res.json();
      if (result.success) {
        setOtherBids(result.data);
      }
    } catch (err) {
      console.error("Fetch bids error:", err);
    } finally {
      setBidsLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  // Submit bid
  const handleSubmitBid = async () => {
    if (!submitBidAmount) {
      alert("Please enter a bid amount");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          driverName: customerName || "Driver",
          bidAmount: Number(submitBidAmount),
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Bid of ${submitBidAmount} LKR submitted successfully!`);
        setSubmitBidAmount("");
        fetchBids();
      } else {
        alert(data.message || "Failed to submit bid");
      }
    } catch (error) {
      console.error("Submit bid error:", error);
      alert("An error occurred while submitting the bid.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = () => alert("Trip accepted!");
  const handleDecline = () => alert("Trip declined!");

  const goToOtherBidsPage = () => {
    navigate(`/other-drivers`, { state: { customerName } });
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={bImage} alt="Sri Lanka View" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#E5F3FD]/70 to-[#E5F3FD] backdrop-blur-[3px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Header />

        <div className="flex-1 flex items-center justify-center w-full px-4 py-10 mt-40">
          <div className="w-full max-w-3xl space-y-6">

            {/* === MAP CARD === */}
            <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border border-slate-100">
              <div className="px-6 pt-5 pb-3 flex items-center gap-2">
                <IoLocationOutline size={16} className="text-blue-600" />
                <span className="text-sm font-bold text-slate-800">Route Map</span>
                {pickup && drop && (
                  <span className="ml-auto text-[11px] text-slate-400 font-medium">
                    {pickup} → {drop}
                  </span>
                )}
              </div>

              <div className="w-full h-[200px] relative">
                {/* Placeholder when no locations */}
                {!pickup && !drop && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-2">
                    <IoLocationOutline size={32} className="text-slate-300" />
                    <span className="text-slate-400 text-xs font-medium">
                      Enter pickup &amp; drop to see map
                    </span>
                  </div>
                )}

                {/* Loading */}
                {mapLoading && (
                  <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center gap-2 z-10">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-400 text-xs font-medium">Loading map...</span>
                  </div>
                )}

                {/* Error */}
                {mapError && !mapLoading && (
                  <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
                    <span className="text-red-400 text-xs font-medium text-center px-6">
                      Location not found. Please check place names.
                    </span>
                  </div>
                )}

                {/* Map */}
                {showMap && !mapLoading && !mapError && pickupCoords && dropCoords && (
                  <MapContainer
                    center={mapCenter}
                    zoom={10}
                    style={{ width: "100%", height: "100%" }}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    attributionControl={false}
                  >
                    <MapRecenter center={mapCenter} zoom={10} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Marker position={pickupCoords} icon={blueIcon}>
                      <Popup>
                        <span className="font-semibold text-blue-600">Pickup:</span> {pickup}
                      </Popup>
                    </Marker>

                    <Marker position={dropCoords} icon={redIcon}>
                      <Popup>
                        <span className="font-semibold text-red-500">Drop:</span> {drop}
                      </Popup>
                    </Marker>

                    <Polyline
                      positions={[pickupCoords, dropCoords]}
                      color="#007AFF"
                      weight={3}
                      dashArray="8, 6"
                    />
                  </MapContainer>
                )}
              </div>

              {/* Map legend */}
              {showMap && distance && (
                <div className="px-6 py-3 flex items-center gap-6 border-t border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                    <span className="text-[11px] text-slate-500 font-medium">Pickup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="text-[11px] text-slate-500 font-medium">Drop</span>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <MdOutlineSocialDistance size={14} className="text-blue-500" />
                    <span className="text-[11px] font-bold text-blue-600">{distance} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMoneyBills size={12} className="text-green-500" />
                    <span className="text-[11px] font-bold text-green-600">LKR {price}</span>
                  </div>
                </div>
              )}
            </div>

            {/* === MAIN FORM CARD === */}
            <div className="bg-white rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-slate-100">

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                {/* Pickup */}
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-bold text-[#1E293B] mb-2">
                    <IoLocationOutline size={17} className="text-blue-600" />
                    Pickup
                  </label>
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={pickupInput}
                    onChange={(e) => setPickupInput(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 text-center text-slate-700 placeholder-slate-400 font-medium transition-colors"
                  />
                </div>

                {/* Drop */}
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-bold text-[#1E293B] mb-2">
                    <IoLocationOutline size={17} className="text-blue-600" />
                    Drop
                  </label>
                  <input
                    type="text"
                    placeholder="Enter drop location"
                    value={dropInput}
                    onChange={(e) => setDropInput(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 text-center text-slate-700 placeholder-slate-400 font-medium transition-colors"
                  />
                </div>

                {/* Distance (auto-calculated) */}
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-bold text-[#1E293B] mb-2">
                    <MdOutlineSocialDistance size={17} className="text-blue-600" />
                    Distance
                  </label>
                  <div className="w-full bg-[#F0F9FF] border border-blue-100 rounded-2xl px-5 py-4 text-sm text-center text-blue-700 font-bold">
                    {distance ? `${distance} km` : mapLoading ? "Calculating..." : "— km"}
                  </div>
                </div>

                {/* Price (auto-calculated) */}
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-bold text-[#1E293B] mb-2">
                    <FaMoneyBills size={17} className="text-blue-600" />
                    Estimated Price
                  </label>
                  <div className="w-full bg-[#F0FDF4] border border-green-100 rounded-2xl px-5 py-4 text-sm text-center text-green-700 font-bold">
                    {price ? `LKR ${price}` : "— LKR"}
                  </div>
                </div>

                {/* Customer Name */}
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-bold text-[#1E293B] mb-2">
                    <IoPeopleOutline size={17} className="text-blue-600" />
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 text-center text-slate-700 placeholder-slate-400 font-medium transition-colors"
                  />
                </div>

                {/* Customer Contact */}
                <div>
                  <label className="flex items-center gap-2 text-[13px] font-bold text-[#1E293B] mb-2">
                    <IoPeopleOutline size={17} className="text-blue-600" />
                    Customer Contact
                  </label>
                  <input
                    type="text"
                    placeholder="Customer Contact Number"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm outline-none focus:border-blue-500 text-center text-slate-700 placeholder-slate-400 font-medium transition-colors"
                  />
                </div>
              </div>

              {/* Submit Bid Section */}
              <div className="mt-8">
                <label className="flex items-center gap-2 text-[13px] font-bold text-[#1E293B] mb-2">
                  <MdOutlineEditNote size={17} className="text-blue-600" />
                  Submit Bid (LKR)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <input
                    type="number"
                    placeholder="Enter your bid amount"
                    value={submitBidAmount}
                    onChange={(e) => setSubmitBidAmount(e.target.value)}
                    className="w-full sm:flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-6 text-sm outline-none focus:border-blue-500 text-center text-slate-700 placeholder-slate-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleSubmitBid}
                    disabled={submitting}
                    className="w-full sm:w-[200px] bg-[#0070FF] hover:bg-[#005FDF] disabled:bg-blue-300 active:scale-95 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-md shadow-blue-200 text-sm font-bold transition-all duration-300"
                  >
                    <IoPaperPlaneOutline className="text-base" />
                    {submitting ? "Submitting..." : "Submit Bid"}
                  </button>
                </div>
              </div>

              {/* Other Bids Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-[13px] font-bold text-[#1E293B]">
                    <MdOutlineEditNote size={17} className="text-blue-600" />
                    Other Driver Bids
                    {otherBids.length > 0 && (
                      <span className="ml-1 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {otherBids.length}
                      </span>
                    )}
                  </label>
                  <button
                    onClick={fetchBids}
                    className="text-[11px] text-blue-500 font-bold hover:underline"
                  >
                    Refresh
                  </button>
                </div>

                <div className="space-y-3">
                  {bidsLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : otherBids.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      No bids yet for this trip
                    </div>
                  ) : (
                    otherBids.map((bid) => (
                      <div
                        key={bid._id}
                        className="flex items-center justify-between gap-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-5 py-3"
                      >
                        <span className="text-slate-700 font-bold text-xs min-w-[100px]">
                          {bid.driverName}
                        </span>
                        <span className="text-blue-600 font-bold text-sm">
                          LKR {bid.bidAmount.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          {new Date(bid.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Navigate Buttons */}
              <div className="mt-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goToOtherBidsPage}
                  className="flex-1 bg-[#0070FF] hover:bg-[#005FDF] active:scale-95 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-md shadow-blue-200 text-sm font-bold transition-all duration-300"
                >
                  See All Bids
                  <IoPaperPlaneOutline className="text-base" />
                </button>
              </div>

              {/* Bottom Action Buttons */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="w-full bg-[#22C55E] hover:bg-[#16a34a] active:scale-95 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-md shadow-green-200 text-sm font-bold transition-all duration-300"
                >
                  Accept Trip
                  <IoPaperPlaneOutline className="text-base" />
                </button>

                <button
                  type="button"
                  onClick={handleDecline}
                  className="w-full bg-[#EF4444] hover:bg-[#dc2626] active:scale-95 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-md shadow-red-200 text-sm font-bold transition-all duration-300"
                >
                  <IoCaretBackOutline className="text-xs" />
                  Decline Trip
                </button>
              </div>

              {/* Back button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}