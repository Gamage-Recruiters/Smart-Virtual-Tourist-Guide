import SecurityAlert from '../models/SecurityAlert.js';
import logger from './logger.js';

// All 25 administrative districts of Sri Lanka with capital coordinates
const SRI_LANKA_DISTRICTS = [
  // Western Province
  { area: 'Colombo',        district: 'Colombo',        lat: 6.9271,  lng: 79.8612 },
  { area: 'Gampaha',        district: 'Gampaha',        lat: 7.0840,  lng: 80.0098 },
  { area: 'Kalutara',       district: 'Kalutara',       lat: 6.5854,  lng: 79.9607 },
  // Central Province
  { area: 'Kandy',          district: 'Kandy',          lat: 7.2906,  lng: 80.6337 },
  { area: 'Matale',         district: 'Matale',         lat: 7.4675,  lng: 80.6234 },
  { area: 'Nuwara Eliya',   district: 'Nuwara Eliya',   lat: 6.9497,  lng: 80.7891 },
  // Southern Province
  { area: 'Galle',          district: 'Galle',          lat: 6.0535,  lng: 80.2210 },
  { area: 'Matara',         district: 'Matara',         lat: 5.9549,  lng: 80.5550 },
  { area: 'Hambantota',     district: 'Hambantota',     lat: 6.1429,  lng: 81.1212 },
  // Northern Province
  { area: 'Jaffna',         district: 'Jaffna',         lat: 9.6615,  lng: 80.0255 },
  { area: 'Kilinochchi',    district: 'Kilinochchi',    lat: 9.3803,  lng: 80.3770 },
  { area: 'Mullaitivu',     district: 'Mullaitivu',     lat: 9.2671,  lng: 80.8142 },
  { area: 'Mannar',         district: 'Mannar',         lat: 8.9810,  lng: 79.9044 },
  { area: 'Vavuniya',       district: 'Vavuniya',       lat: 8.7514,  lng: 80.4971 },
  // Eastern Province
  { area: 'Trincomalee',    district: 'Trincomalee',    lat: 8.5874,  lng: 81.2152 },
  { area: 'Batticaloa',     district: 'Batticaloa',     lat: 7.7310,  lng: 81.6747 },
  { area: 'Ampara',         district: 'Ampara',         lat: 7.2975,  lng: 81.6820 },
  // North Western Province
  { area: 'Kurunegala',     district: 'Kurunegala',     lat: 7.4863,  lng: 80.3623 },
  { area: 'Puttalam',       district: 'Puttalam',       lat: 8.0362,  lng: 79.8283 },
  // North Central Province
  { area: 'Anuradhapura',   district: 'Anuradhapura',   lat: 8.3114,  lng: 80.4037 },
  { area: 'Polonnaruwa',    district: 'Polonnaruwa',    lat: 7.9403,  lng: 81.0188 },
  // Uva Province
  { area: 'Badulla',        district: 'Badulla',        lat: 6.9934,  lng: 81.0550 },
  { area: 'Monaragala',     district: 'Monaragala',     lat: 6.8728,  lng: 81.3507 },
  // Sabaragamuwa Province
  { area: 'Ratnapura',      district: 'Ratnapura',      lat: 6.6828,  lng: 80.3992 },
  { area: 'Kegalle',        district: 'Kegalle',        lat: 7.2513,  lng: 80.3464 },
];

/**
 * UI advice strings for each severity tier.
 */
const SEVERITY_ADVICE = {
  Critical: 'Immediate danger. Halt outdoor movements and seek shelter.',
  High: 'Severe weather detected. Consider delaying travel.',
  Medium: 'Passing showers or elevated heat. Proceed with caution and carry an umbrella.',
};

/**
 * Analyze weather data and return a risk assessment.
 * Uses a 4-tier severity system: 1 (Low) → 2 (Medium) → 3 (High) → 4 (Critical).
 */
