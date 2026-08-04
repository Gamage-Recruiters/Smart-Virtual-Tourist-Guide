import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const DAY_NAMES_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const formatModalDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return `${d} ${MONTH_NAMES[m - 1]} ${y}, ${DAY_NAMES_FULL[dow]}`;
};

const EditAvailabilityModal = ({ date, slots, onSave, onClose }) => {
  const [localSlots, setLocalSlots] = useState(slots.map((s) => ({ ...s })));

  const toggleSlot = (idx) =>
    setLocalSlots((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, isActive: !s.isActive } : s))
    );

  const updateCapacity = (idx, value) =>
    setLocalSlots((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, capacity: Math.max(s.booked, Number(value) || 0) } : s))
    );

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-[slideUp_0.2s_ease]">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#264653] via-[#2d6a4f] to-[#1a6fdb] px-6 py-5">
          <h3 className="text-white font-semibold text-lg tracking-tight">Edit Availability</h3>
          <p className="text-slate-200 text-sm mt-0.5">
            Set availability for {formatModalDate(date)}
          </p>
          <p className="text-slate-300 text-xs mt-1">
            Choose the available time slots for this day.
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Slots */}
        <div className="p-6 space-y-3 max-h-[55vh] overflow-y-auto">
          {localSlots.map((slot, idx) => {
            const id = slot._id || slot.label;
            return (
              <div
                key={id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${slot.isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                    {slot.label}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-xs text-slate-500">Capacity</label>
                    <input
                      type="number"
                      min={slot.booked}
                      value={slot.capacity}
                      onChange={(e) => updateCapacity(idx, e.target.value)}
                      className="w-16 text-center text-sm border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    />
                    <span className="text-xs text-slate-400">/ {slot.booked} booked</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleSlot(idx)}
                  aria-label={slot.isActive ? 'Disable slot' : 'Enable slot'}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
                    slot.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      slot.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(localSlots)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default EditAvailabilityModal;