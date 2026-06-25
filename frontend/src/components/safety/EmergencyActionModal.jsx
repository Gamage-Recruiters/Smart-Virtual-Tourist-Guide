import { FiX } from 'react-icons/fi';
import { useState, useEffect, useMemo } from 'react';
import MapContainer from './MapContainer';

export default function EmergencyActionModal({ isOpen, onClose, data, onAction, isLocationShare, currentLocation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (isOpen && isLocationShare && currentLocation) {
      setSelectedLocation(currentLocation);
    } else {
      setSelectedLocation(null);
    }
  }, [isOpen, isLocationShare, currentLocation]);

  const selectedMarker = useMemo(() => {
    if (!selectedLocation) return [];
    return [
      {
        id: 'selected-location',
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        color: 'red',
        popup: 'Selected Location',
      },
    ];
  }, [selectedLocation]);

  const handleAction = () => {
    onAction(selectedLocation);
  };

  if (!isOpen || !data) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-200 z-10 p-1.5 bg-black/30 rounded-full transition-colors"
        >
          <FiX size={18} />
        </button>

        {/* Dark Header Banner */}
        <div className="bg-[#2d3a4f] px-6 py-5 text-white">
          <h2 className="text-xl md:text-[22px] font-extrabold uppercase leading-snug tracking-wide">
            {data.bannerTitle}
          </h2>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {/* Assistance Call Line */}
          <h3 className="text-[15px] md:text-base font-extrabold text-slate-900 uppercase leading-snug">
            {data.assistanceLabel}
          </h3>

          {/* Description */}
          <p className="text-[13.5px] md:text-sm text-slate-700 leading-relaxed">
            {data.description}
          </p>

          {isLocationShare && (
            <div className="mt-4">
              <div className="overflow-hidden rounded-lg bg-sky-100 border border-slate-200 shadow-sm">
                <div className="h-[200px]">
                  <MapContainer
                    center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : (currentLocation ? [currentLocation.lat, currentLocation.lng] : [7.8731, 80.7718])}
                    zoom={selectedLocation || currentLocation ? 13 : 8}
                    markers={selectedMarker}
                    minHeight="200px"
                    onMapClick={(lat, lng) => setSelectedLocation({ lat, lng })}
                  />
                </div>
                {currentLocation && (
                  <button
                    type="button"
                    onClick={() => setSelectedLocation(currentLocation)}
                    className="block w-full bg-[#e2e8f0] px-4 py-2 text-center text-[11.5px] font-extrabold text-slate-700 hover:bg-slate-300 transition-colors"
                  >
                    Reset to My Current Location
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={handleAction}
            className={`w-full py-3.5 rounded-lg font-bold text-white transition-all active:scale-95 shadow-md ${data.color} hover:brightness-110 text-sm tracking-wide`}
          >
            {data.actionText || 'Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
}
