import React, { useState, useEffect } from 'react';
import {
  FaSearch, FaChevronLeft, FaChevronRight, FaChevronUp, FaChevronDown, FaCalendarAlt, FaBed
} from 'react-icons/fa';
import Header from '../../components/HotelOwner/Header';
import Footer from '../../components/HotelOwner/Footer';
import manageavailability from '../../assets/HotelOwner/room-availability-page-image.png';

const BASE_URL = 'http://localhost:5000';

const STATUS_STYLES = {
  a: 'bg-[#BFEBCB] text-emerald-800',
  b: 'bg-[#F4B6B6] text-rose-800',
  m: 'bg-[#BFDDF7] text-blue-800',
};

const toShortStatus = (s) => {
  if (s === 'Non Available') return 'b';
  if (s === 'Maintenance') return 'm';
  return 'a';
};

const ROOM_TYPES_STATIC = [
  'Single Room', 'Double Room', 'Twin Room', 'Queen Room',
  'King Room', 'Deluxe Double Room', 'Family Room / Quad Room',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const CALENDAR_MONTHS = [
  { label: 'January 2026',  days: 31, startDay: 4 },
  { label: 'February 2026', days: 28, startDay: 0 },
  { label: 'March 2026',    days: 31, startDay: 0 },
  { label: 'April 2026',    days: 30, startDay: 3 },
  { label: 'May 2026',      days: 31, startDay: 5 },
  { label: 'June 2026',     days: 30, startDay: 1 },
  { label: 'July 2026',     days: 31, startDay: 3 },
  { label: 'August 2026',   days: 31, startDay: 6 },
  { label: 'September 2026',days: 30, startDay: 2 },
  { label: 'October 2026',  days: 31, startDay: 4 },
  { label: 'November 2026', days: 30, startDay: 0 },
  { label: 'December 2026', days: 31, startDay: 2 },
];

// ---- Small reusable pieces ---------------------------------------------

function ToggleRow({ label, dotClass, checked, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onChange}
        className={`w-8 h-4 border-2 rounded-full relative inline-block transition-colors ${
          checked ? 'border-slate-900' : 'border-slate-300'
        }`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full absolute top-1/2 -translate-y-1/2 transition-all ${dotClass} ${
            checked ? 'left-4' : 'left-1'
          }`}
        />
      </button>
      <span className="text-sm text-slate-800">{label}</span>
    </div>
  );
}

function MiniCalendar({ title, accent, selectedRoomType, roomNumbers, selectedRoomNumber, onRoomSelect, statusType, selectedRoomId, onSaveSuccess }) {
  const slMonth = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })).getMonth();
  const initIdx = CALENDAR_MONTHS.findIndex((m) => m.label.startsWith(['January','February','March','April','May','June','July','August','September','October','November','December'][slMonth]));
  const [monthIdx, setMonthIdx] = useState(initIdx !== -1 ? initIdx : 0);
  const { label, days, startDay } = CALENDAR_MONTHS[monthIdx];

  const [blocks, setBlocks] = useState([]);
  const [pendingFrom, setPendingFrom] = useState(null);
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  const [roomSearch, setRoomSearch] = useState('');
  const [roomSuggestions, setRoomSuggestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null); // index into blocks
  const [savedBlocks, setSavedBlocks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const mapPeriodsToBlocks = (periods) => (
    (periods || []).map((period) => {
      const startDate = new Date(period.startDate);
      const endDate = new Date(period.endDate);
      return {
        _id: String(period._id),
        from: { day: startDate.getUTCDate(), monthIdx: startDate.getUTCMonth() },
        to: { day: endDate.getUTCDate(), monthIdx: endDate.getUTCMonth() },
      };
    })
  );

  // Sync search box when parent changes selectedRoomNumber (grid click)
  useEffect(() => {
    setRoomSearch(selectedRoomNumber || '');
  }, [selectedRoomNumber]);

  useEffect(() => {
    setBlocks(mapPeriodsToBlocks(
      statusType === 'Non Available'
        ? selectedRoomId?.blockedDates
        : selectedRoomId?.maintenanceDates
    ));
    setSavedBlocks(mapPeriodsToBlocks(
      statusType === 'Non Available'
        ? selectedRoomId?.blockedDates
        : selectedRoomId?.maintenanceDates
    ));
    setPendingFrom(null);
    setSelectedBlock(null);
    setFromInput('');
    setToInput('');
    setSaveMsg('');
  }, [selectedRoomId, statusType]);

  const handleRoomSearch = (val) => {
    setRoomSearch(val);
    setRoomSuggestions(
      val.trim() === ''
        ? []
        : roomNumbers.filter((r) => r.toLowerCase().startsWith(val.toLowerCase()))
    );
  };

  const absDay = (d) => d.monthIdx * 31 + d.day;
  const formatDate = (d) => d ? `${d.day} ${CALENDAR_MONTHS[d.monthIdx].label}` : '—';

  // Parse typed date into { day, monthIdx }
  // Accepts: "2"  →  day 2 of current month
  //          "2 March"  or  "2 March 2026"  →  day 2 of March
  const parseInput = (str) => {
    const parts = str.trim().split(/\s+/);
    const day = parseInt(parts[0], 10);
    if (isNaN(day) || day < 1) return null;
    if (parts.length === 1) {
      if (day > CALENDAR_MONTHS[monthIdx].days) return null;
      return { day, monthIdx };
    }
    const mIdx = CALENDAR_MONTHS.findIndex((m) => m.label.toLowerCase().startsWith(parts[1].toLowerCase()));
    if (mIdx === -1 || day > CALENDAR_MONTHS[mIdx].days) return null;
    return { day, monthIdx: mIdx };
  };

  const getYear = (mIdx) => parseInt(CALENDAR_MONTHS[mIdx].label.split(' ')[1], 10);

  const blockIndexForDay = (day) => {
    const abs = monthIdx * 31 + day;
    return blocks.findIndex((b) => b.from && b.to && abs >= absDay(b.from) && abs <= absDay(b.to));
  };

  const handleDayClick = (day) => {
    const d = { day, monthIdx };
    if (!pendingFrom) {
      setPendingFrom(d);
      setFromInput(formatDate(d));
      setToInput(formatDate(d));
    } else {
      const from = pendingFrom;
      const to = d;
      const [f, t] = absDay(from) <= absDay(to) ? [from, to] : [to, from];
      setFromInput(formatDate(f));
      setToInput(formatDate(t));
      setBlocks((prev) => [...prev, { from: f, to: t }]);
      setPendingFrom(null);
    }
  };

  return (
    <div className="border-1 border-black rounded p-5 bg-white">
      <div className="relative w-full mb-6">
        <div className="relative shadow-sm rounded-full">
          <input
            type="text"
            value={roomSearch}
            onChange={(e) => handleRoomSearch(e.target.value)}
            onBlur={() => setTimeout(() => setRoomSuggestions([]), 150)}
            placeholder={`Search Number of ${selectedRoomType || '...'} Room for Block (EX: R1)`}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs text-slate-700 placeholder-slate-400 focus:outline-none pr-10"
          />
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
        </div>
        {roomSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded shadow-md mt-1">
            {roomSuggestions.map((r) => (
              <li
                key={r}
                onMouseDown={() => {
                  setRoomSearch(r);
                  setRoomSuggestions([]);
                  onRoomSelect(r);
                }}
                className="px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {r}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-sm font-bold text-slate-900 mb-4">{title}</p>

      {/* From / To display */}
      <div className="flex flex-wrap gap-4 items-center mb-7">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">From</span>
          <div className="relative">
            <input
              type="text"
              readOnly={!(isEditing && selectedBlock !== null)}
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                const parsed = parseInput(fromInput);
                if (!parsed) return;
                setBlocks((prev) => prev.map((b, i) => i === selectedBlock ? { ...b, from: parsed } : b));
              }}
              placeholder="Select date"
              className={`text-xs border rounded px-3 py-1.5 pr-7 w-44 text-slate-700 ${
                isEditing && selectedBlock !== null
                  ? 'bg-[#fdfd96] border-slate-400 cursor-text'
                  : 'bg-white border-slate-300 cursor-default'
              }`}
            />
            <FaCalendarAlt className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">To</span>
          <div className="relative">
            <input
              type="text"
              readOnly={!(isEditing && selectedBlock !== null)}
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                const parsed = parseInput(toInput);
                if (!parsed) return;
                setBlocks((prev) => prev.map((b, i) => i === selectedBlock ? { ...b, to: parsed } : b));
              }}
              placeholder="Select date"
              className={`text-xs border rounded px-3 py-1.5 pr-7 w-44 text-slate-700 ${
                isEditing && selectedBlock !== null
                  ? 'bg-[#fdfd96] border-slate-400 cursor-text'
                  : 'bg-white border-slate-300 cursor-default'
              }`}
            />
            <FaCalendarAlt className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none" />
          </div>
        </div>
        {isEditing ? (
          <button
            onClick={async () => {
              if (selectedBlock === null || !selectedRoomId?.roomId) return;
              const remaining = blocks.filter((_, i) => i !== selectedBlock);
              const endpoint = statusType === 'Non Available' ? 'blocked' : 'maintenance';
              setSaving(true);
              setSaveMsg('');
              try {
                const periods = remaining.map((b) => ({
                  startDate: new Date(Date.UTC(getYear(b.from.monthIdx), b.from.monthIdx, b.from.day)).toISOString(),
                  endDate:   new Date(Date.UTC(getYear(b.to.monthIdx),   b.to.monthIdx,   b.to.day  )).toISOString(),
                }));
                const res = await fetch(`${BASE_URL}/api/room-availability/${endpoint}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ roomId: selectedRoomId.roomId, periods }),
                });
                if (res.ok) {
                  setBlocks(remaining);
                  setSavedBlocks(remaining);
                  setSelectedBlock(null);
                  setFromInput('');
                  setToInput('');
                  setIsEditing(false);
                  onSaveSuccess();
                } else {
                  setSaveMsg('Clear failed');
                }
              } catch { setSaveMsg('Clear failed'); }
              finally { setSaving(false); }
            }}
            disabled={selectedBlock === null || saving}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-500 border border-rose-500 rounded hover:bg-rose-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Clearing...' : 'Permanent Clear'}
          </button>
        ) : (
          <button
            onClick={() => {
              setPendingFrom(null);
              setFromInput('');
              setToInput('');
              setBlocks((prev) => prev.slice(0, -1));
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-500 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Month header */}
      <div className="flex justify-between items-center text-sm font-bold text-slate-800 mt-2 mb-3">
        <span>{label}</span>
        <div className="flex gap-2 text-slate-400">
          <FaChevronLeft
            className="cursor-pointer hover:text-slate-600"
            onClick={() => setMonthIdx((i) => Math.max(0, i - 1))}
          />
          <FaChevronRight
            className="cursor-pointer hover:text-slate-600"
            onClick={() => setMonthIdx((i) => Math.min(CALENDAR_MONTHS.length - 1, i + 1))}
          />
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-1">
        {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 text-center text-sm gap-1 mt-1 mb-4">
        {[...Array(startDay)].map((_, i) => <div key={`blank-${i}`} />)}
        {[...Array(days)].map((_, i) => {
          const day = i + 1;
          const bIdx = blockIndexForDay(day);
          const highlighted = bIdx !== -1;
          const isSelected = highlighted && bIdx === selectedBlock;
          const isFirst = highlighted && absDay(blocks[bIdx].from) === monthIdx * 31 + day;
          const isLast  = highlighted && absDay(blocks[bIdx].to)   === monthIdx * 31 + day;

          const isPending = !isEditing && pendingFrom && pendingFrom.day === day && pendingFrom.monthIdx === monthIdx;

          const isSingleDay = highlighted && absDay(blocks[bIdx].from) === absDay(blocks[bIdx].to);

          let cls;
          let style = {};
          if (isEditing) {
            if (highlighted && bIdx === selectedBlock) {
              cls = isSingleDay
                ? `${accent.strong} text-slate-800 font-bold cursor-pointer rounded`
                : `${accent.light} text-slate-800 cursor-pointer`;
              style = {
                borderTop: '2px solid #334155',
                borderBottom: '2px solid #334155',
                borderLeft: (isFirst || isSingleDay) ? '2px solid #334155' : 'none',
                borderRight: (isLast  || isSingleDay) ? '2px solid #334155' : 'none',
              };
            } else if (highlighted) {
              cls = `${accent.light} text-slate-700 cursor-pointer rounded`;
            } else {
              cls = 'text-slate-300 cursor-not-allowed rounded';
            }
          } else {
            if (isFirst || isLast)
              cls = `${accent.strong} font-bold rounded cursor-pointer`;
            else if (highlighted)
              cls = `${accent.light} text-slate-700 rounded cursor-pointer`;
            else if (isPending)
              cls = `${accent.strong} font-bold rounded cursor-pointer`;
            else
              cls = 'text-slate-700 hover:bg-slate-100 cursor-pointer rounded';
          }

          const handleClick = () => {
            if (isEditing) {
              // only allow selecting a block; no date changes via calendar
              if (selectedBlock === null && highlighted) {
                setSelectedBlock(bIdx);
                setFromInput(formatDate(blocks[bIdx].from));
                setToInput(formatDate(blocks[bIdx].to));
              } else if (selectedBlock !== null && highlighted && bIdx !== selectedBlock) {
                // switch selection to a different block
                setSelectedBlock(bIdx);
                setFromInput(formatDate(blocks[bIdx].from));
                setToInput(formatDate(blocks[bIdx].to));
              }
            } else {
              handleDayClick(day);
            }
          };

          return (
            <div key={day} className={`py-1.5 ${cls}`} style={style} onClick={handleClick}>
              {day}
            </div>
          );
        })}
      </div>

      {/* Hint text */}
      <p className="text-[10px] text-slate-400 mb-5">
        {isEditing
          ? selectedBlock === null
            ? 'Click a highlighted period to select it, then type new dates in the From / To boxes'
            : 'Type new From / To dates above (e.g. 8  or  8 March  or  8 March 2026), then click Save'
          : pendingFrom ? 'Click a day to set To date' : blocks.length === 0 ? 'Click a day to set From date' : 'Click a day to add another block'}
      </p>

      {/* Action buttons */}
      <div className="flex gap-3 items-center">
        <button
          disabled={saving || !selectedRoomId}
          onClick={async () => {
            if (!selectedRoomId?.roomId) return;
            const endpoint = statusType === 'Non Available' ? 'blocked' : 'maintenance';
            setSaving(true);
            setSaveMsg('');
            try {
              if (isEditing && selectedBlock !== null) {
                // PATCH: update the selected period by _id using both typed inputs
                const f = parseInput(fromInput);
                const t = parseInput(toInput);
                if (!f || !t) { setSaveMsg('Invalid date'); return; }
                const block = blocks[selectedBlock];
                if (!block?._id || block._id === 'undefined') { setSaveMsg('No period ID'); return; }
                const res = await fetch(`${BASE_URL}/api/room-availability/${selectedRoomId.roomId}/${endpoint}/${block._id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    startDate: new Date(Date.UTC(getYear(f.monthIdx), f.monthIdx, f.day)).toISOString(),
                    endDate:   new Date(Date.UTC(getYear(t.monthIdx), t.monthIdx, t.day)).toISOString(),
                  }),
                });
                if (res.ok) {
                  setBlocks((prev) => prev.map((b, i) => i === selectedBlock ? { ...b, from: f, to: t } : b));
                  setSavedBlocks((prev) => prev.map((b, i) => i === selectedBlock ? { ...b, from: f, to: t } : b));
                  setSelectedBlock(null);
                  setFromInput('');
                  setToInput('');
                  setIsEditing(false);
                  setSaveMsg('✓ Saved');
                  setTimeout(() => setSaveMsg(''), 2500);
                  onSaveSuccess();
                } else {
                  setSaveMsg('Save failed');
                }
              } else {
                // Commit any pending single-day selection before saving
                const finalBlocks = pendingFrom
                  ? [...blocks, { from: pendingFrom, to: pendingFrom }]
                  : blocks;
                if (pendingFrom) {
                  setBlocks(finalBlocks);
                  setPendingFrom(null);
                }
                // POST: replace all periods (empty array clears all dates)
                const periods = finalBlocks.map((b) => ({
                  startDate: new Date(Date.UTC(getYear(b.from.monthIdx), b.from.monthIdx, b.from.day)).toISOString(),
                  endDate:   new Date(Date.UTC(getYear(b.to.monthIdx),   b.to.monthIdx,   b.to.day  )).toISOString(),
                }));
                const res = await fetch(`${BASE_URL}/api/room-availability/${endpoint}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ roomId: selectedRoomId.roomId, periods }),
                });
                if (res.ok) { setSaveMsg('✓ Saved'); setTimeout(() => setSaveMsg(''), 2500); onSaveSuccess(); }
                else setSaveMsg('Save failed');
              }
            } catch { setSaveMsg('Save failed'); }
            finally { setSaving(false); }
          }}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {saveMsg && <span className={`text-xs font-semibold ${saveMsg.startsWith('✓') ? 'text-emerald-600' : 'text-rose-500'}`}>{saveMsg}</span>}
        <button
          onClick={() => {
            if (!isEditing) {
              setSavedBlocks(blocks);
              setSelectedBlock(null);
            } else {
              setBlocks(savedBlocks);
              setSelectedBlock(null);
              setFromInput('');
              setToInput('');
            }
            setIsEditing((v) => !v);
          }}
          className={`px-6 py-2 text-white text-xs font-bold rounded transition-colors ${
            isEditing ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          {isEditing ? 'Editing...' : 'Edit'}
        </button>
      </div>
    </div>
  );
}

// ---- Main page -----------------------------------------------------------

export default function ManageRoomAvailability() {
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showAvailable, setShowAvailable] = useState(true);
  const [showNonAvailable, setShowNonAvailable] = useState(true);
  const [showMaintenance, setShowMaintenance] = useState(true);

  // Live data from backend
  const [roomTypesList, setRoomTypesList] = useState(ROOM_TYPES_STATIC);
  const [roomsData, setRoomsData] = useState([]);   // array of { roomNumber, currentStatus, roomId }
  const [calLoading, setCalLoading] = useState(false);

  const hotelId = JSON.parse(localStorage.getItem('userData') || '{}').hotels?.[0]?._id || '';

  // Selected room (clicked from visual grid or calendar search)
  const [selectedRoom, setSelectedRoom] = useState(null); // { roomId, roomNumber, adults, children }
  const [editAdults, setEditAdults] = useState(0);
  const [editChildren, setEditChildren] = useState(0);
  const [capacitySaving, setCapacitySaving] = useState(false);
  const [capacitySaved, setCapacitySaved] = useState(false);

  // Shared selected room number for both MiniCalendars (drives search box + title)
  const [calendarRoomNumber, setCalendarRoomNumber] = useState('');

  // Fetch distinct room types for search suggestions
  useEffect(() => {
    const url = hotelId ? `${BASE_URL}/api/rooms?hotelId=${hotelId}` : `${BASE_URL}/api/rooms`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const types = [...new Set((data.rooms || []).map((r) => r.roomType))];
        if (types.length > 0) setRoomTypesList(types);
      })
      .catch(() => {});
  }, []);

  const now = new Date();
  const calMonth = now.getMonth() + 1;
  const calYear  = now.getFullYear();

  const refreshCalendar = () => {
    if (!selectedRoomType) return;
    const params = new URLSearchParams({ roomType: selectedRoomType, month: calMonth, year: calYear, ...(hotelId && { hotelId }) });
    fetch(`${BASE_URL}/api/room-availability/calendar?${params}`)
      .then((r) => r.json())
      .then((data) => setRoomsData(data.rooms || []))
      .catch(() => {});
  };

  // Fetch calendar data when room type is selected
  useEffect(() => {
    if (!selectedRoomType) return;
    setCalLoading(true);
    const params = new URLSearchParams({ roomType: selectedRoomType, month: calMonth, year: calYear, ...(hotelId && { hotelId }) });
    fetch(`${BASE_URL}/api/room-availability/calendar?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setRoomsData(data.rooms || []);
        setSelectedRoom(null);
        setCalendarRoomNumber('');
      })
      .catch(() => {})
      .finally(() => setCalLoading(false));
  }, [selectedRoomType]);

  const roomStatusPattern = roomsData.map((r) => toShortStatus(r.currentStatus));
  const roomNumbers = roomsData.map((r) => r.roomNumber);

  const handleRoomClick = (roomData) => {
    fetch(`${BASE_URL}/api/rooms/${roomData.roomId}`)
      .then((r) => r.json())
      .then((data) => {
        const cap = data.room?.capacity || { adults: 0, children: 0 };
        // Always fetch fresh availability so dates are never stale
        const calParams = new URLSearchParams({ roomType: selectedRoomType, month: calMonth, year: calYear, ...(hotelId && { hotelId }) });
        fetch(`${BASE_URL}/api/room-availability/calendar?${calParams}`)
          .then((r) => r.json())
          .then((calData) => {
            const freshRooms = calData.rooms || [];
            setRoomsData(freshRooms);
            const fresh = freshRooms.find((r) => String(r.roomId) === String(roomData.roomId));
            setSelectedRoom({
              roomId: roomData.roomId,
              roomNumber: roomData.roomNumber,
              adults: cap.adults,
              children: cap.children,
              blockedDates:     fresh?.blockedDates     || [],
              maintenanceDates: fresh?.maintenanceDates || [],
            });
          })
          .catch(() => {});
        setEditAdults(cap.adults);
        setEditChildren(cap.children);
        setCapacitySaved(false);
        setCalendarRoomNumber(roomData.roomNumber);
      })
      .catch(() => {});
  };

  // Called when a room is picked from either MiniCalendar's search box
  const handleCalendarRoomSelect = (roomNumber) => {
    setCalendarRoomNumber(roomNumber);
    const found = roomsData.find((r) => r.roomNumber === roomNumber);
    if (found) handleRoomClick({ roomId: found.roomId, roomNumber });
  };

  const handleSaveSuccess = () => {
    refreshCalendar();
    if (!selectedRoom) return;
    const calParams = new URLSearchParams({ roomType: selectedRoomType, month: calMonth, year: calYear, ...(hotelId && { hotelId }) });
    fetch(`${BASE_URL}/api/room-availability/calendar?${calParams}`)
      .then((r) => r.json())
      .then((data) => {
        const freshRooms = data.rooms || [];
        setRoomsData(freshRooms);
        const fresh = freshRooms.find((r) => String(r.roomId) === String(selectedRoom.roomId));
        if (fresh) {
          setSelectedRoom((prev) => ({
            ...prev,
            blockedDates:     fresh.blockedDates     || [],
            maintenanceDates: fresh.maintenanceDates || [],
          }));
        }
      })
      .catch(() => {});
  };

  const handleCapacitySave = () => {
    if (!selectedRoom) return;
    setCapacitySaving(true);
    fetch(`${BASE_URL}/api/rooms/${selectedRoom.roomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capacity: { adults: editAdults, children: editChildren } }),
    })
      .then((r) => r.json())
      .then(() => {
        setSelectedRoom((prev) => ({ ...prev, adults: editAdults, children: editChildren }));
        setCapacitySaved(true);
        setTimeout(() => setCapacitySaved(false), 2000);
      })
      .catch(() => {})
      .finally(() => setCapacitySaving(false));
  };

  const statusCounts = roomStatusPattern.reduce(
    (acc, s) => ({ ...acc, [s]: acc[s] + 1 }),
    { a: 0, b: 0, m: 0 }
  );

  const isVisible = (status) => {
    if (status === 'a') return showAvailable;
    if (status === 'b') return showNonAvailable;
    return showMaintenance;
  };

  return (
    <div className="w-full bg-[#EBF7FF] min-h-screen text-slate-800">
      <Header />

      {/* 1. HERO BANNER SECTION */}
      <section
        className="relative h-screen w-full flex flex-col items-center justify-center px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1)), url(${manageavailability})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 90%',
        }}
      >
        <div className="flex max-w-3xl flex-col items-start gap-9 w-full -ml-[200px] mb-[150px]">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Manage Room Availability
          </h1>

          <p className="text-base md:text-2xl text-slate-800 font-medium">
            Update Room Availability and Manage Booking Dates Easily.
          </p>

          <div className="relative w-full max-w-md shadow-md rounded-full">
            <input
              type="text"
              placeholder="Explore Availability"
              className="w-full px-6 py-3.5 bg-white rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none pr-12"
            />
            <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Section Identifier label */}
      <div className="max-w-8xl mx-auto px-4 md:px-8 mt-12">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Manage Room Availability
        </h2>
      </div>

      <main className="max-w-8xl mx-auto px-4 md:px-8 mt-6 space-y-10">
        

        {/* Unified white box */}
        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 border border-slate-100 space-y-10">
        {/* Search Room Type */}
        <div className="relative w-full max-w-sm">
          <div className="relative border border-black rounded">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                setSuggestions(
                  val.trim() === ''
                    ? []
                    : roomTypesList.filter((r) =>
                        r.toLowerCase().startsWith(val.toLowerCase())
                      )
                );
              }}
              onBlur={() => setTimeout(() => setSuggestions([]), 150)}
              placeholder="Search Room Type"
              className="w-full px-5 py-2.5 bg-white rounded-md text-sm text-slate-700 focus:outline-none pr-10"
            />
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm pointer-events-none" />
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded shadow-md mt-1">
              {suggestions.map((r) => (
                <li
                  key={r}
                  onMouseDown={() => {
                    setSelectedRoomType(r);
                    setSearchQuery(r);
                    setSuggestions([]);
                  }}
                  className="px-5 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>

          {/* Room Section */}
          <div>
       
          <div className="border border-black px-4 md:px-5 py-6">
               <h3 className="text-2xl font-extrabold text-slate-900 mb-8">Room Section</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left Column */}
            <div className="space-y-8 max-w-sm">
              <div>
                <h4 className="text-xl font-semibold text-slate-600 mb-4">{selectedRoomType}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-3 py-2 w-56 justify-between">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-slate-400" /> Total Rooms
                    </span>
                    <span className="font-bold text-slate-900">{roomStatusPattern.length}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#DFF6E4] border border-emerald-200 rounded px-3 py-2 w-56 justify-between">
                    <span className="flex items-center gap-2 text-emerald-800 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available Rooms
                    </span>
                    <span className="font-bold text-emerald-900">{statusCounts.a}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FBE0E0] border border-rose-200 rounded px-3 py-2 w-56 justify-between">
                    <span className="flex items-center gap-2 text-rose-800 font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-500" /> Blocked Rooms
                    </span>
                    <span className="font-bold text-rose-900">{statusCounts.b}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#DDEBFB] border border-blue-200 rounded px-3 py-2 w-56 justify-between">
                    <span className="flex items-center gap-2 text-blue-800 font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-500" /> Maintenance Rooms
                    </span>
                    <span className="font-bold text-blue-900">{statusCounts.m}</span>
                  </div>
                </div>
              </div>

             <div className="bg-gray-200 p-3 rounded min-h-[120px]">
              <h2 className="text-[16px] font-extrabold text-slate-800 mb-3">
                {selectedRoom ? `${selectedRoom.roomNumber} Capacity` : 'Room Capacity'}
              </h2>
              {!selectedRoom ? (
                <p className="text-xs text-slate-400">Click a room in the grid to view and edit its capacity.</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between border border-slate-300 bg-white px-2 py-1.5">
                      <span className="text-xs text-slate-700">{editAdults} {editAdults === 1 ? 'Adult' : 'Adults'}</span>
                      <div className="flex flex-col">
                        <FaChevronUp className="text-[9px] text-slate-500 cursor-pointer hover:text-slate-800" onClick={() => setEditAdults((v) => v + 1)} />
                        <FaChevronDown className="text-[9px] text-slate-500 cursor-pointer hover:text-slate-800" onClick={() => setEditAdults((v) => Math.max(0, v - 1))} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between border border-slate-300 bg-white px-2 py-1.5">
                      <span className="text-xs text-slate-700">{editChildren} {editChildren === 1 ? 'Child' : 'Children'}</span>
                      <div className="flex flex-col">
                        <FaChevronUp className="text-[9px] text-slate-500 cursor-pointer hover:text-slate-800" onClick={() => setEditChildren((v) => v + 1)} />
                        <FaChevronDown className="text-[9px] text-slate-500 cursor-pointer hover:text-slate-800" onClick={() => setEditChildren((v) => Math.max(0, v - 1))} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCapacitySave}
                    disabled={capacitySaving}
                    className="mt-3 w-full py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50"
                  >
                    {capacitySaving ? 'Saving...' : capacitySaved ? '✓ Saved' : 'Save Capacity'}
                  </button>
                </>
              )}
            </div>

              <div>
                <p className="text-lg font-bold text-slate-900 mb-3">Room Availability Statuses</p>
                <div className="space-y-2.5">
                  <ToggleRow
                    label="Available"
                    dotClass="bg-[#BFEBCB]"
                    checked={showAvailable}
                    onChange={() => setShowAvailable((v) => !v)}
                  />
                  <ToggleRow
                    label="Non Available"
                    dotClass="bg-[#F4B6B6]"
                    checked={showNonAvailable}
                    onChange={() => setShowNonAvailable((v) => !v)}
                  />
                  <ToggleRow
                    label="Maintenance"
                    dotClass="bg-[#BFDDF7]"
                    checked={showMaintenance}
                    onChange={() => setShowMaintenance((v) => !v)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
          <div className="justify-self-center lg:justify-self-end w-full max-w-md pr-16 mr-32">
            <h4 className="text-xl font-semibold text-slate-600 text-center mb-6">{selectedRoomType} Visual Availibility</h4>
              <div className="border-2 border-slate-500 p-4 md:p-5 bg-gray-100">
                {calLoading ? (
                  <p className="text-center text-sm text-slate-400 py-4">Loading...</p>
                ) : roomStatusPattern.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-4">
                    {selectedRoomType ? 'No rooms found for this type.' : 'Select a room type to view.'}
                  </p>
                ) : (
                  <div className="grid grid-cols-5 gap-4">
                    {roomStatusPattern.map((status, i) => {
                      const rNum = roomNumbers[i] || `R${i + 1}`;
                      const isActive = selectedRoom?.roomNumber === rNum;
                      return (
                        <div
                          key={i}
                          onClick={() => handleRoomClick({ roomId: roomsData[i].roomId, roomNumber: rNum })}
                          className={`aspect-square flex items-center justify-center text-lg font-medium cursor-pointer transition-all ${STATUS_STYLES[status]} ${
                            isVisible(status) ? 'opacity-100' : 'opacity-25'
                          } ${isActive ? 'ring-2 ring-offset-1 ring-slate-700 scale-105' : 'hover:scale-105'}`}
                        >
                          {rNum}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
          </div>

          {/* Block / Maintenance date marking calendars */}
          <div className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl">
            <MiniCalendar
              title={calendarRoomNumber ? `${calendarRoomNumber} Block Dates Marking` : 'Block Dates Marking'}
              accent={{ light: 'bg-rose-100', strong: 'bg-rose-300' }}
              selectedRoomType={selectedRoomType}
              roomNumbers={roomNumbers}
              selectedRoomNumber={calendarRoomNumber}
              onRoomSelect={handleCalendarRoomSelect}
              statusType="Non Available"
              selectedRoomId={selectedRoom}
              onSaveSuccess={handleSaveSuccess}
            />
            <MiniCalendar
              title={calendarRoomNumber ? `${calendarRoomNumber} Maintenance Dates Marking` : 'Maintenance Dates Marking'}
              accent={{ light: 'bg-blue-100', strong: 'bg-blue-300' }}
              selectedRoomType={selectedRoomType}
              roomNumbers={roomNumbers}
              selectedRoomNumber={calendarRoomNumber}
              onRoomSelect={handleCalendarRoomSelect}
              statusType="Maintenance"
                selectedRoomId={selectedRoom}
              onSaveSuccess={handleSaveSuccess}
            />
          </div>
          </div>
          </div>

      </main>

      <div className="mb-16" />
      <Footer />
    </div>
  );
}
