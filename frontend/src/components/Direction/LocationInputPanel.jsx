import React from 'react';
import { createPortal } from 'react-dom';
import LocationInput from '../LocationInput';
import { MapPin, CircleDot, MoreVertical, ArrowUpDown } from 'lucide-react';

export default function LocationInputPanel({
  swapped,
  handleSwap,
  originLabel,
  pendingOriginLabel,
  destination,
  destPlace,
  searchedPlace,
  onOriginSelect,
  onDestSelect,
  onGpsSelect
}) {
  const content = (
    <div
      className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
      style={
        document.getElementById('header-search-portal') 
          ? { width: '100%', minHeight: '150px', zIndex: 50, position: 'absolute', top: '-15px', right: 0 } 
          : { position: 'absolute', top:'-70px', right: '64px', width: '880px', minHeight: '150px', zIndex: 50 }
      }
    >
      <div className="flex items-center gap-3 pb-4">
        {swapped ? <MapPin size={20} color="#EF4444" className="shrink-0" /> : <CircleDot size={20} color="#1A73E8" className="shrink-0" />}
        <LocationInput
          placeholder="Your location"
          initialValue={originLabel || pendingOriginLabel || ''}
          onSelect={onOriginSelect}
          showGps
          gpsDisplayValue="Your Location"
          onGpsSelect={onGpsSelect}
        />
      </div>
      <div className="flex items-center gap-3 py-2">
        <MoreVertical size={28} color="#333" />
        <hr style={{ width: '90%', border: 'none', borderTop: '3px solid #000' }} />
      </div>
      <div className="flex items-center gap-3 pt-4">
        {swapped ? <CircleDot size={20} color="#1A73E8" className="shrink-0" /> : <MapPin size={20} color="#EF4444" className="shrink-0" />}
        <LocationInput
          placeholder={destPlace || searchedPlace ? destination : "Enter destination first"}
          initialValue={destination}
          onSelect={onDestSelect}
        />
      </div>
      <div className="absolute right-4 top-1/3 z-10" onClick={handleSwap} style={{ cursor: 'pointer' }}>
        <ArrowUpDown size={28} color="#333" className="opacity-90" />
      </div>
      <div className="absolute top-3 right-4">
        <MoreVertical size={28} color="#333" />
      </div>
    </div>
  );
  
  const portalContainer = document.getElementById('header-search-portal');
  return portalContainer ? createPortal(content, portalContainer) : content;
}

