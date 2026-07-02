import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Megaphone, Wind, Phone } from 'lucide-react';
import bottomLogo from '../assets/bottomLogo.png';
import Logo from '../assets/Logo.png';
import Lotus from '../assets/Lotus.png';
import middle from '../assets/middle.png';
import { usePageTitle } from '../contexts/PageTitleContext';
import { checkRouteForFlood, checkRouteForFog } from '../utils/floodService';
import { ensureMapsScript } from '../utils/helpers';

export default function SafetyAlertTemplate() {
  const { setTitle, setActivePage, safetyData } = usePageTitle();

  useEffect(() => {
    setTitle('Safety Alert');
  }, [setTitle]);

  const routePath = safetyData?.routePath || [];
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);


  const [emergencyContacts] = useState([
    { name: 'Police', number: '119' },
    { name: 'Ambulance', number: '1990' },
    { name: 'Tourist police', number: '1912' }
  ]);

  const routeSummary = useMemo(() => {
    if (!safetyData) return '';
    return `${safetyData.origin ? 'From your current location' : 'Route'} to ${safetyData.destination || 'destination'}`;
  }, [safetyData]);

  useEffect(() => {
    let cancelled = false;

    const samplePoints = (path, maxSamples = 5) => {
      if (!path.length) return [];
      if (path.length <= maxSamples) return path;
      const step = Math.max(1, Math.floor(path.length / maxSamples));
      return Array.from({ length: maxSamples }, (_, index) => path[index * step]).filter(Boolean);
    };

    const fetchAirQuality = async (lat, lng) => {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
      if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
        console.warn('[SafetyAlert] OpenWeather API key not set. Skipping air quality check.');
        return null;
      }
      try {
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${apiKey}`;
        console.log('[SafetyAlert] Fetching air quality:', url);
        const response = await fetch(url);
        if (!response.ok) {
          console.error('[SafetyAlert] Air quality API error:', response.status, response.statusText);
          return null;
        }
        const data = await response.json();
        const item = data.list?.[0];
        if (!item) return null;
        console.log('[SafetyAlert] Air quality result:', item);
        return {
          aqi: item.main?.aqi ?? 0,
          pm2_5: item.components?.pm2_5 ?? 0,
        };
      } catch (err) {
        console.error('[SafetyAlert] Air quality fetch error:', err);
        return null;
      }
    };

    const fetchWeather = async (lat, lng) => {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
      if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
        console.warn('[SafetyAlert] OpenWeather API key not set. Skipping weather check.');
        return null;
      }
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
        console.log('[SafetyAlert] Fetching weather:', url);
        const response = await fetch(url);
        if (!response.ok) {
          console.error('[SafetyAlert] Weather API error:', response.status, response.statusText);
          return null;
        }
        const data = await response.json();
        console.log('[SafetyAlert] Weather result:', data);
        return data;
      } catch (err) {
        console.error('[SafetyAlert] Weather fetch error:', err);
        return null;
      }
    };

    const fetchClosedTouristAreas = async (path) => {
      return new Promise((resolve) => {
        if (!window.google?.maps?.places || !path.length) {
          resolve([]);
          return;
        }

        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        const points = samplePoints(path, 4);
        const collected = [];
        let remaining = points.length;

        if (remaining === 0) {
          resolve([]);
          return;
        }

        points.forEach((point) => {
          const location = new window.google.maps.LatLng(point.lat, point.lng);
          service.nearbySearch(
            { location, radius: 2000, type: 'tourist_attraction' },
            (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                results.slice(0, 5).forEach((place) => {
                  if (!place.place_id) return;
                  service.getDetails({ placeId: place.place_id, fields: ['name', 'business_status', 'geometry'] }, (detail, detailStatus) => {
                    if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK && detail?.business_status && detail.business_status !== 'OPERATIONAL') {
                      collected.push({
                        name: detail.name,
                        status: detail.business_status,
                      });
                    }
                  });
                });
              }

              remaining -= 1;
              if (remaining === 0) {
                setTimeout(() => resolve(collected.slice(0, 3)), 250);
              }
            }
          );
        });
      });
    };

    const runChecks = async () => {
      setLoading(true);
      const issues = [];
      let currentWeatherInfo = '';

      if (routePath.length > 0) {
        const destinationPoint = routePath[routePath.length - 1] || routePath[0];
        if (destinationPoint) {
          const lat = typeof destinationPoint.lat === 'function' ? destinationPoint.lat() : destinationPoint.lat;
          const lng = typeof destinationPoint.lng === 'function' ? destinationPoint.lng() : destinationPoint.lng;


          try {
            const weather = await fetchWeather(lat, lng);
            if (weather) {

              if (weather.weather && weather.weather.length > 0) {
                const desc = weather.weather[0].description;
                currentWeatherInfo = desc.charAt(0).toUpperCase() + desc.slice(1);
              }

              if (weather.main && weather.main.temp != null) {
                const temp = weather.main.temp;
                if (currentWeatherInfo) {
                  currentWeatherInfo += ` (${Math.round(temp)}°C)`;
                }
                if (temp >= 30) {
                  issues.push(`Extreme heat (${Math.round(temp)}°C): Stay hydrated and avoid prolonged sun exposure`);
                }
                if (temp <= 20) {
                  issues.push(`Extreme cold (${Math.round(temp)}°C): Risk of hypothermia or icy roads`);
                }
              }

              if (weather.weather && weather.weather.length > 0) {
                const weatherId = weather.weather[0].id;
                if (weatherId >= 200 && weatherId < 300) {
                  issues.push('Thunderstorm expected in this area');
                }
                if (weatherId >= 300 && weatherId < 400) {
                  issues.push('Drizzle / light rain in this area');
                }
                if (weatherId >= 500 && weatherId < 600) {
                  issues.push('Heavy rain expected in this area');
                  const rainMm = weather.rain?.['1h'] ?? weather.rain?.['3h'] ?? 0;
                  if (rainMm >= 10 || weatherId >= 502) {
                    issues.push('Risk of flooding');
                  }
                }
                if (weatherId >= 600 && weatherId < 700) {
                  issues.push('Snow expected in this area');
                }
                if (weatherId >= 700 && weatherId < 800) {
                  issues.push('Fog / low visibility on route');
                }
              }

              if (weather.wind && weather.wind.speed > 15) {
                issues.push(`Strong winds (${Math.round(weather.wind.speed)} m/s)`);
              }
            } else {
            }
          } catch (err) {
          }

          try {
            const air = await fetchAirQuality(lat, lng);
            if (air) {
              if (air.aqi >= 4) {
                issues.push(`Poor air quality (${air.aqi}/5) near the route`);
              }
            } else {
            }
          } catch (err) {
          }
        } else {
        }

        try {
        } catch (err) {
        }
      }



      const nextAlerts = [];
      if (issues.length > 0) {
        nextAlerts.push({
          id: 'combined-alert',
          type: 'weather',
          alertStyle: 'square-card',
          title: 'Weather alert',
          description: issues.join('\n'),
        });
      } else {
        const weatherText = currentWeatherInfo ? `${currentWeatherInfo}` : 'Clear skies';
        nextAlerts.push({
          id: 'clear',
          type: 'weather',
          alertStyle: 'square-card',
          title: 'Weather alert',
          description: `Good weather — ${weatherText}\nSafe to travel.`,
        });
      }

      if (!cancelled) {
        setAlerts(nextAlerts);
        setLoading(false);
      }
    };

    ensureMapsScript(() => {
      runChecks();
    });

    return () => {
      cancelled = true;
    };
  }, [routePath]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 relative overflow-hidden font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
        <img src={bottomLogo} alt="Decorative pattern" className="w-full h-full object-cover opacity-60 scale-x-150" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src={middle} alt="Ocean background" className="w-full h-full object-cover scale-x-[1.7]" />
        </div>

        <div className="relative z-10 space-y-4 mb-12">
          {loading && (
            <div className="rounded-xl bg-white/80 p-4 text-sm text-slate-600 shadow-lg">Checking route conditions...</div>
          )}

          {!loading && alerts.map((alert) => {
            if (alert.alertStyle === 'square-card') {
              return (
                <div key={alert.id} className="bg-[#FAF0CC] rounded-lg shadow-sm flex overflow-hidden transition-transform hover:scale-[1.02] border border-[#FDE047]/20" style={{ minHeight: '110px' }}>
                  <div className="w-[110px] bg-[#FDD94A] flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-14 h-14 text-black" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <h3 className="font-bold text-black text-[19px] mb-3">{alert.title}</h3>
                    <div className="text-black text-[15px] leading-snug">
                      {alert.description.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={alert.id} className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl p-6 shadow-lg flex items-start gap-4 transition-transform hover:scale-[1.02]">
                <div className="bg-yellow-400 rounded-full p-3 text-gray-800">{alert.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{alert.title}</h3>
                  <p className="text-gray-700 text-sm">{alert.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
          <h2 className="text-center text-red-600 font-bold text-xl mb-6">Emergency contact</h2>
          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="bg-gray-200 rounded-full p-3">
                  <Phone className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{contact.name}: </span>
                  <span className="text-gray-700 font-bold">{contact.number}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActivePage('start')}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            Back
          </button>
        </div>
      </main>

    </div>
  );
}
