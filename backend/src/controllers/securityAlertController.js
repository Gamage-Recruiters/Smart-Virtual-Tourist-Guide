import { MongoClient } from 'mongodb';

const getClient = (() => {
  let client = null;
  return async () => {
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
    }
    return client;
  };
})();

const ALLOWED_LOCATION_RE = /^[a-zA-Z0-9\s,\-.]{1,100}$/;

// Weather alerts: docs that have a weatherCondition field
const getWeatherAlerts = async (req, res) => {
  try {
    const { location } = req.query;
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);
    const client = await getClient();
    const col = client.db(process.env.MONGODB_DB_NAME || 'test').collection('securityalerts');

    const filter = { weatherCondition: { $exists: true, $ne: null } };

    const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
    if (location && !hasCoordinates) {
      if (!ALLOWED_LOCATION_RE.test(location)) {
        return res.status(400).json({ success: false, message: 'Invalid location parameter.' });
      }
      const searchedLocation = location.split(',')[0].trim();
      filter.$or = [
        { district: { $regex: searchedLocation, $options: 'i' } },
        { region: { $regex: searchedLocation, $options: 'i' } },
      ];
    }

    let alerts = await col.find(filter).sort({ updatedAt: -1 }).toArray();

    if (hasCoordinates) {
      const toRadians = (value) => (value * Math.PI) / 180;
      const distance = (alert) => {
        const alertLat = alert.location?.coordinates?.[1] ?? alert.latitude ?? alert.lat;
        const alertLng = alert.location?.coordinates?.[0] ?? alert.longitude ?? alert.lng ?? alert.lon;
        if (alertLat == null || alertLng == null) return Infinity;
        const dLat = toRadians(alertLat - latitude);
        const dLng = toRadians(alertLng - longitude);
        const originLat = toRadians(latitude);
        const targetLat = toRadians(alertLat);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(originLat) * Math.cos(targetLat) * Math.sin(dLng / 2) ** 2;
        return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      };
      alerts = alerts.sort((a, b) => distance(a) - distance(b)).slice(0, 1);
    }

    // Normalise fields for frontend
    const data = alerts.map((a) => ({
      _id: a._id,
      title: a.title,
      description: a.description,
      weatherCondition: a.weatherCondition,
      temperature: a.temperature ?? null,
      windSpeed: a.windSpeed ?? null,
      severity: a.severity,
      location: a.district || a.region || '',
      latitude: a.location?.coordinates?.[1] ?? a.latitude ?? a.lat ?? null,
      longitude: a.location?.coordinates?.[0] ?? a.longitude ?? a.lng ?? a.lon ?? null,
      isActive: a.isActive,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch weather alerts', error: error.message });
  }
};

// Crime alerts: docs without weatherCondition
const getCrimeAlerts = async (req, res) => {
  try {
    const client = await getClient();
    const col = client.db(process.env.MONGODB_DB_NAME || 'test').collection('securityalerts');

    const filter = { isActive: true, weatherCondition: { $exists: false } };

    const alerts = await col.find(filter).sort({ updatedAt: -1 }).toArray();

    const data = alerts.map((a) => ({
      _id: a._id,
      title: a.title,
      description: a.description,
      severity: a.severity,
      location: a.district || a.region || '',
      latitude: a.location?.coordinates?.[1] ?? null,
      longitude: a.location?.coordinates?.[0] ?? null,
      isActive: a.isActive,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch crime alerts', error: error.message });
  }
};

// General endpoint (kept for compatibility)
const getSecurityAlerts = async (req, res) => {
  try {
    const { location } = req.query;
    const client = await getClient();
    const col = client.db(process.env.MONGODB_DB_NAME || 'test').collection('securityalerts');

    const filter = { isActive: true };

    if (location) {
      if (!ALLOWED_LOCATION_RE.test(location)) {
        return res.status(400).json({ success: false, message: 'Invalid location parameter.' });
      }
      filter.$or = [
        { district: { $regex: location, $options: 'i' } },
        { region: { $regex: location, $options: 'i' } },
      ];
    }

    const alerts = await col.find(filter).sort({ updatedAt: -1 }).toArray();
    return res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch security alerts', error: error.message });
  }
};

export { getSecurityAlerts, getWeatherAlerts, getCrimeAlerts };
