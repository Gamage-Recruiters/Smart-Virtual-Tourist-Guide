import axios from 'axios';

const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5001';

const mlService = {
    // ── Generate Itinerary (Budget Optimizer) ─────────────────────────────────
    generateItinerary: async (total_budget_lkr, num_days, preference) => {
        const response = await axios.post(`${FLASK_URL}/api/itinerary/generate`, {
            total_budget_lkr,
            num_days,
            preference,
        });
        return response.data;
    },

    // ── Get Recommendations ───────────────────────────────────────────────────
    getRecommendations: async (age, nationality, interest, budget_level, trip_duration) => {
        const response = await axios.post(`${FLASK_URL}/api/ml/recommend`, {
            age,
            nationality,
            interest,
            budget_level,
            trip_duration,
        });
        return response.data;
    },

    // ── Detect Anomaly (Behaviour Tracking) ───────────────────────────────────
    detectAnomaly: async (data) => {
        const response = await axios.post(`${FLASK_URL}/api/ml/detect-anomaly`, data);
        return response.data;
    },

    // ── Health Check ──────────────────────────────────────────────────────────
    checkHealth: async () => {
        const response = await axios.get(`${FLASK_URL}/api/health`);
        return response.data;
    },
};

export default mlService;