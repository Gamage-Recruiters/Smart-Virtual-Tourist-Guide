import React, { useState, useEffect } from 'react';
import {
  FaSearch, FaChevronLeft, FaChevronRight, FaCalendarAlt,
  FaBed, FaCheckCircle, FaBan, FaTools
} from 'react-icons/fa';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import roomavaila from '../assets/roomavaila.png'

const BASE_URL = 'http://localhost:5000';

const ROOM_TYPES = [
  'Single Room',
  'Double Room',
  'Twin Room',
  'Queen Room',
  'King Room',
  'Deluxe Double Room',
  'Family Room / Quad Room',
];

const ALL_MONTHS = [
  { label: 'January 2026',   days: 31, startDay: 4 },
  { label: 'February 2026',  days: 28, startDay: 0 },
  { label: 'March 2026',     days: 31, startDay: 0 },
  { label: 'April 2026',     days: 30, startDay: 3 },
  { label: 'May 2026',       days: 31, startDay: 5 },
  { label: 'June 2026',      days: 30, startDay: 1 },
  { label: 'July 2026',      days: 31, startDay: 3 },
  { label: 'August 2026',    days: 31, startDay: 6 },
  { label: 'September 2026', days: 30, startDay: 2 },
  { label: 'October 2026',   days: 31, startDay: 4 },
  { label: 'November 2026',  days: 30, startDay: 0 },
  { label: 'December 2026',  days: 31, startDay: 2 },
];

// Maps backend status strings to Tailwind classes used across the page
const STATUS_CELL_STYLES = {
  'Available': 'bg-green-100 text-green-700',
  'Non Available': 'bg-rose-100 text-rose-700 font-bold',
  'Maintenance': 'bg-slate-200 text-slate-500',
};

const STATUS_GRID_STYLES = {
  'Available': 'bg-[#D9F8E4] text-slate-500',
  'Non Available': 'bg-[#F8D9D9] text-rose-700',
  'Maintenance': 'bg-[#E2E8F0] text-slate-500',
};

export default function ViewRoomAvailabilityCalendar() {
  const [selectedRoomType, setSelectedRoomType] = useState('Deluxe Double Room');
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(6); // 0 = Jan ... 6 = July
  const [popupRoom, setPopupRoom] = useState(null);

  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null); // { roomNumber, adults, children }

  const hotelId = JSON.parse(localStorage.getItem('userData') || '{}').hotels?.[0]?._id || '';

  const { label: selectedMonthLabel, days: selectedDays } = ALL_MONTHS[selectedMonthIdx];

  useEffect(() => {
    const controller = new AbortController();

    const fetchCalendar = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          roomType: selectedRoomType,
          month: String(selectedMonthIdx + 1),
          year: '2026',
          ...(hotelId && { hotelId }),
        });

        const res = await fetch(`${BASE_URL}/api/room-availability/calendar?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load availability calendar');
        }

        setCalendarData(data);
        setPopupRoom(null);
        setSelectedRoom(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong while loading the calendar');
          setCalendarData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
    return () => controller.abort();
  }, [selectedRoomType, selectedMonthIdx]);

  const rooms = calendarData?.rooms || [];
  const totalRooms = calendarData?.totalRooms ?? 0;
  const capacity = selectedRoom ?? calendarData?.capacity ?? { adults: 0, children: 0 };

  const handleRoomClick = (room) => {
    fetch(`${BASE_URL}/api/rooms/${room.roomId}`)
      .then((r) => r.json())
      .then((data) => {
        const cap = data.room?.capacity || { adults: 0, children: 0 };
        setSelectedRoom({ roomNumber: room.roomNumber, adults: cap.adults, children: cap.children });
      })
      .catch(() => {});
  };

  return (
    <div className="w-full bg-[#EBF7FF] min-h-screen text-slate-800">
      {/* Calendar Popup Modal */}
      {popupRoom !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setPopupRoom(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[420px] max-w-[95vw]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <p className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <FaBed className="text-slate-400" /> {popupRoom.roomNumber} Room's Status
              </p>
              <button onClick={() => setPopupRoom(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✖</button>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-slate-700 mb-3 px-1">
              <span>{selectedMonthLabel}</span>
              <div className="flex gap-2 text-slate-400"><FaChevronLeft /><FaChevronRight /></div>
            </div>
            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center text-sm gap-1">
              {[...Array(ALL_MONTHS[selectedMonthIdx].startDay)].map((_, i) => <div key={`blank-${i}`} />)}
              {popupRoom.days.map((d) => (
                <div key={d.day} className={`py-1.5 rounded transition-colors ${STATUS_CELL_STYLES[d.status] || STATUS_CELL_STYLES['Available']}`}>
                  {d.day}
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-200 inline-block" /> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-200 inline-block" /> Non Available</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-200 inline-block" /> Maintenance</span>
            </div>
          </div>
        </div>
      )}

      <Header />
      {/* 1. HERO BANNER SECTION */}
              <section 
                className="relative h-screen w-full flex flex-col items-center justify-center px-4 bg-cover bg-center"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)), url(${roomavaila})`,
                  backgroundSize: 'cover',
                  backgroundPosition: '80% center',
                }}
              >
      <div className="flex max-w-3xl flex-col items-start gap-9 w-full -ml-[200px] mb-[150px]">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Add Rooms of Accomodations
                  </h1>
      
                  <p className="text-base md:text-2xl text-slate-800 font-medium">
                    Fill in the Details to Create a New Room for <span className="font-bold">Your</span> Hotel!
                  </p>
      
                  <div className="relative w-full max-w-md shadow-md rounded-full">
                    <input 
                      type="text" 
                      placeholder="Explore Room" 
                      className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
                    />
                    <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                  </div>
                </div>
              </section>

      {/* Section Identifier label */}
      <div className="max-w-7.5xl mx-auto px-4 md:px-8 mt-12">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Calendar</h2>
      </div>

