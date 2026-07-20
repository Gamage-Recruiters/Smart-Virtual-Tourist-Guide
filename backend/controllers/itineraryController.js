import mlService from '../ml_gateway/mlService.js';
import Itinerary from '../models/Itinerary.js';

// ── Generate Trip Summary from itinerary data ─────────────────────────────
const generateTripSummary = (itinerary) => {
    const locations     = [...new Set(itinerary.daily_plan.map(d => d.location).filter(Boolean))];
    const highlights    = itinerary.final_report?.highlights || [];
    const placesVisited = itinerary.final_report?.places_visited || locations.length;
    const savedLKR      = itinerary.final_report?.total_savings_lkr || 0;
    const savedUSD      = Math.round(savedLKR / 300);

    const locationStr   = locations.length > 1
        ? `${locations.slice(0, -1).join(', ')} and ${locations[locations.length - 1]}`
        : locations[0] || 'Sri Lanka';

    const highlightStr  = highlights.length > 0
        ? highlights.slice(0, 2).join(', ')
        : 'exploring local culture and natural wonders';

    const summary = `Your journey through Sri Lanka was an incredible experience filled with cultural discoveries and natural wonders. From ${locationStr}, every destination offered unique insights into the rich heritage of this beautiful island nation. During your ${itinerary.num_days}-day adventure, you visited ${placesVisited} amazing places including highlights such as ${highlightStr}. The combination of historical sites, natural beauty, and warm hospitality created an unforgettable travel experience.${savedUSD > 0 ? ` You also managed to save $${savedUSD} under your planned budget — a great achievement!` : ''}`;

    return summary;
};

// ── Generate Itinerary ────────────────────────────────────────────────────────
export const generateItinerary = async (req, res) => {
    try {
        const { total_budget_lkr, num_days, preference, age,
                nationality, interest, budget_level } = req.body;

        const budgetPlan      = await mlService.generateItinerary(total_budget_lkr, num_days, preference);
        const recommendations = await mlService.getRecommendations(age, nationality, interest, budget_level, num_days);

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
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// ── Detect Anomaly ────────────────────────────────────────────────────────────
export const detectAnomaly = async (req, res) => {
    try {
        const result = await mlService.detectAnomaly(req.body);
        return res.status(200).json({ status: 'success', result });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// ── Get Recommendations ───────────────────────────────────────────────────────
export const getRecommendations = async (req, res) => {
    try {
        const { age, nationality, interest, budget_level, trip_duration } = req.body;
        const result = await mlService.getRecommendations(age, nationality, interest, budget_level, trip_duration);
        return res.status(200).json({ status: 'success', result });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// ── Health Check ──────────────────────────────────────────────────────────────
export const checkHealth = async (req, res) => {
    try {
        const result = await mlService.checkHealth();
        return res.status(200).json({ status: 'success', result });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// ── Get Itinerary by MongoDB _id ──────────────────────────────────────────────
export const getItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary) {
            return res.status(404).json({ status: 'error', message: 'Itinerary not found' });
        }
        const trip_summary = generateTripSummary(itinerary);
        return res.status(200).json({ status: 'success', itinerary, trip_summary });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

// ── Get Itinerary by Tourist + Trip ID ───────────────────────────────────────
export const getItineraryByTouristAndTrip = async (req, res) => {
    try {
        const { tourist_id, trip_id } = req.params;
        const itinerary = await Itinerary.findOne({ tourist_id, _id: trip_id });
        if (!itinerary) {
            return res.status(404).json({ status: 'error', message: 'Itinerary not found' });
        }
        const trip_summary = generateTripSummary(itinerary);
        return res.status(200).json({ status: 'success', itinerary, trip_summary });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};