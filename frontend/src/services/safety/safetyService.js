import apiClient from '../api';

// ============================================================
// Helper Functions
// ============================================================

const unwrapList = (response) => {
  const data = response?.data?.data || response?.data || [];
  return Array.isArray(data) ? data : [];
};

const unwrapObject = (response) => {
  return response?.data?.data || response?.data || {};
};

const buildQuery = (params) => {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};


// ============================================================
// Safety Service
// ============================================================

const safetyService = {

  // ==========================================================
  // 1. INCIDENTS
  // ==========================================================

  async getPublicIncidents(params = {}) {
    try {
      const response = await apiClient.get(
        `/safety/incidents/public${buildQuery(params)}`
      );

      return unwrapList(response);
    } catch (error) {
      console.error(
        'Error fetching public incidents:',
        error
      );

      throw error;
    }
  },


  async getIncidents(params = {}) {
    try {
      const response = await apiClient.get(
        `/safety/incidents${buildQuery(params)}`
      );

      return unwrapList(response);
    } catch (error) {
      console.error(
        'Error fetching incidents:',
        error
      );

      throw error;
    }
  },


  async getUserIncidents(params = {}) {
    try {
      const response = await apiClient.get(
        `/safety/incidents${buildQuery(params)}`
      );

      return unwrapList(response);
    } catch (error) {
      console.error(
        'Error fetching user incidents:',
        error
      );

      throw error;
    }
  },


  async createIncident(formData) {
    try {
      const response = await apiClient.post(
        '/safety/incidents',
        formData
      );

      return unwrapObject(response);
    } catch (error) {
      console.error(
        'Error creating incident:',
        error
      );

      throw error;
    }
  },


  async updateIncident(incidentId, updates) {
    try {
      const response = await apiClient.put(
        `/safety/incidents/${incidentId}`,
        updates
      );

      return unwrapObject(response);
    } catch (error) {
      console.error(
        'Error updating incident:',
        error
      );

      throw error;
    }
  },


  async deleteIncident(incidentId) {
    try {
      const response = await apiClient.delete(
        `/safety/incidents/${incidentId}`
      );

      return unwrapObject(response);
    } catch (error) {
      console.error(
        'Error deleting incident:',
        error
      );

      throw error;
    }
  },


  // ==========================================================
  // 2. SECURITY ALERTS
  // ==========================================================

  async getSecurityAlerts(params = {}) {
    try {
      const response = await apiClient.get(
        `/safety/security-alerts${buildQuery(params)}`
      );

      return unwrapList(response);
    } catch (error) {
      console.error(
        'Error fetching security alerts:',
        error
      );

      throw error;
    }
  },


  // ==========================================================
  // 2B. GEOCODING
  // ==========================================================

  async geocodeLocation(query) {
    try {
      const apiKey =
        import.meta.env.VITE_OPENWEATHER_API_KEY;

      if (!apiKey) {
        console.warn(
          'VITE_OPENWEATHER_API_KEY is not configured.'
        );

        return null;
      }

      const url =
        `https://api.openweathermap.org/geo/1.0/direct` +
        `?q=${encodeURIComponent(query)},LK` +
        `&limit=1` +
        `&appid=${apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Geocoding request failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        return {
          lat: data[0].lat,
          lng: data[0].lon,
          name: data[0].name,
        };
      }

      return null;
    } catch (error) {
      console.error(
        'Geocoding error:',
        error
      );

      return null;
    }
  },


  // ==========================================================
  // 3. EMERGENCY CONTACTS & LOCATION SHARING
  // ==========================================================

  async shareLiveLocation(payload) {
    try {
      const response = await apiClient.post(
        '/safety/location/share',
        payload
      );

      return unwrapObject(response);
    } catch (error) {
      console.error(
        'Error sharing location:',
        error
      );

      throw error;
    }
  },


  // ==========================================================
  // 4. EMERGENCY RESOURCES
  // ==========================================================

  async getPoliceStations(params = {}) {
    try {
      const response = await apiClient.get(
        `/safety/emergency-locations/tourist_police${buildQuery(params)}`
      );

      return unwrapList(response);
    } catch (error) {
      console.error(
        'Error fetching police stations:',
        error
      );

      throw error;
    }
  },


  async getHospitals(params = {}) {
    try {
      const response = await apiClient.get(
        `/safety/emergency-locations/hospitals${buildQuery(params)}`
      );

      return unwrapList(response);
    } catch (error) {
      console.error(
        'Error fetching hospitals:',
        error
      );

      throw error;
    }
  },


  async getLocalPoliceStations(params = {}) {
    try {
      const response = await apiClient.get(
        `/safety/emergency-locations/local-police${buildQuery(params)}`
      );

      return unwrapList(response);
    } catch (error) {
      console.error(
        'Error fetching local police stations:',
        error
      );

      throw error;
    }
  },


  // ==========================================================
  // 5. WEATHER
  // ==========================================================

  async getWeatherData(options = {}) {
    try {
      const response = await apiClient.get(
        `/safety/weather${buildQuery(options)}`
      );

      return unwrapObject(response);
    } catch (error) {
      console.error(
        'Error fetching weather:',
        error
      );

      throw error;
    }
  },


  // ==========================================================
  // 6. WEATHER ALERTS
  // ==========================================================

  async getWeatherAlerts() {
    try {
      const response = await apiClient.get(
        '/safety/weather/alerts'
      );

      return unwrapObject(response);
    } catch (error) {
      console.error(
        'Error fetching weather alerts:',
        error
      );

      throw error;
    }
  },


  // ==========================================================
  // 7. ROUTE CALCULATION
  // ==========================================================

  /**
   * Calculate routes from current location to destination.
   *
   * Returns:
   *
   * {
   *   car: {
   *     duration,
   *     distance,
   *     geometry
   *   },
   *   bike: {
   *     duration,
   *     distance,
   *     geometry
   *   },
   *   foot: {
   *     duration,
   *     distance,
   *     geometry
   *   }
   * }
   *
   * NavigationDirectionsPage expects this structure.
   */

  async fetchAllRoutes(
    originLat,
    originLng,
    destLat,
    destLng
  ) {
    try {

      // ------------------------------------------------------
      // Validate coordinates
      // ------------------------------------------------------

      const startLat = Number(originLat);
      const startLng = Number(originLng);
      const endLat = Number(destLat);
      const endLng = Number(destLng);

      if (
        !Number.isFinite(startLat) ||
        !Number.isFinite(startLng) ||
        !Number.isFinite(endLat) ||
        !Number.isFinite(endLng)
      ) {
        throw new Error(
          'Invalid origin or destination coordinates.'
        );
      }


      // ------------------------------------------------------
      // Calculate straight-line distance
      // ------------------------------------------------------

      const calculateDistance = (
        lat1,
        lng1,
        lat2,
        lng2
      ) => {

        const earthRadius = 6371000;

        const toRadians = (degrees) => {
          return (degrees * Math.PI) / 180;
        };

        const dLat = toRadians(lat2 - lat1);
        const dLng = toRadians(lng2 - lng1);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) ** 2;

        const c =
          2 *
          Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
          );

        return earthRadius * c;
      };


      const straightDistance = calculateDistance(
        startLat,
        startLng,
        endLat,
        endLng
      );


      // ------------------------------------------------------
      // Fetch driving route from OSRM
      // ------------------------------------------------------

      const fetchDrivingRoute = async () => {

        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${startLng},${startLat};${endLng},${endLat}` +
          `?overview=full&geometries=geojson&steps=true`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Routing service returned ${response.status}`
          );
        }

        const data = await response.json();

        if (
          data.code !== 'Ok' ||
          !data.routes ||
          data.routes.length === 0
        ) {
          throw new Error(
            'No driving route was found.'
          );
        }

        const route = data.routes[0];

        return {
          duration: route.duration,
          distance: route.distance,

          geometry:
            route.geometry?.coordinates?.map(
              ([lng, lat]) => [lat, lng]
            ) || [],
        };
      };


      // ------------------------------------------------------
      // Get car route
      // ------------------------------------------------------

      let carRoute;

      try {

        carRoute = await fetchDrivingRoute();

      } catch (routeError) {

        console.warn(
          'Driving route request failed. Using fallback route:',
          routeError
        );

        /*
         * Fallback route if OSRM is unavailable.
         */

        const carSpeedKmh = 35;

        const carDuration =
          (straightDistance / 1000 / carSpeedKmh) *
          3600;

        carRoute = {
          duration: carDuration,
          distance: straightDistance,
          geometry: [
            [startLat, startLng],
            [endLat, endLng],
          ],
        };
      }


      // ------------------------------------------------------
      // Bike route estimate
      // ------------------------------------------------------

      const bikeSpeedKmh = 18;

      const bikeDuration =
        (straightDistance / 1000 / bikeSpeedKmh) *
        3600;

      const bikeRoute = {
        duration: bikeDuration,
        distance: straightDistance,

        geometry: [
          [startLat, startLng],
          [endLat, endLng],
        ],
      };


      // ------------------------------------------------------
      // Walking route estimate
      // ------------------------------------------------------

      const walkingSpeedKmh = 5;

      const walkingDuration =
        (straightDistance / 1000 / walkingSpeedKmh) *
        3600;

      const footRoute = {
        duration: walkingDuration,
        distance: straightDistance,

        geometry: [
          [startLat, startLng],
          [endLat, endLng],
        ],
      };


      // ------------------------------------------------------
      // Return all routes
      // ------------------------------------------------------

      return {
        car: carRoute,
        bike: bikeRoute,
        foot: footRoute,
      };

    } catch (error) {

      console.error(
        'Error fetching all routes:',
        error
      );

      throw error;
    }
  },


  // ==========================================================
  // 8. TOURIST PROFILE
  // ==========================================================

  async getTouristProfile(touristId) {

    try {

      // ------------------------------------------------------
      // Try primary endpoint
      // ------------------------------------------------------

      const response = await apiClient.get(
        `/tourists/profile/${touristId}`
      );

      return unwrapObject(response);

    } catch (error) {

      console.warn(
        'Primary tourist profile request failed. Trying fallback endpoints...',
        error
      );

      try {

        const rawApiBaseUrl =
          import.meta.env.VITE_API_BASE_URL ||
          'http://localhost:5000/api/safety';

        const apiRoot =
          rawApiBaseUrl.replace(
            /\/safety\/?$/,
            ''
          );


        // ----------------------------------------------------
        // Fallback 1
        // ----------------------------------------------------

        const res1 = await fetch(
          `${apiRoot}/tourists/profile/${touristId}`
        );

        if (res1.ok) {

          const json = await res1.json();

          return (
            json?.data?.data ||
            json?.data ||
            json
          );
        }


        // ----------------------------------------------------
        // Fallback 2
        // ----------------------------------------------------

        const res2 = await fetch(
          `${apiRoot}/profile/${touristId}`
        );

        if (res2.ok) {

          const json = await res2.json();

          return (
            json?.data?.data ||
            json?.data ||
            json
          );
        }

      } catch (innerError) {

        console.error(
          'All profile fetch fallback attempts failed:',
          innerError
        );
      }

      throw error;
    }
  },
};


// ============================================================
// Named export required by NavigationDirectionsPage.jsx
// ============================================================

export const fetchAllRoutes = (
  originLat,
  originLng,
  destLat,
  destLng
) => {
  return safetyService.fetchAllRoutes(
    originLat,
    originLng,
    destLat,
    destLng
  );
};


// ============================================================
// Default export
// ============================================================

export default safetyService;