<main className="max-w-8xl mx-auto px-4 md:px-8 mt-6">
  {/* One unified white box */}
  <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 border border-slate-100 space-y-10">
    
    {/* Top Dropdowns + Room Section */}
    <div>
      {/* Dropdowns */}
      <div className="flex flex-wrap gap-16 mb-6">
        <div className="relative">
          <select
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            className="w-56 appearance-none px-4 py-2.5 border border-slate-300 text-sm font-medium text-slate-600 bg-white pr-10"
          >
            {ROOM_TYPES.map((rt) => (
              <option key={rt} value={rt}>{rt}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">▼</span>
        </div>

        <div className="relative">
          <select
            value={selectedMonthIdx}
            onChange={(e) => setSelectedMonthIdx(Number(e.target.value))}
            className="w-56 appearance-none px-4 py-2.5 border border-slate-300 text-sm font-medium text-slate-600 bg-white pr-10"
          >
            {ALL_MONTHS.map((m, i) => (
              <option key={m.label} value={i}>{m.label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">▼</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Room Section Layout */}
      <div className="border border-slate-300 px-4 md:px-5 py-6">
        <h3 className="text-2xl font-extrabold text-slate-900 mb-8">Room Section</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5 items-start">
          {/* Left Column */}
          <div className="pl-1 space-y-8 max-w-sm">
            <div>
              <h4 className="text-xl font-semibold text-slate-600">{selectedRoomType}</h4>
              <div className="mt-6 inline-flex items-center gap-3 bg-slate-100 border border-slate-300 rounded-lg px-4 py-2.5">
                <span className="text-sm font-semibold text-slate-600">Total Rooms</span>
                <span className="w-px h-5 bg-slate-300" />
                <span className="text-xl font-extrabold text-slate-900">{loading ? '…' : totalRooms}</span>
              </div>
            </div>

              <div className="bg-gray-200 p-3 rounded min-h-[120px]">
              <h2 className="text-[16px] font-extrabold text-slate-800 mb-3">
                {selectedRoom ? `${selectedRoom.roomNumber} Capacity` : 'Room Capacity'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-300 text-xs px-2 py-1.5 text-slate-700 bg-white">
                  {capacity.adults} {capacity.adults === 1 ? 'Adult' : 'Adults'}
                </div>
                <div className="border border-slate-300 text-xs px-2 py-1.5 text-slate-700 bg-white">
                  {capacity.children} {capacity.children === 1 ? 'Child' : 'Children'}
                </div>
              </div>
            </div>



            <div>
              <p className="text-lg font-bold text-slate-900 mb-3">Room Availability Statuses</p>
              <div className="space-y-2.5 text-slate-800 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-4 border-2 border-slate-900 rounded-full relative inline-block">
                    <span className="w-2.5 h-2.5 bg-[#BFEBCB] rounded-full absolute top-1/2 left-1 -translate-y-1/2" />
                  </span>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-4 border-2 border-slate-900 rounded-full relative inline-block">
                    <span className="w-2.5 h-2.5 bg-[#F4B6B6] rounded-full absolute top-1/2 left-1 -translate-y-1/2" />
                  </span>
                  <span>Non Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-4 border-2 border-slate-900 rounded-full relative inline-block">
                    <span className="w-2.5 h-2.5 bg-white border border-slate-400 rounded-full absolute top-1/2 left-1 -translate-y-1/2" />
                  </span>
                  <span>Maintenance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}

          <div className="justify-self-center lg:justify-self-end w-full max-w-md pr-16 mr-24">
            <h4 className="text-xl font-semibold text-slate-600 text-center mb-6">{selectedRoomType} Visual Availibility</h4>
            <div className="border-2 border-slate-500 p-4 md:p-5 bg-gray-100">
              {loading ? (
                <p className="text-center text-sm text-slate-500 py-10">Loading rooms…</p>
              ) : rooms.length === 0 ? (
                <p className="text-center text-sm text-slate-500 py-10">No rooms found for this room type.</p>
              ) : (
                <div className="grid grid-cols-5 gap-4">
                  {rooms.map((room) => (
                    <div
                      key={room.roomId}
                      onClick={() => handleRoomClick(room)}
                      className={`aspect-square flex items-center justify-center text-lg font-medium cursor-pointer transition-all ${STATUS_GRID_STYLES[room.currentStatus] || STATUS_GRID_STYLES['Available']} ${
                        selectedRoom?.roomNumber === room.roomNumber ? 'ring-2 ring-offset-1 ring-slate-700 scale-105' : 'hover:scale-105'
                      }`}
                    >
                      {room.roomNumber}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Timeline + Calendar Grid */}
    <section>
      {/* Timeline Row */}
      <div className="flex flex-wrap gap-4 items-center text-xs font-bold text-slate-700 mb-8 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 border px-3 py-2 rounded-lg">
          <span className="text-slate-400 font-medium">From:</span>
          <span>1 {selectedMonthLabel}</span>
          <FaCalendarAlt className="text-slate-400 ml-1" />
        </div>
        <div className="flex items-center gap-2 bg-slate-50 border px-3 py-2 rounded-lg">
          <span className="text-slate-400 font-medium">To:</span>
          <span>{selectedDays} {selectedMonthLabel}</span>
          <FaCalendarAlt className="text-slate-400 ml-1" />
        </div>
      </div>

      {/* Room Calendars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 border-1 border-black rounded p-8">
        {loading ? (
          <p className="col-span-full text-center text-sm text-slate-500 py-10">Loading calendars…</p>
        ) : rooms.length === 0 ? (
          <p className="col-span-full text-center text-sm text-slate-500 py-10">No rooms found for this room type.</p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => setPopupRoom(room)}
              className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer hover:ring-2 hover:ring-sky-300"
            >
              <p className="text-[11px] font-black text-slate-800 mb-2 tracking-tight flex items-center gap-1.5 border-b border-slate-50 pb-1.5">
                <FaBed className="text-slate-400" /> {room.roomNumber} Room's Status
              </p>
              <div className="rounded-lg p-1.5 bg-slate-50/60">
                <div className="flex justify-between items-center text-[9px] font-black text-slate-700 mb-1.5 px-0.5">
                  <span>{selectedMonthLabel}</span>
                  <div className="flex gap-1 text-slate-400 scale-75"><FaChevronLeft /><FaChevronRight /></div>
                </div>
                <div className="grid grid-cols-7 text-center text-[7px] font-bold text-slate-400 mb-1">
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
                </div>
                <div className="grid grid-cols-7 text-center text-[8px] gap-0.5">
                  {[...Array(ALL_MONTHS[selectedMonthIdx].startDay)].map((_, i) => <div key={`blank-${i}`} />)}
                  {room.days.map((d) => (
                    <div key={d.day} className={`py-0.5 rounded-xs transition-colors ${STATUS_CELL_STYLES[d.status] || STATUS_CELL_STYLES['Available']}`}>
                      {d.day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      </section>

  </div>
</main>

      <div className="mb-16" />
      <Footer />
    </div>
  );
}
