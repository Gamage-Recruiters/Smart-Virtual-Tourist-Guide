import React, { useState, useMemo } from 'react';

/**
 * Hotel carousel with expand/collapse rooms.
 * @param {{ hotels: Array }} props
 */
export default function HotelList({ hotels }) {
  const [expandedHotels, setExpandedHotels] = useState({});

  // Group hotels by name, sort rooms by price ascending
  const hotelGroups = useMemo(() => {
    const grouped = hotels.reduce((acc, hotel) => {
      const key = hotel.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(hotel);
      return acc;
    }, {});
    return Object.values(grouped).map((rooms) =>
      rooms.slice().sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0))
    );
  }, [hotels]);

  if (!hotels || hotels.length === 0) return null;

  return (
    <div style={{ marginTop: '60px', textAlign: 'left' }}>
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400,
        fontStyle: 'normal',
        fontSize: '24px',
        lineHeight: '100%',
        letterSpacing: '0%',
        color: '#000000',
      }}>
        Hotel Nearby
      </span>
      <div className="hide-scrollbar" style={{ display: 'flex', gap: '16px', marginTop: '20px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none', msOverflowStyle: 'none', width: '100%' }}>
        {hotelGroups.map((rooms, groupIdx) => {
          const base = rooms[0];
          const extraRooms = rooms.slice(1);
          const isExpanded = !!expandedHotels[base.name];
          return (
            <div key={groupIdx} style={{ minWidth: '280px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'row', transition: 'min-width 0.3s ease' }}>
              {/* Left: photo + base room info */}
              <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* +/- toggle */}
                {extraRooms.length > 0 && (
                  <button
                    onClick={() => setExpandedHotels(prev => ({ ...prev, [base.name]: !prev[base.name] }))}
                    style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', background: '#1A73E8', color: '#fff', border: 'none', fontSize: '20px', lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                    aria-label={isExpanded ? 'Collapse rooms' : 'Expand rooms'}
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                )}
                {base.photo && (
                  <img src={base.photo} alt={base.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1a73e8/ffffff?text=${encodeURIComponent(base.name || 'Hotel')}`; }}
                  />
                )}
                <div style={{ padding: '10px 10px 0' }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '15px', color: '#000', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{base.name}</div>
                </div>
                <div style={{ padding: '0 10px 10px' }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#555', marginBottom: '2px' }}>{base.roomName}</div>
                  {base.roomType && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>{base.roomType}{base.capacity ? ` · ${base.capacity.adults} adults` : ''}</div>}
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1A73E8' }}>{base.price}</span>
                  {base.location && (
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#1A73E8', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {base.location}{base.distanceKm != null ? ` · ${base.distanceKm} km away` : ''}
                    </div>
                  )}
                </div>
              </div>
              {/* Right: extra rooms panel */}
              {extraRooms.length > 0 && isExpanded && (
                <div style={{ width: '200px', borderLeft: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid #E5E7EB' }}>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Other Rooms</span>
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {extraRooms.map((room, rIdx) => (
                      <div key={rIdx} style={{ padding: '8px 10px', borderBottom: rIdx < extraRooms.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#555', marginBottom: '2px' }}>{room.roomName}</div>
                        {room.roomType && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888', marginBottom: '4px' }}>{room.roomType}{room.capacity ? ` · ${room.capacity.adults} adults` : ''}</div>}
                        <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', color: '#1A73E8' }}>{room.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
