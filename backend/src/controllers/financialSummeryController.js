import BudgetAllocation from "../models/BudgetAllocation.js"; 

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