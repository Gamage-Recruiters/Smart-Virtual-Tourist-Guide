import mongoose from 'mongoose';

let testDb = null;
const getTestDb = async () => {
  if (testDb && testDb.readyState === 1) return testDb;
  const conn = await mongoose.createConnection(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME || 'test',
  }).asPromise();
  testDb = conn;
  return testDb;
};

// In-memory cache for geocoded locations to avoid repeated API calls
const geocodeCache = new Map();

/**
 * Geocode a location name to coordinates using Google Maps Geocoding API.
 * Results are cached in memory to minimize API usage.
 */
const geocodeLocation = async (locationName) => {
  if (!locationName) return null;

  const cacheKey = locationName.trim().toLowerCase();
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey);

  // Rate limiting helper for Nominatim (1 request/sec max)
  await new Promise(resolve => setTimeout(resolve, 1100));

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName + ', Sri Lanka')}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SmartVirtualTouristGuide/1.0' }
    });
    const data = await response.json();

    if (data && data.length > 0) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geocodeCache.set(cacheKey, coords);
      return coords;
    }
  } catch (err) {
    console.error('[hotels] Geocode error for', locationName, ':', err.message);
  }

  geocodeCache.set(cacheKey, null);
  return null;
};

/**
 * Calculate distance between two coordinates using the Haversine formula.
 * Returns distance in kilometers.
 */
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
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

const RADIUS_KM = 30;

// Use the configured test database for hotel data as well.
const getHotels = async (req, res) => {
  try {
    const db = await getTestDb();
    const searchLocation = (req.query.location || '').trim().toLowerCase();
    const searchLat = parseFloat(req.query.lat);
    const searchLng = parseFloat(req.query.lng);
    const hasCoordinates = !isNaN(searchLat) && !isNaN(searchLng);

    const [rooms, packages] = await Promise.all([
      db.collection('rooms').find({}).toArray(),
      db.collection('specialpackages').find({}).toArray(),
    ]);

    const allItems = [...rooms, ...packages];

    const hotelIds = [...new Set(allItems.map(i => i.hotelId?.toString()).filter(Boolean))];

    // Build maps for hotel name AND hotel address from the users collection
    const hotelNameMap = {};
    const hotelAddressMap = {};
    if (hotelIds.length > 0) {
      const { ObjectId } = mongoose.Types;
      const safeIds = hotelIds.map(id => { try { return new ObjectId(id); } catch { return null; } }).filter(Boolean);
      const users = await mongoose.connection.db.collection('users').find(
        { 'hotels._id': { $in: safeIds } },
        { projection: { 'hotels': 1 } }
      ).toArray();

      users.forEach(user => {
        (user.hotels || []).forEach(h => {
          const id = h._id.toString();
          hotelNameMap[id] = h.hotelName;
          if (h.hotelAddress) {
            hotelAddressMap[id] = h.hotelAddress;
          }
        });
      });
    }

    // Filter items that have valid images and location data
    const validItems = allItems.filter(item => {
      if (!item.images || item.images.length === 0) return false;
      if (!item.locationAndPricing || item.locationAndPricing.length === 0) return false;
      return true;
    });

    // If coordinates are provided, use 30km radius filtering
    // Otherwise fall back to text-based location matching
    const hotelServerUrl = process.env.HOTEL_SERVER_URL || 'http://localhost:3000';
    let hotels = [];

    if (hasCoordinates) {
      // Geocode each hotel's location and calculate distance
      const hotelPromises = validItems.map(async (item) => {
        const pricing = item.locationAndPricing[0];
        const aboutLocation = pricing.aboutLocation || '';
        const hotelName = hotelNameMap[item.hotelId?.toString()] || 'Hotel';
        const hotelAddress = hotelAddressMap[item.hotelId?.toString()] || '';

        // Try geocoding with hotel's registered address first,
        // then fall back to the room's aboutLocation
        let hotelCoords = null;
        if (hotelAddress) {
          hotelCoords = await geocodeLocation(hotelAddress);
        }
        if (!hotelCoords && aboutLocation) {
          hotelCoords = await geocodeLocation(aboutLocation);
        }
        if (!hotelCoords) return null;

        // Calculate distance from searched location
        const distanceKm = haversineDistance(searchLat, searchLng, hotelCoords.lat, hotelCoords.lng);

        // Only include hotels within 30km radius
        if (distanceKm > RADIUS_KM) return null;

        const imageUrl = item.images[0];
        let photo;
        if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/')) {
          photo = `${hotelServerUrl}${imageUrl}`;
        } else {
          photo = imageUrl;
        }

        return {
          name: hotelName,
          roomName: item.roomName || item.packageName || '',
          roomType: item.roomType || '',
          capacity: item.capacity || null,
          location: hotelAddress || aboutLocation,
          price: pricing.basePrice ? `LKR ${pricing.basePrice.toLocaleString()}` : 'LKR 5,000+',
          photo,
          rating: null,
          totalRatings: 0,
          distanceKm: Math.round(distanceKm * 10) / 10,
        };
      });

      const results = await Promise.all(hotelPromises);
      hotels = results.filter(Boolean).sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      // Fallback: text-based location matching (no coordinates available)
      hotels = validItems
        .filter(item => {
          if (!searchLocation) return true;
          const about = (item.locationAndPricing[0].aboutLocation || '').toLowerCase();
          const address = (hotelAddressMap[item.hotelId?.toString()] || '').toLowerCase();
          return about.includes(searchLocation) || searchLocation.includes(about) ||
                 address.includes(searchLocation) || searchLocation.includes(address);
        })
        .map(item => {
          const pricing = item.locationAndPricing[0];
          const hotelName = hotelNameMap[item.hotelId?.toString()] || 'Hotel';
          const hotelAddress = hotelAddressMap[item.hotelId?.toString()] || '';
          const imageUrl = item.images[0];

          let photo;
          if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/')) {
            photo = `${hotelServerUrl}${imageUrl}`;
          } else {
            photo = imageUrl;
          }

          return {
            name: hotelName,
            roomName: item.roomName || item.packageName || '',
            roomType: item.roomType || '',
            capacity: item.capacity || null,
            location: hotelAddress || pricing.aboutLocation || '',
            price: pricing.basePrice ? `LKR ${pricing.basePrice.toLocaleString()}` : 'LKR 5,000+',
            photo,
            rating: null,
            totalRatings: 0,
            distanceKm: null,
          };
        });
    }

    res.status(200).json({ success: true, data: hotels });
  } catch (err) {
    console.error('[hotels] Error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch hotels', error: err.message });
  }
};

export { getHotels };