function assessRisk(weatherData) {
  const conditionId = weatherData.weather?.[0]?.id || 800;
  const windSpeed = weatherData.wind?.speed || 0; // m/s
  const visibility = weatherData.visibility || 10000; // meters
  const rain1h = weatherData.rain?.['1h'] || 0; // mm
  const rain3h = weatherData.rain?.['3h'] || 0; // mm
  const temp = weatherData.main?.temp || 25;

  const risks = [];

  // --- Thunderstorm (2xx codes) → Critical ---
  if (conditionId >= 200 && conditionId < 300) {
    risks.push({ risk: 'Thunderstorm activity – seek shelter immediately', severity: 4 });
  }

  // --- Rain condition codes (5xx) ---
  if (conditionId >= 500 && conditionId < 600) {
    if (conditionId >= 502) {
      risks.push({ risk: 'Heavy rainfall and flooding risk', severity: 3 });
    } else {
      risks.push({ risk: 'Light to moderate rain', severity: 2 });
    }
  }

  // --- Rain volume ---
  if (rain1h > 10 || rain3h > 25) {
    risks.push({ risk: 'Flash flooding possible – avoid low-lying areas', severity: 4 });
  } else if (rain1h > 5 || rain3h > 12) {
    risks.push({ risk: 'Heavy downpours – wet roads and reduced visibility', severity: 3 });
  } else if (rain1h > 2 || rain3h > 5) {
    risks.push({ risk: 'Moderate rain – carry rain gear', severity: 2 });
  }

  // --- Wind ---
  if (windSpeed > 15) {
    risks.push({ risk: 'Strong winds – unsafe for coastal activities', severity: 4 });
  } else if (windSpeed > 10) {
    risks.push({ risk: 'High winds – exercise caution outdoors', severity: 3 });
  } else if (windSpeed > 8) {
    risks.push({ risk: 'Moderate winds', severity: 2 });
  }

  // --- Visibility (fog, mist, haze) ---
  if (visibility < 500) {
    risks.push({ risk: 'Near-zero visibility – do not drive', severity: 4 });
  } else if (visibility < 1000) {
    risks.push({ risk: 'Very low visibility – avoid mountain roads', severity: 3 });
  } else if (visibility < 3000) {
    risks.push({ risk: 'Mist and reduced visibility', severity: 2 });
  }

  // --- Extreme heat ---
  if (temp > 37) {
    risks.push({ risk: 'Extreme heat – high dehydration risk', severity: 3 });
  } else if (temp > 35) {
    risks.push({ risk: 'Elevated heat – stay hydrated', severity: 2 });
  }

  // --- Snow / sleet (6xx) – rare but possible in highlands ---
  if (conditionId >= 600 && conditionId < 700) {
    risks.push({ risk: 'Cold and icy conditions', severity: 3 });
  }

  // Determine overall status from the highest severity (4-tier)
  const maxSeverity = risks.length ? Math.max(...risks.map(r => r.severity)) : 0;
  let status = 'Low';
  if (maxSeverity >= 4) status = 'Critical';
  else if (maxSeverity >= 3) status = 'High';
  else if (maxSeverity >= 2) status = 'Medium';

  // Pick the most severe risk description and append UI advice
  const topRisk = risks.length
    ? risks.sort((a, b) => b.severity - a.severity)[0].risk
    : 'Clear conditions – safe for travel';

  const advice = SEVERITY_ADVICE[status] || '';
  const description = advice ? `${topRisk}. ${advice}` : topRisk;

  return { risk: description, status };
}

/**
 * Map risk status string → severity enum used by SecurityAlert model.
 */
function mapStatusToSeverity(status) {
  if (status === 'Critical') return 'critical';
  if (status === 'High') return 'high';
  if (status === 'Medium') return 'medium';
  return 'low';
}

/**
 * Fetch live weather for all 25 districts from OpenWeather and upsert
 * SecurityAlert documents. Deduplicates by externalId.
 */
async function syncWeatherAlerts(io) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === 'your_openweather_api_key_here') {
    logger.error('[AlertSync] OPENWEATHER_API_KEY not configured');
    return;
  }

  logger.info(`[AlertSync] Starting sync for ${SRI_LANKA_DISTRICTS.length} districts...`);
  let synced = 0;
  let deactivated = 0;
  let errors = 0;

  for (const place of SRI_LANKA_DISTRICTS) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lng}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        logger.error(`[AlertSync] API error for ${place.district}: ${response.status}`);
        errors++;
        continue;
      }

      const data = await response.json();
      const { risk, status } = assessRisk(data);
      const externalId = `openweather_${place.district.replace(/\s+/g, '_').toLowerCase()}`;

      // If low risk, deactivate any existing alert for this district
      if (status === 'Low') {
        const result = await SecurityAlert.findOneAndUpdate(
          { externalId, isActive: true },
          { isActive: false }
        );
        if (result) deactivated++;
        continue;
      }

      // Upsert the alert with fresh weather data
      await SecurityAlert.findOneAndUpdate(
        { externalId },
        {
          title: `${data.weather?.[0]?.main || 'Weather'} Alert — ${place.district} District`,
          description: risk,
          severity: mapStatusToSeverity(status),
          region: place.area,
          district: place.district,
          location: { type: 'Point', coordinates: [place.lng, place.lat] },
          isActive: true,
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          createdBy: 'System_OpenWeather',
          source: 'openweather',
          externalId,
          weatherCondition: data.weather?.[0]?.main,
          temperature: Math.round(data.main?.temp || 0),
          windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // m/s → km/h
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      synced++;

      // --- Trigger Notification Engine ---
      // Push weather alerts to all connected users via Socket.io
      if (io) {
        try {
          const { sendNotification } = await import('../services/NotificationService.js');
          await sendNotification(io, {
            scope: 'BROADCAST',
            title: `${data.weather?.[0]?.main || 'Weather'} Alert — ${place.district}`,
            message: risk,
            category: 'SAFETY',
            priority: status === 'Critical' ? 'critical' : status === 'High' ? 'high' : 'medium',
            actionUrl: '/safety/weather-alerts',
            location: { type: 'Point', coordinates: [place.lng, place.lat] },
            district: place.district,
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
          });
        } catch (notifErr) {
          logger.error(`[AlertSync] Notification failed for ${place.district}:`, notifErr.message);
        }
      }
    } catch (err) {
      logger.error(`[AlertSync] Error processing ${place.district}:`, err.message);
      errors++;
    }
  }

  logger.info(`[AlertSync] Sync complete — ${synced} upserted, ${deactivated} deactivated, ${errors} errors`);
}

export { syncWeatherAlerts };
