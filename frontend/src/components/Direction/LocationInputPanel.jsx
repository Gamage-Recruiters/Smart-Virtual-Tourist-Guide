import React from 'react';
import { createPortal } from 'react-dom';
import LocationInput from '../LocationInput';
import redPinIcon from '../../assets/locationRed.png';
import blueLocationIcon from '../../assets/directionCircle.png';
import threeDots from '../../assets/3dots.png';
import upDown from '../../assets/upDown.png';

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
        <img src={swapped ? redPinIcon : blueLocationIcon} alt="Origin" className="w-5 h-5 shrink-0" />
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
        <img src={threeDots} alt="Separator" className="w-7 h-7" />
        <hr style={{ width: '90%', border: 'none', borderTop: '3px solid #000' }} />
      </div>
      <div className="flex items-center gap-3 pt-4">
        <img src={swapped ? blueLocationIcon : redPinIcon} alt="Destination" className="w-5 h-5 shrink-0" />
        <LocationInput
          placeholder={destPlace || searchedPlace ? destination : "Enter destination first"}
          initialValue={destination}
          onSelect={onDestSelect}
        />
      </div>
      <div className="absolute right-4 top-1/3 z-10" onClick={handleSwap} style={{ cursor: 'pointer' }}>
        <img src={upDown} alt="Swap" className="w-6 h-12 object-contain opacity-90" />
      </div>
      <div className="absolute top-3 right-4">
        <img src={threeDots} alt="Menu" className="w-7 h-7" />
      </div>
    </div>
  );
  
  const portalContainer = document.getElementById('header-search-portal');
  return portalContainer ? createPortal(content, portalContainer) : content;
}
