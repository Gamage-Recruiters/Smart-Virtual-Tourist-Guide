import BudgetAllocation from "../models/BudgetAllocation.js";
import Itinerary from '../models/Itinerary.js';

export const getBudgetAllocation = async (req, res) => {
    try {
        const { touristId } = req.params;
        if (!touristId) return res.status(400).json({ success: false, error: "touristId is required." });

        const allocation = await BudgetAllocation.findOne({ touristId }).lean();

        if (!allocation) {
            return res.status(404).json({ success: false, error: "No budget allocation found." });
        }

        return res.status(200).json({
            success: true,
            data: {
                ...allocation,
                dailyAllocation: allocation.dailyAllocation || {},
                totalAllocation: allocation.totalAllocation || {},
                weightsUsed: allocation.weightsUsed || {}
            }
        });
    } catch (err) {
        console.error("[getBudgetAllocation Error]", err.message);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};

export const getLatestExpenses = async (req, res) => {
    try {
        const { touristId } = req.params;
        if (!touristId) return res.status(400).json({ success: false, error: "touristId is required." });

        const itinerary = await Itinerary.findOne({ tourist_id: touristId }).lean();

        if (!itinerary || !itinerary.daily_plan) {
            return res.status(200).json({ success: true, data: [] });
        }

        const allActivities = itinerary.daily_plan.flatMap(day =>
            (day.activities || []).map(act => ({
                ...act,
                date: day.date ? new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : `Day ${day.day}`
            }))
        ).filter(act => (act.actual_cost > 0 || act.estimated_cost > 0));

        const latestActivities = allActivities.slice(0, 5);

        return res.status(200).json({
            success: true,
            data: latestActivities
        });
    } catch (err) {
        console.error("[getLatestExpenses Error]", err.message);
        return res.status(500).json({ success: false, error: "Server error" });
    }
};