import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { FiShare2, FiMic, FiCopy, FiSend } from 'react-icons/fi';
import { FaPhoneAlt, FaAmbulance, FaShieldAlt, FaFire, FaMapMarkerAlt, FaRobot, FaExchangeAlt } from 'react-icons/fa';
import MapContainer from '../../components/safety/MapContainer';
import EmergencyActionModal from '../../components/safety/EmergencyActionModal';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useEmergencyLocations } from '../../hooks/useSafetyData';
import heroBg from '../../assets/safety/Nine-Arches-Bridge 1.png';

export default function EmergencyCallPage() {
  const navigate = useNavigate();
  const [activeEmergency, setActiveEmergency] = useState(null);

  const emergencyActionsData = {
    police: {
      bannerTitle: 'POLICE EMERGENCY (119) DISPATCH ASSISTANCE',
      assistanceLabel: 'POLICE ASSISTANCE: CALL 119',
      phone: '119',
      color: 'bg-[#232B7A]',
      description:
        'Your request for emergency police assistance has been initiated. In a web application context, we are now automatically sharing your real-time location, reporter details, and incident summary to the nearest Police Division for immediate dispatch.',
      actionText: 'Call 119'
    },
    ambulance: {
      bannerTitle: 'SUWA SERIYA EMERGENCY (1990) DISPATCH ASSISTANCE',
      assistanceLabel: 'SUWA SERIYA  ASSISTANCE: CALL 1990',
      phone: '1990',
      color: 'bg-[#E03A3E]',
      description:
        'Your request for emergency medical assistance has been initiated. In a web application context, we are now automatically sharing your real-time location, reporter details, and essential medical profile (Blood Type: A+, Allergies: Penicillin) to the Suwa Seriya Central Dashboard for immediate ambulance dispatch.',
      actionText: 'Call 1990'
    },
    tourist_police: {
      bannerTitle: 'TOURIST POLICE (011-2421451) DISPATCH ASSISTANCE',
      assistanceLabel: 'TOURIST POLICE ASSISTANCE: CALL 011-2421451',
      phone: '011-2421451',
      color: 'bg-[#41C9BA]',
      description:
        'Your request for Tourist Police assistance has been initiated. In a web application context, we are now automatically sharing your real-time location, passport details, and travel itinerary to the Tourist Police Division for immediate officer dispatch.',
      actionText: 'Call 011-2421451'
    },
    fire: {
      bannerTitle: 'FIRE & RESCUE EMERGENCY (110) DISPATCH ASSISTANCE',
      assistanceLabel: 'FIRE & RESCUE ASSISTANCE: CALL 110',
      phone: '110',
      color: 'bg-[#F27024]',
      description:
        'Your request for Fire & Rescue assistance has been initiated. In a web application context, we are now automatically sharing your real-time location, building details, and fire type description to the nearest Fire Station for immediate engine dispatch.',
      actionText: 'Call 110'
    },
    location: {
      bannerTitle: 'LIVE LOCATION SHARING',
      assistanceLabel: 'SHARE YOUR EXACT GPS COORDINATES',
      phone: null,
      color: 'bg-[#5CB85C]',
      description:
        'Your live location sharing request has been initiated. In a web application context, we are now preparing a shareable link containing your real-time GPS coordinates, nearby landmark information, and a direct Google Maps reference for your trusted emergency contacts.',
      actionText: 'Share Location Link'
    }
  };

  const handleEmergencyAction = () => {
    if (!activeEmergency) return;

    if (activeEmergency === 'location') {
      shareLocation();
    } else {
      callNumber(emergencyActionsData[activeEmergency].phone);
    }
  };

  const handleGoNavigation = ({ lat, lng, name, type }) => {
    navigate(`/safety/navigate?destLat=${lat}&destLng=${lng}&name=${encodeURIComponent(name)}&type=${type}`);
  };

  // ── REQUIRE REAL GPS LOCATION ONLY ───────────────────────────────────────────

  const { location } = useGeolocation()

  // Only fetch emergency locations when real GPS location is available
  const hasRealLocation = location.latitude && location.longitude

  const locationParams = hasRealLocation
    ? { lat: location.latitude, lng: location.longitude, radius: 30000 }
    : null   // null = don't fetch yet

  const { data: emergencyLocations = [], isLoading } = useEmergencyLocations(locationParams)

  // Map center is user's actual GPS location (no fallback)
  const mapCenter = hasRealLocation
    ? [location.latitude, location.longitude]
    : [7.8731, 80.7718]   // Sri Lanka island center while waiting

  const touristPoliceLocations = emergencyLocations.filter(loc => loc.type === 'tourist_police' || loc.type === 'tourist-police');
  const hospitalLocations = emergencyLocations.filter(loc => loc.type === 'hospital');

  // Custom SVG icon for Tourist Police (blue shield with badge)
  const policeIcon = useMemo(() => L.divIcon({
    className: '',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:44px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
        <path d="M18 0C8.06 0 0 7.6 0 17c0 12.75 18 27 18 27s18-14.25 18-27C36 7.6 27.94 0 18 0z" fill="#1E3A8A"/>
        <circle cx="18" cy="16" r="11" fill="#2563EB"/>
        <path d="M18 7l2.5 3.5H24l-3 3.5 1.5 4-4.5-2.5L13.5 18l1.5-4-3-3.5h3.5z" fill="white"/>
        <circle cx="18" cy="16" r="3" fill="white" opacity="0.9"/>
      </svg>
    </div>`,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
  }), []);

  // Custom SVG icon for Hospital (red circle with white cross)
  const hospitalIcon = useMemo(() => L.divIcon({
    className: '',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:44px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
        <path d="M18 0C8.06 0 0 7.6 0 17c0 12.75 18 27 18 27s18-14.25 18-27C36 7.6 27.94 0 18 0z" fill="#DC2626"/>
        <circle cx="18" cy="16" r="11" fill="white"/>
        <rect x="15" y="9" width="6" height="14" rx="1" fill="#DC2626"/>
        <rect x="11" y="13" width="14" height="6" rx="1" fill="#DC2626"/>
      </svg>
    </div>`,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -40],
  }), []);

  // Custom pulsing icon for the user's current location
  const myLocationIcon = useMemo(() => L.divIcon({
    className: '',
    html: `<div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center">
      <div style="position:absolute;width:28px;height:28px;border-radius:50%;background:rgba(34,197,94,0.25);animation:pulse-ring 1.8s ease-out infinite"></div>
      <div style="position:relative;width:14px;height:14px;border-radius:50%;background:#16a34a;border:2.5px solid #fff;box-shadow:0 0 0 2px rgba(22,163,74,0.5),0 2px 6px rgba(0,0,0,0.3)"></div>
      <style>@keyframes pulse-ring{0%{transform:scale(0.6);opacity:1}100%{transform:scale(2.2);opacity:0}}</style>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
  }), []);

  //your current myLocationMarker useMemo
  const myLocationMarker = useMemo(() => {
    if (!location.latitude || !location.longitude) return null

    return {
      id: 'my-location',
      lat: location.latitude,
      lng: location.longitude,
      icon: myLocationIcon,
      popup: '<strong>📍 Your Current Location</strong>',
    }
  }, [location.latitude, location.longitude, myLocationIcon])

  const createMarkers = (locs, customIcon, defaultType) => locs
    .filter((item) => item.location?.lat && item.location?.lng)
    .map((item) => ({
      id: item._id || item.id,
      lat: item.location.lat,
      lng: item.location.lng,
      label: item.name,
      icon: customIcon,
      popup: `
        <div style="min-width:200px; font-family: sans-serif; padding: 2px;">
          <strong style="font-size:14px; color: #1e293b; display: block; margin-bottom: 4px;">${item.name}</strong>
          <p style="margin:4px 0;font-size:12px;color:#64748b;line-height:1.4;">${item.address || 'Address not available'}</p>
          ${item.phone ? `<p style="margin:4px 0;font-size:12px;color:#334155;"><strong>Phone:</strong> ${item.phone}</p>` : ''}
          <button
            class="popup-go-btn"
            data-lat="${item.location.lat}"
            data-lng="${item.location.lng}"
            data-name="${encodeURIComponent(item.name)}"
            data-type="${item.type || defaultType}"
            style="margin-top:8px;width:100%;padding:8px 0;background:#2563EB;color:#fff;border:none;border-radius:6px;font-weight:700;font-size:13px;cursor:pointer;letter-spacing:0.5px;text-align:center;box-shadow: 0 2px 4px rgba(37,99,235,0.2);transition: all 0.2s;"
          >
            GO
          </button>
        </div>
      `,
    }));

  const touristPoliceMarkers = [
    ...(myLocationMarker ? [myLocationMarker] : []),
    ...createMarkers(touristPoliceLocations, policeIcon, 'tourist_police'),
  ];
  const hospitalMarkers = [
    ...(myLocationMarker ? [myLocationMarker] : []),
    ...createMarkers(hospitalLocations, hospitalIcon, 'hospital'),
  ];

  const shareLocation = async () => {
    if (!location.latitude) {
      alert('Location not available. Please enable location services.');
      return;
    }
    const text = `My current location: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Emergency location', text });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Location link copied to clipboard');
    }
  }

  const callNumber = (number) => {
    window.location.href = `tel:${number}`;
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] pb-12 font-sans">
      {/* Hero Section */}
      <div
        className="relative h-[280px] md:h-[350px] w-full flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${heroBg}')` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 md:left-8 md:top-8 z-20 flex h-9 w-9 items-center justify-center text-xl font-bold text-white/90 hover:text-white"
          aria-label="Navigate back"
        >
          &larr;
        </button>
        <div className="relative z-10 max-w-4xl px-4 text-center flex flex-col items-center gap-6 mt-6">
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 md:p-8 rounded-lg shadow-xl max-w-3xl">
            <p className="text-white text-base md:text-lg lg:text-xl font-medium leading-relaxed">
              "These updates are intended for international visitors who are currently in Sri Lanka as well as those planning a trip to the country."
            </p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 px-8 py-3 rounded-lg shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-wide" style={{ color: '#ffffff' }}>
              Tourism Hotline <span style={{ color: '#FFD700' }}>1912</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 mt-8 space-y-12">
        {/* Emergency Assistance Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#E03A3E] mb-6">Emergency Assistance</h2>

          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 lg:gap-12">
            {/* Left Column: Action Buttons */}
            <div className="flex flex-col gap-2.5 max-w-[420px]">
              {/* Police */}
              <button onClick={() => setActiveEmergency('police')} className="flex items-center gap-3.5 bg-[#232B7A] text-white py-2.5 px-4 rounded-lg hover:bg-blue-900 transition-colors text-left group shadow-sm">
                <div className="bg-white/10 p-2.5 rounded-full group-hover:scale-110 transition-transform">
                  <FaPhoneAlt className="text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] leading-tight">Police Emergency</h3>
                  <p className="text-blue-100 text-[13px] mt-0.5">Dial 119 for immediate police assistance.</p>
                </div>
              </button>

              {/* Ambulance */}
              <button onClick={() => setActiveEmergency('ambulance')} className="flex items-center gap-3.5 bg-[#E03A3E] text-white py-2.5 px-4 rounded-lg hover:bg-red-700 transition-colors text-left group shadow-sm">
                <div className="bg-white/10 p-2.5 rounded-full group-hover:scale-110 transition-transform">
                  <FaAmbulance className="text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] leading-tight">Suwa Seriya Ambulance</h3>
                  <p className="text-red-100 text-[13px] mt-0.5">Dial 1990 for 24/7 Free Emergency Ambulance Service.</p>
                </div>
              </button>

              {/* Tourist Police */}
              <button onClick={() => setActiveEmergency('tourist_police')} className="flex items-center gap-3.5 bg-[#41C9BA] text-white py-2.5 px-4 rounded-lg hover:bg-teal-500 transition-colors text-left group shadow-sm">
                <div className="bg-white/20 p-2.5 rounded-full group-hover:scale-110 transition-transform">
                  <FaShieldAlt className="text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] leading-tight text-white">Tourist Police</h3>
                  <p className="text-teal-50 text-[13px] mt-0.5">Dial 011-2421451.</p>
                </div>
              </button>

              {/* Fire & Rescue */}
              <button onClick={() => setActiveEmergency('fire')} className="flex items-center gap-3.5 bg-[#F27024] text-white py-2.5 px-4 rounded-lg hover:bg-orange-600 transition-colors text-left group shadow-sm">
                <div className="bg-white/20 p-2.5 rounded-full group-hover:scale-110 transition-transform">
                  <FaFire className="text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] leading-tight">Fire & Rescue</h3>
                  <p className="text-orange-100 text-[13px] mt-0.5">Dial 110 for fire emergencies or rescue operations.</p>
                </div>
              </button>

              {/* My Current Location */}
              <button onClick={() => setActiveEmergency('location')} className="flex items-center gap-3.5 bg-[#5CB85C] text-white py-2.5 px-4 rounded-lg hover:bg-green-600 transition-colors text-left group shadow-sm">
                <div className="bg-white/20 p-2.5 rounded-full group-hover:scale-110 transition-transform">
                  <FaMapMarkerAlt className="text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] leading-tight">My Current Location</h3>
                  <p className="text-green-50 text-[13px] mt-0.5">View or share your exact GPS coordinates.</p>
                </div>
              </button>
            </div>

            {/* Right Column: Informational Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-lg overflow-hidden flex flex-col shadow-sm border border-slate-100">
                <div className="bg-[#E6F3FF] px-4 py-3 border-b border-blue-100 text-center">
                  <h4 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">Important Instructions</h4>
                </div>
                <div className="p-5 flex-1 space-y-5 text-sm text-slate-700">
                  <p><span className="font-bold text-slate-900 block mb-1">Stay Calm:</span> Take a deep breath and stay focused.</p>
                  <p><span className="font-bold text-slate-900 block mb-1">Identify Landmarks:</span> Look for a nearby building or sign to describe your location.</p>
                  <p><span className="font-bold text-slate-900 block mb-1">Save Battery:</span> Keep your phone for emergency calls only.</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-lg overflow-hidden flex flex-col shadow-sm border border-slate-100">
                <div className="bg-[#E6F3FF] px-4 py-3 border-b border-blue-100 text-center">
                  <h4 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">Emergency Contacts</h4>
                </div>
                <div className="p-5 flex-1 space-y-5 text-sm text-slate-700">
                  <p><span className="font-bold text-slate-900 block mb-1">Local Police:</span> Immediate response for any security concerns.</p>
                  <p><span className="font-bold text-slate-900 block mb-1">Medical Support:</span> Fast access to ambulance services (1990).</p>
                  <p><span className="font-bold text-slate-900 block mb-1">Tourist Hotline:</span> Dedicated support for international visitors.</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-lg overflow-hidden flex flex-col shadow-sm border border-slate-100">
                <div className="bg-[#E6F3FF] px-4 py-3 border-b border-blue-100 text-center">
                  <h4 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">Quick Tips</h4>
                </div>
                <div className="p-5 flex-1 space-y-5 text-sm text-slate-700">
                  <p><span className="font-bold text-slate-900 block mb-1">Share Your Location:</span> Send your GPS coordinates to a trusted person.</p>
                  <p><span className="font-bold text-slate-900 block mb-1">Keep Documents Ready:</span> Have a digital copy of your passport and insurance.</p>
                  <p><span className="font-bold text-slate-900 block mb-1">Check Surroundings:</span> Move to a safe, well-lit area if possible.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maps Section */}
        {!hasRealLocation ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Waiting for Location - Police */}
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-4 ml-1">Tourist Police Stations</h3>
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 h-[450px] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mb-4 flex justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-blue-600 rounded-full"></div>
                  </div>
                  <p className="text-slate-600 font-semibold">Acquiring your location...</p>
                  <p className="text-slate-500 text-sm mt-2">Please enable location services on your device</p>
                </div>
              </div>
            </div>

            {/* Waiting for Location - Hospitals */}
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-4 ml-1">Hospitals</h3>
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 h-[450px] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mb-4 flex justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-red-300 border-t-red-600 rounded-full"></div>
                  </div>
                  <p className="text-slate-600 font-semibold">Acquiring your location...</p>
                  <p className="text-slate-500 text-sm mt-2">Please enable location services on your device</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tourist Police Map */}
            <div>
              <div className="flex items-center justify-between mb-4 ml-1">
                <h3 className="text-[15px] font-bold text-slate-900">Tourist Police Stations</h3>
                {myLocationMarker && (
                  <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow ring-2 ring-green-300" />
                    Your Location
                  </span>
                )}
              </div>
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 h-[450px]">
                <div className="h-full rounded-lg overflow-hidden relative">
                  {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                      <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-slate-600">Loading nearby police stations...</p>
                      </div>
                    </div>
                  )}
                  <MapContainer
                    center={mapCenter}
                    zoom={10}
                    markers={touristPoliceMarkers}
                    onPopupAction={handleGoNavigation}
                  />
                </div>
              </div>
            </div>

            {/* Hospitals Map */}
            <div>
              <div className="flex items-center justify-between mb-4 ml-1">
                <h3 className="text-[15px] font-bold text-slate-900">Hospitals</h3>
                {myLocationMarker && (
                  <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow ring-2 ring-green-300" />
                    Your Location
                  </span>
                )}
              </div>
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 h-[450px]">
                <div className="h-full rounded-lg overflow-hidden relative">
                  {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                      <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-red-300 border-t-red-600 rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-slate-600">Loading nearby hospitals...</p>
                      </div>
                    </div>
                  )}
                  <MapContainer
                    center={mapCenter}
                    zoom={10}
                    markers={hospitalMarkers}
                    onPopupAction={handleGoNavigation}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Translator & Chatbot Access Section */}
        <div className="pt-4">
          <h2 className="text-[15px] font-bold text-slate-900 mb-6 ml-1">Translator Access</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Translator UI Mock */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full flex flex-col bg-slate-50 border border-slate-200 rounded-lg overflow-hidden h-full">
                <select className="w-full bg-white p-3 border-b border-slate-200 outline-none text-slate-700 font-semibold text-sm">
                  <option>Select Languages</option>
                  <option>English</option>
                </select>
                <div className="p-4 flex-1 min-h-[140px] relative bg-slate-50">
                  <textarea placeholder="Enter text" className="w-full h-full bg-transparent resize-none outline-none text-slate-600 text-sm" />
                  <button className="absolute bottom-4 right-4 text-slate-400 hover:text-slate-600">
                    <FiMic size={18} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center p-2 text-slate-600">
                <FaExchangeAlt size={18} />
              </div>

              <div className="flex-1 w-full flex flex-col bg-slate-50 border border-slate-200 rounded-lg overflow-hidden h-full">
                <select className="w-full bg-white p-3 border-b border-slate-200 outline-none text-slate-700 font-semibold text-sm">
                  <option>Select Languages</option>
                  <option>Translation</option>
                </select>
                <div className="p-4 flex-1 min-h-[140px] relative bg-slate-50">
                  <div className="w-full h-full text-slate-400 text-sm">Translation</div>
                  <button className="absolute bottom-4 right-4 text-slate-400 hover:text-slate-600">
                    <FiCopy size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Chatbot UI Mock */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
              <div className="p-6 flex items-start gap-4 flex-1">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
                  <FaRobot size={24} />
                </div>
                <div className="pt-1">
                  <h4 className="font-bold text-slate-900 text-sm">Hi</h4>
                  <p className="text-slate-600 text-sm mt-1">"Type your message here to get some help from me"</p>
                </div>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <div className="relative border border-blue-400 rounded-md overflow-hidden">
                  <input
                    type="text"
                    placeholder="Ask me anything."
                    className="w-full bg-white p-3 pr-12 outline-none text-sm text-slate-700 placeholder-slate-400"
                  />
                  <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-4 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition-colors">
                    <FiSend size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <EmergencyActionModal
        isOpen={!!activeEmergency}
        onClose={() => setActiveEmergency(null)}
        data={activeEmergency ? emergencyActionsData[activeEmergency] : null}
        onAction={handleEmergencyAction}
      />
    </div>
  )
}
