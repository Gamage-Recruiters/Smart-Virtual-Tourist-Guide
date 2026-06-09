import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { FaPhoneAlt, FaAmbulance, FaShieldAlt, FaFire, FaMapMarkerAlt } from 'react-icons/fa';
import ChatbotPanel from '../../components/safety/ChatbotPanel';
import MapContainer from '../../components/safety/MapContainer';
import EmergencyActionModal from '../../components/safety/EmergencyActionModal';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useLocalPoliceStations, useTouristPolice, useHospitals } from '../../hooks/useSafetyData';
import EmergencyTranslator from '../../components/safety/EmergencyTranslator';
import heroBg from '../../assets/safety/Nine-Arches-Bridge 1.png';

import { haversineDistance, policeIcon, nearestPoliceIcon, hospitalIcon, localPoliceIcon, myLocationIcon } from '../../utils/mapUtils';
export default function EmergencyCallPage() {
  const navigate = useNavigate();
  const [activeEmergency, setActiveEmergency] = useState(null);

  // Auto-scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        'Your request for emergency medical assistance has been initiated. In a web application context, we are now automatically sharing your real-time location, reporter details, and essential medical profile to the Suwa Seriya Central Dashboard for immediate ambulance dispatch.',
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

  const { location, isLoading: isLocationLoading, error: locationError } = useGeolocation()

  // Only fetch emergency locations when real GPS location is available
  const hasRealLocation = location.latitude && location.longitude



  // Map center: user's actual GPS location, fallback to Sri Lanka center
  const mapCenter = hasRealLocation
    ? [location.latitude, location.longitude]
    : [7.8731, 80.7718]; // Sri Lanka island center

  // If GPS is still loading and we don't have a real location yet, pass null to prevent fetching
  // If GPS finishes loading and fails (or user denies), then we fallback to the mapCenter.
  const shouldFetch = hasRealLocation || (!isLocationLoading && locationError);
  
  const locationParams = shouldFetch ? { lat: mapCenter[0], lng: mapCenter[1], radius: 15000 } : null;
  const localPoliceParams = shouldFetch ? { lat: mapCenter[0], lng: mapCenter[1], radius: 15000 } : null;

  // ── Police stations: from backend DB (instant map load, no GPS wait) ──
  const { data: rawTouristPoliceLocations = [], isLoading: isLoadingTouristPolice } = useTouristPolice({})

  // ── Calculate distances and find nearest 3 tourist police stations if GPS available ──
  const { touristPoliceLocations, nearestIds } = useMemo(() => {
    let stations = [...rawTouristPoliceLocations];
    let nIds = [];

    if (hasRealLocation && location?.latitude && location?.longitude) {
      stations = stations.map((s) => ({
        ...s,
        distanceKm: s.location?.lat && s.location?.lng 
          ? haversineDistance(location.latitude, location.longitude, s.location.lat, s.location.lng)
          : Infinity,
      }));

      stations.sort((a, b) => a.distanceKm - b.distanceKm);
      nIds = stations.slice(0, 3).map((s) => s._id || s.id); // 3 nearest
    }

    return { touristPoliceLocations: stations, nearestIds: nIds };
  }, [rawTouristPoliceLocations, hasRealLocation, location]);

  // ── Hospitals: from backend API (Overpass/OSM) ──
  const { data: hospitalLocations = [], isLoading } = useHospitals(locationParams)

  // ── Local Police: from backend API (Overpass/OSM), auto-filtered by GPS ──
  const { data: localPoliceLocations = [], isLoading: isLoadingLocalPolice } = useLocalPoliceStations(localPoliceParams)



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
      id: item._id || item.id || item.osmId || Math.random().toString(),
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

  // Build police markers with auto-highlighted nearest stations
  const touristPoliceMarkers = [
    ...(myLocationMarker ? [myLocationMarker] : []),
    ...touristPoliceLocations
      .filter((s) => s.location?.lat && s.location?.lng)
      .map((station) => {
        const id = station._id || station.id;
        const isNearest = nearestIds.includes(id);
        return {
          id: id,
          lat: station.location.lat,
          lng: station.location.lng,
          label: station.name,
          icon: isNearest ? nearestPoliceIcon : policeIcon,
          popup: `
            <div style="min-width:220px; font-family: sans-serif; padding: 2px;">
              <strong style="font-size:14px; color: #1e293b; display: block; margin-bottom: 4px;">${station.name}</strong>
              ${isNearest ? '<div style="display:inline-block;background:#DBEAFE;color:#1E40AF;font-size:11px;font-weight:700;padding:2px 8px;border-radius:12px;margin-bottom:6px;">⭐ Nearest to you</div>' : ''}
              <div style="display:inline-block;background:#DBEAFE;color:#1E3A8A;font-size:10px;font-weight:600;padding:1px 6px;border-radius:8px;margin-bottom:4px;">Tourist Police</div>
              <p style="margin:4px 0;font-size:12px;color:#64748b;line-height:1.4;">${station.address || 'Address not available'}</p>
              ${station.phone ? `<p style="margin:4px 0;font-size:12px;color:#334155;"><strong>📞 Phone:</strong> <a href="tel:${station.phone}" style="color:#2563EB;text-decoration:none;">${station.phone}</a></p>` : ''}
              <p style="margin:4px 0;font-size:11px;color:#64748b;">🕐 ${station.operatingHours || '24/7'}</p>
              ${station.distanceKm != null ? `<p style="margin:4px 0;font-size:12px;color:#16a34a;font-weight:600;">📏 ${station.distanceKm.toFixed(1)} km away</p>` : ''}
              <button
                class="popup-go-btn"
                data-lat="${station.location.lat}"
                data-lng="${station.location.lng}"
                data-name="${encodeURIComponent(station.name)}"
                data-type="tourist_police"
                style="margin-top:8px;width:100%;padding:8px 0;background:#2563EB;color:#fff;border:none;border-radius:6px;font-weight:700;font-size:13px;cursor:pointer;letter-spacing:0.5px;text-align:center;box-shadow: 0 2px 4px rgba(37,99,235,0.2);transition: all 0.2s;"
              >
                GO
              </button>
            </div>
          `,
        };
      }),
    // Local police stations (dark green pins) — auto-filtered by proximity
    ...createMarkers(
      localPoliceLocations.map(lp => ({ ...lp, type: 'local_police' })),
      localPoliceIcon,
      'local_police'
    ),
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

  console.log('Local Police Data:', localPoliceLocations.length, localPoliceLocations);
  console.log('Local Police Markers:', touristPoliceMarkers.filter(m => m.popup.includes('local_police')));

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Police Map — Tourist Police (static) + Local Police (Overpass) */}
          <div>
            <div className="flex items-center justify-between mb-4 ml-1">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">Police Stations</h3>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-end">
                {nearestIds.length > 0 && (
                  <span className="flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 shadow ring-2 ring-blue-200 animate-pulse" />
                    Nearest
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-[11px] text-blue-700 font-medium">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#1E3A8A' }} />
                  Tourist
                </span>
                {localPoliceLocations.length > 0 && (
                  <span className="flex items-center gap-1.5 text-[11px] text-green-700 font-medium">
                    <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#16A34A' }} />
                    Local
                  </span>
                )}
                {myLocationMarker && (
                  <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow ring-2 ring-green-300" />
                    You
                  </span>
                )}
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 h-[450px]">
              <div className="h-full rounded-lg overflow-hidden relative">
                {(isLoadingLocalPolice || isLoadingTouristPolice) && hasRealLocation && (
                  <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
                    <div className="h-3.5 w-3.5 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
                    <span className="text-[11px] text-slate-600 font-medium">Loading nearby police...</span>
                  </div>
                )}
                {isLoadingTouristPolice && !hasRealLocation && (
                  <div className="absolute inset-0 z-[1000] bg-white/80 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-blue-600 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-slate-600">Loading police stations...</p>
                    </div>
                  </div>
                )}
                <MapContainer
                  center={hasRealLocation ? mapCenter : [7.8731, 80.7718]}
                  zoom={hasRealLocation ? 10 : 8}
                  markers={touristPoliceMarkers}
                  onPopupAction={handleGoNavigation}
                />
              </div>
            </div>
          </div>

          {/* Hospitals Map — requires GPS */}
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
                {!hasRealLocation ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                    <div className="text-center p-8">
                      <div className="mb-4 flex justify-center">
                        <div className="animate-spin h-8 w-8 border-4 border-red-300 border-t-red-600 rounded-full"></div>
                      </div>
                      <p className="text-slate-600 font-semibold">Acquiring your location...</p>
                      <p className="text-slate-500 text-sm mt-2">Please enable location services on your device</p>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-red-300 border-t-red-600 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-slate-600">Loading nearby hospitals...</p>
                    </div>
                  </div>
                ) : null}
                {hasRealLocation && (
                  <MapContainer
                    center={mapCenter}
                    zoom={10}
                    markers={hospitalMarkers}
                    onPopupAction={handleGoNavigation}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Translator & Chatbot Access Section */}
        <div className="pt-4">
          <h2 className="text-[15px] font-bold text-slate-900 mb-6 ml-1">Translator & AI Assistant</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ── Live Translator (MyMemory API) ────────────────────────────── */}
            <EmergencyTranslator />

            {/* SafeBot — Rule-Based Tourist Safety Chatbot */}
            <ChatbotPanel />
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
