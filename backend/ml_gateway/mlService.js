// ══════════════════════════════════════════════════════
// ML Service — Node.js Bridge to Flask ML APIs
// Location: backend/ml_gateway/mlService.js
// ══════════════════════════════════════════════════════

const axios = require('axios');

const FLASK_BASE_URL = 'http://127.0.0.1:5001';

// 1. Generate Itinerary (Budget Optimizer)
const generateItinerary = async (total_budget_lkr, num_days, preference) => {
    try {
        const response = await axios.post(`${FLASK_BASE_URL}/api/itinerary/generate`, {
            total_budget_lkr,
            num_days,
            preference,
        });
        return response.data;
    } catch (error) {
        throw new Error(`Itinerary generation failed: ${error.message}`);
    }
};

// 2. Get Recommendations (Recommendation System)
const getRecommendations = async (age, nationality, interest, budget_level, trip_duration, top_n = 5) => {
    try {
        const response = await axios.post(`${FLASK_BASE_URL}/api/ml/recommend`, {
            age, nationality, interest, budget_level, trip_duration, top_n,
        });
        return response.data;
    } catch (error) {
        throw new Error(`Recommendation failed: ${error.message}`);
    }
};

// 3. Detect Anomaly (Behaviour Tracking)
const detectAnomaly = async (behaviourData) => {
    try {
        const response = await axios.post(`${FLASK_BASE_URL}/api/ml/detect-anomaly`, behaviourData);
        return response.data;
    } catch (error) {
        throw new Error(`Anomaly detection failed: ${error.message}`);
    }
};

// 4. Health Check
const checkHealth = async () => {
    try {
        const response = await axios.get(`${FLASK_BASE_URL}/api/health`);
        return response.data;
    } catch (error) {
        throw new Error(`Flask server is not running: ${error.message}`);
    }
};

module.exports = {
    generateItinerary,
    getRecommendations,
    detectAnomaly,
    checkHealth,
};