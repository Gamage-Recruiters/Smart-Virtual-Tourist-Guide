import logger from '../../utils/logger.js';

import TouristArea from '../../models/Safety/TouristArea.js';

/**
 * Analyze weather data and return a risk assessment for a tourist area.
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

  // Pick the most severe risk description, or default
  const topRisk = risks.length
    ? risks.sort((a, b) => b.severity - a.severity)[0].risk
    : 'Clear conditions – safe for travel';

  return { risk: topRisk, status };
}

// Proxy to OpenWeather API
export const getWeather = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      return res.status(500).json({ success: false, message: 'OpenWeather API key is not configured' });
    }

    // Fetch current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      return res.status(weatherResponse.status).json({ success: false, message: weatherData.message });
    }

    // Fetch 5-day forecast (free tier substitute for 7-day)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
    );
    const forecastData = await forecastResponse.json();

    res.status(200).json({
      success: true,
      data: {
        current: weatherData,
        forecast: forecastData,
      },
    });
  } catch (error) {
    logger.error('Weather Fetch Error:', error);
    next(error);
  }
};

/**
 * GET /weather/alerts
 * Fetches live weather for all predefined tourist areas in parallel,
 * analyzes conditions, and returns dynamic risk assessments.
 */
export const getWeatherAlerts = async (req, res, next) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      return res.status(500).json({ success: false, message: 'OpenWeather API key is not configured' });
    }

    // Fetch active tourist areas from DB
    const TOURIST_AREAS = await TouristArea.find({ isActive: true });

    // Fetch weather for all tourist areas in parallel
    const results = await Promise.allSettled(
      TOURIST_AREAS.map(async (place) => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lng}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error(`Failed for ${place.area}`);
        const data = await response.json();
        const { risk, status } = assessRisk(data);

        return {
          area: place.area,
          covers: place.covers,
          risk,
          status,
          lat: place.lat,
          lng: place.lng,
          temperature: Math.round(data.main?.temp || 0),
          condition: data.weather?.[0]?.main || 'Unknown',
          windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // m/s → km/h
          humidity: data.main?.humidity || 0,
        };
      })
    );

    const alerts = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => r.value);

    // Build a top-level emergency warning from the highest-severity alerts
    const criticalAlerts = alerts.filter((a) => a.status === 'Critical');
    const highAlerts = alerts.filter((a) => a.status === 'High');
    const mediumAlerts = alerts.filter((a) => a.status === 'Medium');

    let emergencyWarning = null;
    if (criticalAlerts.length > 0) {
      const areaNames = criticalAlerts.map((a) => a.area).join(', ');
      const uniqueRisks = [...new Set(criticalAlerts.map((a) => a.risk))];
      emergencyWarning = {
        type: 'critical',
        title: `🔴 EMERGENCY — ${criticalAlerts.length} area${criticalAlerts.length > 1 ? 's' : ''} in critical danger`,
        message: `${uniqueRisks.join('. ')} in ${areaNames}. Immediate danger – halt outdoor movements and seek shelter.`,
      };
    } else if (highAlerts.length > 0) {
      const areaNames = highAlerts.map((a) => a.area).join(', ');
      const uniqueRisks = [...new Set(highAlerts.map((a) => a.risk))];
      emergencyWarning = {
        type: 'warning',
        title: `🟠 Weather warning — ${highAlerts.length} area${highAlerts.length > 1 ? 's' : ''} affected`,
        message: `${uniqueRisks.join('. ')} in ${areaNames}. Consider delaying travel to these areas.`,
      };
    } else if (mediumAlerts.length > 0) {
      const areaNames = mediumAlerts.map((a) => a.area).join(', ');
      const uniqueRisks = [...new Set(mediumAlerts.map((a) => a.risk))];
      emergencyWarning = {
        type: 'advisory',
        title: `🟡 Weather advisory — ${mediumAlerts.length} area${mediumAlerts.length > 1 ? 's' : ''} with moderate risk`,
        message: `${uniqueRisks.join('. ')} reported in ${areaNames}. Exercise caution when travelling.`,
      };
    } else {
      emergencyWarning = {
        type: 'info',
        title: 'All clear – safe travel conditions',
        message: `All ${alerts.length} monitored tourist areas report low risk. Conditions are favourable for travel across Sri Lanka.`,
      };
    }

    res.status(200).json({
      success: true,
      data: {
        alerts,
        emergencyWarning,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error('Weather Alerts Fetch Error:', error);
    next(error);
  }
};
