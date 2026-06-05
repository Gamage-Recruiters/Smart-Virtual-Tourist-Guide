// ══════════════════════════════════════════════════════════════════════════════
// Itinerary Controller
// Smart Virtual Tourist Guide — Sri Lanka
// Location: backend/controllers/itineraryController.js
// ══════════════════════════════════════════════════════════════════════════════

const mlService = require('../ml_gateway/mlService');

// ── Generate Itinerary ────────────────────────────────────────────────────────
const generateItinerary = async (req, res) => {
    try {
        const { total_budget_lkr, num_days, preference, age,
                nationality, interest, budget_level } = req.body;

        // Step 1: Generate budget plan from ML
        const budgetPlan = await mlService.generateItinerary(
            total_budget_lkr, num_days, preference
        );

        // Step 2: Get place recommendations from ML
        const recommendations = await mlService.getRecommendations(
            age, nationality, interest, budget_level, num_days
        );

        // Step 3: Combine into full itinerary response
        const itinerary = {
            total_budget_lkr,
            num_days,
            preference,
            daily_plan:      budgetPlan.daily_plan,
            allocations:     budgetPlan.allocations,
            recommendations: recommendations.recommendations,
            created_at:      new Date().toISOString(),
        };

        return res.status(200).json({
            status:    'success',
            message:   'Itinerary generated successfully!',
            itinerary,
        });

    } catch (error) {
        return res.status(500).json({
            status:  'error',
            message: error.message,
        });
    }
};

// ── Detect Anomaly (Budget Guardian) ─────────────────────────────────────────
const detectAnomaly = async (req, res) => {
    try {
        const result = await mlService.detectAnomaly(req.body);

        return res.status(200).json({
            status: 'success',
            result,
        });

    } catch (error) {
        return res.status(500).json({
            status:  'error',
            message: error.message,
        });
    }
};

// ── Get Recommendations ───────────────────────────────────────────────────────
const getRecommendations = async (req, res) => {
    try {
        const { age, nationality, interest, budget_level, trip_duration } = req.body;

        const result = await mlService.getRecommendations(
            age, nationality, interest, budget_level, trip_duration
        );

        return res.status(200).json({
            status: 'success',
            result,
        });

    } catch (error) {
        return res.status(500).json({
            status:  'error',
            message: error.message,
        });
    }
};

// ── Health Check ──────────────────────────────────────────────────────────────
const checkHealth = async (req, res) => {
    try {
        const result = await mlService.checkHealth();
        return res.status(200).json({ status: 'success', result });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

module.exports = {
    generateItinerary,
    detectAnomaly,
    getRecommendations,
    checkHealth,
};