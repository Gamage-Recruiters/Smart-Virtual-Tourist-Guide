import mongoose from 'mongoose';

const TEST_DB_URI = process.env.MONGODB_URI
  ? `${process.env.MONGODB_URI.replace(/\/+$/, '')}/test`
  : 'mongodb+srv://smartvirtualtouristguide_db_user:Ogr6FOULp2qjCjjz@cluster0.lxurgpd.mongodb.net/test';

let testDb = null;
const getTestDb = async () => {
  if (testDb && testDb.readyState === 1) return testDb;
  const conn = await mongoose.createConnection(TEST_DB_URI).asPromise();
  testDb = conn;
  return testDb;
};

// In-memory cache for geocoded locations to avoid repeated API calls
const geocodeCache = new Map();

/**
 * Clean address to generate search variants from specific to general.
 */
const cleanAddressVariants = (text) => {
  if (!text) return [];
  const raw = text.trim();
  const cleaned = raw.replace(/^(no\.\s*[\d\w/-]+,?|\d+[\w/-]*,?)\s*/i, '').trim();
  const parts = raw.split(/[,.\n;]/).map(p => p.trim()).filter(p => p.length > 2);
  const variants = [raw];
  if (cleaned && cleaned !== raw) variants.push(cleaned);
  if (parts.length >= 2) {
    variants.push(parts.slice(-2).join(', '));
    variants.push(parts.slice(-1)[0]);
  }
  return [...new Set(variants)];
};

/**
 * Geocode a location using OpenStreetMap / Nominatim (Free, open-source).
 */
const geocodeLocation = async (locationText) => {
  if (!locationText) return null;
  const cacheKey = locationText.trim().toLowerCase();
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey);

  const variants = cleanAddressVariants(locationText);
  for (const query of variants) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=lk&q=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SmartVirtualTouristGuide/1.0',
          'Accept-Language': 'en',
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const coords = { lat: Number(data[0].lat), lng: Number(data[0].lon) };
          geocodeCache.set(cacheKey, coords);
          return coords;
        }
      }
    } catch (err) {
      console.warn('[hotels] Geocode failed for query', query, ':', err.message);
    }
  }

  geocodeCache.set(cacheKey, null);
  return null;
};

/**
 * Calculate distance between two coordinates using the Haversine formula (km).
 */
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const RADIUS_KM = 35;
const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80';

/**
 * Helper to fetch registered hotels from users collection.
 */
const fetchHotelsFromUsers = async (db) => {
  const users = await db.collection('users').find(
    { 'hotels.0': { $exists: true } },
    { projection: { fullName: 1, email: 1, hotels: 1 } }
  ).toArray();

  const allHotels = [];
  users.forEach(user => {
    (user.hotels || []).forEach(hotel => {
      allHotels.push({
        ...hotel,
        ownerName: user.fullName,
        ownerEmail: user.email,
        userId: user._id,
      });
    });
  });
  return allHotels;
};

/**
 * GET /api/hotels
 * Search hotels/rooms/packages based on location name and/or coordinates.
 */
