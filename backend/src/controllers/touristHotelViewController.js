// backend/src/controllers/touristHotelViewController.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import Room from '../models/HotelOwner/room.model.js';
import SpecialPackage from '../models/HotelOwner/specialPackage.model.js';
import {
  flattenHotel,
  getHotelBookingModel,
  getRoomPrice,
  parseYMD,
  collectUnavailableNights,
} from '../utils/hotelTouristAvailability.js';

// ===========================================================================
// GET /api/tourist/hotels
// ===========================================================================
export const getHotels = async (req, res) => {
  try {
    const {
      city, district, search, amenity, sort, limit, page,
      adults: adultsRaw, children: childrenRaw,
      restrictedOnly: restrictedRaw,
    } = req.query;

    const adultsQ = parseInt(adultsRaw, 10);
    const childrenQ = parseInt(childrenRaw, 10);
    const hasGuestFilter =
      Number.isFinite(adultsQ) || Number.isFinite(childrenQ);

    const restrictedOnly =
      String(restrictedRaw || '').toLowerCase() === 'true';

    const owners = await User.find(
      { role: 'hotelowner_user' },
      { hotels: 1, fullName: 1, email: 1, contactNumber: 1, createdAt: 1 }
    ).lean();

    let hotels = [];
    owners.forEach((owner) => {
      (owner.hotels || []).forEach((hotel) => {
        if (!hotel) return;
        hotels.push(flattenHotel(hotel, owner));
      });
    });

    // Location filters
    if (city) {
      const c = city.toLowerCase();
      hotels = hotels.filter((h) =>
        (h.hotelLocation?.city || '').toLowerCase().includes(c)
      );
    }
    if (district) {
      const d = district.toLowerCase();
      hotels = hotels.filter((h) =>
        (h.hotelLocation?.district || '').toLowerCase().includes(d)
      );
    }
    if (search) {
      const s = search.toLowerCase();
      hotels = hotels.filter(
        (h) =>
          (h.hotelName || '').toLowerCase().includes(s) ||
          (h.hotelDescription || '').toLowerCase().includes(s) ||
          (h.hotelAddress || '').toLowerCase().includes(s) ||
          (h.hotelLocation?.city || '').toLowerCase().includes(s) ||
          (h.hotelLocation?.district || '').toLowerCase().includes(s)
      );
    }
    if (amenity) {
      const wanted = Array.isArray(amenity) ? amenity : [amenity];
      hotels = hotels.filter((h) =>
        wanted.every((a) => (h.hotelAmenities || []).includes(a))
      );
    }

    // Capacity filter
    if (hasGuestFilter && hotels.length > 0) {
      const wantAdults = Number.isFinite(adultsQ) ? Math.max(1, adultsQ) : 1;
      const wantChildren = Number.isFinite(childrenQ) ? Math.max(0, childrenQ) : 0;
      const hotelIds = hotels.map((h) => h._id);

      const fittingRooms = await Room.find({
        hotelId: { $in: hotelIds },
        'capacity.adults': { $gte: wantAdults },
        'capacity.children': { $gte: wantChildren },
      }).select('hotelId').lean();

      const fittingSet = new Set(fittingRooms.map((r) => String(r.hotelId)));
      hotels = hotels.filter((h) => fittingSet.has(String(h._id)));
    }

    // Restricted: only priced rooms
    if (restrictedOnly && hotels.length > 0) {
      const hotelIds = hotels.map((h) => h._id);
      const pricedRooms = await Room.find({
        hotelId: { $in: hotelIds },
        'locationAndPricing.0.basePrice': { $exists: true, $ne: null },
      }).select('hotelId').lean();

      const pricedSet = new Set(pricedRooms.map((r) => String(r.hotelId)));
      hotels = hotels.filter((h) => pricedSet.has(String(h._id)));
    }

    // Sorting
    switch (sort) {
      case 'newest':
        hotels.sort((a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case 'price_asc':
        hotels.sort((a, b) => (a.hotelPrice || 0) - (b.hotelPrice || 0));
        break;
      case 'price_desc':
        hotels.sort((a, b) => (b.hotelPrice || 0) - (a.hotelPrice || 0));
        break;
      case 'rating_desc':
        hotels.sort((a, b) => (b.hotelRating || 0) - (a.hotelRating || 0));
        break;
      default:
        break;
    }

    // Pagination
    const total = hotels.length;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.max(parseInt(limit, 10) || 0, 0);

    if (pageSize > 0) {
      const start = (pageNum - 1) * pageSize;
      hotels = hotels.slice(start, start + pageSize);
    }

    res.json({
      total,
      page: pageSize > 0 ? pageNum : 1,
      pageSize: pageSize > 0 ? pageSize : total,
      hotels,
    });
  } catch (error) {
    console.error('getHotels error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===========================================================================
// GET /api/tourist/hotels/meta/districts
// ===========================================================================
export const getMetaDistricts = async (req, res) => {
  try {
    const owners = await User.find(
      { role: 'hotelowner_user' },
      { 'hotels.hotelLocation.district': 1 }
    ).lean();

    const set = new Set();
    owners.forEach((owner) => {
      (owner.hotels || []).forEach((hotel) => {
        const d = hotel?.hotelLocation?.district;
        if (d) set.add(d);
      });
    });

    res.json({ districts: Array.from(set).sort() });
  } catch (error) {
    console.error('getMetaDistricts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===========================================================================
// GET /api/tourist/hotels/meta/cities
// ===========================================================================
export const getMetaCities = async (req, res) => {
  try {
    const owners = await User.find(
      { role: 'hotelowner_user' },
      { 'hotels.hotelLocation.city': 1 }
    ).lean();

    const set = new Set();
    owners.forEach((owner) => {
      (owner.hotels || []).forEach((hotel) => {
        const c = hotel?.hotelLocation?.city;
        if (c) set.add(c);
      });
    });

    res.json({ cities: Array.from(set).sort() });
  } catch (error) {
    console.error('getMetaCities error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===========================================================================
// GET /api/tourist/hotels/locations?q=Ka
// ===========================================================================
export const getLocations = async (req, res) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();

    const owners = await User.find(
      { role: 'hotelowner_user' },
      { 'hotels.hotelLocation.city': 1, 'hotels.hotelLocation.district': 1 }
    ).lean();

    const citySet = new Set();
    const districtSet = new Set();

    owners.forEach((owner) => {
      (owner.hotels || []).forEach((h) => {
        const c = h?.hotelLocation?.city;
        const d = h?.hotelLocation?.district;
        if (c) citySet.add(c);
        if (d) districtSet.add(d);
      });
    });

    const matches = (str) => !q || str.toLowerCase().includes(q);

    const cities = Array.from(citySet).filter(matches).sort();
    const districts = Array.from(districtSet).filter(matches).sort();

    res.json({
      cities,
      districts,
      suggestions: [
        ...cities.map((v) => ({ type: 'city', value: v })),
        ...districts.map((v) => ({ type: 'district', value: v })),
      ].slice(0, 20),
    });
  } catch (error) {
    console.error('getLocations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===========================================================================
// GET /api/tourist/hotels/search-by-date
// ===========================================================================
export const searchHotelsByDate = async (req, res) => {
  try {
    const {
      checkin, checkout,
      adults: adultsRaw, children: childrenRaw,
      city, district, search, amenity, sort,
    } = req.query;

    if (!checkin || !checkout) {
      return res.status(400).json({ message: 'checkin and checkout are required' });
    }

    const startTs = parseYMD(checkin);
    const endTs = parseYMD(checkout);
    if (Number.isNaN(startTs) || Number.isNaN(endTs) || endTs <= startTs) {
      return res.status(400).json({
        message: 'Invalid date range (checkout must be after checkin)',
      });
    }

    const wantAdults = Math.max(1, parseInt(adultsRaw, 10) || 1);
    const wantChildren = Math.max(0, parseInt(childrenRaw, 10) || 0);
    const hasGuestFilter =
      Number.isFinite(parseInt(adultsRaw, 10)) ||
      Number.isFinite(parseInt(childrenRaw, 10));

    const owners = await User.find(
      { role: 'hotelowner_user' },
      { hotels: 1, fullName: 1, email: 1, contactNumber: 1, createdAt: 1 }
    ).lean();

    let hotels = [];
    owners.forEach((owner) => {
      (owner.hotels || []).forEach((hotel) => {
        if (!hotel) return;
        hotels.push(flattenHotel(hotel, owner));
      });
    });

    if (city) {
      const c = city.toLowerCase();
      hotels = hotels.filter((h) =>
        (h.hotelLocation?.city || '').toLowerCase().includes(c)
      );
    }
    if (district) {
      const d = district.toLowerCase();
      hotels = hotels.filter((h) =>
        (h.hotelLocation?.district || '').toLowerCase().includes(d)
      );
    }
    if (search) {
      const s = search.toLowerCase();
      hotels = hotels.filter(
        (h) =>
          (h.hotelName || '').toLowerCase().includes(s) ||
          (h.hotelDescription || '').toLowerCase().includes(s) ||
          (h.hotelAddress || '').toLowerCase().includes(s) ||
          (h.hotelLocation?.city || '').toLowerCase().includes(s) ||
          (h.hotelLocation?.district || '').toLowerCase().includes(s)
      );
    }
    if (amenity) {
      const wanted = Array.isArray(amenity) ? amenity : [amenity];
      hotels = hotels.filter((h) =>
        wanted.every((a) => (h.hotelAmenities || []).includes(a))
      );
    }

    if (hotels.length === 0) {
      return res.json({ total: 0, hotels: [] });
    }

    const hotelIds = hotels.map((h) => h._id);
    const allRooms = await Room.find({ hotelId: { $in: hotelIds } }).lean();

    const roomsByHotel = new Map();
    for (const room of allRooms) {
      const hId = String(room.hotelId);

      if (hasGuestFilter) {
        const cap = room.capacity || {};
        if ((cap.adults ?? 0) < wantAdults) continue;
        if ((cap.children ?? 0) < wantChildren) continue;
      }

      if (!roomsByHotel.has(hId)) roomsByHotel.set(hId, []);
      roomsByHotel.get(hId).push(room);
    }

    if (roomsByHotel.size === 0) {
      return res.json({ total: 0, hotels: [] });
    }

    const allRoomIds = allRooms.map((r) => r._id);
    const unavailable = await collectUnavailableNights(allRoomIds, checkin, checkout);

    const results = [];
    for (const hotel of hotels) {
      const hId = String(hotel._id);
      const rooms = roomsByHotel.get(hId) || [];
      if (rooms.length === 0) continue;

      const availableRooms = rooms.filter((r) => {
        const blocked = unavailable.get(String(r._id));
        return !blocked || blocked.size === 0;
      });

      if (availableRooms.length === 0) continue;

      const availableRoomIds = availableRooms.map((r) => String(r._id));
      const cheapestRoom = availableRooms.reduce((min, r) =>
        getRoomPrice(r) < getRoomPrice(min) ? r : min
      );

      results.push({
        ...hotel,
        cheapestRoom,
        availableRoomCount: availableRooms.length,
        availableRoomIds,
      });
    }

    switch (sort) {
      case 'price_desc':
        results.sort((a, b) => getRoomPrice(b.cheapestRoom) - getRoomPrice(a.cheapestRoom));
        break;
      default:
        results.sort((a, b) => getRoomPrice(a.cheapestRoom) - getRoomPrice(b.cheapestRoom));
    }

    res.json({ total: results.length, hotels: results });
  } catch (error) {
    console.error('searchHotelsByDate error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===========================================================================
// GET /api/tourist/hotels/check-room-type-availability
// ===========================================================================
export const checkRoomTypeAvailability = async (req, res) => {
  try {
    const { hotelId, roomType, checkin, checkout } = req.query;

    if (!hotelId || !roomType || !checkin || !checkout) {
      return res.status(400).json({
        message: 'hotelId, roomType, checkin and checkout are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: 'Invalid hotel ID' });
    }

    const startTs = parseYMD(checkin);
    const endTs = parseYMD(checkout);
    if (Number.isNaN(startTs) || Number.isNaN(endTs) || endTs <= startTs) {
      return res.status(400).json({
        message: 'Invalid date range (checkout must be after checkin)',
      });
    }

    const needle = String(roomType).trim().toLowerCase();
    const allRooms = await Room.find({ hotelId }).lean();

    const matchingRooms = allRooms.filter((r) => {
      const type = String(r.roomType || '').toLowerCase();
      const name = String(r.roomName || '').toLowerCase();
      return type.includes(needle) || name.includes(needle);
    });

    if (matchingRooms.length === 0) {
      return res.json({
        roomType, checkin, checkout,
        totalRooms: 0, availableCount: 0, rooms: [],
      });
    }

    const roomIds = matchingRooms.map((r) => r._id);
    const unavailable = await collectUnavailableNights(roomIds, checkin, checkout);

    const availableRooms = matchingRooms
      .filter((r) => {
        const blocked = unavailable.get(String(r._id));
        return !blocked || blocked.size === 0;
      })
      .map((r) => ({
        _id: r._id,
        roomId: r._id,
        roomNumber: r.roomNumber || '',
        roomName: r.roomName || '',
        roomType: r.roomType || '',
      }));

    res.json({
      roomType, checkin, checkout,
      totalRooms: matchingRooms.length,
      availableCount: availableRooms.length,
      rooms: availableRooms,
    });
  } catch (error) {
    console.error('checkRoomTypeAvailability error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===========================================================================
// GET /api/tourist/hotels/:hotelId/bookings
// ===========================================================================
export const getHotelBookings = async (req, res) => {
  try {
    const { hotelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: 'Invalid hotel ID' });
    }

    const BookingModel = await getHotelBookingModel();
    const bookings = await BookingModel.find(
      { hotelId, status: { $nin: ['cancelled', 'no-show'] } },
      { _id: 0, roomName: 1, roomId: 1, roomNo: 1, checkIn: 1, checkOut: 1, status: 1 }
    ).lean();

    res.json({ bookings });
  } catch (error) {
    console.error('getHotelBookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===========================================================================
// GET /api/tourist/hotels/:hotelId/rooms
// ===========================================================================
export const getHotelRooms = async (req, res) => {
  try {
    const { hotelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: 'Invalid hotel ID' });
    }

    const rooms = await Room.find({ hotelId }).lean();
    res.json({ rooms });
  } catch (error) {
    console.error('getHotelRooms error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===========================================================================
// GET /api/tourist/hotels/:hotelId/rooms/cheapest
// ===========================================================================
export const getCheapestRoom = async (req, res) => {
  try {
    const { hotelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: 'Invalid hotel ID' });
    }

    const adults = Math.max(1, parseInt(req.query.adults, 10) || 1);
    const children = Math.max(0, parseInt(req.query.children, 10) || 0);

    const rooms = await Room.find({ hotelId }).lean();

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ message: 'No rooms found for this hotel' });
    }

    const fitting = rooms.filter((r) => {
      const cap = r.capacity || {};
      return (cap.adults ?? 0) >= adults && (cap.children ?? 0) >= children;
    });

    const pool = fitting.length > 0 ? fitting : rooms;
    const cheapest = pool.reduce((min, r) =>
      getRoomPrice(r) < getRoomPrice(min) ? r : min
    );

    res.json({ ...cheapest, fitsGuests: fitting.length > 0 });
  } catch (error) {
    console.error('getCheapestRoom error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===========================================================================
// GET /api/tourist/hotels/:hotelId/packages
// ===========================================================================
export const getHotelPackages = async (req, res) => {
  try {
    const { hotelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: 'Invalid hotel ID' });
    }

    const packages = await SpecialPackage.find({ hotelId }).lean();
    res.json({ packages });
  } catch (error) {
    console.error('getHotelPackages error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ===========================================================================
// GET /api/tourist/hotels/:id
// ===========================================================================
export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hotel ID' });
    }

    const owner = await User.findOne(
      { role: 'hotelowner_user', 'hotels._id': id },
      { hotels: 1, fullName: 1, email: 1, contactNumber: 1 }
    ).lean();

    if (!owner) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const hotel = (owner.hotels || []).find(
      (h) => h._id && h._id.toString() === id
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(flattenHotel(hotel, owner));
  } catch (error) {
    console.error('getHotelById error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};