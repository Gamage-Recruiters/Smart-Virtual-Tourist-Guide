// backend/src/utils/hotelAvailability.js
import mongoose from 'mongoose';
import HotelBooking from '../models/HotelOwner/TempHotBook.js';
import getTestDb from '../configs/HotelOwner/testDb.js';

// ---- flattenHotel ----
export const flattenHotel = (hotel, owner) => ({
  _id: hotel._id,
  hotelName: hotel.hotelName || '',
  hotelRegistrationNo: hotel.hotelRegistrationNo || '',
  hotelEmail: hotel.hotelEmail || '',
  hotelRegisteredYear: hotel.hotelRegisteredYear || '',
  hotelContactNumber: hotel.hotelContactNumber || '',
  hotelAddress: hotel.hotelAddress || '',
  hotelLocation: hotel.hotelLocation || { city: '', district: '' },
  hotelImages: Array.isArray(hotel.hotelImages) ? hotel.hotelImages : [],
  hotelAmenities: Array.isArray(hotel.hotelAmenities) ? hotel.hotelAmenities : [],
  hotelDescription: hotel.hotelDescription || '',
  hotelPolicies: hotel.hotelPolicies || '',
  ownerId: owner._id,
  ownerName: owner.fullName || '',
});

// ---- getHotelBookingModel ----
export const getHotelBookingModel = async () => {
  const conn = await getTestDb();
  return (
    conn.models.HotelBooking ||
    conn.model('HotelBooking', HotelBooking.schema)
  );
};

// ---- getRoomPrice ----
export const getRoomPrice = (room) => {
  const p = room?.locationAndPricing?.[0]?.basePrice;
  if (typeof p === 'number') return p;
  const n = Number(p);
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
};

// ---- enumerateNights ----
export const enumerateNights = (checkIn, checkOut) => {
  const nights = [];
  const m1 = String(checkIn).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const m2 = String(checkOut).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m1 || !m2) return nights;

  let cursor = Date.UTC(+m1[1], +m1[2] - 1, +m1[3]);
  const end = Date.UTC(+m2[1], +m2[2] - 1, +m2[3]);
  if (end <= cursor) return nights;

  while (cursor < end) {
    const d = new Date(cursor);
    const y = d.getUTCFullYear();
    const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
    const da = String(d.getUTCDate()).padStart(2, '0');
    nights.push(`${y}-${mo}-${da}`);
    cursor += 24 * 60 * 60 * 1000;
  }
  return nights;
};

// ---- parseYMD ----
export const parseYMD = (str) => {
  if (!str) return NaN;
  const m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return NaN;
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
};

// ---- collectUnavailableNights ----
export const collectUnavailableNights = async (roomIds, checkIn, checkOut) => {
  const map = new Map();
  if (!roomIds || roomIds.length === 0) return map;

  const nights = enumerateNights(checkIn, checkOut);
  if (nights.length === 0) return map;

  const nightsSet = new Set(nights);

  // 1. Bookings
  try {
    const BookingModel = await getHotelBookingModel();
    const bookings = await BookingModel.find(
      {
        roomId: { $in: roomIds.map((id) => String(id)).concat(roomIds) },
        status: { $nin: ['cancelled', 'no-show'] },
      },
      { roomId: 1, roomName: 1, checkIn: 1, checkOut: 1 }
    ).lean();

    for (const b of bookings) {
      const start = parseYMD(b.checkIn);
      const end = parseYMD(b.checkOut);
      if (Number.isNaN(start) || Number.isNaN(end) || end <= start) continue;

      const key = String(b.roomId);
      if (!map.has(key)) map.set(key, new Set());

      let cursor = start;
      while (cursor < end) {
        const d = new Date(cursor);
        const y = d.getUTCFullYear();
        const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
        const da = String(d.getUTCDate()).padStart(2, '0');
        const iso = `${y}-${mo}-${da}`;
        if (nightsSet.has(iso)) map.get(key).add(iso);
        cursor += 24 * 60 * 60 * 1000;
      }
    }
  } catch (err) {
    console.warn('collectUnavailableNights: bookings lookup failed:', err.message);
  }

  // 2. Room availability (Non Available + Maintenance)
  try {
    const conn = mongoose.connection;
    const AvailabilityModel = conn.models.RoomAvailability || null;

    if (AvailabilityModel) {
      const start = parseYMD(checkIn);
      const end = parseYMD(checkOut);
      const monthKeys = new Set();
      let cur = start;
      while (cur < end) {
        const d = new Date(cur);
        monthKeys.add(`${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`);
        cur += 24 * 60 * 60 * 1000;
      }

      const orClauses = Array.from(monthKeys).map((k) => {
        const [y, m] = k.split('-').map(Number);
        return { year: y, month: m };
      });

      const docs = await AvailabilityModel.find({
        roomId: { $in: roomIds },
        $or: orClauses,
      }).lean();

      for (const doc of docs) {
        const key = String(doc.roomId);
        if (!map.has(key)) map.set(key, new Set());
        const y = doc.year;
        const m = doc.month;

        for (const d of doc.days || []) {
          if (!d) continue;
          if (d.status !== 'Non Available' && d.status !== 'Maintenance') continue;

          const day = String(d.day).padStart(2, '0');
          const mo = String(m).padStart(2, '0');
          const iso = `${y}-${mo}-${day}`;
          if (nightsSet.has(iso)) map.get(key).add(iso);
        }
      }
    }
  } catch (err) {
    console.warn('collectUnavailableNights: availability lookup failed:', err.message);
  }

  return map;
};