export const getHotels = async (req, res) => {
  try {
    const db = await getTestDb();
    const searchLocation = (req.query.location || '').trim().toLowerCase();
    const searchLat = parseFloat(req.query.lat);
    const searchLng = parseFloat(req.query.lng);
    const hasCoordinates = !isNaN(searchLat) && !isNaN(searchLng);

    const [rooms, packages, registeredHotels] = await Promise.all([
      db.collection('rooms').find({}).toArray(),
      db.collection('specialpackages').find({}).toArray(),
      fetchHotelsFromUsers(db),
    ]);

    const hotelMap = {};
    registeredHotels.forEach(h => {
      hotelMap[(h._id || '').toString()] = h;
    });

    const allItems = [...rooms, ...packages];

    const validItems = allItems.filter(item => {
      if (!item.locationAndPricing || item.locationAndPricing.length === 0) return false;
      return true;
    });

    const hotelServerUrl = process.env.HOTEL_SERVER_URL || 'http://localhost:5000';

    const hotelPromises = validItems.map(async (item) => {
      const pricing = item.locationAndPricing[0] || {};
      const aboutLocation = pricing.aboutLocation || '';
      const hotelIdStr = (item.hotelId || '').toString();
      const registered = hotelMap[hotelIdStr] || {};
      const hotelName = registered.hotelName || item.hotelName || 'Hotel';
      const hotelAddress = registered.hotelAddress || item.hotelAddress || '';
      const fullText = `${hotelName} ${hotelAddress} ${aboutLocation} ${item.roomName || ''} ${item.packageName || ''}`.toLowerCase();

      let hotelCoords = null;
      if (hotelAddress) {
        hotelCoords = await geocodeLocation(hotelAddress);
      }
      if (!hotelCoords && aboutLocation) {
        hotelCoords = await geocodeLocation(aboutLocation);
      }

      let distanceKm = null;
      let isMatch = false;

      if (hasCoordinates && hotelCoords) {
        distanceKm = haversineDistance(searchLat, searchLng, hotelCoords.lat, hotelCoords.lng);
        if (distanceKm <= RADIUS_KM) {
          isMatch = true;
        }
      }

      // Text-based matching fallback
      if (!isMatch && searchLocation) {
        const isTextMatch = fullText.includes(searchLocation) ||
          (hotelAddress && hotelAddress.toLowerCase().includes(searchLocation)) ||
          (aboutLocation && aboutLocation.toLowerCase().includes(searchLocation)) ||
          (searchLocation.includes('gampaha') && fullText.includes('gampaha'));
        if (isTextMatch) {
          isMatch = true;
        }
      }

      if (!searchLocation && !hasCoordinates) {
        isMatch = true;
      }

      if (!isMatch) return null;

      const rawImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '';
      let photo = DEFAULT_PHOTO;
      if (rawImage) {
        if (rawImage.startsWith('/uploads/') || rawImage.startsWith('/')) {
          photo = `${hotelServerUrl}${rawImage}`;
        } else {
          photo = rawImage;
        }
      }

      return {
        hotelId: hotelIdStr,
        name: hotelName,
        roomName: item.roomName || item.packageName || '',
        roomType: item.roomType || '',
        capacity: item.capacity || null,
        location: hotelAddress || aboutLocation,
        price: pricing.basePrice ? `LKR ${pricing.basePrice.toLocaleString()}` : 'LKR 5,000+',
        photo,
        rating: null,
        totalRatings: 0,
        distanceKm: distanceKm != null ? Math.round(distanceKm * 10) / 10 : null,
      };
    });

    const results = await Promise.all(hotelPromises);
    const hotels = results.filter(Boolean).sort((a, b) => {
      if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
      if (a.distanceKm != null) return -1;
      if (b.distanceKm != null) return 1;
      return 0;
    });

    res.status(200).json({ success: true, data: hotels });
  } catch (err) {
    console.error('[hotels] Error in getHotels:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch hotels', error: err.message });
  }
};

/**
 * GET /api/rooms
 * Get all rooms with hotel details.
 */
export const getRooms = async (req, res) => {
  try {
    const db = await getTestDb();
    const [rooms, hotels] = await Promise.all([
      db.collection('rooms').find({}).toArray(),
      fetchHotelsFromUsers(db),
    ]);

    const hotelMap = {};
    hotels.forEach(h => {
      hotelMap[(h._id || '').toString()] = h;
    });

    const data = rooms.map(room => {
      const hotel = hotelMap[(room.hotelId || '').toString()] || {};
      return {
        ...room,
        hotelName: hotel.hotelName || 'Hotel',
        hotelAddress: hotel.hotelAddress || '',
        hotelEmail: hotel.hotelEmail || '',
        hotelContactNumber: hotel.hotelContactNumber || '',
      };
    });

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[hotels] Error in getRooms:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch rooms', error: err.message });
  }
};

/**
 * GET /api/rooms/:id
 * Get a single room by ID with hotel details.
 */
