const axios = require("axios");

async function getRegionFromCoords(lat, lng) {
  try {
    const baseUrl = process.env.GEOCODE_API_URL;

    const url = `${baseUrl}?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

    const response = await axios.get(url);
    const data = response.data;

    const regionName =
      data.city || data.locality || data.principalSubdivision || "Sri Lanka";

    return regionName;
  } catch (error) {
    console.error("Reverse Geocoding failed:", error.message);
    return null;
  }
}

module.exports = {
  getRegionFromCoords,
};
