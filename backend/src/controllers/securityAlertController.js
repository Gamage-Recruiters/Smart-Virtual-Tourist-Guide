import { MongoClient } from 'mongodb';

const MAIN_DB_URI = 'mongodb+srv://SVTG:svtg123@cluster0.936rmcg.mongodb.net/?appName=Cluster0';

const getClient = (() => {
  let client = null;
  return async () => {
    if (!client) {
      client = new MongoClient(MAIN_DB_URI);
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
    const client = await getClient();
    const col = client.db('tourismGuideDB').collection('securityalerts');

    const filter = { weatherCondition: { $exists: true, $ne: null } };

    if (location) {
      if (!ALLOWED_LOCATION_RE.test(location)) {
        return res.status(400).json({ success: false, message: 'Invalid location parameter.' });
      }
      const exactLocation = `^${location}$`;
      filter.$or = [
        { district: { $regex: exactLocation, $options: 'i' } },
        { region: { $regex: exactLocation, $options: 'i' } },
      ];
    }

    const alerts = await col.find(filter).sort({ updatedAt: -1 }).toArray();

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
      latitude: a.location?.coordinates?.[1] ?? null,
      longitude: a.location?.coordinates?.[0] ?? null,
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
    const col = client.db('tourismGuideDB').collection('securityalerts');

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
    const col = client.db('tourismGuideDB').collection('securityalerts');

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
