const TripFeedback = require("../models/TripFeedback");

const createFeedback = async (req, res) => {
    try {
        const { touristId, tripId, overallRating, feedbackText } = req.body;


        if (!touristId || !tripId || !overallRating || !feedbackText) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newFeedback = new TripFeedback({
            touristId,
            tripId,
            overallRating,
            feedbackText
        });

        const savedFeedback = await newFeedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully!",
            data: savedFeedback
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Server error occurred while submitting feedback",
            error: error.message
        });
    }
};

module.exports = {
    createFeedback
};