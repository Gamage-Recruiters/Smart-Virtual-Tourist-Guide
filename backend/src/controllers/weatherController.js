const logger = require('../utils/logger');

// Proxy to OpenWeather API
exports.getWeather = async (req, res, next) => {
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