export const getRoomById = async (req, res) => {
  try {
    const db = await getTestDb();
    const { id } = req.params;
    const { ObjectId } = mongoose.Types;

    let room = null;
    try {
      room = await db.collection('rooms').findOne({ _id: new ObjectId(id) });
    } catch {}
    if (!room) {
      room = await db.collection('rooms').findOne({ _id: id });
    }

    if (!room) {
      return res.status(404).json({ success: false, message: `Room not found with ID ${id}` });
    }

    const hotels = await fetchHotelsFromUsers(db);
    const hotel = hotels.find(h => (h._id || '').toString() === (room.hotelId || '').toString()) || {};

    const data = {
      ...room,
      hotelName: hotel.hotelName || 'Hotel',
      hotelAddress: hotel.hotelAddress || '',
      hotelEmail: hotel.hotelEmail || '',
      hotelContactNumber: hotel.hotelContactNumber || '',
    };

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('[hotels] Error in getRoomById:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch room', error: err.message });
  }
};

/**
 * GET /api/special-packages
 * Get all special packages with hotel details.
 */
export const getSpecialPackages = async (req, res) => {
  try {
    const db = await getTestDb();
    const [packages, hotels] = await Promise.all([
      db.collection('specialpackages').find({}).toArray(),
      fetchHotelsFromUsers(db),
    ]);

    const hotelMap = {};
    hotels.forEach(h => {
      hotelMap[(h._id || '').toString()] = h;
    });

    const data = packages.map(pkg => {
      const hotel = hotelMap[(pkg.hotelId || '').toString()] || {};
      return {
        ...pkg,
        hotelName: hotel.hotelName || 'Hotel',
        hotelAddress: hotel.hotelAddress || '',
      };
    });

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[hotels] Error in getSpecialPackages:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch special packages', error: err.message });
  }
};

/**
 * GET /api/users/hotels
 * Get all registered hotels from users.
 */
export const getUsersHotels = async (req, res) => {
  try {
    const db = await getTestDb();
    const data = await fetchHotelsFromUsers(db);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[hotels] Error in getUsersHotels:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch user hotels', error: err.message });
  }
};

/**
 * GET /api/bookings/hotel/:hotelId
 * Get all bookings for a specific hotel ID.
 */
export const getBookingsByHotel = async (req, res) => {
  try {
    const db = await getTestDb();
    const { hotelId } = req.params;
    const { ObjectId } = mongoose.Types;
    const safeId = (() => { try { return new ObjectId(hotelId); } catch { return null; } })();

    const query = {
      $or: [
        { hotelId: hotelId },
        ...(safeId ? [{ hotelId: safeId }] : []),
      ]
    };

    const [tempBookings, standardBookings] = await Promise.all([
      db.collection('tempHotBook').find(query).toArray(),
      db.collection('hotelbookings').find(query).toArray(),
    ]);

    const data = [...tempBookings, ...standardBookings];
    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[hotels] Error in getBookingsByHotel:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch hotel bookings', error: err.message });
  }
};

/**
 * GET /api/room-availability
 * Get room availability, blocked dates, and maintenance dates.
 */
export const getRoomAvailability = async (req, res) => {
  try {
    const db = await getTestDb();
    const roomId = req.query.roomId;
    let query = {};
    if (roomId) {
      const { ObjectId } = mongoose.Types;
      const safeId = (() => { try { return new ObjectId(roomId); } catch { return null; } })();
      query = {
        $or: [
          { _id: roomId },
          ...(safeId ? [{ _id: safeId }] : []),
        ]
      };
    }

    const rooms = await db.collection('rooms').find(query).toArray();
    const data = rooms.map(room => ({
      roomId: room._id,
      roomName: room.roomName,
      roomNumber: room.roomNumber,
      roomStatus: room.roomStatus || 'Available',
      blockedDates: room.blockedDates || [],
      maintenanceDates: room.maintenanceDates || [],
      bookingDates: room.bookingDates || [],
    }));

    res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    console.error('[hotels] Error in getRoomAvailability:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch room availability', error: err.message });
  }
};

